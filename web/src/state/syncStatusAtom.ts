import { atom } from 'jotai'

export interface SyncStatus {
  isOffline: boolean
  hasPushError: boolean
  isFirstPullComplete: boolean
}

const initialSyncStatus: SyncStatus = {
  isOffline: false,
  hasPushError: false,
  isFirstPullComplete: false,
}

export const syncStatusAtom = atom<SyncStatus>(initialSyncStatus)

export const isOfflineAtom = atom((get) => get(syncStatusAtom).isOffline)
