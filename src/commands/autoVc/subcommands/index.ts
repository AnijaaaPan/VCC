import { SubCommandPack } from '~/commands/base'
import addAutoVc from './add'
import deleteAutoVc from './delete'
import listAutoVc from './list'

export default [addAutoVc, deleteAutoVc, listAutoVc] as SubCommandPack[]
