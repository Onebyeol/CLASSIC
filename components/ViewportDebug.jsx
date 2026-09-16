'use client';
import { useEffect, useState } from 'react';

export default function ViewportDebug() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    function measure() {
      const app = document.querySelector('.app');
      const cs = app ? getComputedStyle(app) : null;
      const rect = app ? app.getBoundingClientRect() : null;
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;bottom:0;left:0;height:env(safe-area-inset-bottom);width:1px;visibility:hidden;';
      document.body.appendChild(probe);
      const safeBottom = probe.getBoundingClientRect().height;
      document.body.removeChild(probe);
      setInfo({
        innerHeight: window.innerHeight,
        visualViewportHeight: window.visualViewport ? Math.round(window.visualViewport.height) : 'n/a',
        docClientHeight: document.documentElement.clientHeight,
        bodyClientHeight: document.body.clientHeight,
        appClientHeight: app ? app.clientHeight : 'n/a',
        appComputedHeight: cs ? cs.height : 'n/a',
        appBottom: rect ? Math.round(rect.bottom) : 'n/a',
        gapBelowApp: rect ? Math.round(window.innerHeight - rect.bottom) : 'n/a',
        safeAreaBottom: safeBottom,
        dpr: window.devicePixelRatio,
        standalone: window.navigator.standalone,
      });
    }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('orientationchange', measure);
    const id = setInterval(measure, 1000);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('orientationchange', measure);
      clearInterval(id);
    };
  }, []);

  if (!info) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 999, background: 'rgba(255,0,0,0.85)', color: '#fff',
      fontSize: 10, fontFamily: 'monospace', padding: '4px 6px', lineHeight: 1.5, whiteSpace: 'pre-wrap',
    }}>
      {`innerHeight:${info.innerHeight} visualVP:${info.visualViewportHeight} docClient:${info.docClientHeight} bodyClient:${info.bodyClientHeight}
appClient:${info.appClientHeight} appComputed:${info.appComputedHeight} appBottom:${info.appBottom} GAP:${info.gapBelowApp} safeBottom:${info.safeAreaBottom} dpr:${info.dpr} standalone:${String(info.standalone)}`}
    </div>
  );
}
