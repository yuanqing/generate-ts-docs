import {
  parseExportedFunctionsAsync,
  stringifyFunctionDataToMarkdown
} from '../src'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./src/*.ts'])
  for (const functionData of functionsData) {
    console.log(stringifyFunctionDataToMarkdown(functionData)) // eslint-disable-line no-console
  }
}
main()
