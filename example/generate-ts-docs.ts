import {
  parseExportedFunctionsAsync,
  renderFunctionDataToMarkdown
} from '../src/index.js'

async function main(): Promise<void> {
  const functionsData = await parseExportedFunctionsAsync(['./example.ts'])
  for (const functionData of functionsData) {
    console.log(renderFunctionDataToMarkdown(functionData))
  }
}
main()
