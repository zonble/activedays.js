'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var localStorage;

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

function weekBeginDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1);
}

var ActiveDaysPerWeekCounter = exports.ActiveDaysPerWeekCounter = function () {
  function ActiveDaysPerWeekCounter() {
    var settingKey = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'active_days';

    _classCallCheck(this, ActiveDaysPerWeekCounter);

    this.settingKey = settingKey;
  }

  _createClass(ActiveDaysPerWeekCounter, [{
    key: 'reset',
    value: function reset() {
      this.setSessionBeginDate(null);
      this.setLastResult(null);
      this.setLastResultMadeDate(null);
    }
  }, {
    key: 'startNewSessionIfNoExistingOne',
    value: function startNewSessionIfNoExistingOne() {
      if (this.getSessionBeginDate() != null) {
        return false;
      }
      this.startSession(new Date());
      return true;
    }
  }, {
    key: 'startSession',
    value: function startSession(date) {
      this.setSessionBeginDate(weekBeginDate(date));
      this.setLastResult(null);
      this.setLastResultMadeDate(null);
    }
  }, {
    key: 'commit',
    value: function commit(accessDate) {
      var beginDate = this.getSessionBeginDate();
      if (!beginDate) {
        throw new Error('You did not start a session');
      }
      if (accessDate < beginDate) {
        throw new Error('The incoming date is before the week.');
      }
      if (accessDate - beginDate > 7 * 24 * 60 * 60 * 1000) {
        throw new Error('The incoming date is not in the week. Please start a new session.');
      }

      var lastResultMadeDate = this.getLastResultMadeDate();
      var lastResult = this.getLastResult();

      if (!lastResultMadeDate || !lastResult) {
        this.setLastResultMadeDate(accessDate);
        this.setLastResult(1);
        return 1;
      }

      if (accessDate < lastResultMadeDate) {
        throw new Error('The incoming date is before the week');
      }

      if (lastResultMadeDate.getDate() === accessDate.getDate()) {
        return 0;
      }

      var newResult = lastResult + 1;
      this.setLastResult(newResult);
      this.setLastResultMadeDate(accessDate);
      return newResult;
    }
  }, {
    key: 'sessionBeginDateKey',
    value: function sessionBeginDateKey() {
      return this.settingKey + '-sessionBegin';
    }
  }, {
    key: 'getSessionBeginDate',
    value: function getSessionBeginDate() {
      var item = localStorage.getItem(this.sessionBeginDateKey());
      if (item) {
        return new Date(item);
      }
    }
  }, {
    key: 'setSessionBeginDate',
    value: function setSessionBeginDate(newDate) {
      var key = this.sessionBeginDateKey();
      if (newDate) {
        localStorage.setItem(key, newDate);
      } else {
        localStorage.removeItem(key);
      }
    }
  }, {
    key: 'lastResultKey',
    value: function lastResultKey() {
      return this.settingKey + '-lastResult';
    }
  }, {
    key: 'getLastResult',
    value: function getLastResult() {
      return parseInt(localStorage.getItem(this.lastResultKey()));
    }
  }, {
    key: 'setLastResult',
    value: function setLastResult(lastResult) {
      var key = this.lastResultKey();
      if (lastResult) {
        localStorage.setItem(key, lastResult);
      } else {
        localStorage.removeItem(key);
      }
    }
  }, {
    key: 'lastResultMadeDateKey',
    value: function lastResultMadeDateKey() {
      return this.settingKey + '-lastDate';
    }
  }, {
    key: 'getLastResultMadeDate',
    value: function getLastResultMadeDate() {
      var item = localStorage.getItem(this.lastResultMadeDateKey());
      if (item) {
        return new Date(item);
      }
    }
  }, {
    key: 'setLastResultMadeDate',
    value: function setLastResultMadeDate(lastResultMadeDate) {
      var key = this.lastResultMadeDateKey();
      if (lastResultMadeDate) {
        localStorage.setItem(key, lastResultMadeDate);
      } else {
        localStorage.removeItem(key);
      }
    }
  }]);

  return ActiveDaysPerWeekCounter;
}();