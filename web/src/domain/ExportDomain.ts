import { BackendService } from '@/services'

class ExportDomain {
  private readonly backendService: BackendService

  constructor(backendService: BackendService) {
    this.backendService = backendService
  }

  async exportToCsv(): Promise<void> {
    const { blob, filename } = await this.backendService.downloadExportingCsv()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export default ExportDomain
