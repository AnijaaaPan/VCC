import { Service } from '.'
import { VcAutoCreate } from './interface'

export default class VcAutoCreateService extends Service {
  async get(): Promise<VcAutoCreate[]> {
    return (await this.getData('vcAutoCreates')) ?? []
  }

  async save(vcAutoCreates: VcAutoCreate[]) {
    await this.saveData(vcAutoCreates, 'vcAutoCreates')
  }

  async updateIsDetele(getVcAutoCreate: VcAutoCreate) {
    const vcAutoCreates = await this.get()
    const newVcs = vcAutoCreates
      .map((vc) => {
        if (vc.categoryId !== getVcAutoCreate.categoryId) return vc
        return undefined
      })
      .filter((d) => d)
    await this.save(newVcs as VcAutoCreate[])
  }

  async updateAddExtraCategoryId(getVcAutoCreate: VcAutoCreate, categoryId: string) {
    const vcAutoCreates = await this.get()
    const newVcs = vcAutoCreates
      .map((vc) => {
        if (vc.categoryId !== getVcAutoCreate.categoryId) return vc
        return undefined
      })
      .filter((d) => d)
    await this.save(newVcs as VcAutoCreate[])
  }

  async getFromSomeId(id: string = '') {
    const vcs = await this.get()
    return vcs.find((vc) => [vc.archiveId, vc.categoryId, vc.voiceId].includes(id))
  }

  async getVcAutoCreateByVoice(channelId?: string) {
    const vcAutoCreates = await this.get()
    return vcAutoCreates.find((vc) => vc.voiceId === channelId)
  }

  async getVcAutoCreateByCategory(channelId?: string) {
    const vcAutoCreates = await this.get()
    return vcAutoCreates.find((vc) => vc.categoryId === channelId)
  }
}
