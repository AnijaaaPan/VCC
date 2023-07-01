import { Service } from '.'
import { Vc } from './interface'

export default class VcService extends Service {
  async get(): Promise<Vc[]> {
    return (await this.getData('vcs')) ?? []
  }

  async save(vcs: Vc[]) {
    await this.saveData(vcs, 'vcs')
  }

  async updateIsDetele(getVc: Vc, isDelete: boolean) {
    const vcs = await this.get()
    const newVcs = vcs.map((vc) => {
      if (vc.userId !== getVc.userId) return vc
      return { ...vc, isDelete }
    })
    await this.save(newVcs)
  }

  async getFromSomeId(id: string = '') {
    const vcs = await this.get()
    return vcs.find((vc) => [vc.userId, vc.voiceChannelId].includes(id))
  }
}
