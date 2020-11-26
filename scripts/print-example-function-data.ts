import * as path from 'path'
import * as util from 'util'

import { parseExportedFunctionsAsync } from '../src'

async function main() {
  const functionsData = await parseExportedFunctionsAsync([
    path.resolve(__dirname, '..', 'example', 'example.ts')
  ])
  console.log(util.inspect(functionsData, { depth: null })) // eslint-disable-line no-console
}
main()
