import * as globby from 'globby'

import { DocEntry } from './types'
import { generateTypeDeclarationSourceFiles } from './utilities/generate-type-declaration-source-files'
import { parseTypeDeclarationSourceFiles } from './utilities/parse-type-declaration-source-files'

export async function generateTypeScriptDocs(
  globs: Array<string>
): Promise<Array<DocEntry>> {
  const filePaths = await globby(globs)
  const sourceFiles = generateTypeDeclarationSourceFiles(filePaths)
  const result = parseTypeDeclarationSourceFiles(sourceFiles)
  return result
}
