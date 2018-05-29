var localStorage

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage
  localStorage = new LocalStorage('./scratch');
}

function weekBeginDate(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay() + 1)
}

export class ActiveDaysPerWeekCounter {

  constructor(settingKey = 'active_days') {
    this.settingKey = settingKey
  }

  reset() {
    this.setSessionBeginDate(null)
    this.setLastResult(null)
    this.setLastResultMadeDate(null)
  }

  startNewSessionIfNoExistingOne() {
    if (this.getSessionBeginDate() != null) {
      return false
    }
    this.startSession(new Date())
    return true
  }

  startSession(date) {
    this.setSessionBeginDate(weekBeginDate(date))
    this.setLastResult(null)
    this.setLastResultMadeDate(null)
  }

  commit(accessDate) {
    const beginDate = this.getSessionBeginDate()
    if (!beginDate) {
      throw new Error('You did not start a session')
    }
    if (accessDate < beginDate) {
      throw new Error('The incoming date is before the week.')
    }
    if (accessDate - beginDate > 7 * 24 * 60 * 60 * 1000) {
      throw new Error('The incoming date is not in the week. Please start a new session.')
    }

    const lastResultMadeDate = this.getLastResultMadeDate()
    const lastResult = this.getLastResult()

    if (!lastResultMadeDate || !lastResult) {
      this.setLastResultMadeDate(accessDate)
      this.setLastResult(1)
      return 1
    }

    if (accessDate < lastResultMadeDate) {
      throw new Error('The incoming date is before the week')
    }

    if (lastResultMadeDate.getDate() === accessDate.getDate()) {
      return 0
    }

    let newResult = lastResult + 1
    this.setLastResult(newResult)
    this.setLastResultMadeDate(accessDate)
    return newResult
  }

  sessionBeginDateKey() {
    return this.settingKey + '-sessionBegin'
  }
  getSessionBeginDate() {
    let item = localStorage.getItem(this.sessionBeginDateKey())
    if (item) {
      return new Date(item)
    }
  }
  setSessionBeginDate(newDate) {
    let key = this.sessionBeginDateKey()
    if (newDate) {
      localStorage.setItem(key, newDate)
    } else {
      localStorage.removeItem(key)
    }
  }

  lastResultKey() {
    return this.settingKey + '-lastResult'
  }
  getLastResult() {
    return parseInt(localStorage.getItem(this.lastResultKey()))
  }
  setLastResult(lastResult) {
    let key = this.lastResultKey()
    if (lastResult) {
      localStorage.setItem(key, lastResult)
    } else {
      localStorage.removeItem(key)
    }
  }

  lastResultMadeDateKey() {
    return this.settingKey + '-lastDate'
  }
  getLastResultMadeDate() {
    let item = localStorage.getItem(this.lastResultMadeDateKey())
    if (item) {
      return new Date(item)
    }
  }
  setLastResultMadeDate(lastResultMadeDate) {
    let key = this.lastResultMadeDateKey()
    if (lastResultMadeDate) {
      localStorage.setItem(key, lastResultMadeDate)
    } else {
      localStorage.removeItem(key)
    }
  }
}