'use client';

import { useCallback, useRef } from 'react';
import { EQ_FREQ_HZ } from '@/lib/constants';

const GAIN_RAMP_SECONDS = 0.02;

export function useAudioEngine() {
  const audioRef = useRef(null);
  const audioCtxRef = useRef(null);
  const filtersRef = useRef([]);

  const ensureAudioGraph = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    const ctx = new Ctx();
    const source = ctx.createMediaElementSource(audioRef.current);
    let prev = source;
    const filters = EQ_FREQ_HZ.map((hz) => {
      const f = ctx.createBiquadFilter();
      f.type = 'peaking';
      f.frequency.value = hz;
      f.Q.value = 1.1;
      f.gain.value = 0;
      prev.connect(f);
      prev = f;
      return f;
    });
    prev.connect(ctx.destination);
    audioCtxRef.current = ctx;
    filtersRef.current = filters;
  }, []);

  const setEqGains = useCallback((eqEnabled, eqBands) => {
    const ctx = audioCtxRef.current;
    filtersRef.current.forEach((f, i) => {
      const target = eqEnabled ? eqBands[i] : 0;
      if (ctx) f.gain.setTargetAtTime(target, ctx.currentTime, GAIN_RAMP_SECONDS);
      else f.gain.value = target;
    });
  }, []);

  const setBandGain = useCallback((index, value, eqEnabled) => {
    const ctx = audioCtxRef.current;
    const f = filtersRef.current[index];
    if (!f) return;
    const target = eqEnabled ? value : 0;
    if (ctx) f.gain.setTargetAtTime(target, ctx.currentTime, GAIN_RAMP_SECONDS);
    else f.gain.value = target;
  }, []);

  const resumeIfSuspended = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }, []);

  return { audioRef, ensureAudioGraph, setEqGains, setBandGain, resumeIfSuspended };
}
