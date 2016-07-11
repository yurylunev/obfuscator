/**
 * Created by xaLT on 03.07.16.
 */

var firstLetters,
  nextLetters,
  mainBase,
  firstLetterBase;

firstLetters = 'abcdefghijklmnopqrstuvwxyz';
nextLetters = firstLetters + '0123456789-_';
firstLetters = firstLetters.split('');
nextLetters = nextLetters.split('');
mainBase = nextLetters.length; // 38 по умолчанию
firstLetterBase = firstLetters.length; // 26 по умолчанию

function f(number, base) {
  "use strict";
  if (number < base) {
    return number;
  }
  if (Math.floor(number / base) < base) {
    return [(number % base), (Math.floor(number / base)) - 1];
  }
  return [(number % base), f(Math.floor(number / base) - 1, base)];
}


function _decompose(largeInteger) {
  var setOfSmallIntegers = [];
  var a = Math.floor((largeInteger - this._firstLetterBase) / this._firstLetterBase);

  function modulo(dividend, divisor) {
    var b = Math.floor(dividend / divisor);
    if (dividend < divisor) {
      return dividend;
    }
    if (b < divisor) {
      return [(dividend % divisor), b - 1];
    }
    return [(dividend % divisor), modulo(b - 1, divisor)];
  }

  if (largeInteger < this._firstLetterBase) {
    setOfSmallIntegers.push(largeInteger);
  } else {
    setOfSmallIntegers.push(largeInteger % this._firstLetterBase);
    if (a < this._mainBase) {
      setOfSmallIntegers.push(a);
    } else {
      setOfSmallIntegers.push(modulo(a, this._mainBase));
    }
  }

  return setOfSmallIntegers;
}


function encodeNumber(number) {
  "use strict";
  var digits = [];
  if (number < firstLetterBase) {
    digits.push(number);
  } else {
    digits.push(number % firstLetterBase);
    if (Math.floor((number - firstLetterBase) / firstLetterBase) < mainBase) {
      digits.push(Math.floor((number - firstLetterBase) / firstLetterBase));
    } else {
      digits.push(f(Math.floor((number - firstLetterBase) / firstLetterBase), mainBase));
    }
  }
  return digits.toString().split(',');
}

for (var j = 0; j < 1500; j++) {
  var r = encodeNumber(j);
  // var ne = r.map((a)=> {
  //     if (a) return nextLetters[a];
  //     else return firstLetters[a];
  // });
  console.log(r);
}
console.log(Array.isArray(r));