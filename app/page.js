import { PlayerProvider } from '@/context/PlayerContext';
import ClassicMp3App from '@/components/ClassicMp3App';

export default function Page() {
  return (<PlayerProvider><ClassicMp3App /></PlayerProvider>);
}
