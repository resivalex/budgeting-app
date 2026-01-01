import { StorageService, BackendService } from '@/services'
import { ConfigDataDTO } from '@/types'

class AuthDomain {
  private storageService: StorageService

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  async login(backendUrl: string, password: string): Promise<ConfigDataDTO> {
    const backendService = new BackendService(backendUrl)
    const config = await backendService.getConfig(password)
    this.storageService.set('config', config)
    return config
  }

  isLoggedIn(): boolean {
    return this.storageService.get('config') !== null
  }

  logout(): void {
    this.storageService.remove('config')
    window.location.reload()
  }
}

export default AuthDomain
