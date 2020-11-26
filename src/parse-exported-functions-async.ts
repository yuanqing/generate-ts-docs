import * as globby from 'globby'

import { FunctionData } from './types'
import { generateTypeDeclarationSourceFiles } from './utilities/generate-type-declaration-source-files'
import { parseTypeDeclarationSourceFiles } from './utilities/parse-type-declaration-source-files/parse-type-declaration-source-files'

/**
 * Parses the exported functions defined in the given `globs` of
 * TypeScript files.
 *
 * @param globs  One or more globs of TypeScript files.
 * @param options.tsconfigFilePath  Path to a TypeScript configuration file.
 * Defaults to `./tsconfig.json`.
 * @category Parse function data
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
