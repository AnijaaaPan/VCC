import { isProd } from '~/utils/general'
import dev from './dev'
import prod from './prod'

function getConfig() {
  const config = isProd ? prod : dev
  return config
}

export default getConfig()
