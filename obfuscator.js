/**
 * @description Класс объектов, которые обфусцируют CSS классы из массива data
 * @param {Array} data – массив CSS классов
 */
class ClassName {
  constructor(data) {
    this._firstLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');            // Алфавит первых букв в названии нового класса
    this._nextLetters = 'abcdefghijklmnopqrstuvwxyz0123456789-_'.split(''); // Алфавит непервых букв в названии нового класса
    this._mainBase = this._nextLetters.length;      // Количество непервых букв в названии нового класса
    this._firstLetterBase = this._firstLetters.length; // Количество первых букв в названии нового класса
    this.newClassesCount = 0;   // Общее количество классов, получившееся после минимизации
    this._initData(data);       // Метод первичной инициализации массива data
    this._initSetOfCodes();
    this._mergeData();
  }

  /**
   * @description Метод возвращающий объект с минимизированными и обфусцированными классами
   * @returns {Object}
   */
  get names() {
    var data = {};
    if (!this.error.message) {
      this._data.forEach((row)=> {
        data[row.oldName] = row.newName;
      });
      return data;
    } else {
      return this.error
    }
  }

  /**
   * @description Генератор массива числовых кодов для создания новых имён классов.
   * Метод генерирует от 0 до максимального числа классов, получившихся после минимизации,
   * с помощью метода _decompose.
   *
   */
  _initSetOfCodes() {
    this._setOfCodes = [];
    for (var i = 0; i < this.newClassesCount; i++) {
      this._setOfCodes.push(this._decompose(i));
    }
  }

  /**
   * @description Метод, раскладывающий входное число в набор чисел, особенностью которых является то,
   * что первое число кодирует первую букву (значение не должно превышать _firstLetterBase),
   * а второе и далее кодирует остальные буквы (значение не должно превышать _mainBase).
   * @param largeInteger
   * @returns {Array}
   */
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

  /**
   * @param data
   * @description Минимизация массива классов путём создания объекта с ключами в виде названий
   * и подсчетом их частоты. Также, считается общее количество уникальных классов - newClassesCount
   */
  _initData(data) {
    if (Array.isArray(data)) {
      this._data = {};
      this.newClassesCount = 0;
      this.error = {message: null};
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
      this.error = {message: "Ошибка: некорректно задан входной массив классов"};
    }
  }

  /**
   * @description Совмещение массива кодов с минимизированным набором классов, и придание буквенных имён классам
   *
   */
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