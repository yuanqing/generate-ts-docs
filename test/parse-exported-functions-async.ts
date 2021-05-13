import test from 'ava'
import fs from 'fs-extra'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

import { parseExportedFunctionsAsync } from '../src/parse-exported-functions-async.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDirectory = resolve(__dirname, 'fixtures')

test('throws if no files match the given globs', async function (t) {
  t.plan(2)
  const filePath = resolve(fixturesDirectory, 'invalid.ts')
  t.true((await fs.pathExists(filePath)) === false)
  try {
    await parseExportedFunctionsAsync([filePath])
    t.fail()
  } catch {
    t.pass()
  }
})

test('parses function expressed as a function declaration', async function (t) {
  t.plan(2)
  const filePath = resolve(fixturesDirectory, '1-function-declaration.ts')
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

test('parses the function description', async function (t) {
  t.plan(2)
  const filePath = resolve(fixturesDirectory, '2-function-description.ts')
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
  const filePath = resolve(fixturesDirectory, '3-param-tag.ts')
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
  const filePath = resolve(fixturesDirectory, '4-return-tag.ts')
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

test('parses the `@category` tag', async function (t) {
  t.plan(2)
  const filePath = resolve(fixturesDirectory, '5-category-tag.ts')
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
  const filePath = resolve(fixturesDirectory, '6-multiple-functions.ts')
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
  const filePath = resolve(fixturesDirectory, '7-weight-tag.ts')
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
        weight: '1'
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
        weight: '2'
      },
      typeParameters: []
    }
  ])
})

test('ignores functions with the `@ignore` tag', async function (t) {
  t.plan(2)
  const filePath = resolve(fixturesDirectory, '8-ignore-tag.ts')
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

test('parses optional parameters', async function (t) {
  t.plan(2)
  const filePath = resolve(fixturesDirectory, '9-optional-parameters.ts')
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

test('parses type parameters', async function (t) {
  t.plan(2)
  const filePath = resolve(fixturesDirectory, '10-type-parameters.ts')
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
          optional: false,
          type: 'A'
        },
        {
          description: null,
          name: 'y',
          optional: false,
          type: 'B'
        },
        {
          description: null,
          name: 'z',
          optional: false,
          type: 'C'
        }
      ],
      returnType: {
        description: null,
        type: '{\n  x: A;\n  y: B;\n  z: C;\n}'
      },
      tags: null,
      typeParameters: [
        {
          defaultType: null,
          name: 'A',
          type: 'string | number'
        },
        {
          defaultType: 'string',
          name: 'B',
          type: 'string | number'
        },
        {
          defaultType: 'null',
          name: 'C',
          type: null
        }
      ]
    }
  ])
})

test('parses function expressed as a variable statement', async function (t) {
  t.plan(2)
  const filePath = resolve(fixturesDirectory, '11-variable-statement.ts')
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
          optional: false,
          type: 'A'
        },
        {
          description: null,
          name: 'y',
          optional: false,
          type: 'B'
        },
        {
          description: null,
          name: 'z',
          optional: false,
          type: 'C'
        }
      ],
      returnType: {
        description: null,
        type: '{\n  x: A;\n  y: B;\n  z: C;\n}'
      },
      tags: null,
      typeParameters: [
        {
          defaultType: null,
          name: 'A',
          type: 'string | number'
        },
        {
          defaultType: 'string',
          name: 'B',
          type: 'string | number'
        },
        {
          defaultType: 'null',
          name: 'C',
          type: null
        }
      ]
    }
  ])
})
