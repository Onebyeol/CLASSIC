'use client';
import { useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { useDragReorder } from '@/hooks/useDragReorder';
import TrackRow from '../TrackRow';
import EmptyState from '../EmptyState';
import { TrashIcon, PlusIcon, SearchIcon, NoteOutlineIcon } from '../icons';

export default function LibraryScreen() {
  const { tracks, searchQuery, setSearchQuery, currentTrackId, playTrack, openTrackMenu, openTrash, setShowUpload, reorderLibrary } = usePlayer();
  const [editMode, setEditMode] = useState(false);
  const { onPointerDown, getRowStyle } = useDragReorder(tracks.length, reorderLibrary);
  const q = searchQuery.trim().toLowerCase();
  const filtered = tracks.filter((t) => !q || (t.title + ' ' + t.artist).toLowerCase().includes(q));
  const canEdit = !q && tracks.length > 1;
  return (
    <section className="screen">
      <div className="hdr">
        <div>
          <div className="hdr-title">노래</div>
          <div className="hdr-sub">총 {tracks.length}곡</div>
        </div>
        <div className="hdr-actions">
          {editMode ? (
            <button className="edit-btn" onClick={() => setEditMode(false)}>완료</button>
          ) : (
            <>
              {canEdit && <button className="edit-btn" onClick={() => setEditMode(true)}>편집</button>}
              <button className="round-btn ghost" aria-label="휴지통" onClick={openTrash}><TrashIcon size={16} /></button>
              <button className="round-btn solid" aria-label="MP3 등록" onClick={() => setShowUpload(true)}><PlusIcon /></button>
            </>
          )}
        </div>
      </div>
      {!editMode && (
        <div className="search-wrap">
          <div className="search-box">
            <SearchIcon />
            <input type="text" placeholder="곡 검색" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          </div>
        </div>
      )}
      <div className="list-pad">
        {filtered.length === 0 ? (
          q ? (
            <EmptyState icon={<SearchIcon />} title="검색 결과가 없어요" subtitle={`'${searchQuery.trim()}'에 대한 곡을 찾을 수 없어요`} />
          ) : (
            <EmptyState icon={<NoteOutlineIcon size={24} />} title="아직 등록된 노래가 없어요" subtitle="오른쪽 위 + 버튼으로 MP3를 추가해보세요" />
          )
        ) : (
          <ul>
            {filtered.map((t, i) => (
              <TrackRow key={t.id} track={t} index={i} isCurrent={t.id === currentTrackId} editMode={editMode} dragStyle={getRowStyle(i)} onClick={() => playTrack(t.id, null)} onMenuClick={() => openTrackMenu(t.id, null)} onPointerDownHandle={onPointerDown} />
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
