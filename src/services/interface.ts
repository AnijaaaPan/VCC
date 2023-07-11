export interface VcAutoCreate {
  archiveId: string
  categoryId: string
  extraCategoryIds: string[]
  maxLimit: number | null
  roleId: string
  voiceId: string
}

export interface Vc {
  guildId: string
  isDelete: boolean
  userId: string
  voiceChannelId: string
}
