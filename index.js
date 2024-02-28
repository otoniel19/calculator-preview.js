var globalExpression = ""
var display = document.getElementById("display")

function updateDisplayContinuously() {
  // Ensures that the expression does not begin with one of these signs: +, x, ÷, ^, !, which are signs not allowed at the beginning of the expression.
  if (/^[+x÷\^\!\.\%]/g.test(globalExpression)) globalExpression = globalExpression.slice(0, -1)
  //Do not allow more than one comma to be added to decimal numbers.
  if (/(\d+\.\d+\.)/g.test(globalExpression)) globalExpression = globalExpression.slice(0, -1)
  //Update display
  display.value = globalExpression
  requestAnimationFrame(updateDisplayContinuously)
}
updateDisplayContinuously()

function calculate(expression) {
  //const lookForErrors = catchErrors(expression, new expressionTokenizer().tokenize(expression))
  var result = String(eval(expressionConverter.convert(expression)))
  globalExpression = result;
}

function applyParentheses() {
  var tokenizedExpression = new expressionTokenizer().tokenize(globalExpression);
  var lastValue = tokenizedExpression[tokenizedExpression.length - 1]
  // Verifica se a contagem de parênteses abertos e fechados é equilibrada
  var openParenthesesCount = globalExpression.match(/\(/g) || []
  var closedParenthesesCount = globalExpression.match(/\)/g) || []

  if (lastValue) {
    if (lastValue.type === "number")
      if (openParenthesesCount.length > closedParenthesesCount.length) globalExpression += ")";
      else globalExpression += "("
    else if (lastValue.type === "operator") globalExpression += "("
  }
}

var indexOfButtons = 0;
//Change the special buttons which are the gray buttons
function alternateButtons() {
  indexOfButtons++
  const originalEspecialButtons = ["√", "π", "^", "!"]
  const otherSpecialButtons = ["±"]
  const especialButtonsElements = document.querySelectorAll("button.buttons")
  if (indexOfButtons === 1) {
    otherSpecialButtons.forEach((buttonContent, index) => {
      especialButtonsElements[index].innerHTML = buttonContent
    })
  } else {
    indexOfButtons = 0;
    //Restores buttons to their original state
    originalEspecialButtons.forEach((buttonContent, index) => {
      especialButtonsElements[index].innerHTML = buttonContent
    })
  }
}

function invertLastNumberSign() {
  const lastNumber = globalExpression.match(/(\d+\.\d+|\-\d+\.\d+)|(\-\d+|\d+)$/g)
  const removeLastNumber = () => {
    for(let i = 0; i < lastNumber[0].length; i++) {
      globalExpression = globalExpression.slice(0, -1)
    }
  }
  if(lastNumber !== null) {
    if(lastNumber[0].startsWith("-")) {
      removeLastNumber();
      globalExpression += lastNumber[0].replace("-", "")
    } else {
      removeLastNumber();
      globalExpression += "-" + lastNumber[0]
    }
  }
}
