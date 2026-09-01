'use client';
import { useEffect, useRef } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { CloseIcon, UploadIcon } from '../icons';

export default function UploadSheet() {
  const { showUpload, setShowUpload, addFiles, uploadingCount } = usePlayer();
  const wasUploadingRef = useRef(false);
  useEffect(() => {
    if (uploadingCount > 0) wasUploadingRef.current = true;
    if (uploadingCount === 0 && wasUploadingRef.current) {
      wasUploadingRef.current = false;
      const t = setTimeout(() => setShowUpload(false), 500);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [uploadingCount, setShowUpload]);
  if (!showUpload) return null;
  const uploading = uploadingCount > 0;
  return (
    <div className="sheet-overlay" onClick={(e) => { if (e.target === e.currentTarget && !uploading) setShowUpload(false); }}>
      <div className="sheet">
        <div className="sheet-head">
          <div className="sheet-title">곡 등록</div>
          {!uploading && <button className="sheet-close" aria-label="닫기" onClick={() => setShowUpload(false)}><CloseIcon /></button>}
        </div>
        {uploading ? (
          <div className="upload-progress">
            <div className="upload-spinner" />
            <div className="upload-progress-text">업로드 중…</div>
            <div className="upload-progress-sub">{uploadingCount}개 파일 처리 중이에요</div>
          </div>
        ) : (
          <label className="drop-zone" onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); addFiles(e.dataTransfer.files); }}>
            <UploadIcon />
            <div className="drop-zone-text">MP3 파일을 여기로 드래그하거나<br /><br />탭해서 선택하세요</div>
            <input type="file" accept=".mp3,audio/mpeg" multiple style={{ display: 'none' }} onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
          </label>
        )}
      </div>
    </div>
  );
}
