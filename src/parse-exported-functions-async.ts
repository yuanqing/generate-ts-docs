import globby from 'globby'

import { FunctionData } from './types.js'
import { generateTypeDeclarationSourceFiles } from './utilities/generate-type-declaration-source-files.js'
import { parseTypeDeclarationSourceFiles } from './utilities/parse-type-declaration-source-files/parse-type-declaration-source-files.js'

/**
 * Parses the exported functions defined in the given `globs` of TypeScript
 * files.
 *
 * - Functions with the `@ignore` JSDoc tag will be skipped.
 * - Functions will be sorted in *ascending* order of their `@weight` JSDoc
 * tag. A function with the `@weight` tag will be ranked *before* a function
 * without the `@weight` tag.
 *
 * @param globs  One or more globs of TypeScript files.
 * @param options.tsconfigFilePath  Path to a TypeScript configuration file.
 * Defaults to `./tsconfig.json`.
 * @category Functions data
 * @weight 1
 */
export async function parseExportedFunctionsAsync(
  globs: Array<string>,
  options?: {
    tsconfigFilePath: string
  }
): Promise<Array<FunctionData>> {
  const filePaths = await globby(globs, { absolute: true })
  if (filePaths.length === 0) {
    throw new Error('No files match the given globs')
  }
  const sourceFiles = generateTypeDeclarationSourceFiles(
    filePaths,
    typeof options === 'undefined' ? null : options.tsconfigFilePath
  )
  return parseTypeDeclarationSourceFiles(sourceFiles)
}
