import axios from 'axios';
import { getPendingSales, removePendingSale } from './offline';
import { useSyncStore } from '@/stores/sync';

let syncing = false;

export async function drainOfflineQueue(): Promise<void> {
  if (syncing) return;
  syncing = true;
  try {
    const pending = await getPendingSales();
    if (pending.length === 0) return;

    const syncStore = useSyncStore();
    for (const item of pending) {
      try {
        await axios.post('/api/v1/sales', item.payload);
        await removePendingSale(item.id);
        syncStore.decrement();
      } catch {
        // leave in queue for next sync attempt
      }
    }
  } finally {
    syncing = false;
  }
}

export function setupOnlineListener(): void {
  window.addEventListener('online', () => {
    drainOfflineQueue();
  });
}
