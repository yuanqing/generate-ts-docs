/* eslint-disable no-console */

import {
  createCategories,
  parseExportedFunctionsAsync,
  renderCategoriesToMarkdownToc,
  renderCategoryToMarkdown
} from '../src/index.js'

async function main(): Promise<void> {
  const functionsData = await parseExportedFunctionsAsync(['./src/*.ts'])
  const categories = createCategories(functionsData)
  console.log(renderCategoriesToMarkdownToc(categories))
  console.log()
  for (const category of categories) {
    console.log(renderCategoryToMarkdown(category, { headerLevel: 3 }))
  }
}
main()
