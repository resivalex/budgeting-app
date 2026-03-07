import { atom } from 'jotai'

export interface SyncStatus {
  isOffline: boolean
}

const initialSyncStatus: SyncStatus = {
  isOffline: false,
}

export const syncStatusAtom = atom<SyncStatus>(initialSyncStatus)

export const isOfflineAtom = atom((get) => get(syncStatusAtom).isOffline)
