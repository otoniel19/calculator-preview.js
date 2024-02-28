const expressionConverter = {
  conversionOfOperators: {
    "x": "*",
    "÷": "/",
    "^": "**",
    "%": "/100*"
  },
  conversionOfSymbols: {
    "π": Math.PI
  },
  convert: function (expression) {
    //expression = expression.replace(new RegExp(`[${Object.keys(this.conversionOfSymbols).join("")}]`, "g"), (match) => this.conversionOfSymbols[match])
    //expression = this.convertWithRegexp(expression)
    //Tokenizes the expression (i.e. breaks the expression into smaller parts)
    var tokenized = new expressionTokenizer().tokenize(expression)
    tokenized = tokenized.map((token) => {
      if(token.type === "operator") return this.conversionOfOperators[token.value] || token.value 
      else if(token.type === "symbol") return this.conversionOfSymbols[token.value] || token.value
      else return token.value
    })
    /*
      Returns this reassembled expression and uses regexp (regular expressions) to perform a more advanced conversion, due to operations such as the square root.
    */
    return this.convertWithRegexp(tokenized.join(""), tokenized)
  },
  convertWithRegexp: function (expression, tokenized) {
    //The following conversion code, using regular expressions, follows the order of operation called PEMDAS
    //P (parentheses)
    expression = expression.replace(/(\d+)\((.*)\)/g, "$1*($2)")
    expression = expression.replace(/\)\(/g, ")*(")
    // Treat expressions (or calculations/accounts) in parentheses, for example: 5 + (5 + 5), the 5 + 5 in parentheses will be converted into 10, leaving the expression like this: 5 + 10
    //expression = expression.replace(/\((.*)\)/g, (match) => !/[√]/g.test(match) ? eval(match) : match)
    //E (Exponentiation, radiciation and fraction)
    //Deals with square roots, to convert them to a JavaScript-readable format, example: √36 = Math.sqrt(36)
    expression = expression.replace(/√(\d+\.\d+|\d+)/g, "Math.sqrt($1)")
    //M (Multiplication)
    //Deals with multiplications implicit in the expression, those unsigned multiplications, for example: 5(5 + 10)
    while (/Math.sqrt\((.*)\)Math.sqrt\((.*)\)/g.test(expression)) {
      expression = expression.replace(/Math.sqrt\((.*)\)Math.sqrt\((.*)\)/g, "Math.sqrt($1*$2)")
    }
    expression = expression.replace(/(\d+)(Math.sqrt\(.*\))/g, "$1*$2")
    //Others expressions 
    //Factorial
    expression = expression.replace(/(\d+)\!/g, "utils.factorial($1)")
    while (/utils.factorial\((\d+)\)utils.factorial\((\d+)\)/g.test(expression)) {
      expression = expression.replace(/(utils.factorial\(\d+\))(utils.factorial\(\d+\))/g, "$1*$2")
    }
    return expression
  }
}
