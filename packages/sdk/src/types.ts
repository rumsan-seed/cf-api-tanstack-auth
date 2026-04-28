// Re-export common types used throughout the web app

export interface SetupStatus {
  setupComplete: boolean
}

export interface ProjectMemberRole {
  role: 'admin' | 'editor' | 'readOnly'
}
