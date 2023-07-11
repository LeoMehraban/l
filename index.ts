import { tokenize } from "./frontend/lexer.ts";
import Parser from "./frontend/parser.ts";
import Env from "./runtime/env.ts";
import { interperate } from "./runtime/interperater.ts";

//doText()

function doText(){
    const parser = new Parser()
    const env = new Env()
    const decoder = new TextDecoder("utf-8")
    const input: string = decoder.decode(Deno.readFileSync(Deno.args[0]))
    console.log("LEXER\n")
    console.log(tokenize(input))
    console.log("PARSER\n")
    const program = parser.produceAST(input)
    console.log(program)
    console.log("ITERPERATER\n")
    console.log(interperate(program, env))
}



repl()


function repl() {
    const parser = new Parser()
    const env = new Env()
    console.log("\n L repl 0.1")
    while (true) {
        const input = prompt("> ")
        if(!input || input.includes("exit")){
            Deno.exit(0)
        }
        //console.log("LEXER\n")
        //console.log(tokenize(input))
        //console.log("PARSER\n")
        const program = parser.produceAST(input)
        //console.log(program)
        //console.log("ITERPERATER\n")
        console.log(interperate(program, env))
    }
}
