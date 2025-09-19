import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { env } from '@shared/config/env'

const buildBaseUrl = (): string => {
  const base = env.apiUrl.endsWith('/') ? env.apiUrl : `${env.apiUrl}/`
  return new URL(String(env.storeId), base).href
}

const appendAuthParams = (config: InternalAxiosRequestConfig) => {
  const existingParams = config.params ?? {}

  config.params = {
    ...existingParams,
    token: env.apiToken
  }

  return config
}

export const httpClient: AxiosInstance = axios.create({
  baseURL: buildBaseUrl(),
  timeout: 15_000
})

httpClient.interceptors.request.use(appendAuthParams)
