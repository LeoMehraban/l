import { FuncBody } from "../frontend/ast.ts"
import Env from "./env.ts"

export type ValueType = "nil" | "int" | "string" | "func"

export interface RuntimeVal{
    type : ValueType
    valueType: string
    value?: any
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
    value: FuncBody[]
    valueType: "func"
    returnType: string
    scope: Env
}
export interface StringVal extends RuntimeVal{
    type: "string"
    value: string
    valueType: "string"
}