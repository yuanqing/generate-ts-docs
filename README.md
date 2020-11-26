# generate-ts-docs [![npm Version](https://img.shields.io/npm/v/generate-ts-docs?cacheSeconds=1800)](https://www.npmjs.com/package/generate-ts-docs) [![build](https://github.com/yuanqing/generate-ts-docs/workflows/build/badge.svg)](https://github.com/yuanqing/generate-ts-docs/actions?query=workflow%3Abuild)

> Utilities to parse exported functions from TypeScript files and generate Markdown documentation

## API

The API documentation below is generated using [the following script](/scripts/generate-ts-docs.ts):

<!-- ```ts markdown-interpolate: cat scripts/generate-ts-docs.ts -->
```ts
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
```
<!-- ``` end -->

<!-- markdown-interpolate: ts-node scripts/generate-ts-docs.ts -->
### Markdown utilities

#### createCategoriesToc(categories)

Generate a Markdown table of contents (TOC) for the given `categories`.

##### *Parameters*

- **`categories`** (`Array<{ name: string; functionsData: Array<FunctionData>; }>`)

##### *Return type*

```
string
```

#### createFunctionsDataToc(functionsData)

Generate a Markdown table of contents (TOC) for the given `functionsData`.

##### *Parameters*

- **`functionsData`** (`Array<FunctionData>`)

##### *Return type*

```
string
```

#### stringifyCategoryToMarkdown(category [, options])

##### *Parameters*

- **`category`** (`object`)
  - **`name`** (`string`)
  - **`functionsData`** (`Array<FunctionData>`)
- **`options`** (`object`) – *Optional.*
  - **`headerLevel`** (`number`) – Header level to be used for rendering the category name.

##### *Return type*

```
string
```

#### stringifyFunctionDataToMarkdown(functionData [, options])

##### *Parameters*

- **`functionData`** (`FunctionData`)
- **`options`** (`object`) – *Optional.*
  - **`headerLevel`** (`number`) – Header level to be used for rendering the function name.

##### *Return type*

```
string
```

### Parse function data

#### groupFunctionsDataByCategory(functionsData)

Groups each object in `functionsData` by the value of each function’s `tags.category` key.

##### *Parameters*

- **`functionsData`** (`Array<FunctionData>`) – Function data to be grouped.

##### *Return type*

```
Array<{
  name: string;
  functionsData: Array<FunctionData>;
}>
```

#### parseExportedFunctionsAsync(globs [, options])

Parses the exported functions defined in the given `globs` of TypeScript files.

##### *Parameters*

- **`globs`** (`Array<string>`) – One or more globs of TypeScript files.
- **`options`** (`object`) – *Optional.*
  - **`tsconfigFilePath`** (`string`) – Path to a TypeScript configuration file. Defaults to `./tsconfig.json`.

##### *Return type*

```
Promise<Array<FunctionData>>
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
