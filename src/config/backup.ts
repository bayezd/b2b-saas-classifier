export const backupConfig = {
  // Database Backup Configuration
  database: {
    // Backup schedule
    schedule: {
      full: '0 0 * * *',      // Daily full backup at midnight
      incremental: '0 */6 * * *', // Incremental backup every 6 hours
    },
    
    // Retention policy
    retention: {
      daily: 7,    // Keep daily backups for 7 days
      weekly: 4,   // Keep weekly backups for 4 weeks
      monthly: 3,  // Keep monthly backups for 3 months
    },
    
    // Storage configuration
    storage: {
      provider: 'S3',  // AWS S3 for backup storage
      bucket: process.env.BACKUP_S3_BUCKET || 'b2b-classifier-backups',
      path: {
        daily: 'backups/daily',
        weekly: 'backups/weekly',
        monthly: 'backups/monthly',
      },
    },
  },

  // Redis Backup Configuration
  redis: {
    schedule: '0 */12 * * *',  // Backup every 12 hours
    retention: 14,             // Keep backups for 14 days
    snapshot: {
      type: 'RDB',            // Redis dump format
      compress: true,         // Compress backup files
    },
  },

  // File Storage Backup
  fileStorage: {
    schedule: '0 0 * * 0',    // Weekly backup on Sunday
    retention: 30,            // Keep backups for 30 days
    include: [
      'uploads/*',
      'public/assets/*',
    ],
    exclude: [
      '*.tmp',
      '*.log',
    ],
  },

  // Notification Configuration
  notifications: {
    channels: ['email', 'slack'],
    events: {
      success: true,
      failure: true,
      warning: true,
    },
    contacts: {
      email: process.env.BACKUP_NOTIFICATION_EMAIL || 'admin@b2bclassifier.com',
      slack: process.env.BACKUP_SLACK_WEBHOOK || '',
    },
  },

  // Monitoring
  monitoring: {
    checkInterval: 300,     // Check backup status every 5 minutes
    metrics: [
      'backup_size',
      'backup_duration',
      'backup_success_rate',
    ],
    alerts: {
      backupFailure: true,
      sizeDelta: 0.5,      // Alert if backup size changes by 50%
      durationThreshold: 3600, // Alert if backup takes more than 1 hour
    },
  },

  // Recovery Testing
  recoveryTesting: {
    schedule: '0 0 * * 1',  // Run recovery tests every Monday
    verificationSteps: [
      'restore_database',
      'verify_data_integrity',
      'check_application_boot',
    ],
  },
}
