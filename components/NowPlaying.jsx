'use client';
import { useEffect, useRef, useState } from 'react';
import { usePlayer } from '@/context/PlayerContext';
import { formatTime } from '@/lib/constants';
import { PlayIcon, PauseIcon, PrevIcon, NextIcon, RepeatIcon, QueueIcon } from './icons';
import NowPlayingQueue from './NowPlayingQueue';

export default function NowPlaying() {
  const { audioRef, findTrack, currentTrackId, isPlaying, repeatMode, closeNowPlaying, playPrev, playNext, togglePlayPause, setRepeatMode } = usePlayer();
  const track = findTrack(currentTrackId);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [closing, setClosing] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const bodyRef = useRef(null);
  const seekRef = useRef(null);
  const touchStartYRef = useRef(0);
  const allowDragRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime || 0);
    setDuration(audio.duration || 0);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [audioRef, currentTrackId]);

  function closeAnimated() {
    setClosing(true);
    setDragY(0);
    setTimeout(() => { closeNowPlaying(); setClosing(false); setDragY(0); }, 220);
  }
  function onTouchStart(e) {
    touchStartYRef.current = e.touches[0].clientY;
    allowDragRef.current = bodyRef.current ? bodyRef.current.scrollTop <= 0 : true;
  }
  function onTouchMove(e) {
    if (!allowDragRef.current) return;
    const dy = e.touches[0].clientY - touchStartYRef.current;
    if (dy > 0) setDragY(dy);
  }
  function onTouchEnd() {
    if (dragY > 100) closeAnimated(); else setDragY(0);
  }
  function onSeekClick(e) {
    const audio = audioRef.current;
    if (!track || !audio || !audio.duration || !seekRef.current) return;
    const rect = seekRef.current.getBoundingClientRect();
    const frac = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audio.currentTime = frac * audio.duration;
    setCurrentTime(audio.currentTime);
  }

  if (!track) return null;
  const dur = duration || track.duration || 0;
  const pct = dur ? Math.min(100, (currentTime / dur) * 100) : 0;
  const transform = `translateY(${closing ? '100%' : `${dragY}px`})`;
  const transition = closing ? 'transform 0.22s ease-in' : (dragY > 0 ? 'none' : 'transform 0.2s ease-out');

  return (
    <div className="np-overlay" style={{ transform, transition }}>
      <button className="np-handle" aria-label="닫기" onClick={closeAnimated} />
      <div className="np-header-row">
        <button className="np-queue-btn" aria-label="재생목록 보기" onClick={() => setShowQueue(true)}><QueueIcon /></button>
      </div>
      <div className="np-body" ref={bodyRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
        <div className="np-art">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/default-cover.png" alt="" />
        </div>
        <div>
          <div className="np-title">{track.title}</div>
          <div className="np-artist">{track.artist}</div>
        </div>
      </div>
      <div style={{ width: '100%' }}>
        <button className="np-seek" ref={seekRef} onClick={onSeekClick}><span className="np-seek-fill" style={{ width: `${pct}%` }} /></button>
        <div className="np-times"><span>{formatTime(currentTime)}</span><span>{formatTime(dur)}</span></div>
        <div className="np-transport">
          <button aria-label="이전 곡" onClick={playPrev}><PrevIcon size={26} /></button>
          <button className="np-play-big" aria-label="재생/일시정지" onClick={togglePlayPause}>{isPlaying ? <PauseIcon /> : <PlayIcon />}</button>
          <button aria-label="다음 곡" onClick={playNext}><NextIcon size={26} /></button>
        </div>
        <div className="np-repeats">
          <button className="np-repeat-btn" style={{ color: repeatMode === 'one' ? 'var(--np-repeat-active)' : 'var(--np-repeat-inactive)' }} onClick={() => setRepeatMode('one')}><RepeatIcon badge="one" /><span>한곡 반복</span></button>
          <button className="np-repeat-btn" style={{ color: repeatMode === 'playlist' ? 'var(--np-repeat-active)' : 'var(--np-repeat-inactive)' }} onClick={() => setRepeatMode('playlist')}><RepeatIcon /><span>재생목록 반복</span></button>
          <button className="np-repeat-btn" style={{ color: repeatMode === 'all' ? 'var(--np-repeat-active)' : 'var(--np-repeat-inactive)' }} onClick={() => setRepeatMode('all')}><RepeatIcon badge="all" /><span>전체 반복</span></button>
        </div>
      </div>
      {showQueue && <NowPlayingQueue onClose={() => setShowQueue(false)} />}
    </div>
  );
}
