'use client';
import { usePlayer } from '@/context/PlayerContext';

export default function EmptyTrashConfirmDialog() {
  const { showEmptyTrashConfirm, setShowEmptyTrashConfirm, emptyTrash } = usePlayer();
  if (!showEmptyTrashConfirm) return null;
  return (
    <div className="confirm-dialog-overlay">
      <div className="confirm-dialog">
        <h3>휴지통 비우기</h3>
        <p>휴지통의 모든 곡이 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.</p>
        <div className="confirm-dialog-actions">
          <button style={{ background: '#f0f0f2', color: 'var(--text)' }} onClick={() => setShowEmptyTrashConfirm(false)}>취소</button>
          <button style={{ background: 'var(--danger)', color: '#fff' }} onClick={emptyTrash}>비우기</button>
        </div>
      </div>
    </div>
  );
}
