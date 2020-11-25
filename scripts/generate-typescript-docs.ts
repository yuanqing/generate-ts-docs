import {
  generateTypeScriptDocsAsync,
  stringifyFunctionDataToMarkdown
} from '../src'

const files = [
  './src/generate-typescript-docs-async.ts',
  './src/group-functions-data-by-category.ts',
  './src/stringify-category-to-markdown.ts',
  './src/stringify-function-data-to-markdown.ts'
]

async function main() {
  const functionsData = await generateTypeScriptDocsAsync(files)
  for (const functionData of functionsData) {
    console.log(stringifyFunctionDataToMarkdown(functionData)) // eslint-disable-line no-console
  }
}
main()
