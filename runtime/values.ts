export type ValueType = "nil" | "int" | "string"

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

export interface StringVal extends RuntimeVal{
    type: "string"
    value: string
    valueType: "string"
}