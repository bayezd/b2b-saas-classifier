import { developmentConfig } from './development'
import { stagingConfig } from './staging'
import { productionConfig } from './production'
import { backupConfig } from './backup'

type Environment = 'development' | 'staging' | 'production'

const getEnvironment = (): Environment => {
  return (process.env.NODE_ENV as Environment) || 'development'
}

export const getConfig = () => {
  const env = getEnvironment()

  switch (env) {
    case 'production':
      return productionConfig
    case 'staging':
      return stagingConfig
    default:
      return developmentConfig
  }
}

export const config = getConfig()
export const backup = backupConfig

// Type exports
export type Config = typeof productionConfig
export type BackupConfig = typeof backupConfig
