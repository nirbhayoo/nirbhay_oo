const display = document.getElementById("mainDisplay");
const smallDisplay = document.getElementById("smallDisplay");
let angleMode = "DEG";
let expression = "";

function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toggleAngleMode() {
  angleMode = angleMode === "DEG" ? "RAD" : "DEG";
  document.getElementById("angleMode").innerText = angleMode;
}

function appendValue(value) {
  const lastChar = expression.slice(-1);

  // Prevent two operators in a row, including '*'
  if (/[+\-*/.%]/.test(lastChar) && /[+\-*/.%]/.test(value)) {
    return;
  }

  expression += value;
  display.value = expression;
  smallDisplay.innerText = expression;
}

function clearDisplay() {
  expression = "";
  display.value = "";
  smallDisplay.innerText = "";
}

function deleteLast() {
  expression = expression.slice(0, -1);
  display.value = expression;
  smallDisplay.innerText = expression;
}

function calculateResult() {
  try {
    let result = eval(
      expression
      .replace(/(\d+(\.\d+)?)\^(\d+(\.\d+)?)/g, "Math.pow($1,$3)")
        .replace(/sin/g, angleMode === "DEG" ? "Math.sin(toRad" : "Math.sin")
        .replace(/cos/g, angleMode === "DEG" ? "Math.cos(toRad" : "Math.cos")
        .replace(/tan/g, angleMode === "DEG" ? "Math.tan(toRad" : "Math.tan")
        .replace(/ln/g, "Math.log")
        .replace(/log/g, "Math.log10")
        .replace(/√/g, "Math.sqrt")
        .replace(/π/g, "Math.PI")
        .replace(/e/g, "Math.E")
    );

    if (angleMode === "DEG") result = toDeg(result);
    display.value = result;
    smallDisplay.innerText = expression + " =";
    addToHistory(expression + " = " + result);
    expression = "" + result;
  } catch (e) {
    display.value = "Error";
  }
}

function toRad(x) {
  return x * (Math.PI / 180);
}

function toDeg(x) {
  // Note: The original toDeg function just returned x.
  // If you need actual degree conversion for results from trig functions in radians,
  // the logic here might need adjustment depending on the desired behavior.
  return x;
}

function addToHistory(entry) {
  const list = document.getElementById("historyList");
  const item = document.createElement("li");
  item.innerText = entry;
  list.prepend(item);
}

function clearHistory() {
  const list = document.getElementById("historyList");
  list.innerHTML = ""; // Clears all list items
}


function factorial(n) {
  // Basic factorial implementation, might need error handling for non-integers/negatives
  if (n < 0) return NaN; // Factorial of negative numbers is not defined
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}


// Buttons setup - Arranged for 4 columns, including all original functions and Clear History
const buttonList = [
  "7", "8", "9", "/",
  "4", "5", "6", "*",
  "1", "2", "3", "-",
  "0", ".", "=", "+",
  "AC", "DEL", "(", ")",
  "2nd", "deg", "%", "√",
  "sin(", "cos(", "tan(", "x!",
  "1/x", "π", "e", "Clear History", // Added Clear History button
];


const buttonContainer = document.getElementById("buttons");

buttonList.forEach(label => {
  const btn = document.createElement("button");
  btn.innerText = label;

  let tooltipText = label; // Default tooltip is the button label

  if (label === "AC") {
    btn.onclick = clearDisplay;
    tooltipText = "Clear Display";
  } else if (label === "DEL") {
    btn.onclick = deleteLast;
    tooltipText = "Delete Last Character";
  } else if (label === "=") {
    btn.onclick = calculateResult;
    tooltipText = "Calculate Result";
  } else if (label === "x!") {
    btn.onclick = () => appendValue("factorial(");
    tooltipText = "Factorial function";
  } else if (label === "1/x") {
    btn.onclick = () => appendValue("1/(");
    tooltipText = "Reciprocal function";
  } else if (label === "√") {
    btn.onclick = () => appendValue("Math.sqrt(");
    tooltipText = "Square Root function";
  } else if (label === "π") {
    btn.onclick = () => appendValue("Math.PI");
    tooltipText = "Append Pi";
  } else if (label === "e") {
    btn.onclick = () => appendValue("Math.E");
    tooltipText = "Append E (Euler's number)";
  } else if (label === "sin(" || label === "cos(" || label === "tan(") {
    btn.onclick = () => appendValue(label);
    tooltipText = label.replace("(", "") + " function"; // e.g., "sin function"
  } else if (label === "deg") {
      btn.onclick = toggleAngleMode;
      tooltipText = "Toggle Angle Mode (Degrees/Radians)";
  } else if (label === "Clear History") { // Added handler for Clear History button
      btn.onclick = clearHistory;
      tooltipText = "Clear Calculation History";
  }
  // Add tooltips for operators and numbers
  else if (/[+\-*/.%]/.test(label)) {
      tooltipText = "Append " + label + " (Operator)";
  } else if (/\d|\./.test(label)) {
      tooltipText = "Append " + label + " (Number)";
  } else if (label === "(") {
      tooltipText = "Open Parenthesis";
  } else if (label === ")") {
      tooltipText = "Close Parenthesis";
  } else if (label === "2nd") {
      // Assuming 2nd function will be implemented later
      tooltipText = "Toggle Second Functions";
  }


  btn.setAttribute("title", tooltipText); // Add the tooltip attribute
  btn.onclick = btn.onclick || (() => appendValue(label)); // Ensure a click handler is always assigned

  buttonContainer.appendChild(btn);
});
