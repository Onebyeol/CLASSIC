export const TRACK_COLORS = [
  '#1f3a5f', '#3a5a8c', '#5c7ba3', '#8a6d3a',
  '#4a6b5c', '#6b4a6b', '#3a5c4a', '#7a4a4a',
];

export const EQ_PRESETS = {
  Flat: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  '클래식': [3, 2, 1, 0, 0, 0, -1, -1, -2, -2],
  '보컬 부스트': [-2, -2, -1, 1, 3, 3, 2, 0, -1, -1],
  '베이스 부스터': [6, 5, 4, 2, 1, 0, 0, 0, 0, 0],
  '트레블 부스트': [0, 0, 0, 0, 0, 1, 2, 4, 5, 6],
  '어쿠스틱': [3, 2, 1, 1, 0, 1, 2, 2, 1, 1],
  '일렉트로닉': [4, 3, 0, -2, -1, 0, 2, 3, 4, 5],
};

export const EQ_FREQ_LABELS = ['32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];
export const EQ_FREQ_HZ = [32, 64, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];

export function uid(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function formatTime(sec) {
  sec = Math.max(0, Math.floor(sec || 0));
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

export function randomTrackColor() {
  return TRACK_COLORS[Math.floor(Math.random() * TRACK_COLORS.length)];
}
