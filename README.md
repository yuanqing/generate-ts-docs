# generate-ts-docs [![npm Version](https://img.shields.io/npm/v/generate-ts-docs?cacheSeconds=1800)](https://www.npmjs.com/package/generate-ts-docs) [![build](https://github.com/yuanqing/generate-ts-docs/workflows/build/badge.svg)](https://github.com/yuanqing/generate-ts-docs/actions?query=workflow%3Abuild)

> Utilities to parse type information and [JSDoc](https://github.com/jsdoc/jsdoc) comments from TypeScript functions, and render documentation as Markdown

## Usage

First:

```sh
$ npm install --save-dev generate-ts-docs
```

Suppose that we have the following (contrived) toy [`example.ts`](/example/example.ts) source file:

<!-- ```ts markdown-interpolate: cat example/example.ts -->
```ts
/**
 * Adds two numbers.
 *
 * @param x First number to add.
 * @param y Second number to add.
 * @return The sum of `x` and `y`.
 */
export function add(x: number, y: number): number {
  return x + y
}
```
<!-- ``` end -->

…and the following [`generate-ts-docs.ts`](/example/generate-ts-docs.ts) script:

<!-- ```ts markdown-interpolate: sed 's/\.\.\/src/generate-ts-docs/' example/generate-ts-docs.ts -->
```ts
import {
  parseExportedFunctionsAsync,
  renderFunctionDataAsMarkdown
} from 'generate-ts-docs'

async function main() {
  const functionsData = await parseExportedFunctionsAsync(['./example.ts'])
  for (const functionData of functionsData) {
    console.log(renderFunctionDataAsMarkdown(functionData))
  }
}
main()
```
<!-- ``` end -->

`parseExportedFunctionsAsync` receives an array of globs of TypeScript files, and parses the functions in these files that have the [`export`](https://www.typescriptlang.org/docs/handbook/modules.html#export) keyword. It returns an array of `FunctionData` objects that looks like so:

<!-- ```ts markdown-interpolate: ts-node scripts/print-example-function-data.ts -->
```ts
[
  {
    description: 'Adds two numbers.',
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
    returnType: { description: 'The sum of `x` and `y`.', type: 'number' },
    tags: null
  }
]
```
<!-- ``` end -->

`renderFunctionDataAsMarkdown` pretty-prints the given array of `FunctionData` objects into a Markdown string.

Now, let’s run the `generate-ts-docs.ts` script, piping its output to a file:

````sh
$ npx ts-node generate-ts-docs.ts > README.md
````

The output [`README.md`](/example/README.md) will be as follows:

<!-- ````md markdown-interpolate: cat example/README.md -->
````md
### add(x, y)

Adds two numbers.

#### *Parameters*

- **`x`** (`number`) – First number to add.
- **`y`** (`number`) – Second number to add.

#### *Return type*

The sum of `x` and `y`.

```
number
```
````
<!-- ```` end -->

## API

*The documentation below is generated using the [`scripts/generate-ts-docs.ts`](/scripts/generate-ts-docs.ts) script in this repository.*

<!-- markdown-interpolate: ts-node scripts/generate-ts-docs.ts -->
### Markdown utilities

#### createCategoriesMarkdownToc(categories)

Generate a Markdown table of contents for the given `categories`.

##### *Parameters*

- **`categories`** (`Array<{ name: string; functionsData: Array<FunctionData>; }>`)

##### *Return type*

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
#### renderCategoryAsMarkdown(category [, options])

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
#### renderFunctionDataAsMarkdown(functionData [, options])

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

## Implementation details

`ts-generate-docs` works via the following two-step process:

- Generates type declarations for the given TypeScript source files.
- Traverses and extracts relevant information from the AST of the generated type declarations.

## See also

- [markdown-interpolate](https://github.com/yuanqing/markdown-interpolate)
- [ts-node](https://github.com/TypeStrong/ts-node)

## License

[MIT](/LICENSE.md)
