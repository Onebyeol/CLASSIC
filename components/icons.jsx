export function NoteIcon({ size = 20, opacity = 0.85 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill={`rgba(255,255,255,${opacity})`}><path d="M9 18V5l11-2v12"></path><circle cx="6" cy="18" r="3"></circle><circle cx="17" cy="15" r="3"></circle></svg>);
}
export function NoteOutlineIcon({ size = 22 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18V5l11-2v12"></path><circle cx="6" cy="18" r="3"></circle><circle cx="17" cy="15" r="3"></circle></svg>);
}
export function PlayIcon({ size = '100%' }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><polygon points="6,4 20,12 6,20"></polygon></svg>);
}
export function PauseIcon({ size = '100%' }) {
  return (<svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}><rect x="5" y="4" width="5" height="16"></rect><rect x="14" y="4" width="5" height="16"></rect></svg>);
}
export function PrevIcon({ size = 18 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><polygon points="20,4 8,12 20,20"></polygon><rect x="4" y="4" width="3" height="16"></rect></svg>);
}
export function NextIcon({ size = 18 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor"><polygon points="4,4 16,12 4,20"></polygon><rect x="17" y="4" width="3" height="16"></rect></svg>);
}
export function GripIcon() {
  return (<svg viewBox="0 0 24 24" width="15" height="15" fill="#c7c7cc"><circle cx="8" cy="6" r="1.4"></circle><circle cx="16" cy="6" r="1.4"></circle><circle cx="8" cy="12" r="1.4"></circle><circle cx="16" cy="12" r="1.4"></circle><circle cx="8" cy="18" r="1.4"></circle><circle cx="16" cy="18" r="1.4"></circle></svg>);
}
export function DotsIcon() {
  return (<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><circle cx="12" cy="5" r="2"></circle><circle cx="12" cy="12" r="2"></circle><circle cx="12" cy="19" r="2"></circle></svg>);
}
export function RestoreIcon() {
  return (<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"></path><path d="M3 4v5h5"></path></svg>);
}
export function TrashIcon({ size = 16 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M6 6l1 14h10l1-14"></path></svg>);
}
export function CheckIcon() {
  return (<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#1f3a5f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>);
}
export function PlusIcon({ size = 18 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"></path></svg>);
}
export function SearchIcon() {
  return (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#8a8a8e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"></circle><path d="M21 21l-4.35-4.35"></path></svg>);
}
export function ChevronRightIcon() {
  return (<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#c7c7cc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>);
}
export function ChevronLeftIcon({ size = 22 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
}
export function CloseIcon() {
  return (<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>);
}
export function UploadIcon() {
  return (<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 16V4M12 4l-4 4M12 4l4 4"></path><path d="M4 16v3a2 2 0 002 2h12a2 2 0 002-2v-3"></path></svg>);
}
export function EqualizerIcon({ size = 15 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 21v-6M4 11V3M12 21v-9M12 8V3M20 21v-4M20 13V3"></path><path d="M1 15h6M9 8h6M17 13h6"></path></svg>);
}
export function SettingsTabIcon({ size = 22 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="3"></circle><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8l2.8-2.8M17 7l2.8-2.8"></path></svg>);
}
export function PlaylistsTabIcon({ size = 22 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="12" cy="12" r="2.3"></circle></svg>);
}
export function QueueIcon({ size = 22 }) {
  return (<svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h13M3 12h13M3 18h9"></path><path d="M18 14l4 3-4 3v-6z" fill="currentColor" stroke="none"></path></svg>);
}
export function RepeatIcon({ badge }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 2l4 4-4 4"></path><path d="M3 11V9a4 4 0 0 1 4-4h14"></path><path d="M7 22l-4-4 4-4"></path><path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
      {badge === 'one' && <text x="10.5" y="15" fontSize="8" fill="currentColor" stroke="none">1</text>}
      {badge === 'all' && <text x="9" y="15" fontSize="7" fill="currentColor" stroke="none">∞</text>}
    </svg>
  );
}
