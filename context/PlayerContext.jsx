'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { EQ_PRESETS, randomTrackColor } from '@/lib/constants';
import { api } from '@/lib/api';

const PlayerContext = createContext(null);

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer()는 PlayerProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}

export function PlayerProvider({ children }) {
  const { audioRef, ensureAudioGraph, setEqGains, setBandGain, resumeIfSuspended } = useAudioEngine();

  const [tab, setTab] = useState('library');
  const [pushed, setPushed] = useState(null);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [tracks, setTracks] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [trash, setTrash] = useState([]);

  const [currentTrackId, setCurrentTrackId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [repeatMode, setRepeatModeState] = useState('off');
  const [playContextPlaylistId, setPlayContextPlaylistId] = useState(null);
  const [showNowPlaying, setShowNowPlaying] = useState(false);

  const [eqEnabled, setEqEnabled] = useState(true);
  const [eqPreset, setEqPreset] = useState('Flat');
  const [eqBands, setEqBands] = useState(EQ_PRESETS.Flat.slice());

  const [showUpload, setShowUpload] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [trackMenu, setTrackMenu] = useState(null);
  const [addToPlaylistFor, setAddToPlaylistFor] = useState(null);
  const [playlistMenuFor, setPlaylistMenuFor] = useState(null);
  const [renameTarget, setRenameTarget] = useState(null);
  const [showEmptyTrashConfirm, setShowEmptyTrashConfirm] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [uploadingCount, setUploadingCount] = useState(0);

  const findTrack = useCallback((id) => tracks.find((t) => t.id === id), [tracks]);
  const findPlaylist = useCallback((id) => playlists.find((p) => p.id === id), [playlists]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tracksRes, playlistsRes, trashRes, settingsRes] = await Promise.all([
          api.listTracks(), api.listPlaylists(), api.listTrash(), api.getSettings(),
        ]);
        if (cancelled) return;
        setTracks(tracksRes);
        setPlaylists(playlistsRes);
        setTrash(trashRes);
        setEqEnabled(settingsRes.eqEnabled);
        setEqPreset(settingsRes.eqPreset);
        setEqBands(settingsRes.eqBands);
      } catch (err) {
        if (!cancelled) setLoadError(err.message || 'Supabase에 연결할 수 없습니다.');
      } finally {
        if (!cancelled) setInitialLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const selectTab = useCallback((t) => { setTab(t); setPushed(null); }, []);
  const openTrash = useCallback(() => setPushed('trash'), []);
  const openEqualizer = useCallback(() => setPushed('equalizer'), []);
  const openPlaylistDetail = useCallback((id) => { setPushed('playlistDetail'); setActivePlaylistId(id); }, []);
  const back = useCallback(() => setPushed(null), []);

  const getContextIds = useCallback(() => {
    if (repeatMode === 'all' || !playContextPlaylistId) return tracks.map((t) => t.id);
    const pl = playlists.find((p) => p.id === playContextPlaylistId);
    return pl ? pl.trackIds : tracks.map((t) => t.id);
  }, [repeatMode, playContextPlaylistId, tracks, playlists]);

  const playTrack = useCallback((trackId, playlistId) => {
    const t = tracks.find((x) => x.id === trackId);
    if (!t) return;
    setCurrentTrackId(trackId);
    setPlayContextPlaylistId(playlistId || null);
    const audio = audioRef.current;
    if (audio) {
      audio.src = t.url;
      audio.currentTime = 0;
      const p = audio.play();
      if (p && p.catch) p.catch(() => setIsPlaying(false));
    }
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: t.title, artist: t.artist, album: 'Classic MP3',
        artwork: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      });
    }
  }, [tracks, audioRef]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!currentTrackId) {
      const ids = getContextIds();
      if (ids.length) playTrack(ids[0], playContextPlaylistId);
      return;
    }
    if (!audio) return;
    if (audio.paused) audio.play(); else audio.pause();
  }, [currentTrackId, getContextIds, playTrack, playContextPlaylistId, audioRef]);

  const playNext = useCallback(() => {
    const ids = getContextIds();
    const idx = ids.indexOf(currentTrackId);
    if (idx === -1) return;
    if (idx + 1 < ids.length) {
      playTrack(ids[idx + 1], playContextPlaylistId);
    } else if (repeatMode === 'playlist' || repeatMode === 'all') {
      playTrack(ids[0], playContextPlaylistId);
    } else {
      audioRef.current?.pause();
    }
  }, [getContextIds, currentTrackId, playContextPlaylistId, repeatMode, playTrack, audioRef]);

  const playPrev = useCallback(() => {
    const ids = getContextIds();
    const idx = ids.indexOf(currentTrackId);
    if (idx === -1) return;
    const prevIdx = idx > 0 ? idx - 1 : ids.length - 1;
    playTrack(ids[prevIdx], playContextPlaylistId);
  }, [getContextIds, currentTrackId, playContextPlaylistId, playTrack]);

  const handleTrackEnded = useCallback(() => {
    if (repeatMode === 'one') {
      const audio = audioRef.current;
      if (audio) { audio.currentTime = 0; audio.play(); }
      return;
    }
    playNext();
  }, [repeatMode, playNext, audioRef]);

  const setRepeatMode = useCallback((mode) => {
    setRepeatModeState((prev) => (prev === mode ? 'off' : mode));
  }, []);

  const openNowPlaying = useCallback(() => { if (currentTrackId) setShowNowPlaying(true); }, [currentTrackId]);
  const closeNowPlaying = useCallback(() => setShowNowPlaying(false), []);

  const latest = useRef({});
  useEffect(() => { latest.current = { handleTrackEnded, playNext, playPrev, togglePlayPause }; });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => latest.current.handleTrackEnded();
    const onLoadedMetadata = () => {
      setTracks((prev) => prev.map((t) => (t.id === currentTrackId ? { ...t, duration: audio.duration } : t)));
    };
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [audioRef, currentTrackId]);

  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.setActionHandler('play', () => audioRef.current?.play());
    navigator.mediaSession.setActionHandler('pause', () => audioRef.current?.pause());
    navigator.mediaSession.setActionHandler('previoustrack', () => latest.current.playPrev());
    navigator.mediaSession.setActionHandler('nexttrack', () => latest.current.playNext());
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details && details.seekTime != null && audioRef.current) audioRef.current.currentTime = details.seekTime;
    });
  }, [audioRef]);

  useEffect(() => {
    const onVisibility = () => { if (document.visibilityState === 'visible') resumeIfSuspended(); };
    const onFirstClick = () => resumeIfSuspended();
    document.addEventListener('visibilitychange', onVisibility);
    document.addEventListener('click', onFirstClick, { passive: true });
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      document.removeEventListener('click', onFirstClick);
    };
  }, [resumeIfSuspended]);

  const addFiles = useCallback((fileList) => {
    if (!fileList || !fileList.length) return;
    Array.from(fileList).forEach(async (f) => {
      const tempUrl = URL.createObjectURL(f);
      const title = f.name.replace(/\.[^/.]+$/, '');
      const color = randomTrackColor();
      setUploadingCount((c) => c + 1);
      try {
        const duration = await new Promise((resolve) => {
          const probe = new Audio();
          probe.preload = 'metadata';
          probe.src = tempUrl;
          probe.addEventListener('loadedmetadata', () => resolve(probe.duration || 0), { once: true });
          probe.addEventListener('error', () => resolve(0), { once: true });
        });
        const uploaded = await api.uploadTrack(f, { title, duration, color });
        setTracks((prev) => [...prev, uploaded]);
      } catch (err) {
        console.error('[classic-mp3] 업로드 실패:', err.message);
      } finally {
        URL.revokeObjectURL(tempUrl);
        setUploadingCount((c) => c - 1);
      }
    });
  }, []);

  const deleteTrack = useCallback((id) => {
    setTracks((prevTracks) => {
      const track = prevTracks.find((t) => t.id === id);
      if (track) setTrash((prevTrash) => [...prevTrash, track]);
      return prevTracks.filter((t) => t.id !== id);
    });
    setPlaylists((prev) => prev.map((p) => ({ ...p, trackIds: p.trackIds.filter((tid) => tid !== id) })));
    setCurrentTrackId((prevId) => {
      if (prevId === id) {
        const audio = audioRef.current;
        if (audio) { audio.pause(); audio.removeAttribute('src'); audio.load(); }
        setIsPlaying(false);
        setShowNowPlaying(false);
        return null;
      }
      return prevId;
    });
    api.trashTrack(id).catch((err) => console.error('[classic-mp3] 휴지통 이동 실패:', err.message));
  }, [audioRef]);

  const renameTrack = useCallback((id, title) => {
    const trimmed = title.trim();
    if (!trimmed) return;
    setTracks((prev) => prev.map((t) => (t.id === id ? { ...t, title: trimmed } : t)));
    api.renameTrack(id, trimmed).catch((err) => console.error('[classic-mp3] 이름 변경 실패:', err.message));
  }, []);

  const restoreTrack = useCallback((id) => {
    setTrash((prevTrash) => {
      const t = prevTrash.find((x) => x.id === id);
      if (t) setTracks((prevTracks) => [...prevTracks, t]);
      return prevTrash.filter((x) => x.id !== id);
    });
    api.restoreTrack(id).catch((err) => console.error('[classic-mp3] 복원 실패:', err.message));
  }, []);

  const permanentlyDeleteTrack = useCallback((id) => {
    setTrash((prev) => prev.filter((x) => x.id !== id));
    api.permanentlyDeleteTrack(id).catch((err) => console.error('[classic-mp3] 영구 삭제 실패:', err.message));
  }, []);

  const emptyTrash = useCallback(() => {
    setTrash([]);
    setShowEmptyTrashConfirm(false);
    api.emptyTrash().catch((err) => console.error('[classic-mp3] 휴지통 비우기 실패:', err.message));
  }, []);

  const createPlaylist = useCallback(async (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setShowCreatePlaylist(false);
    try {
      const created = await api.createPlaylist(trimmed);
      setPlaylists((prev) => [...prev, created]);
    } catch (err) {
      console.error('[classic-mp3] 재생목록 생성 실패:', err.message);
    }
  }, []);

  const deletePlaylist = useCallback((id) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== id));
    setPlaylistMenuFor(null);
    if (pushed === 'playlistDetail' && activePlaylistId === id) setPushed(null);
    api.deletePlaylist(id).catch((err) => console.error('[classic-mp3] 재생목록 삭제 실패:', err.message));
  }, [pushed, activePlaylistId]);

  const setPlaylistCover = useCallback(async (id, file) => {
    setPlaylistMenuFor(null);
    try {
      const { cover } = await api.uploadPlaylistCover(id, file);
      setPlaylists((prev) => prev.map((p) => (p.id === id ? { ...p, cover } : p)));
    } catch (err) {
      console.error('[classic-mp3] 표지 설정 실패:', err.message);
    }
  }, []);

  const togglePlaylistMenu = useCallback((id) => {
    setPlaylistMenuFor((prev) => (prev === id ? null : id));
  }, []);

  const toggleTrackInPlaylist = useCallback((playlistId, trackId) => {
    let willAdd = false;
    setPlaylists((prev) => prev.map((p) => {
      if (p.id !== playlistId) return p;
      const has = p.trackIds.includes(trackId);
      willAdd = !has;
      return { ...p, trackIds: has ? p.trackIds.filter((id) => id !== trackId) : [...p.trackIds, trackId] };
    }));
    const call = willAdd ? api.addTrackToPlaylist(playlistId, trackId) : api.removeTrackFromPlaylist(playlistId, trackId);
    call.catch((err) => console.error('[classic-mp3] 재생목록 트랙 변경 실패:', err.message));
  }, []);

  const removeTrackFromPlaylist = useCallback((playlistId, trackId) => {
    setPlaylists((prev) => prev.map((p) => (
      p.id === playlistId ? { ...p, trackIds: p.trackIds.filter((id) => id !== trackId) } : p
    )));
    api.removeTrackFromPlaylist(playlistId, trackId).catch((err) => console.error('[classic-mp3] 트랙 제거 실패:', err.message));
  }, []);

  const reorderLibrary = useCallback((fromIndex, toIndex) => {
    if (searchQuery.trim()) return;
    setTracks((prev) => {
      const arr = prev.slice();
      const [moved] = arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, moved);
      api.reorderTracks(arr.map((t) => t.id)).catch((err) => console.error('[classic-mp3] 순서 저장 실패:', err.message));
      return arr;
    });
  }, [searchQuery]);

  const reorderPlaylistTracks = useCallback((playlistId, fromIndex, toIndex) => {
    setPlaylists((prev) => prev.map((p) => {
      if (p.id !== playlistId) return p;
      const ids = p.trackIds.slice();
      const [moved] = ids.splice(fromIndex, 1);
      ids.splice(toIndex, 0, moved);
      api.reorderPlaylistTracks(playlistId, ids).catch((err) => console.error('[classic-mp3] 순서 저장 실패:', err.message));
      return { ...p, trackIds: ids };
    }));
  }, []);

  const openTrackMenu = useCallback((trackId, playlistId) => setTrackMenu({ trackId, playlistId: playlistId || null }), []);
  const closeTrackMenu = useCallback(() => setTrackMenu(null), []);
  const openAddToPlaylist = useCallback((trackId) => { setTrackMenu(null); setAddToPlaylistFor(trackId); }, []);
  const closeAddToPlaylist = useCallback(() => setAddToPlaylistFor(null), []);
  const openRename = useCallback((trackId) => { setTrackMenu(null); setRenameTarget(trackId); }, []);
  const closeRename = useCallback(() => setRenameTarget(null), []);

  const eqSaveTimeoutRef = useRef(null);
  const scheduleEqSave = useCallback((patch) => {
    if (eqSaveTimeoutRef.current) clearTimeout(eqSaveTimeoutRef.current);
    eqSaveTimeoutRef.current = setTimeout(() => {
      api.updateSettings(patch).catch((err) => console.error('[classic-mp3] EQ 설정 저장 실패:', err.message));
    }, 600);
  }, []);
  useEffect(() => () => { if (eqSaveTimeoutRef.current) clearTimeout(eqSaveTimeoutRef.current); }, []);

  const toggleEqEnabled = useCallback(() => {
    ensureAudioGraph();
    setEqEnabled((prev) => {
      const next = !prev;
      setEqGains(next, eqBands);
      scheduleEqSave({ eqEnabled: next });
      return next;
    });
  }, [eqBands, setEqGains, scheduleEqSave, ensureAudioGraph]);

  const applyEqPreset = useCallback((name) => {
    ensureAudioGraph();
    const bands = EQ_PRESETS[name].slice();
    setEqPreset(name);
    setEqBands(bands);
    setEqGains(eqEnabled, bands);
    scheduleEqSave({ eqPreset: name, eqBands: bands });
  }, [eqEnabled, setEqGains, scheduleEqSave, ensureAudioGraph]);

  const setEqBand = useCallback((index, value) => {
    ensureAudioGraph();
    setEqBands((prev) => {
      const next = prev.slice();
      next[index] = value;
      scheduleEqSave({ eqPreset: '사용자 지정', eqBands: next });
      return next;
    });
    setEqPreset('사용자 지정');
    setBandGain(index, value, eqEnabled);
  }, [eqEnabled, setBandGain, scheduleEqSave, ensureAudioGraph]);

  const value = {
    audioRef,
    tab, pushed, activePlaylistId, searchQuery, setSearchQuery,
    tracks, playlists, trash,
    currentTrackId, isPlaying, repeatMode, playContextPlaylistId, showNowPlaying,
    eqEnabled, eqPreset, eqBands,
    showUpload, setShowUpload, showCreatePlaylist, setShowCreatePlaylist,
    trackMenu, addToPlaylistFor, playlistMenuFor, showEmptyTrashConfirm, setShowEmptyTrashConfirm,
    renameTarget, openRename, closeRename, renameTrack,
    initialLoading, loadError, uploadingCount,
    findTrack, findPlaylist, getContextIds,
    selectTab, openTrash, openEqualizer, openPlaylistDetail, back,
    playTrack, togglePlayPause, playNext, playPrev, setRepeatMode, openNowPlaying, closeNowPlaying,
    addFiles, deleteTrack, restoreTrack, permanentlyDeleteTrack, emptyTrash,
    createPlaylist, deletePlaylist, setPlaylistCover, togglePlaylistMenu,
    toggleTrackInPlaylist, removeTrackFromPlaylist, reorderLibrary, reorderPlaylistTracks,
    openTrackMenu, closeTrackMenu, openAddToPlaylist, closeAddToPlaylist,
    toggleEqEnabled, applyEqPreset, setEqBand,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
    </PlayerContext.Provider>
  );
}
