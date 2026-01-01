import { createContext, useContext, ReactNode, useMemo } from 'react'
import BackendService from './BackendService'
import DbService from './DbService'
import StorageService from './StorageService'

interface ServiceContextValue {
  backendService: BackendService
  dbService: DbService
  storageService: StorageService
}

const ServiceContext = createContext<ServiceContextValue | null>(null)

interface ServiceProviderProps {
  backendService: BackendService
  dbService: DbService
  children: ReactNode
}

export function ServiceProvider({ backendService, dbService, children }: ServiceProviderProps) {
  const storageService = useMemo(() => new StorageService(), [])

  const value = useMemo(
    () => ({
      backendService,
      dbService,
      storageService,
    }),
    [backendService, dbService, storageService],
  )

  return <ServiceContext.Provider value={value}>{children}</ServiceContext.Provider>
}

export function useServices(): ServiceContextValue {
  const context = useContext(ServiceContext)
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider')
  }
  return context
}
