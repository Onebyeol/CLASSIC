'use client';

import { supabase, BUCKETS, publicUrlFor } from './supabaseClient';

function rowToTrack(row) {
  return {
    id: row.id,
    title: row.title,
    artist: row.artist,
    duration: row.duration,
    color: row.color,
    url: publicUrlFor(BUCKETS.tracks, row.file_path),
    position: row.position,
  };
}

function must(error) {
  if (error) throw new Error(error.message || '요청 실패');
}

async function nextTrackPosition() {
  const { data } = await supabase
    .from('tracks').select('position').is('deleted_at', null)
    .order('position', { ascending: false }).limit(1).maybeSingle();
  return data ? data.position + 1 : 0;
}

async function nextPlaylistTrackPosition(playlistId) {
  const { data } = await supabase
    .from('playlist_tracks').select('position').eq('playlist_id', playlistId)
    .order('position', { ascending: false }).limit(1).maybeSingle();
  return data ? data.position + 1 : 0;
}

export const api = {
  // ---------- tracks ----------
  listTracks: async () => {
    const { data, error } = await supabase.from('tracks').select('*').is('deleted_at', null).order('position', { ascending: true });
    must(error);
    return data.map(rowToTrack);
  },

  uploadTrack: async (file, meta = {}) => {
    const id = crypto.randomUUID();
    const filePath = `${id}.mp3`;
    const { error: upErr } = await supabase.storage.from(BUCKETS.tracks).upload(filePath, file, { contentType: file.type || 'audio/mpeg' });
    must(upErr);

    const position = await nextTrackPosition();
    const { data, error } = await supabase.from('tracks').insert({
      id,
      title: meta.title || file.name.replace(/\.[^/.]+$/, ''),
      artist: meta.artist || '알 수 없는 아티스트',
      duration: meta.duration || 0,
      color: meta.color,
      file_path: filePath,
      position,
    }).select().single();
    must(error);
    return rowToTrack(data);
  },

  reorderTracks: async (orderedIds) => {
    await Promise.all(orderedIds.map((id, index) => supabase.from('tracks').update({ position: index }).eq('id', id)));
    return { ok: true };
  },

  renameTrack: async (id, title) => {
    const { data, error } = await supabase.from('tracks').update({ title: title.trim() }).eq('id', id).select().single();
    must(error);
    return rowToTrack(data);
  },

  trashTrack: async (id) => {
    await supabase.from('playlist_tracks').delete().eq('track_id', id);
    const { error } = await supabase.from('tracks').update({ deleted_at: new Date().toISOString() }).eq('id', id);
    must(error);
    return { ok: true };
  },

  restoreTrack: async (id) => {
    const { error } = await supabase.from('tracks').update({ deleted_at: null }).eq('id', id);
    must(error);
    return { ok: true };
  },

  permanentlyDeleteTrack: async (id) => {
    const { data: track } = await supabase.from('tracks').select('file_path').eq('id', id).maybeSingle();
    if (track) await supabase.storage.from(BUCKETS.tracks).remove([track.file_path]);
    const { error } = await supabase.from('tracks').delete().eq('id', id);
    must(error);
    return { ok: true };
  },

  listTrash: async () => {
    const { data, error } = await supabase.from('tracks').select('*').not('deleted_at', 'is', null).order('deleted_at', { ascending: false });
    must(error);
    return data.map(rowToTrack);
  },

  emptyTrash: async () => {
    const { data: trashed } = await supabase.from('tracks').select('id, file_path').not('deleted_at', 'is', null);
    if (trashed && trashed.length) {
      await supabase.storage.from(BUCKETS.tracks).remove(trashed.map((t) => t.file_path));
      await supabase.from('tracks').delete().not('deleted_at', 'is', null);
    }
    return { deleted: trashed ? trashed.length : 0 };
  },

  // ---------- playlists ----------
  listPlaylists: async () => {
    const { data: playlists, error: plErr } = await supabase.from('playlists').select('*').order('created_at', { ascending: true });
    must(plErr);
    const { data: links, error: linkErr } = await supabase.from('playlist_tracks').select('playlist_id, track_id, position').order('position', { ascending: true });
    must(linkErr);
    return playlists.map((p) => ({
      id: p.id,
      name: p.name,
      cover: publicUrlFor(BUCKETS.covers, p.cover_path),
      trackIds: links.filter((l) => l.playlist_id === p.id).map((l) => l.track_id),
    }));
  },

  createPlaylist: async (name) => {
    const { data, error } = await supabase.from('playlists').insert({ name: name.trim() }).select().single();
    must(error);
    return { id: data.id, name: data.name, cover: null, trackIds: [] };
  },

  deletePlaylist: async (id) => {
    const { data: p } = await supabase.from('playlists').select('cover_path').eq('id', id).maybeSingle();
    if (p && p.cover_path) await supabase.storage.from(BUCKETS.covers).remove([p.cover_path]);
    const { error } = await supabase.from('playlists').delete().eq('id', id);
    must(error);
    return { ok: true };
  },

  uploadPlaylistCover: async (id, file) => {
    const extMatch = file.name.match(/\.[^/.]+$/);
    const ext = extMatch ? extMatch[0] : '.jpg';
    const coverPath = `${id}-${crypto.randomUUID()}${ext}`;
    const { error: upErr } = await supabase.storage.from(BUCKETS.covers).upload(coverPath, file, { contentType: file.type || 'image/jpeg' });
    must(upErr);

    const { data: existingRow } = await supabase.from('playlists').select('cover_path').eq('id', id).maybeSingle();
    if (existingRow && existingRow.cover_path) await supabase.storage.from(BUCKETS.covers).remove([existingRow.cover_path]);

    const { error } = await supabase.from('playlists').update({ cover_path: coverPath }).eq('id', id);
    must(error);
    return { cover: publicUrlFor(BUCKETS.covers, coverPath) };
  },

  addTrackToPlaylist: async (playlistId, trackId) => {
    // upsert + onConflict는 복합 기본키(playlist_id, track_id) 테이블에서 PostgREST가
    // 제약조건을 인덱스로 제대로 못 찾아서 실패하는 경우가 보고돼 있어서, 더 안전하게
    // "이미 있는지 확인 후 없으면 insert"하는 방식으로 처리합니다.
    const { data: existing } = await supabase
      .from('playlist_tracks').select('playlist_id')
      .eq('playlist_id', playlistId).eq('track_id', trackId).maybeSingle();
    if (existing) return { ok: true };

    const position = await nextPlaylistTrackPosition(playlistId);
    const { error } = await supabase.from('playlist_tracks').insert({ playlist_id: playlistId, track_id: trackId, position });
    must(error);
    return { ok: true };
  },

  removeTrackFromPlaylist: async (playlistId, trackId) => {
    const { error } = await supabase.from('playlist_tracks').delete().eq('playlist_id', playlistId).eq('track_id', trackId);
    must(error);
    return { ok: true };
  },

  reorderPlaylistTracks: async (playlistId, orderedTrackIds) => {
    await Promise.all(orderedTrackIds.map((trackId, index) =>
      supabase.from('playlist_tracks').update({ position: index }).eq('playlist_id', playlistId).eq('track_id', trackId)
    ));
    return { ok: true };
  },

  // ---------- settings ----------
  getSettings: async () => {
    const { data, error } = await supabase.from('eq_settings').select('*').eq('id', 1).maybeSingle();
    must(error);
    if (!data) return { eqEnabled: true, eqPreset: 'Flat', eqBands: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0] };
    return { eqEnabled: data.eq_enabled, eqPreset: data.eq_preset, eqBands: data.eq_bands };
  },

  updateSettings: async (patch) => {
    const dbPatch = { updated_at: new Date().toISOString() };
    if (typeof patch.eqEnabled === 'boolean') dbPatch.eq_enabled = patch.eqEnabled;
    if (typeof patch.eqPreset === 'string') dbPatch.eq_preset = patch.eqPreset;
    if (patch.eqBands) dbPatch.eq_bands = patch.eqBands;
    const { data, error } = await supabase.from('eq_settings').update(dbPatch).eq('id', 1).select().maybeSingle();
    must(error);
    return { eqEnabled: data.eq_enabled, eqPreset: data.eq_preset, eqBands: data.eq_bands };
  },
};
