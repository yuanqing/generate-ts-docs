# generate-ts-docs [![npm Version](https://img.shields.io/npm/v/generate-ts-docs?cacheSeconds=1800)](https://www.npmjs.com/package/generate-ts-docs) [![build](https://github.com/yuanqing/generate-ts-docs/workflows/build/badge.svg)](https://github.com/yuanqing/generate-ts-docs/actions?query=workflow%3Abuild)

> Utilities to parse type information and [JSDoc](https://github.com/jsdoc/jsdoc) annotations from TypeScript functions, and render documentation as Markdown

## Usage

First:

```sh
$ npm install --save-dev generate-ts-docs
```

Given the following toy [`example.ts`](/example/example.ts) file:

```ts
/**
 * Adds two numbers.
 *
 * @param x First number.
 * @param y Second number.
 * @return The result of adding `x` and `y`.
 */
export function add(x: number, y: number): number {
  return x + y
}
```

…and the following [`generate-ts-docs.ts`](/example/generate-ts-docs.ts) script:

```ts
import {
  parseExportedFunctionsAsync,
  stringifyFunctionDataToMarkdown
} from 'generate-ts-docs'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['example.ts'])
  for (const functionData of functionsData) {
    console.log(stringifyFunctionDataToMarkdown(functionData)) // eslint-disable-line no-console
  }
}
main()
```

Do:

````
$ npx ts-node generate-ts-docs.ts > README.md
````

The output [`README.md`](/example/README.md) will be as follows:

> ### add(x, y)
>
> Adds two numbers.
>
> #### *Parameters*
>
> - **`x`** (`number`) – First number.
> - **`y`** (`number`) – Second number.
>
> #### *Return type*
>
> The result of adding `x` and `y`.
>
> ```
> number
> ```

## API

*The API documentation below is generated using the [`scripts/generate-ts-docs.ts`](/scripts/generate-ts-docs.ts) script.*

<!-- markdown-interpolate: ts-node scripts/generate-ts-docs.ts -->
### Markdown utilities

#### createCategoriesMarkdownToc(categories)

Generate a Markdown table of contents for the given `categories`.

##### *Parameters*

- **`categories`** (`Array<{ name: string; functionsData: Array<FunctionData>; }>`)

##### *Return type*

Description for return type!!!!

```
string
```

#### createFunctionsDataMarkdownToc(functionsData)

Generate a Markdown table of contents for the given `functionsData`.

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

```sh
$ npm install --save-dev generate-ts-docs
```

## See also

- [markdown-interpolate](https://github.com/yuanqing/markdown-interpolate)

## License

[MIT](/LICENSE.md)
