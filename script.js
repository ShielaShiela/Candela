const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentValue = '0';
let shouldResetDisplay = false;

function updateDisplay(value) {
  display.textContent = value;
}

function handleNumber(value) {
  if (shouldResetDisplay) {
    currentValue = value;
    shouldResetDisplay = false;
  } else {
    currentValue = currentValue === '0' ? value : currentValue + value;
  }

  updateDisplay(currentValue);
}

function handleDecimal() {
  if (shouldResetDisplay) {
    currentValue = '0.';
    shouldResetDisplay = false;
    updateDisplay(currentValue);
    return;
  }

  if (!currentValue.includes('.')) {
    currentValue += '.';
    updateDisplay(currentValue);
  }
}

function handleOperator(operator) {
  const lastChar = currentValue.slice(-1);

  if (['+', '-', '*', '/'].includes(lastChar)) {
    currentValue = currentValue.slice(0, -1) + operator;
  } else {
    currentValue += operator;
  }

  updateDisplay(currentValue);
  shouldResetDisplay = false;
}

function clearDisplay() {
  currentValue = '0';
  shouldResetDisplay = false;
  updateDisplay(currentValue);
}

function deleteLast() {
  if (currentValue.length <= 1) {
    currentValue = '0';
  } else {
    currentValue = currentValue.slice(0, -1);
  }

  updateDisplay(currentValue);
}

function calculatePercent() {
  try {
    const result = Number(currentValue) / 100;
    currentValue = String(result);
    updateDisplay(currentValue);
  } catch {
    currentValue = 'Error';
    updateDisplay(currentValue);
    shouldResetDisplay = true;
  }
}

function evaluateExpression() {
  try {
    const sanitized = currentValue.replace(/×/g, '*').replace(/÷/g, '/');
    const result = Function(`"use strict"; return (${sanitized});`)();

    if (!Number.isFinite(result)) {
      throw new Error('Invalid operation');
    }

    currentValue = String(result);
    updateDisplay(currentValue);
    shouldResetDisplay = true;
  } catch {
    currentValue = 'Error';
    updateDisplay(currentValue);
    shouldResetDisplay = true;
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { value, action } = button.dataset;

    if (value !== undefined && !isNaN(Number(value)) || value === '.') {
      if (value === '.') {
        handleDecimal();
      } else {
        handleNumber(value);
      }
      return;
    }

    switch (action) {
      case 'clear':
        clearDisplay();
        break;
      case 'delete':
        deleteLast();
        break;
      case 'percent':
        calculatePercent();
        break;
      case 'equals':
        evaluateExpression();
        break;
      default:
        if (['+', '-', '*', '/'].includes(value)) {
          handleOperator(value);
        }
        break;
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    handleNumber(key);
    return;
  }

  if (key === '.') {
    handleDecimal();
    return;
  }

  if (['+', '-', '*', '/'].includes(key)) {
    handleOperator(key);
    return;
  }

  if (key === 'Enter' || key === '=') {
    evaluateExpression();
    return;
  }

  if (key === 'Backspace') {
    deleteLast();
    return;
  }

  if (key === 'Escape') {
    clearDisplay();
  }
});

updateDisplay(currentValue);
