"use strict";
window.addEventListener('load', onLoad);
const SMALL_NUMS = [
    '',
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    'eleven',
    'twelve',
    'thirteen',
    'fourteen',
    'fifteen',
    'sixteen',
    'seventeen',
    'eighteen',
    'nineteen'
];
const PREFIXES = [
    'twenty',
    'thirty',
    'fourty',
    'fifty',
    'sixty',
    'seventy',
    'eighty',
    'ninety'
];
const THIRD_ORDERS = [
    '',
    ' thousand',
    ' million',
    ' billion',
    ' trillion',
    ' quadrillion',
    ' quintillion',
    ' sextillion',
    ' septillion',
    ' octillion',
    ' nonillion',
    ' decillion'
];
const FRACTIONAL_PREFIXES = [
    '',
    'ten',
    'hundred'
];
function onLoad() {
    let numeral_input = document.getElementById('numeral');
    if (numeral_input != null) {
        numeral_input.addEventListener('change', numeralChange);
    }
    else {
        console.log('ERROR: Could not find numeral element!');
    }
}
function numeralChange(ev) {
    let input = this.value;
    let numeral = makeValidNumeral(input);
    if (numeral == null) {
        setEnglish('Invalid numeral');
        return;
    }
    let negative = negativePortion(numeral);
    let integers = integerPortion(numeral);
    if (integers == null) {
        setEnglish('Invalid numeral');
        return;
    }
    let decimals = decimalPortion(numeral);
    if (decimals == null) {
        setEnglish('Invalid numeral');
        return;
    }
    if (decimals !== '') {
        if (integers === 'zero') {
            integers = '';
        }
        else if (integers !== '') {
            integers += ' and ';
        }
    }
    else if (integers === 'zero') {
        negative = '';
    }
    setEnglish(negative + integers + decimals);
}
function setEnglish(engl) {
    let engl_el = document.getElementById('english');
    if (engl_el == null) {
        console.log('ERROR: Could not find english element!');
        return;
    }
    engl_el.innerHTML = engl;
}
function makeValidNumeral(s) {
    let matches = s.trim().match(/^-?\d*\.?\d*/);
    if (matches == null || matches[0] === '') {
        return null;
    }
    s = matches[0];
    if (s.search(/\d/g) === -1) {
        return null;
    }
    return s;
}
function negativePortion(numeral) {
    return numeral[0] === '-' ? 'negative ' : '';
}
function integerPortion(numeral) {
    let start = numeral.indexOf('-') + 1;
    let end = numeral.indexOf('.');
    if (end === -1) {
        end = numeral.length;
    }
    let integers = removeExtraLeadingZeros(numeral.slice(start, end));
    if (integers === '0') {
        return 'zero';
    }
    return convertDigits(integers);
}
function convertGroup(group, thirdOrder) {
    if (group === '000') {
        return '';
    }
    let num = parseInt(group);
    let engl;
    if (num < 20) {
        engl = SMALL_NUMS[num];
    }
    else if (num < 100) {
        engl = PREFIXES[parseInt(group[0]) - 2];
        if (group[1] !== '0') {
            engl += '-' + SMALL_NUMS[parseInt(group[1])];
        }
    }
    else {
        engl = SMALL_NUMS[parseInt(group[0])] + ' hundred';
        let remainder_engl = convertRemainder(group.slice(1));
        if (remainder_engl !== '') {
            engl += ' ' + remainder_engl;
        }
    }
    engl += THIRD_ORDERS[thirdOrder];
    return engl;
}
function convertRemainder(remainder) {
    let num = parseInt(remainder);
    let engl;
    if (num < 20) {
        engl = SMALL_NUMS[num];
    }
    else {
        engl = PREFIXES[parseInt(remainder[0]) - 2];
        if (remainder[1] !== '0') {
            engl += '-' + SMALL_NUMS[parseInt(remainder[1])];
        }
    }
    return engl;
}
function removeExtraLeadingZeros(integers) {
    for (let i = 0; i < integers.length; ++i) {
        if (integers[i] !== '0') {
            return integers.slice(i);
        }
    }
    return '0';
}
function decimalPortion(numeral) {
    let decimal = numeral.indexOf('.');
    if (decimal === -1) {
        return '';
    }
    let start = decimal + 1;
    // set start to the first non-zero digit after the decimal point
    for (; start < numeral.length; ++start) {
        let num = parseInt(numeral[start]);
        if (isNaN(num)) {
            return '';
        }
        if (num !== 0) {
            let end = start + 1;
            for (let i = end; i < numeral.length; ++i) {
                num = parseInt(numeral[i]);
                if (isNaN(num)) {
                    break;
                }
                if (num !== 0) {
                    end = i + 1;
                }
            }
            return convertDecimalDigits(numeral.slice(start, end), end - decimal - 1);
        }
    }
    return '';
}
function convertDigits(digits) {
    if (digits.length > 36) {
        return null;
    }
    let thirdOrder = Math.floor(digits.length / 3);
    let remainder = digits.length % 3;
    let engl = '';
    if (remainder !== 0) {
        engl += convertRemainder(digits.slice(0, remainder));
        engl += THIRD_ORDERS[thirdOrder];
    }
    for (let i = 0; i < thirdOrder; ++i) {
        let start = remainder + i * 3;
        let group = convertGroup(digits.slice(start, start + 3), thirdOrder - i - 1);
        if (engl !== '' && group !== '') {
            engl += ' ';
        }
        engl += group;
    }
    return engl;
}
function convertFractionPlace(place) {
    return FRACTIONAL_PREFIXES[place % 3] +
        THIRD_ORDERS[Math.floor(place / 3)] + 'th';
}
function convertDecimalDigits(digits, place) {
    let engl = convertDigits(digits);
    if (engl == null) {
        return null;
    }
    engl += ' ' + convertFractionPlace(place);
    if (digits.length !== 1 || digits[0] !== '1') {
        engl += 's';
    }
    return engl;
}
