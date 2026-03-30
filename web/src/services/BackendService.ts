import axios, { AxiosInstance } from 'axios'
import { ConfigDataDTO } from '@/types'

interface SettingsData {
  transactionsUploadedAt: string
}

const TIMEOUT = 5000 // 5 seconds

class BackendService {
  private readonly axiosInstance: AxiosInstance
  private readonly backendUrl: string

  constructor(backendUrl: string, token?: string) {
    this.backendUrl = backendUrl
    this.axiosInstance = axios.create({
      baseURL: backendUrl,
      timeout: TIMEOUT,
      headers: { Authorization: `Bearer ${token}` },
    })
  }

  async getConfig(password: string): Promise<ConfigDataDTO> {
    try {
      const response = await this.axiosInstance.get('/config', {
        params: { password: password },
      })

      return {
        backendUrl: this.backendUrl,
        backendToken: response.data.backend_token,
        dbUrl: response.data.db_url,
      }
    } catch (err) {
      throw new Error('Failed to log in. Please check your Backend URL and Password.')
    }
  }

  async getSettings(): Promise<SettingsData> {
    const response = await this.axiosInstance.get('/settings')

    return {
      transactionsUploadedAt: response.data.transactions_uploaded_at,
    }
  }
}

export default BackendService
