import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import util from 'util'

import { parseExportedFunctionsAsync } from '../src/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function main(): Promise<void> {
  const functionsData = await parseExportedFunctionsAsync([
    resolve(__dirname, '..', 'example', 'example.ts')
  ])
  console.log(util.inspect(functionsData, { depth: null })) // eslint-disable-line no-console
}
main()
