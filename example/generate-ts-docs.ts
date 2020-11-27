import {
  parseExportedFunctionsAsync,
  renderFunctionDataToMarkdown
} from '../src'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./example.ts'])
  for (const functionData of functionsData) {
    console.log(renderFunctionDataToMarkdown(functionData))
  }
}
main()
