import {RuntimeVal, IntVal, NilVal, StringVal, FuncVal} from "./values.ts"
import {BinaryExpr, CallExpr, CustomNode, Expr, FuncDef, Identifier, NumericLiteral, Program, StringLiteral, VarAssign, VarDec } from "../frontend/ast.ts"
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
        case "FuncDef":
            return evalFuncDef(astNode as FuncDef, env)
        case "CallExpr":
            return evalFuncCall(astNode as CallExpr, env)
        default:
            console.error("Not implemented yet:", astNode)
            Deno.exit(1)
    }
}

function evalFuncCall(funccall: CallExpr, env: Env): RuntimeVal{
    const funcval = env.lookupVar(funccall.name) as FuncVal
    
    for(let i = 0; i < funccall.args.length; i++){
        funcval.scope.assignVar(funcval.paramNames[i], interperate(funccall.args[i], funcval.scope))
    }
    
    return interperate(funcval.value, funcval.scope)
}

function evalFuncDef(funcdef: FuncDef, env: Env): RuntimeVal{
    const scope = new Env(env)
    if(funcdef.paramNames.length != funcdef.paramTypes.length){
        throw `all params must have a name and a type`
    }
    let i = 0
    for(const name of funcdef.paramNames){
        i++;
        scope.declareVariable(name, {type: funcdef.paramTypes[i], valueType:funcdef.paramTypes[i], value: "nil"} as NilVal, funcdef.paramTypes[i])
    }
    return env.declareVariable(funcdef.id, {type: "func", value: funcdef.returnExpr, returnType: funcdef.returnType, paramNames: funcdef.paramNames, scope} as FuncVal, "func")
}

function evalId(id: Identifier, env: Env): RuntimeVal {
    return env.lookupVar(id.symbol)
}

function evalBinary(binop: BinaryExpr, env: Env): RuntimeVal{
    const left = interperate(binop.left, env)
    const right = interperate(binop.right, env)
    if(left.type == "int" && right.type == "int"){
        return evalNumericBinary(left as IntVal, right as IntVal, binop.operator)
    } else {
        throw `inconvertible types: ${left.valueType}, ${right.valueType}`
    }
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
    if(varassign.assigne.valueType != varassign.value.valueType)
        throw `inconvertible types: ${varassign.assigne.valueType}, ${varassign.value.valueType}`
    if(varassign.assigne.type != "Identifier")
        throw `Invalid Node Type: ${varassign.assigne.type}`
    const varname = (varassign.assigne as Identifier).symbol
    return env.assignVar(varname, interperate(varassign.value, env))
}
