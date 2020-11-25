# generate-ts-docs [![npm Version](https://img.shields.io/npm/v/generate-ts-docs?cacheSeconds=1800)](https://www.npmjs.com/package/generate-ts-docs) [![build](https://github.com/yuanqing/generate-ts-docs/workflows/build/badge.svg)](https://github.com/yuanqing/generate-ts-docs/actions?query=workflow%3Abuild)

> Utilities to parse exported functions from TypeScript files and generate Markdown documentation

## Usage

The API documentation below is generated using the following script:

```ts
import {
  parseExportedFunctionsAsync,
  stringifyFunctionDataToMarkdown
} from 'generate-ts-docs'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./src/*.ts'])
  for (const functionData of functionsData) {
    console.log(stringifyFunctionDataToMarkdown(functionData)) // eslint-disable-line no-console
  }
}
main()
```

## API

<!-- markdown-interpolate: ts-node scripts/generate-ts-docs.ts -->
### groupFunctionsDataByCategory(functionsData)

Groups each object in `functionsData` by the value of each function’s `tags.category` key.

#### *Parameters*

- **`functionsData`** (`Array<FunctionData>`) – Function data to be grouped.

#### *Return type*

```
Array<{
  name: string;
  functionsData: Array<FunctionData>;
}>
```

### parseExportedFunctionsAsync(globs [, options])

Parses the exported functions defined in the given `globs` of TypeScript files.

#### *Parameters*

- **`globs`** (`Array<string>`) – One or more globs of TypeScript files.
- **`options`** (`object`) – *Optional.*
  - **`tsconfigFilePath`** (`string`) – Path to a TypeScript configuration file. Defaults to `./tsconfig.json`.

#### *Return type*

```
Promise<Array<FunctionData>>
```

### stringifyCategoryToMarkdown(category [, options])

#### *Parameters*

- **`category`** (`object`)
  - **`name`** (`string`)
  - **`functionsData`** (`Array<FunctionData>`)
- **`options`** (`object`) – *Optional.*
  - **`headerLevel`** (`number`) – Header level to be used for rendering the category name.

#### *Return type*

```
string
```

### stringifyFunctionDataToMarkdown(functionData [, options])

#### *Parameters*

- **`functionData`** (`FunctionData`)
- **`options`** (`object`) – *Optional.*
  - **`headerLevel`** (`number`) – Header level to be used for rendering the function name.

#### *Return type*

```
string
```

<!-- end -->

## Installation

```
$ npm install --save-dev generate-ts-docs
```

## See also

- [markdown-interpolate](https://github.com/yuanqing/markdown-interpolate)

## License

[MIT](/LICENSE.md)
