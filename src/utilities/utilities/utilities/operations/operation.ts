import ts from 'typescript'

export type Operation = (node: ts.Node) => null | ts.Node
