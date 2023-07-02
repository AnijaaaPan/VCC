export interface VcAutoCreate {
  archiveId: string
  categoryId: string
  maxLimit: number | null
  voiceId: string
}

export interface Vc {
  guildId: string
  isDelete: boolean
  userId: string
  voiceChannelId: string
}
