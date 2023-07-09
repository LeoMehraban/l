import { RuntimeVal } from "./values.ts"



export default class Env{
    private parent?: Env
    private variables: Map<string, RuntimeVal> 
    constructor(parent?: Env){
        this.parent = parent
        this.variables = new Map()
    }

    public declareVariable(name: string, value: RuntimeVal, type: string): RuntimeVal{
            if(this.variables.has(name)){
                console.error("Cannot declare variables twice: ", name, " is already defined in scope", this)
                Deno.exit(1)
            }
            const newValue = value
            newValue.valueType = type
            this.variables.set(name, newValue)
            return newValue
    }

    public assignVar(name: string, value: RuntimeVal): RuntimeVal{
        const env = this.resolve(name)
        env.variables.set(name, value)
        return value
    }


    public lookupVar(name: string): RuntimeVal{
        return this.resolve(name).variables.get(name) as RuntimeVal
    }

    public resolve(name: string): Env{
        if(this.variables.has(name)){
            return this
        } 
        if(this.parent == undefined){
            throw new Error(`${name} is undefined in scope ${JSON.stringify(this)}`)
        }
        return this.parent.resolve(name)
    }
}