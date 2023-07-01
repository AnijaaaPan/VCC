import dotenv from 'dotenv'
dotenv.config()

const type = process.env.TYPE
export const isProd = type === 'PRODUCT'
export const isDev = type === 'DEVELOPMENT'

export function format(str: string, ...args: unknown[]) {
  for (const [i, arg] of args.entries()) {
    const regExp = new RegExp(`\\{${i}\\}`, 'g')
    str = str.replace(regExp, arg as string)
  }
  return str
}
