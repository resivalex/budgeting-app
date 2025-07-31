import axios, { AxiosInstance } from 'axios'
import {
  ConfigDataDTO,
  SpendingLimitsDTO,
  CategoryExpansionsDTO,
  AccountPropertiesDTO,
} from '@/types'

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

  async getSpendingLimits(): Promise<SpendingLimitsDTO> {
    const response = await this.axiosInstance.get('/spending-limits')

    const data = response.data
    return {
      limits: data.limits.map((limit: any) => ({
        name: limit.name,
        color: limit.color,
        categories: limit.categories,
        monthLimits: limit.month_limits.map((monthLimit: any) => ({
          date: monthLimit.date,
          currency: monthLimit.currency,
          amount: monthLimit.amount,
        })),
      })),
      monthCurrencyConfigs: data.month_currency_configs.map((monthCurrencyConfig: any) => ({
        date: monthCurrencyConfig.date,
        config: {
          mainCurrency: monthCurrencyConfig.config.main_currency,
          conversionRates: monthCurrencyConfig.config.conversion_rates,
        },
      })),
    }
  }

  async setMonthSpendingItemLimit(
    date: string,
    name: string,
    currency: string,
    amount: number,
  ): Promise<void> {
    await this.axiosInstance.post('/spending-limits/month-budget-item', {
      date: date,
      limit: { name: name, currency: currency, amount: amount },
    })
  }

  async getCategoryExpansions(): Promise<CategoryExpansionsDTO> {
    const response = await this.axiosInstance.get('/category-expansions')

    return response.data
  }

  async getAccountProperties(): Promise<AccountPropertiesDTO> {
    const response = await this.axiosInstance.get('/account-properties')

    return response.data
  }

  async getExportingCsvString(): Promise<string> {
    try {
      const response = await this.axiosInstance.get('/exporting', {
        responseType: 'blob',
      })

      return response.data
    } catch (err) {
      throw new Error('Failed to export CSV.')
    }
  }
}

export default BackendService
