document.addEventListener('DOMContentLoaded', () => {
  const input = document.querySelector('.calc__screen-input');
  const buttons = document.querySelectorAll('.calc__button');

  const textButtons = ['=', '-', '+', 'x', '÷', '%', '√x'];

  let firstNum = '';
  let secondNum = '';
  let operation = '';
  let previousSign = '';
  let previousValue = '';

  const buttonArrow = document.querySelector('.button-arrow');
  function removeLastNumber() {
    buttonArrow.addEventListener('click', () => {
      if (firstNum === 'Ошибка') return;
      if (input.value.length > 1) {
        if (firstNum !== '' && secondNum !== '' && operation !== '') {
          input.value = secondNum = input.value.slice(0, -1);
        } else {
          input.value = firstNum = input.value.slice(0, -1);
        }
      }
    });
  }
  if (buttonArrow) removeLastNumber();

  function blinkDigits(input) {
    input.value = '';
    input.placeholder = '';
    setTimeout(() => {
      input.value = previousValue;
    }, 200);
  }

  function cleanAll() {
    firstNum = '';
    secondNum = '';
    operation = '';
    input.value = '0';
    input.placeholder = '0';
    previousSign = '';
    previousValue = '';
  }

  function setSwitch() {
    return previousSign === '' ? operation : previousSign;
  }
  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const textButton = button.previousElementSibling;
      if (textButton.innerText === '⬅') return;
      if (textButton.innerText === 'C') {
        cleanAll();
        return;
      }
      if (firstNum === 'Ошибка') return;
      if (textButtons.includes(textButton.innerText)) {
        if (textButton.innerText === '√x') {
          if (firstNum === '') return;
          if (firstNum < 0) {
           input.value = firstNum = 'Ошибка';
          } else {
             input.value = firstNum = Math.sqrt(Number(firstNum));
          }
        }
        if (previousSign !== '' && firstNum !== '' && secondNum === '')
          previousSign = '';
        if (previousSign !== '') {
          switch (setSwitch()) {
            case '+':
              firstNum = Number(firstNum) + Number(secondNum);
              break;
            case '-':
              firstNum = Number(firstNum) - Number(secondNum);
              break;
            case 'x':
              firstNum = Number(firstNum) * Number(secondNum);
              break;
            case '÷':
              firstNum = Number(firstNum) / Number(secondNum);
              if (secondNum === '0') firstNum = 'Ошибка';
              break;
            case '%':
              firstNum = Number(firstNum) * (Number(secondNum) / 100);
              break;
            default:
              if (firstNum === 'Ошибка') {
                return;
              }
          }
          previousSign = '';
          operation = '';
        }
        previousValue = String(firstNum).substring(0, 11);
        if (firstNum === '') return;
        blinkDigits(input);
      }
      if (textButton.classList.contains('button-action')) {
        if (firstNum === '') return;

        operation = textButton.innerText;

        if (firstNum !== '' && operation !== '' && secondNum !== '')
          secondNum = '';

        if (previousSign === '') {
          return (previousSign = operation);
        }
      }
      if (!textButton.classList.contains('button-action')) {
        if (
          secondNum === '' &&
          operation === '' &&
          textButton.innerText !== '='
        ) {
          if (firstNum.includes('.') && textButton.innerText === '.') return;
          firstNum = firstNum.substring(0, 10);
          input.value = firstNum += textButton.innerText;
        }
        if (
          firstNum !== '' &&
          operation !== '' &&
          textButton.innerText !== '='
        ) {
          if (secondNum.includes('.') && textButton.innerText === '.') return;
          secondNum = secondNum.substring(0, 10);
          input.value = secondNum += textButton.innerText;
        }
        previousValue = String(firstNum).substring(0, 11);
      }
      if (!/^[^0]/.test(firstNum)) firstNum = '';
      if (!/^[^0]/.test(secondNum) && operation === '÷') {
        secondNum = textButton.innerText;
      } else if (!/^[^0]/.test(secondNum)) {
        secondNum = '';
      }
    });
  });
});
