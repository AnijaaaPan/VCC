import { VoiceChannel, VoiceState } from 'discord.js'
import VcService from '~/services/VcService'
import { getChannel } from '~/utils/discord'
import archiveVc from './archiveVc'

async function checkExistVcChannel(vcService: VcService, oldState: VoiceState) {
  const vcs = await vcService.get()
  const vc = vcs.find((v) => v.voiceChannelId === oldState.channel?.id)
  const voiceChannel = await getChannel<VoiceChannel>(vc?.voiceChannelId, oldState.guild)
  if (!voiceChannel || !vc || !vc.isDelete) return

  const newVcs = vcs.filter((v) => v.userId !== vc.userId)
  await vcService.save(newVcs)
  await archiveVc(voiceChannel)
}

export default checkExistVcChannel
