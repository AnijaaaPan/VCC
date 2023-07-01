import { VoiceChannel, VoiceState } from 'discord.js'
import VcService from '~/services/VcService'
import { getChannel, lang } from '~/utils/discord'
import { format } from '~/utils/general'
import { sleep } from '~/utils/promise'
import checkExistVcChannel from './checkExistVcChannel'

async function deleteChannel(vcService: VcService, oldState: VoiceState) {
  const vcs = await vcService.get()
  const vc = vcs.find((v) => v.voiceChannelId === oldState.channel?.id)
  if (oldState.channel?.members.size !== 0 || !vc || vc.isDelete) return

  const i18n = lang(oldState.guild)
  const channel = await getChannel<VoiceChannel>(vc.voiceChannelId, oldState.guild)
  await channel?.send(format(i18n.handlers.voiceStateUpdate.autoVc.update.noMemberInVoiceChannel, oldState.channel, channel, oldState.channel))

  await vcService.updateIsDetele(vc, true)
  await sleep(5000)

  await checkExistVcChannel(vcService, oldState)
}

export default deleteChannel
