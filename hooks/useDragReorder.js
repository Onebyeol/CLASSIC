'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export function useDragReorder(itemCount, onCommit) {
  const [dragIndex, setDragIndex] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [deltaY, setDeltaY] = useState(0);
  const startYRef = useRef(0);
  const rowHeightRef = useRef(56);

  const onPointerDown = useCallback((e, index) => {
    const row = e.currentTarget.closest('.track-row');
    if (row) rowHeightRef.current = row.getBoundingClientRect().height;
    startYRef.current = e.clientY;
    setDragIndex(index);
    setHoverIndex(index);
    setDeltaY(0);
  }, []);

  useEffect(() => {
    if (dragIndex === null) return undefined;
    function handleMove(e) {
      const rawDelta = e.clientY - startYRef.current;
      const rowH = rowHeightRef.current || 56;
      const shift = Math.round(rawDelta / rowH);
      const newHover = Math.max(0, Math.min(itemCount - 1, dragIndex + shift));
      setHoverIndex(newHover);
      setDeltaY(rawDelta);
      e.preventDefault();
    }
    function handleUp() {
      setDragIndex((currentDragIndex) => {
        setHoverIndex((currentHoverIndex) => {
          if (currentDragIndex !== null && currentHoverIndex !== null && currentDragIndex !== currentHoverIndex) {
            onCommit(currentDragIndex, currentHoverIndex);
          }
          return null;
        });
        return null;
      });
      setDeltaY(0);
    }
    window.addEventListener('pointermove', handleMove, { passive: false });
    window.addEventListener('pointerup', handleUp);
    window.addEventListener('pointercancel', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
      window.removeEventListener('pointercancel', handleUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragIndex, itemCount]);

  const getRowStyle = useCallback((index) => {
    if (dragIndex === null) return undefined;
    const rowH = rowHeightRef.current;
    if (index === dragIndex) {
      return { transform: `translateY(${deltaY}px)`, transition: 'none', zIndex: 10, position: 'relative', boxShadow: '0 6px 16px rgba(0,0,0,0.18)', borderRadius: 8 };
    }
    if (dragIndex < index && index <= hoverIndex) return { transform: `translateY(${-rowH}px)`, transition: 'transform 0.18s ease' };
    if (hoverIndex <= index && index < dragIndex) return { transform: `translateY(${rowH}px)`, transition: 'transform 0.18s ease' };
    return { transform: 'translateY(0)', transition: 'transform 0.18s ease' };
  }, [dragIndex, hoverIndex, deltaY]);

  return { isDragging: dragIndex !== null, onPointerDown, getRowStyle };
}
