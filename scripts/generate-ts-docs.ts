/* eslint-disable no-console */

import {
  createCategories,
  parseExportedFunctionsAsync,
  renderCategoriesToMarkdownToc,
  renderCategoryToMarkdown
} from '../src'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./src/*.ts'])
  const categories = createCategories(functionsData)
  console.log(renderCategoriesToMarkdownToc(categories))
  console.log()
  for (const category of categories) {
    console.log(renderCategoryToMarkdown(category, { headerLevel: 3 }))
  }
}
main()
