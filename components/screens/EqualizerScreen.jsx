'use client';
import { usePlayer } from '@/context/PlayerContext';
import { EQ_PRESETS, EQ_FREQ_LABELS } from '@/lib/constants';
import { ChevronLeftIcon } from '../icons';

export default function EqualizerScreen() {
  const { back, eqEnabled, eqPreset, eqBands, toggleEqEnabled, applyEqPreset, setEqBand } = usePlayer();
  return (
    <section className="screen">
      <div className="push-hdr">
        <div className="back-row"><button className="back-btn" aria-label="뒤로" onClick={back}><ChevronLeftIcon /></button><div className="push-title">이퀄라이저</div></div>
        <button className="eq-toggle" aria-label="이퀄라이저 켜기/끄기" style={{ background: eqEnabled ? 'var(--navy)' : 'var(--divider)' }} onClick={toggleEqEnabled}>
          <span className="eq-toggle-thumb" style={{ left: eqEnabled ? 21 : 2 }} />
        </button>
      </div>
      <div className="eq-chip-row">
        {Object.keys(EQ_PRESETS).map((name) => {
          const active = name === eqPreset;
          return (<button key={name} className="eq-chip" style={{ background: active ? 'var(--navy)' : 'var(--white)', color: active ? '#fff' : 'var(--text)' }} onClick={() => applyEqPreset(name)}>{name}</button>);
        })}
      </div>
      <div className="eq-panel" style={{ opacity: eqEnabled ? 1 : 0.4, pointerEvents: eqEnabled ? 'auto' : 'none' }}>
        <div className="eq-bands">
          {EQ_FREQ_LABELS.map((freq, i) => {
            const v = eqBands[i];
            return (
              <div className="eq-band-col" key={freq}>
                <span className="eq-band-val">{v > 0 ? `+${v}` : v}</span>
                <div className="eq-band-slider-wrap"><input type="range" className="eq-band-slider" min={-12} max={12} step={1} value={v} aria-label={`${freq}Hz`} onChange={(e) => setEqBand(i, Number(e.target.value))} /></div>
                <span className="eq-band-freq">{freq}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="eq-note">각 주파수 대역을 위아래로 조절해 소리를 다듬어보세요. 슬라이더를 움직이면 자동으로 &apos;사용자 지정&apos;으로 전환됩니다.</div>
    </section>
  );
}
