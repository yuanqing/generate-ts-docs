import * as fs from 'fs-extra'
import * as path from 'path'
import { test } from 'tap'

import { parseExportedFunctionsAsync } from '../parse-exported-functions-async'

const fixturesDirectory = path.resolve(__dirname, '..', '__fixtures__')

test('throws if no files match the given globs', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, 'invalid.ts')
  t.true((await fs.pathExists(filePath)) === false)
  try {
    await parseExportedFunctionsAsync([filePath])
    t.fail()
  } catch {
    t.pass()
  }
})

test('parses function expressed as a function declaration (`function add`)', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '1-function-declaration.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: null,
      name: 'add',
      parameters: [
        {
          description: null,
          name: 'x',
          optional: false,
          type: 'number'
        },
        {
          description: null,
          name: 'y',
          optional: false,
          type: 'number'
        }
      ],
      returnType: {
        description: null,
        type: 'number'
      },
      tags: null
    }
  ])
})

test('parses function expressed as a variable statement eg. `const foo = function`', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '2-variable-statement.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: null,
      name: 'add',
      parameters: [
        {
          description: null,
          name: 'x',
          optional: false,
          type: 'number'
        },
        {
          description: null,
          name: 'y',
          optional: false,
          type: 'number'
        }
      ],
      returnType: {
        description: null,
        type: 'number'
      },
      tags: null
    }
  ])
})

test('parses optional parameters', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '3-optional-parameters.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: null,
      name: 'foo',
      parameters: [
        {
          description: null,
          name: 'x',
          optional: true,
          type: 'unknown'
        },
        {
          description: null,
          name: 'y',
          optional: true,
          type: 'unknown'
        }
      ],
      returnType: {
        description: null,
        type: '{\n  x?: unknown;\n  y?: unknown;\n}'
      },
      tags: null
    }
  ])
})

test('parses the function description', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '4-function-description.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: 'Adds two numbers.',
      name: 'add',
      parameters: [
        {
          description: null,
          name: 'x',
          optional: false,
          type: 'number'
        },
        {
          description: null,
          name: 'y',
          optional: false,
          type: 'number'
        }
      ],
      returnType: {
        description: null,
        type: 'number'
      },
      tags: null
    }
  ])
})

test('parses the `@param` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '5-param-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: null,
      name: 'add',
      parameters: [
        {
          description: 'First number to add.',
          name: 'x',
          optional: false,
          type: 'number'
        },
        {
          description: 'Second number to add.',
          name: 'y',
          optional: false,
          type: 'number'
        }
      ],
      returnType: {
        description: null,
        type: 'number'
      },
      tags: null
    }
  ])
})

test('parses the `@returns` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '6-return-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: null,
      name: 'add',
      parameters: [
        {
          description: null,
          name: 'x',
          optional: false,
          type: 'number'
        },
        {
          description: null,
          name: 'y',
          optional: false,
          type: 'number'
        }
      ],
      returnType: {
        description: 'The sum of `x` and `y`.',
        type: 'number'
      },
      tags: null
    }
  ])
})

test('parses the `@returns` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '7-category-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: null,
      name: 'add',
      parameters: [
        {
          description: null,
          name: 'x',
          optional: false,
          type: 'number'
        },
        {
          description: null,
          name: 'y',
          optional: false,
          type: 'number'
        }
      ],
      returnType: {
        description: null,
        type: 'number'
      },
      tags: {
        category: 'Math'
      }
    }
  ])
})

test('sorts functions by their `@weight` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '8-weight-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: null,
      name: 'noop',
      parameters: [],
      returnType: {
        description: null,
        type: 'void'
      },
      tags: {
        weight: 1
      }
    },
    {
      description: null,
      name: 'add',
      parameters: [
        {
          description: null,
          name: 'x',
          optional: false,
          type: 'number'
        },
        {
          description: null,
          name: 'y',
          optional: false,
          type: 'number'
        }
      ],
      returnType: {
        description: null,
        type: 'number'
      },
      tags: {
        weight: 2
      }
    }
  ])
})

test('ignores functions with the `@ignore` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '9-ignore-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const results = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(results, [
    {
      description: null,
      name: 'noop',
      parameters: [],
      returnType: {
        description: null,
        type: 'void'
      },
      tags: null
    }
  ])
})

// test('complex', async function (t) {
//   t.plan(2)
//   const filePath = path.resolve(fixturesDirectory, '5-complex.ts')
//   t.true(await fs.pathExists(filePath) === true)
//   const results = await parseExportedFunctionsAsync([filePath])
//   t.deepEqual(results, [
//     {
//       "description": "Description for function `foo`.",
//       "name": "foo",
//       "parameters": [
//         {
//           "description": "Description for parameter `x`.",
//           "name": "x",
//           "optional": false,
//           "type": "number",
//         },
//         {
//           "description": "Description for parameter `y`.",
//           "name": "y",
//           "optional": true,
//           "type": "string",
//         },
//       ],
//       "returnType": {
//         "description": "Description for return type.",
//         "type": "{\n  x: number;\n  y?: string;\n}",
//       },
//       "tags": {
//         "category": "Category for function `foo`.",
//       },
//     }
//   ])
// })
