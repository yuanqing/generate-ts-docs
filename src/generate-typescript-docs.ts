import * as globby from 'globby'

import { FunctionData } from './types'
import { generateTypeDeclarationSourceFiles } from './utilities/generate-type-declaration-source-files'
import { parseTypeDeclarationSourceFiles } from './utilities/parse-type-declaration-source-files/parse-type-declaration-source-files'

export async function generateTypeScriptDocs(
  globs: Array<string>
): Promise<Array<FunctionData>> {
  const filePaths = await globby(globs)
  const sourceFiles = generateTypeDeclarationSourceFiles(filePaths)
  return parseTypeDeclarationSourceFiles(sourceFiles)
}
