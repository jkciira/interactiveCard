const partComplete = document.querySelector('.part.complete');
const partInfo = document.querySelector('.part.info');

const nameInput = document.querySelector('#name');
const numberInput = document.querySelector('#number');
const monthInput = document.querySelector('#MM');
const yearInput = document.querySelector('#YY');
const cvvInput = document.querySelector('#cvv');
const btnConfirm = document.querySelector('#confirm');
const btnContinue = document.querySelector('#continue');

const cardNumber = document.querySelector('.card--span.number');
const cardName = document.querySelector('.card--span.name');
const cardMonth = document.querySelector('.card--span .month');
const cardYear = document.querySelector('.card--span .year');
const cardcvv = document.querySelector('.card--span.cvv');

const namePattern = /^([a-z]{2,13})\s([a-z]{2,13})$/i;
const numberPattern = /^[0-9]{4}\s[0-9]{4}\s[0-9]{4}\s[0-9]{4}$/;
const monthPattern = /^0?[1-9][0-2]?$/;
const yearPattern = /^0?[0-9][0-9]?$/;
const cvvPattern = /^[0-9][0-9][0-9]$/;

const validationMessages = {
    'name': 'Cardholder name accepts 2 names, separated by a space!',
    'number': 'Card number must be 16 digits!',
    'MM': 'MM accepts digits 1-12!',
    'YY': 'YY accepts digits 0-99!',
    'cvv': 'CVV accepts 3 digits!',
};

const defaultValues = {
    'name': 'Jane Appleseed',
    'number': '0000 0000 0000 0000',
    'MM': '00',
    'YY': '00',
    'cvv': '000'
};
const allInputs = document.querySelectorAll('input');
const errorWrappers = document.querySelectorAll('.error-wrapper');

nameInput.addEventListener('input', () => {
    const userInput = nameInput.value;
    isValidInput(userInput, namePattern) == true ? hideErrors(nameInput) : showErrors(nameInput);
    setCardValue(nameInput, cardName);
});

numberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/gi, '').replace(/(.{4})/gi, '$1 ').trim();
    const userInput = e.target.value;

    isValidInput(userInput, numberPattern) == true ? hideErrors(numberInput) : showErrors(numberInput);
    setCardValue(numberInput, cardNumber);
});

monthInput.addEventListener('input', () => {
    const userInput = monthInput.value;
    isValidInput(userInput, monthPattern) == true ? hideErrors(monthInput) : showErrors(monthInput);
    isMonthValid() == false ? showErrors(monthInput) : hideErrors(monthInput);
    setCardValue(monthInput, cardMonth);

    if (isValidInput(userInput, monthPattern)) {
        cardMonth.innerText = addPrefixZero(monthInput);
    }

    function isMonthValid() {
        if (+userInput > 12 || +userInput < 1) {
            return false;
        }

        return true;
    }
});

yearInput.addEventListener('input', () => {
    const userInput = yearInput.value;
    isValidInput(userInput, yearPattern) == true ? hideErrors(yearInput) : showErrors(yearInput);
    setCardValue(yearInput, cardYear);

    if (isValidInput(userInput, yearPattern)) {
        cardYear.innerText = addPrefixZero(yearInput);
    }
});

cvvInput.addEventListener('input', () => {
    const userInput = cvvInput.value;
    isValidInput(userInput, cvvPattern) == true ? hideErrors(cvvInput) : showErrors(cvvInput);
    setCardValue(cvvInput, cardcvv);
});

btnConfirm.addEventListener('click', () => {
    if (areInputsEmpty() || errorsExist()) {
        return;
    }

    togglePartComplete(true);

    function areInputsEmpty() {
        let result = false;

        allInputs.forEach(input => {
            if (input.value.length == 0) {
                result = true;
                showErrors(input);
                input.focus();
            }
        });

        return result;
    }

    function errorsExist() {
        let result = false;

        errorWrappers.forEach(wrapper => {
            if (wrapper.classList.contains('show')) {
                const currentInput = wrapper.closest('.input-group').querySelector('input');
                currentInput.focus();
                showErrors(currentInput);
                result = true;
            }
        });

        return result;
    }
});

btnContinue.addEventListener('click', () => {
    togglePartComplete(false);
    clearAllInputs();
    setCardDefaultValues();

    nameInput.focus();

    function clearAllInputs() {
        allInputs.forEach(input => {
            input.value = "";
        });
    }

    function setCardDefaultValues() {
        cardNumber.innerText = defaultValues.number;
        cardName.innerText = defaultValues.name;
        cardMonth.innerText = defaultValues.MM;
        cardYear.innerText = defaultValues.YY;
        cardcvv.innerText = defaultValues.cvv;
    }
});

function togglePartComplete(affirm = true) {
    if (affirm) {
        partComplete.classList.remove('hide');
        partComplete.classList.add('show');

        partInfo.classList.remove('show');
        partInfo.classList.add('hide');
        return;
    }

    partComplete.classList.remove('show');
    partComplete.classList.add('hide');

    partInfo.classList.remove('hide');
    partInfo.classList.add('show');
}

function addPrefixZero(inputElem) {
    const inputValue = inputElem.value;

    if (inputValue.length < 2) return '0' + inputValue;

    return inputValue;
}

function hideErrors(inputElem) {
    const errorWrapper = inputElem.closest('.input-group').querySelector('.error-wrapper');

    errorWrapper.classList.remove('show');
    inputElem.classList.remove('error');
}

function showErrors(inputElem) {
    const errorWrapper = inputElem.closest('.input-group').querySelector('.error-wrapper');
    loadValidationError();
    errorWrapper.classList.add('show');
    inputElem.classList.add('error');

    function loadValidationError() {
        const spanError = errorWrapper.querySelector('span');
        for (key in validationMessages) {
            if (key == inputElem.id) {
                spanError.innerText = validationMessages[key];
                return;
            }
        }
    }
}

function isValidInput(userInput, inputPattern) {
    if (inputPattern.test(userInput)) {
        return true;
    }

    return false;
}

function setCardValue(inputElem, outputElem) {
    const inputValue = inputElem.value;

    if (inputValue.length == 0) {
        setDefaultValue();
        hideErrors(inputElem);
        return;
    }

    outputElem.innerText = inputValue;

    function setDefaultValue() {
        const elemId = inputElem.id;

        for (const key in defaultValues) {
            if (key == elemId) {
                outputElem.innerText = defaultValues[key];
                return;
            }
        }
    }
}