// deno-lint-ignore-file
export interface CustomNode{
    type: NodeType
}  


export interface Program extends CustomNode{
    type: "Program"
    body: CustomNode[]
}

export interface VarDec extends CustomNode{
    type: "VarDec"
    id: string
    value?: Expr
    valueType: ValueType
}

export interface Expr extends CustomNode{
    valueType: string
}

export interface BinaryExpr extends Expr{
    type: "BinaryExpr"
    left: Expr
    right: Expr
    operator: string
}


export interface VarAssign extends Expr{
    type: "VarAssign"
    assigne: Expr
    value: Expr
}

export interface FuncDef extends Expr{
    type: "FuncDef"
    paramTypes: string[]
    returnType: string
    returnExpr: Expr
    paramNames: string[]
    id: string
}

export interface CallExpr extends Expr{
    type: "CallExpr"
    args: Expr[]
    name: string
}

export interface Identifier extends Expr{
    type: "Identifier"
    symbol: string
}

export interface NumericLiteral extends Expr{
    type: "NumericLiteral"
    value: number
    valueType: "int"
}

export interface StringLiteral extends Expr{
    type: "StringLiteral"
    value: string
    valueType: "string"
}

export interface NilLiteral extends Expr{
    type: "NilLiteral"
    value: "nil"
}



export type ValueType = "int" | "string"



export type NodeType = "Program" | "NumericLiteral" | "Identifier" | "BinaryExpr" | "NilLiteral" | "VarDec" | "VarAssign" | "StringLiteral" | "CallExpr" | "FuncDef"

// let mainTree : Tree<number> = new Tree(new CustomNode(5))
// mainTree.root.left = new CustomNode<number>(3)
// mainTree.root.left.left = new CustomNode<number>(13)
// mainTree.root.left.right = new CustomNode<number>(8)
// mainTree.root.right = new CustomNode<number>(1)
// console.log(mainTree.preorder(mainTree.root, [], 0))