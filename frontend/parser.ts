import { CustomNode, Program, Expr, BinaryExpr, Identifier, NumericLiteral, NilLiteral, VarDec, StringLiteral, VarAssign } from "./ast.ts";
import { tokenize, Token, TokenType} from "./lexer.ts";


export default class Parser{
    private tokens: Token[] = []
    private notEOF():boolean{
        return this.tokens[0].type != TokenType.EOF 
    }

    public produceAST(sourceCode: string): Program{
        this.tokens = tokenize(sourceCode)
        const program: Program = {
            type: "Program",
            body: []
        }
        while (this.notEOF()) {
             program.body.push(this.parseStatement())
        }

        return program
    }

    private at() {
        return this.tokens[0] as Token
    }

    private eat() {
        return this.tokens.shift() as Token
    }

    private expect(type : TokenType, err : string): Token{
        const prev = this.eat()
        if(!prev || prev.type == type){
            console.error("parser error: \n", err, "type:",prev.type, "- Expecting:", type)
            Deno.exit(1)
        }
        return prev;
    }

    private parseStatement(): CustomNode {
        switch (this.at().type) {
            case TokenType.Var:
                return this.parseVarDec()
            default:
                return this.parseExpr()
        }
    }

    private parseStringLiteral(): Expr {
        this.eat()
        let string = ""
        while(this.at().type != TokenType.Quote){
            if(this.at().type != TokenType.EOF){
                string += this.at().value
            } else {
                throw "unexpected end of file. Expected a quotation mark"
            }
        }
        return {"type": "StringLiteral", "value": string, "valueType": "string"} as StringLiteral
    }

    private parseExpr(): Expr {
        return this.parseAssignmentExpr()
    }

    private parseAssignmentExpr(): Expr {
        const left = this.parseAdditiveExpr()
        if(this.at().type == TokenType.Equals){
            this.eat()
            const right = this.parseAssignmentExpr()
            return {value: right, assigne: left, type: "VarAssign"} as VarAssign
        }

        return left;
    }

    private parseAdditiveExpr(): Expr {
        let left = this.parseMultiplicitiveExpr();

        while (
          this.at().value == "+" || this.at().value == "-"
        ) {
          const operator = this.eat().value;
          const right = this.parseMultiplicitiveExpr();
          left = {
            type: "BinaryExpr",
            left,
            right,
            operator,
          } as BinaryExpr;
        }
    
        return left;
    }

    private parseMultiplicitiveExpr(): Expr {
        let left = this.parsePrimaryExpr();

        while (
          this.at().value == "*" || this.at().value == "/" || this.at().value == "%"
        ) {
          const operator = this.eat().value;
          const right = this.parsePrimaryExpr();
          left = {
            type: "BinaryExpr",
            left,
            right,
            operator,
          } as BinaryExpr;
        }
    
        return left;
    }

    private parsePrimaryExpr(): Expr {
        const tk: TokenType = this.at().type
        switch (tk) {
            case TokenType.Identifier:
                return {type: "Identifier", symbol: this.eat().value} as Identifier
            case TokenType.Number:
                return {type: "NumericLiteral", value: parseFloat(this.eat().value)} as NumericLiteral
            case TokenType.Quote:
                return this.parseStringLiteral()
            case TokenType.OpenParen: {
                this.eat()
                const value = this.parseExpr()
                this.expect(TokenType.CloseParen, "Unexpected token instead of closing paren")
                return value
            }
            case TokenType.Nil:
                this.eat()
                return {type: "NilLiteral", value: "nil"} as NilLiteral
            default:
                console.error("Unexpected token found during parsing", this.at())
                Deno.exit(1)
        }
    }

    parseVarDec(): CustomNode {
        this.eat()
        if(this.at().type == TokenType.Identifier){
            const identifier = this.at().value
            this.eat()
            if(this.at().type == TokenType.Colon){
                this.eat()
                if(this.at().type == TokenType.Type){
                    const type = this.eat().value
                    if(this.at().type == TokenType.Equals){
                        this.eat()
                        return {type: "VarDec", id: identifier, value: this.parseExpr(), valueType: type} as VarDec
                    }
                    return {type:"VarDec", id: identifier} as VarDec
                }
                else throw `unexpeced token: ${this.at()}`
            }
            else throw `you forgot to add the type to variable ${identifier}`
        }
        else throw `Unexpected token: ${this.at()}. You likely put the wrong thing after var or $`
    }
    
}



 
