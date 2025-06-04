document.addEventListener("DOMContentLoaded", () => {
  const display = document.getElementById("display");
  let currentInput = "";
  let lastInput = "";

  function updateDisplay(value) {
    // Animate color change
    display.style.color = "#000000";
    display.textContent = value;
    setTimeout(() => {
      display.style.color = "#000000";
    }, 200);
  }

  function appendValue(val) {
    // Prevent two operators in a row
    if ("+-*/".includes(val)) {
      if (currentInput === "" && val !== "-") return; // prevent operator at start except minus
      if ("+-*/".includes(lastInput)) {
        currentInput = currentInput.slice(0, -1);
      }
    }

    // Only one decimal point per number
    if (val === ".") {
      let parts = currentInput.split(/[\+\-\*\/]/);
      if (parts[parts.length - 1].includes(".")) return;
      if (currentInput === "" || "+-*/".includes(lastInput)) {
        val = "0.";
      }
    }

    currentInput += val;
    lastInput = val;
    updateDisplay(currentInput);
  }

  function clearDisplay() {
    currentInput = "";
    lastInput = "";
    updateDisplay("0");
  }

  function backspace() {
    if (currentInput.length > 0) {
      currentInput = currentInput.slice(0, -1);
      lastInput = currentInput.slice(-1);
      updateDisplay(currentInput || "0");
    }
  }

  function calculateResult() {
    if (currentInput === "") return;

    try {
      
      let expression = currentInput.replace(/×/g, "*").replace(/÷/g, "/");

      
      if (/[^0-9+\-*/.]/.test(expression)) {
        throw new Error("Invalid characters");
      }

      
      let result = eval(expression);
      result = Math.round((result + Number.EPSILON) * 100000000) / 100000000; // round to 8 decimals
      updateDisplay(result.toString());
      currentInput = result.toString();
      lastInput = "";
    } catch {
      updateDisplay("Error");
      currentInput = "";
      lastInput = "";
    }
  }

  // Attach event listeners to buttons
  document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-value");
      const action = button.getAttribute("data-action");

      if (action === "clear") clearDisplay();
      else if (action === "calculate") calculateResult();
      else if (action === "backspace") backspace();
      else if (value) appendValue(value);
    });
  });
});
