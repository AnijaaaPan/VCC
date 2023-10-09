import { SubCommandPack } from '~/commands/base'
import createAutoVc from './create'
import deleteAutoVc from './delete'
import listAutoVc from './list'

const commands: SubCommandPack[] = [
  createAutoVc,
  deleteAutoVc,
  listAutoVc
]

export default commands
