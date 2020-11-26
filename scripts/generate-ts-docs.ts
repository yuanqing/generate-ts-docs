import {
  groupFunctionsDataByCategory,
  parseExportedFunctionsAsync,
  stringifyCategoryToMarkdown
} from '../src'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./src/*.ts'])
  const categories = groupFunctionsDataByCategory(functionsData)
  for (const category of categories) {
    console.log(stringifyCategoryToMarkdown(category, { headerLevel: 3 })) // eslint-disable-line no-console
  }
}
main()
