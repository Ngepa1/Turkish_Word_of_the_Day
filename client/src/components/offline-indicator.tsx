import { useOnlineStatus } from '@/hooks/use-online-status';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const isOnline = useOnlineStatus();
  
  if (isOnline) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md shadow-lg flex items-center space-x-2 z-50">
      <WifiOff className="h-5 w-5" />
      <span>You are offline. Some features may be limited.</span>
    </div>
  );
}