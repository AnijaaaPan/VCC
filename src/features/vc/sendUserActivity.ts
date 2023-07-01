import { VoiceChannel, VoiceState } from 'discord.js'
import VcService from '~/services/VcService'
import { getChannel, lang } from '~/utils/discord'
import { format } from '~/utils/general'

export async function sendUserActivity(vcService: VcService, oldState: VoiceState, newState: VoiceState) {
  const state = newState.channel !== null ? newState : oldState
  const isConnected = newState.channel === null

  const vc = await vcService.getFromSomeId(state.channel?.id)
  if (!vc) return

  const channel = await getChannel<VoiceChannel>(vc.voiceChannelId, state.guild)
  if (!channel) return

  const i18n = lang(state.guild)
  const connectMsg = isConnected ? i18n.handlers.voiceStateUpdate.autoVc.update.connectVc : i18n.handlers.voiceStateUpdate.autoVc.update.disconnectVc
  await channel.send(format(connectMsg, state.id))
}
