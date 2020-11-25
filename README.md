# generate-typescript-docs [![npm Version](https://img.shields.io/npm/v/generate-typescript-docs?cacheSeconds=1800)](https://www.npmjs.com/package/generate-typescript-docs) [![build](https://github.com/yuanqing/generate-typescript-docs/workflows/build/badge.svg)](https://github.com/yuanqing/generate-typescript-docs/actions?query=workflow%3Abuild)

## API

<!-- markdown-interpolate: ts-node scripts/generate-typescript-docs.ts -->
### generateTypeScriptDocs(globs [, options])

Parses and generates documentation for the given `globs` of TypeScript source files.

#### *Parameters*

- **`globs`** (`Array<string>`) – One or more globs of TypeScript files to parse.
- **`options`** (`object`) – *Optional.*
    - **`tsconfigFilePath`** (`string`) – Path to a `tsconfig.json` file. Defaults to './tsconfig.json'.

#### *Return type*

```
Promise<Array<FunctionData>>
```

### groupFunctionsDataByCategory(functionsData)

#### *Parameters*

- **`functionsData`** (`Array<FunctionData>`)

#### *Return type*

```
Array<Category>
```

### stringifyCategoryToMarkdown(category [, options])

#### *Parameters*

- **`category`** (`Category`)
- **`options`** (`object`) – *Optional.*
    - **`headerLevel`** (`number`)

#### *Return type*

```
string
```

### stringifyFunctionDataToMarkdown(functionData [, options])

#### *Parameters*

- **`functionData`** (`FunctionData`)
- **`options`** (`object`) – *Optional.*
    - **`headerLevel`** (`number`)

#### *Return type*

```
string
```

<!-- end -->
