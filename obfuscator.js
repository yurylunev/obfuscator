/**
 * @param {Array} data – массив CSS классов
 */

class ClassName {
  constructor(data) {
    this._firstLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
    this._nextLetters = 'abcdefghijklmnopqrstuvwxyz0123456789-_'.split('');
    this._mainBase = this._nextLetters.length;
    this._firstLetterBase = this._firstLetters.length;
    this.newClassesCount = 0;
    this._initData(data);
    this._initSetOfCodes();
    this._mergeData();
  }

  get names() {
    var data = {};
    this._data.forEach((row)=> {
      data[row.oldName] = row.newName;
    });
    return data;
  }

  _initSetOfCodes() {
    this._setOfCodes = [];
    for (var i = 0; i < this.newClassesCount; i++) {
      this._setOfCodes.push(this._decompose(i));
    }
  }

  _decompose(largeInteger) {
    var setOfSmallIntegers = [];
    var r = [];
    var n = 0;
    var sum = 0;
    while (largeInteger >= sum) {
      sum += this._firstLetterBase * Math.pow(this._mainBase, n++);
    }
    r.push(largeInteger);
    for (var i = 0; i < n; i++) {
      if (!i) {
        r.push(Math.floor(r[i] / this._firstLetterBase) - 1);
        setOfSmallIntegers.push(r[i] % this._firstLetterBase);
      } else {
        r.push(Math.floor(r[i] / this._mainBase) - 1);
        setOfSmallIntegers.push(r[i] % this._mainBase);
      }
    }
    return setOfSmallIntegers;
  }

  _initData(data) {
    if (Array.isArray(data)) {
      this._data = {};
      this.newClassesCount = 0;
      this.error = 'Нет ошибок.';
      data.forEach((className) => {
        if (this._data.hasOwnProperty(className)) {
          this._data[className]['times']++;
        } else {
          this._data[className] = {};
          this._data[className]['times'] = 1;
          this.newClassesCount++;
        }
      });
    } else {
      this.error = "Ошибка: некорректно задан входной массив классов";
    }
  }

  _mergeData() {
    var data = [];
    var j = 0;
    for (var className in this._data) {
      if (this._data.hasOwnProperty(className)) {
        data.push({oldName: className, position: j++, times: this._data[className].times});
      }
    }
    data.sort((a, b)=> b.times - a.times);
    for (var i = 0; i < this.newClassesCount; i++) {
      data[i]['newName'] = (this._setOfCodes[i].map((code)=> this._nextLetters[parseInt(code)])).join('');
    }
    data.sort((a, b)=> a.position - b.position);
    this._data = data;
  }
}

module.exports = function (data) {
  var newClass = new ClassName(data);
  return newClass.names;
};