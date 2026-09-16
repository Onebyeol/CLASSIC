'use client';
import { usePlayer } from '@/context/PlayerContext';
import { ChevronLeftIcon, RestoreIcon, TrashIcon } from '../icons';
import TrackTile from '../TrackTile';
import EmptyState from '../EmptyState';

export default function TrashScreen() {
  const { trash, back, restoreTrack, permanentlyDeleteTrack, setShowEmptyTrashConfirm } = usePlayer();
  return (
    <section className="screen">
      <div className="push-hdr">
        <div className="back-row"><button className="back-btn" aria-label="뒤로" onClick={back}><ChevronLeftIcon /></button><div className="push-title">휴지통</div></div>
        <div style={{ fontSize: 13, color: 'var(--danger)', cursor: 'pointer' }} onClick={() => setShowEmptyTrashConfirm(true)}>전체 비우기</div>
      </div>
      <div style={{ padding: '8px 20px 100px' }}>
        {trash.length === 0 ? (
          <EmptyState icon={<TrashIcon size={22} />} title="휴지통이 비어있어요" subtitle="삭제한 곡이 여기에 보관돼요" />
        ) : (
          <ul>
            {trash.map((t) => (
              <li className="track-row" style={{ cursor: 'default' }} key={t.id}>
                <TrackTile dim />
                <div className="row-meta"><div className="row-title">{t.title}</div><div className="row-artist">{t.artist}</div></div>
                <button className="icon-btn-32" style={{ color: 'var(--accent)' }} aria-label="복원" onClick={() => restoreTrack(t.id)}><RestoreIcon /></button>
                <button className="icon-btn-32" style={{ color: 'var(--danger)' }} aria-label="영구 삭제" onClick={() => permanentlyDeleteTrack(t.id)}><TrashIcon size={14} /></button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
