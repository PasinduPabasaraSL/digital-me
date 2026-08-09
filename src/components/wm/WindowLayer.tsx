import Window from './Window';
import { useWindows } from '@/store/windows';

export default function WindowLayer() {
  const windows = useWindows((state) => state.windows);

  return (
    <>
      {windows.map((win) => (
        <Window key={win.id} win={win} />
      ))}
    </>
  );
}
