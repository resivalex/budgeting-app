import { BackendService } from '@/services'

class ExportDomain {
  private backendService: BackendService

  constructor(backendService: BackendService) {
    this.backendService = backendService
  }

  async exportToCsv(): Promise<void> {
    const csvString = await this.backendService.getExportingCsvString()
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', this.generateFileName())
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  private generateFileName(): string {
    return (
      new Date()
        .toISOString()
        .slice(0, 19)
        .replaceAll('-', '')
        .replaceAll(':', '')
        .replace('T', '-') + '.csv'
    )
  }
}

export default ExportDomain
