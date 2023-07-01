import { VoiceState } from 'discord.js'
import autoCreate from '~/features/vc/autoCreate'
import deleteChannel from '~/features/vc/deleteChannel'
import { sendUserActivity } from '~/features/vc/sendUserActivity'
import stopDelete from '~/features/vc/stopDelete'
import VcAutoCreateService from '~/services/VcAutoCreateService'
import VcService from '~/services/VcService'

export default async function voiceStateUpdate(oldState: VoiceState, newState: VoiceState) {
  if (!newState || !oldState) return

  const guildId = newState.guild.id ?? oldState.guild.id
  const vcService = new VcService(guildId)
  const vcAutoCreateService = new VcAutoCreateService(guildId)
  const vcAutoCreates = await vcAutoCreateService.get()

  const vcAutoCreate = vcAutoCreates.find((d) => d.voiceId === newState.channel?.id)
  if (vcAutoCreate) {
    await autoCreate(vcService, newState, vcAutoCreate)
  }

  if (!vcAutoCreate && newState.channelId !== oldState.channelId) {
    await sendUserActivity(vcService, newState, oldState)
  }

  if (newState.channel) {
    await stopDelete(vcService, newState)
  }

  if (!newState.channel || (oldState.channel && newState.channel.id !== oldState.channel.id)) {
    await deleteChannel(vcService, oldState)
  }
}
