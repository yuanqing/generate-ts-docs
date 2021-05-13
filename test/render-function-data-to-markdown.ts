import test from 'ava'
import fs from 'fs-extra'
import globby from 'globby'
import { basename, dirname, join, resolve } from 'path'
import { fileURLToPath } from 'url'

import { renderFunctionDataToMarkdown } from '../src/render-function-data-to-markdown.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixtureDirectoryPaths = globby.sync(
  `${resolve(__dirname, 'fixtures')}/*`,
  { onlyDirectories: true }
)

for (const fixtureDirectoryPath of fixtureDirectoryPaths) {
  const testName = basename(fixtureDirectoryPath)
  // Uncomment below to run a specific test
  // if (testName !== '1-function-declaration') {
  //   continue
  // }
  test(testName, async function (t) {
    t.plan(1)
    const functionsData = JSON.parse(
      await fs.readFile(
        join(fixtureDirectoryPath, 'functions-data.json'),
        'utf8'
      )
    )
    const result = []
    for (const functionData of functionsData) {
      result.push(renderFunctionDataToMarkdown(functionData))
    }
    const actual = result.join('\n')
    const expected = await fs.readFile(
      join(fixtureDirectoryPath, 'markdown.md'),
      'utf8'
    )
    t.deepEqual(actual, expected)
  })
}
