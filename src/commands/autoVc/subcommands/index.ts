import { SubCommandPack } from '~/commands/base'
import createAutoVc from './create'
import deleteAutoVc from './delete'
import listAutoVc from './list'

export default [createAutoVc, deleteAutoVc, listAutoVc] as SubCommandPack[]
