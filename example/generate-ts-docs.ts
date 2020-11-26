import {
  parseExportedFunctionsAsync,
  stringifyFunctionDataToMarkdown
} from 'generate-docs'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['example.ts'])
  for (const functionData of functionsData) {
    console.log(stringifyFunctionDataToMarkdown(functionData)) // eslint-disable-line no-console
  }
}
main()
