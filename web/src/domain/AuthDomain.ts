import { StorageService } from '@/services'

class AuthDomain {
  private storageService: StorageService

  constructor(storageService: StorageService) {
    this.storageService = storageService
  }

  logout(): void {
    this.storageService.remove('config')
    window.location.reload()
  }
}

export default AuthDomain
