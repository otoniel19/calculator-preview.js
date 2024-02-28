class expressionTokenizer {
  static #operatorsAndSymbolsName;
  static #operatorsRegex;
  static #symbolsRegex;
  constructor() {
    this.operatorsAndSymbolsName = {
      operator: {
        "+": "plus",
        "-": "minus",
        "x": "times",
        "*": "times",
        "÷": "divided-by",
        "/": "divided-by",
        "^": "elevated",
        "**": "elevated",
        "√": "square-root",
        "³√": "cubic-root",
        "!": "factorial",
        "%": "percent",
      },
      symbol: {
        "π": "PI",
        "(": "open-parentheses",
        ")": "close-parentheses"
      }
    }
    this.operatorsRegex = /([\+\-|\x|\*|\÷|\/|\^|\**|\√|\³√|\!|\%])/g
    this.symbolsRegex = /([π|\(|\)])/g
  }
  tokenize(expression) {
    if (expression.includes(" ")) throw new Error(`White spaces in the expression are not allowed. On line: ${expression.indexOf(" ")}`)
    const expressionSeparateInTokens = [];
    //Capture in the expression, the numbers, operators and symbols. Numbers like: -1, -10.50, 80, 80.50, -6, etc. Mathematical operators and symbols such as PI (π).
    const capturedValues = expression.match(/(\-\d+\.\d+|\-\d+|\d+\.\d+|\d+)|([\+\-|\x|\*|\÷|\/|\^|\**|\√|\³√|\!|\%])|([π|\(\)])/g)
    for (let i = 0; i < capturedValues.length; i++) {
      let separatedValueOfExpression = capturedValues[i]
      //Stores each value found in the expression as an array of objects, with the type of the value, the value itself and the name of the value.
      expressionSeparateInTokens.push(this.getToken(separatedValueOfExpression))
    }
    return expressionSeparateInTokens
  }
  getToken(value) {
    return {
      name: this.nameOfValue(value),
      type: this.valueType(value),
      value: value
    }
  }
  valueType(value) {
    if (/\d+|\d+\.\d+/.test(value)) return "number"
    else if (this.operatorsRegex.test(value)) return "operator"
    else if (this.symbolsRegex.test(value)) return "symbol"
    else return "unknown"
  }
  nameOfValue(value) {
    if (value && this.operatorsAndSymbolsName[this.valueType(value)] && this.valueType(value) !== "unknown") return this.operatorsAndSymbolsName[this.valueType(value)][value]
    else return "unknown"
  }
}