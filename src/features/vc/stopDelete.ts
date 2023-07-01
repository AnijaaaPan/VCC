import { VoiceChannel, VoiceState } from 'discord.js'
import VcService from '~/services/VcService'
import { getChannel, lang } from '~/utils/discord'
import { format } from '~/utils/general'

/**
 * VC削除システムの中断処理
 */
async function stopDelete(vcService: VcService, newState: VoiceState) {
  const vcs = await vcService.get()
  const getVc = vcs.find((v) => v.voiceChannelId === newState.channel?.id)
  if (newState.channel?.members.size === 0 || !getVc || !getVc.isDelete) return

  await vcService.updateIsDetele(getVc, false)
  const i18n = lang(newState.guild)
  const channel = await getChannel<VoiceChannel>(getVc.voiceChannelId, newState.guild)
  channel?.send(format(i18n.handlers.voiceStateUpdate.autoVc.delete.stop, newState.channel))
}

export default stopDelete
