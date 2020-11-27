/* eslint-disable no-console */

import {
  createCategories,
  parseExportedFunctionsAsync,
  renderCategoriesAsMarkdownToc,
  renderCategoryAsMarkdown
} from '../src'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./src/*.ts'])
  const categories = createCategories(functionsData)
  console.log(renderCategoriesAsMarkdownToc(categories))
  console.log()
  for (const category of categories) {
    console.log(renderCategoryAsMarkdown(category, { headerLevel: 3 }))
  }
}
main()
