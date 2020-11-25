import * as globby from 'globby'

import { FunctionData } from './types'
import { generateTypeDeclarationSourceFiles } from './utilities/generate-type-declaration-source-files'
import { parseTypeDeclarationSourceFiles } from './utilities/parse-type-declaration-source-files/parse-type-declaration-source-files'

/**
 * Parses and generates documentation for the given `globs` of TypeScript
 * source files.
 *
 * @param globs  One or more globs of TypeScript files to parse.
 * @param options.tsconfigFilePath  Path to a `tsconfig.json` file. Defaults
 * to './tsconfig.json'.
 */
export async function generateTypeScriptDocs(
  globs: Array<string>,
  options?: {
    tsconfigFilePath: string
  }
): Promise<Array<FunctionData>> {
  const filePaths = await globby(globs, { absolute: true })
  if (filePaths.length === 0) {
    throw new Error('No files found')
  }
  const sourceFiles = generateTypeDeclarationSourceFiles(
    filePaths,
    typeof options === 'undefined' ? null : options.tsconfigFilePath
  )
  return parseTypeDeclarationSourceFiles(sourceFiles)
}
