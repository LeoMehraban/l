import {RuntimeVal, IntVal, NilVal, StringVal} from "./values.ts"
import {BinaryExpr, CustomNode, Identifier, NumericLiteral, Program, StringLiteral, VarAssign, VarDec } from "../frontend/ast.ts"
import Env from "./env.ts"

export function interperate(astNode: CustomNode, env: Env): RuntimeVal {
    switch (astNode.type) {
        case "NumericLiteral":
            return {"value": (astNode as NumericLiteral).value, "type": "int"} as IntVal
        case "StringLiteral":
            return {"value": (astNode as StringLiteral).value, "type": "string", "valueType": "string"} as StringVal
        case "NilLiteral":
            return {"value": "nil", "type": "nil"} as NilVal
        case "BinaryExpr":
            return evalBinary(astNode as BinaryExpr, env)
        case "Program":
            return evalProgram(astNode as Program, env)
        case "Identifier":
            return evalId(astNode as Identifier, env)
        case "VarDec":
            return evalDec(astNode as VarDec, env)
        case "VarAssign":
                return evalAssign(astNode as VarAssign, env)
        default:
            console.error("Not implemented yet:", astNode)
            Deno.exit(1)
    }
}

function evalId(id: Identifier, env: Env): RuntimeVal {
    return env.lookupVar(id.symbol)
}

function evalBinary(binop: BinaryExpr, env: Env): RuntimeVal{
    const left = interperate(binop.left, env)
    const right = interperate(binop.right, env)
    if(left.type == "int" && right.type == "int"){
        return evalNumericBinary(left as IntVal, right as IntVal, binop.operator)
    }
    return {"value": "nil", "type": "nil"} as NilVal
}

function evalProgram(program: Program, env: Env): RuntimeVal{
    let lastEvaluated: RuntimeVal = {"value": "nil", "type": "nil"} as NilVal
    for(const statement of program.body){
        lastEvaluated = interperate(statement, env)
    }
    return lastEvaluated
}

function evalNumericBinary(left: IntVal,right: IntVal,operator: string): IntVal {
    let result = 0;
    if( operator == "+"){
        result = left.value + right.value
    } else if(operator == "-"){
        result = left.value - right.value
    } else if(operator == "*"){
        result = left.value * right.value
    } else if(operator == "/"){
        result = left.value / right.value
    } else{
        result = left.value % right.value
    }

    return {value: result, type: "int", valueType: "int"}
}

function evalDec(vardec: VarDec,env: Env): RuntimeVal {
    const value = vardec.value ? interperate(vardec.value, env) : {"type": "nil", "value": "nil"} as NilVal
    return env.declareVariable(vardec.id, value, vardec.valueType)
}

function evalAssign(varassign: VarAssign,env: Env): RuntimeVal {
    if(varassign.assigne.type != "Identifier")
        throw `Invalid Node Type: ${varassign.assigne.type}`
    const varname = (varassign.assigne as Identifier).symbol
    return env.assignVar(varname, interperate(varassign.value, env))
}
