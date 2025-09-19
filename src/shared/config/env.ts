export type EnvConfig = {
  apiUrl: string
  apiToken: string
  storeId: string
}

const resolveEnv = (): EnvConfig => {
  const apiUrl = import.meta.env.VITE_ECWID_API_URL as string | undefined
  const apiToken = import.meta.env.VITE_ECWID_API_TOKEN as string | undefined
  const storeId = import.meta.env.VITE_ECWID_STORE_ID as string | undefined

  if (!apiUrl) {
    throw new Error('Missing VITE_ECWID_API_URL environment variable')
  }

  if (!apiToken) {
    throw new Error('Missing VITE_ECWID_API_TOKEN environment variable')
  }

  if (!storeId) {
    throw new Error('Missing VITE_ECWID_STORE_ID environment variable')
  }

  return {
    apiUrl,
    apiToken,
    storeId
  }
}

export const env = resolveEnv()
