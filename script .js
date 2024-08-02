
const inputSlider = document.querySelector("[data-LengthSlider]");
const lengthDisplay = document.querySelector("[data-LengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generatorBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll('input[type=checkbox]');
const symbols = '~`!@{#$<%^&*)_\®-}[©|:;?¶]/>,.(+="';

let password = "";
let passwordLength = 10;
let checkCount = 0;

// Set initial indicator color to grey
setIndicator("#ccc");

// Set initial password length
handleSlider();

function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerHTML = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%";
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    // Uncomment below line if needed for shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0, 9);
}

function generateLowerCase() {
    return String.fromCharCode(getRndInteger(97, 123));
}

function generateUpperCase() {
    return String.fromCharCode(getRndInteger(65, 91));
}

function generateSymbol() {
    const randomNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randomNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0"); // Strong
    } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
        setIndicator("#ff0"); // Medium
    } else {
        setIndicator("#f00"); // Weak
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "Copied Success";
        
        // 3 seconds ke baad message ko chhupane ke liye
        setTimeout(() => {
            copyMsg.innerText = "";
        }, 1500); // 2 seconds delay
    } catch (e) {
        copyMsg.innerText = "Failed";
    }
    
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 2000);
}

function shufflePassword(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if (checkbox.checked) {
            checkCount++;
        }
    });

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click', () => {
    if (passwordDisplay.value) copyContent();
});

generatorBtn.addEventListener('click', () => {
    if (checkCount == 0) return;

    if (passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    password = "";
    let funcArr = [];

    if (uppercaseCheck.checked) funcArr.push(generateUpperCase);
    if (lowercaseCheck.checked) funcArr.push(generateLowerCase);
    if (numberCheck.checked) funcArr.push(generateRandomNumber);
    if (symbolCheck.checked) funcArr.push(generateSymbol);

    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }

    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getRndInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    passwordDisplay.value = password;
    calcStrength();
});
