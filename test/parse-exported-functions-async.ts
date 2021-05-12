import * as fs from 'fs-extra'
import * as path from 'path'
import { test } from 'tap'

import { parseExportedFunctionsAsync } from '../src/parse-exported-functions-async'

const fixturesDirectory = path.resolve(__dirname, 'fixtures')

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
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      tags: null,
      typeParameters: []
    }
  ])
})

test('parses function expressed as a variable statement eg. `const foo = function`', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '2-variable-statement.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      tags: null,
      typeParameters: []
    }
  ])
})

test('parses optional parameters', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '3-optional-parameters.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      tags: null,
      typeParameters: []
    }
  ])
})

test('parses the function description', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '4-function-description.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      tags: null,
      typeParameters: []
    }
  ])
})

test('parses the `@param` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '5-param-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      tags: null,
      typeParameters: []
    }
  ])
})

test('parses the `@returns` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '6-return-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      tags: null,
      typeParameters: []
    }
  ])
})

test('parses the `@returns` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '7-category-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      },
      typeParameters: []
    }
  ])
})

test('parses multiple functions', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '8-multiple-functions.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      tags: null,
      typeParameters: []
    },
    {
      description: null,
      name: 'noop',
      parameters: [],
      returnType: {
        description: null,
        type: 'void'
      },
      tags: null,
      typeParameters: []
    }
  ])
})

test('sorts functions in ascending order of their `@weight` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '9-weight-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
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
      },
      typeParameters: []
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
      },
      typeParameters: []
    }
  ])
})

test('ignores functions with the `@ignore` tag', async function (t) {
  t.plan(2)
  const filePath = path.resolve(fixturesDirectory, '10-ignore-tag.ts')
  t.true((await fs.pathExists(filePath)) === true)
  const functionsData = await parseExportedFunctionsAsync([filePath])
  t.deepEqual(functionsData, [
    {
      description: null,
      name: 'noop',
      parameters: [],
      returnType: {
        description: null,
        type: 'void'
      },
      tags: null,
      typeParameters: []
    }
  ])
})
