import { openDB, type DBSchema, type IDBPDatabase } from 'idb';

interface PosDB extends DBSchema {
  'pending-sales': {
    key: string;
    value: {
      id: string;
      payload: any;
      createdAt: number;
    };
  };
}

let dbInstance: IDBPDatabase<PosDB> | null = null;

async function getDb(): Promise<IDBPDatabase<PosDB>> {
  if (!dbInstance) {
    dbInstance = await openDB<PosDB>('pos-offline', 1, {
      upgrade(db) {
        db.createObjectStore('pending-sales', { keyPath: 'id' });
      },
    });
  }
  return dbInstance;
}

export async function queueSale(payload: any): Promise<string> {
  const db = await getDb();
  const id = crypto.randomUUID();
  await db.put('pending-sales', { id, payload, createdAt: Date.now() });
  return id;
}

export async function getPendingSales(): Promise<Array<{ id: string; payload: any; createdAt: number }>> {
  const db = await getDb();
  return db.getAll('pending-sales');
}

export async function removePendingSale(id: string): Promise<void> {
  const db = await getDb();
  await db.delete('pending-sales', id);
}

export async function countPendingSales(): Promise<number> {
  const db = await getDb();
  return db.count('pending-sales');
}
