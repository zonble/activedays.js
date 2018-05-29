import {
  ActiveDaysPerWeekCounter
}
from './ActiveDaysPerWeekCounter'

import {
  expect
} from 'chai'


describe('ActiveDays', function () {
  it('should be resetted', function () {
    let counter = new ActiveDaysPerWeekCounter('com.kkbox.activedays')
    counter.reset()
    expect(counter.startNewSessionIfNoExistingOne()).to.equal(true)
    expect(counter.startNewSessionIfNoExistingOne()).to.equal(false)
  })

  it('should raise an error if there is no session', function () {
    let counter = new ActiveDaysPerWeekCounter('com.kkbox.activedays')
    counter.reset()
    expect(counter.commit.bind(counter, new Date())).to.throw(Error)
  })

  it('should raise an error when passing an old date', function () {
    let counter = new ActiveDaysPerWeekCounter('com.kkbox.activedays')
    counter.reset()
    counter.startSession(new Date(2018, 4, 9, 1, 2, 3))
    expect(counter.commit.bind(counter, new Date(2018, 3, 15, 1, 2, 3))).to.throw(Error)
  })

  it('should ask for a new session when passing a larger date', function () {
    let counter = new ActiveDaysPerWeekCounter('com.kkbox.activedays')
    counter.reset()
    counter.startSession(new Date(2018, 4, 9, 1, 2, 3))
    expect(counter.commit.bind(counter, new Date(2018, 5, 15, 1, 2, 3))).to.throw(Error)
  })

  it('should return 1', function () {
    let counter = new ActiveDaysPerWeekCounter('com.kkbox.activedays')
    counter.reset()
    counter.startSession(new Date(2018, 4, 9, 1, 2, 3))
    expect(counter.commit(new Date(2018, 4, 9, 1, 2, 3))).to.equal(1)
    expect(counter.commit(new Date(2018, 4, 9, 2, 2, 3))).to.equal(0)
  })

  it('should return 2', function () {
    let counter = new ActiveDaysPerWeekCounter('com.kkbox.activedays')
    counter.reset()
    counter.startSession(new Date(2018, 4, 9, 1, 2, 3))
    expect(counter.commit(new Date(2018, 4, 9, 1, 2, 3))).to.equal(1)
    expect(counter.commit(new Date(2018, 4, 11, 2, 2, 3))).to.equal(2)
    expect(counter.commit(new Date(2018, 4, 11, 8, 2, 3))).to.equal(0)
  })

  it('should return 3', function () {
    let counter = new ActiveDaysPerWeekCounter('com.kkbox.activedays')
    counter.reset()
    counter.startSession(new Date(2018, 4, 9, 1, 2, 3))
    expect(counter.commit(new Date(2018, 4, 9, 1, 2, 3))).to.equal(1)
    expect(counter.commit(new Date(2018, 4, 11, 2, 2, 3))).to.equal(2)
    expect(counter.commit(new Date(2018, 4, 13, 2, 2, 3))).to.equal(3)
    expect(counter.commit.bind(counter, new Date(2018, 4, 14, 1, 2, 3))).to.throw(Error)
  })
})