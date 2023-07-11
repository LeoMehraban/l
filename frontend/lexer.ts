//#x = 5 + (1 * 3)

export interface Token{
    value: string
    type: TokenType
}

export enum TokenType{
    Number,
    Nil,
    Identifier,
    OpenParen, 
    CloseParen,
    Quote,
    BinaryOperator,
    Equals,
    Var,
    Colon,
    Type,
    Returns,
    Call,
    OpenBracket,
    ColseBracket,
    Comma,
    EOF
}

const KEYWORDS: Record<string, TokenType> = {
    "nil": TokenType.Nil,
    "var": TokenType.Var,
    "int": TokenType.Type,
    "string": TokenType.Type,
    "func": TokenType.Type
}


/**
 * Returns whether the character passed in alphabetic -> [a-zA-Z]
 */
export function isalpha(src: string) {
    return src.toUpperCase() != src.toLowerCase();
}
  

/**
 * Returns true if the character is whitespace like -> [\s, \t, \n]
 */
export function isskippible(str: string) {
    return str == " " || str == "\n" || str == "\t";
  }

export function isint(src:string){
    const c = src.charCodeAt(0)
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
    return c >= bounds[0] && c <= bounds[1]
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>();
    const src = sourceCode.split("");
  
    // produce tokens until the EOF is reached.
    while (src.length > 0) {
      // BEGIN PARSING ONE CHARACTER TOKENS
      if (src[0] == "(") {
        tokens.push(token(src.shift(), TokenType.OpenParen));
      } else if (src[0] == ")") {
        tokens.push(token(src.shift(), TokenType.CloseParen));
      } // HANDLE BINARY OPERATORS
      else if (
        src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" ||
        src[0] == "%"
      ) {
        tokens.push(token(src.shift(), TokenType.BinaryOperator));
      } // Handle Conditional & Assignment Tokens
      else if (src[0] == "=") {
        tokens.push(token(src.shift(), TokenType.Equals));
      }
      else if (src[0] == `"`) {
        tokens.push(token(src.shift(), TokenType.Quote));
      }
      else if (src[0] == ":") {
        tokens.push(token(src.shift(), TokenType.Colon));
      }
      else if (src[0] == ",") {
        tokens.push(token(src.shift(), TokenType.Comma));
      }
      else if (src[0] == "[") {
        tokens.push(token(src.shift(), TokenType.OpenBracket));
      }
      else if (src[0] == "]") {
        tokens.push(token(src.shift(), TokenType.ColseBracket));
      }   // HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
      else if (src[0] == "$") {
        tokens.push(token(src.shift(), TokenType.Var));
      }
      else if (src[0] == "#") {
        tokens.push(token(src.shift(), TokenType.Call));
      } else if (src[0] == ">") {
        tokens.push(token(src.shift(), TokenType.Returns));
      }// HANDLE MULTICHARACTER KEYWORDS, TOKENS, IDENTIFIERS ETC...
      else {
        // Handle numeric literals -> Integers
        if (isint(src[0])) {
          let num = "";
          while (src.length > 0 && isint(src[0])) {
            num += src.shift();
          }
  
          // append new numeric token.
          tokens.push(token(num, TokenType.Number));
        } // Handle Identifier & Keyword Tokens.
        else if (isalpha(src[0])) {
          let ident = "";
          while (src.length > 0 && isalpha(src[0])) {
            ident += src.shift();
          }
  
          // CHECK FOR RESERVED KEYWORDS
          const reserved = KEYWORDS[ident];
          // If value is not undefined then the identifier is
          // reconized keyword
          if (typeof reserved == "number") {
            tokens.push(token(ident, reserved));
          } else {
            // Unreconized name must mean user defined symbol.
            tokens.push(token(ident, TokenType.Identifier));
          }
        } else if (isskippible(src[0])) {
          // Skip uneeded chars.
          src.shift();
        } // Handle unreconized characters.
        // TODO: Impliment better errors and error recovery.
        else {
          console.error(
            "Unreconized character found in source: ",
            src[0].charCodeAt(0),
            src[0],
          );
          Deno.exit(1);
        }
      }
    }
  
    tokens.push({ type: TokenType.EOF, value: "EndOfFile" });
    return tokens;
  }

function token(value = "", type: TokenType):Token{
    return {value, type}
}
    
