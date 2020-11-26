import {
  parseExportedFunctionsAsync,
  renderFunctionDataAsMarkdown
} from '../src'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./example.ts'])
  for (const functionData of functionsData) {
    console.log(renderFunctionDataAsMarkdown(functionData)) // eslint-disable-line no-console
  }
}
main()
