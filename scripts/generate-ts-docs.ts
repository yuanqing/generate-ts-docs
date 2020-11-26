import {
  groupFunctionsDataByCategory,
  parseExportedFunctionsAsync,
  renderCategoryAsMarkdown
} from '../src'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./src/*.ts'])
  const categories = groupFunctionsDataByCategory(functionsData)
  for (const category of categories) {
    console.log(renderCategoryAsMarkdown(category, { headerLevel: 3 })) // eslint-disable-line no-console
  }
}
main()
