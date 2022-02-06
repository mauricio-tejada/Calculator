//theme selector

const themes = document.getElementsByName('theme')
themes[0].checked = true


const body = document.querySelector('body')
const header = document.querySelector('.header')
const form = document.querySelector('form')
const display = document.querySelector('.display')
const keyboard = document.querySelector('.keyboard')

const numberButtons = document.querySelectorAll("[data-number]")
const operationButtons = document.querySelectorAll("[data-operation]")

const equalButton = document.querySelector("[data-equal]")
const deleteButton = document.querySelector("[data-del]")
const resetButton = document.querySelector("[data-reset]")

const previousOperandTextElement = document.querySelector("[previous-operand]")
const currentOperandTextElement = document.querySelector("[current-operand]")


function verifyChecked() {
    return document.querySelector('input[type="radio"]:checked').value
}

function addClass(theme) {
    body.classList.add(`${theme}-bg-main`)
    header.classList.add(`${theme}-header`)
    form.classList.add(`${theme}-form`)
    display.classList.add(`${theme}-display`)
    keyboard.classList.add(`${theme}-keyboard`)
    equalButton.classList.add(`${theme}-equal-btn`)
    deleteButton.classList.add(`${theme}-del-btn`)
    resetButton.classList.add(`${theme}-reset-btn`)

    operationButtons.forEach(e => e.classList.add(`${theme}-button`))
    numberButtons.forEach(e => e.classList.add(`${theme}-button`))
}

function removeClass(theme) {
    body.classList.remove(`${theme}-bg-main`)
    header.classList.remove(`${theme}-header`)
    form.classList.remove(`${theme}-form`)
    display.classList.remove(`${theme}-display`)
    keyboard.classList.remove(`${theme}-keyboard`)
    equalButton.classList.remove(`${theme}-equal-btn`)
    deleteButton.classList.remove(`${theme}-del-btn`)
    resetButton.classList.remove(`${theme}-reset-btn`)

    operationButtons.forEach(e => e.classList.remove(`${theme}-button`))
    numberButtons.forEach(e => e.classList.remove(`${theme}-button`))
}

function changeTheme() {
    if (verifyChecked() === 'theme1') {
        removeClass('t2')
        removeClass('t3')
        addClass('t1')
    } else if (verifyChecked() === 'theme2') {
        removeClass('t1')
        removeClass('t3')
        addClass('t2')
    } else {
        removeClass('t1')
        removeClass('t2')
        addClass('t3')
    }
}

changeTheme()

themes.forEach(e => {
    e.addEventListener('click', () => {
        changeTheme()
    })
})


//calculator

class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement
        this.currentOperandTextElement = currentOperandTextElement
        this.clear()
    }

    formatDisplayNumber(number) {
        const stringNumber = number.toString();

        const integerDigits = parseFloat(stringNumber.split(".")[0]);
        const decimalDigits = stringNumber.split(".")[1];

        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = "";
        } else {
            integerDisplay = integerDigits.toLocaleString("en", {
                maximumFractionDigits: 0,
            });
        }

        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1)
    }

    calculate() {
        let result

        const _previousOperand = parseFloat(this.previousOperand)
        const _currentOperand = parseFloat(this.currentOperand)

        if (isNaN(_previousOperand) || isNaN(_currentOperand)) return

        switch (this.operation) {
            case '+':
                result = _previousOperand + _currentOperand
                break;
            case '-':
                result = _previousOperand - _currentOperand
                break;
            case '*':
                result = _previousOperand * _currentOperand
                break;
            case '/':
                result = _previousOperand / _currentOperand
                break;
            default:
                return;
        }

        this.currentOperand = result
        this.operation = undefined
        this.previousOperand = ''

    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return

        if (this.previousOperand !== '') {
            this.calculate()
        }
        this.operation = operation

        this.previousOperand = this.currentOperand
        this.currentOperand = ""
    }

    appendNumber(number) {
        if (this.currentOperand.includes(".") && number === ".") return

        if (this.currentOperand.length >= 14) {
            return
        }
        else {
            this.currentOperand = `${this.currentOperand}${number.toString()}`
        }
    }

    clear() {
        this.currentOperand = ''
        this.previousOperand = ''
        this.operation = undefined
    }

    updateDisplay() {
        this.previousOperandTextElement.innerText = `${this.formatDisplayNumber(
            this.previousOperand
        )} ${this.operation || ""}`;
        this.currentOperandTextElement.innerText = this.formatDisplayNumber(
            this.currentOperand
        );
    }


}


const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement)

for (const number of numberButtons) {
    number.addEventListener('click', () => {
        calculator.appendNumber(number.innerText)
        calculator.updateDisplay()
    })
}

for (const operation of operationButtons) {
    operation.addEventListener('click', () => {
        calculator.chooseOperation(operation.innerText)
        calculator.updateDisplay()
    })
}

equalButton.addEventListener('click', () => {
    calculator.calculate()
    calculator.updateDisplay()
})

resetButton.addEventListener("click", () => {
    calculator.clear()
    calculator.updateDisplay()
})

deleteButton.addEventListener('click', () => {
    calculator.delete()
    calculator.updateDisplay()
})