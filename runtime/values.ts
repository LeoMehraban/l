import { Expr } from "../frontend/ast.ts"
import Env from "./env.ts"

export type ValueType = "nil" | "int" | "string" | "func"

export interface RuntimeVal{
    type : ValueType
    valueType: string
}

export interface NilVal extends RuntimeVal{
    type: "nil"
    value: "nil"
    valueType: "nil"
}

export interface IntVal extends RuntimeVal{
    type: "int"
    value: number
    valueType: "int"
}

export interface FuncVal extends RuntimeVal{
    type: "func"
    value: Expr
    valueType: "func"
    returnType: string
    scope: Env
    paramNames: string[]
}
export interface StringVal extends RuntimeVal{
    type: "string"
    value: string
    valueType: "string"
}