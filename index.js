const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

let id = 1

class Promise {
  constructor(resolver) {
    this.id = id++
    this.status = PENDING
    this.value = ''
    this.onFulfilledCallback = []
    this.onRejectedCallback = []
    resolver(this.resolve.bind(this), this.reject.bind(this))
  }

  resolve(value) {
    setTimeout(() => {
      if (this.status === PENDING) {
        // console.log('resolve')
        this.status = FULFILLED
        this.value = value
        this.onFulfilledCallback && this.onFulfilledCallback.forEach(callback => callback(value))
      } else {
        console.log("status can't be changed to success!")
      }
    }, 0)
  }

  reject(value) {
    setTimeout(() => {
      if (this.status === PENDING) {
        // console.log('reject')
        this.status = REJECTED
        this.value = value
        this.onRejectedCallback && this.onRejectedCallback.forEach(callback => callback(value))
      } else {
        console.log("status can't be changed to failure!")
      }
    }, 0)
  }

  then(onFulfilled, onRejected) {
    // console.log(this.id)
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : value => value
    onRejected = typeof onRejected === "function" ? onRejected : reason => reason

    return new Promise((resolve, reject) => {
      this.onFulfilledCallback.push(this.processThen(onFulfilled, resolve, reject))
      this.onRejectedCallback.push(this.processThen(onRejected, resolve, reject))
    })
  }

  processThen(callback, resolve, reject) {
    return value => {
      const nextValue = callback(value)
      if (nextValue instanceof Promise) {
        nextValue.then(val => resolve(val), reason => reject(reason))
      } else {
        resolve(nextValue)
      }
    }
  }

  finally(callback) {
    return this.then(
      value => Promise.resolve(callback()).then(() => value),
      reason => Promise.resolve(callback()).then(() => { throw reason })
    )
  }

  static promiseStatus(length, resolve) {
    values = []
    return (value, index) => {
      values[index] = value
      if (values.length === length) {
        resolve(values)
      }
    }
  }

  static Resolve(value) {
    return new Promise(resolve => resolve(value))
  }

  static Reject(value) {
    return new Promise((resolve, reject) => reject(value))
  }

  static all(promises) {
    return new Promise((resolve, reject) => {
      const done = Promise.promiseStatus(1, resolve)
      promises.forEach((promise, index) => {
        promise.then(value => {
          done(value, index)
        }, reject)
      })
    })
  }

  static race(promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve, reject)
      })
    })
  }
}

// console.log(1)
new Promise((resolve, reject) => { reject(1) })
  .then(function (value) {
    console.log(value)
    return 'suceess'
  }, function (reason) {
    console.log(reason)
    // return 'failed'
    return new Promise((resolve, reject) => { reject('demacia1') })
  })
  .then(function (value) {
    console.log(value)
    // return 'suceess1'
    return new Promise(resolve => { resolve('demacia2') })
  }, function (reason) {
    console.log(reason)
    return 'failed1'
  })
  .then(function (value) {
    console.log(value)
  }, function (reason) {
    console.log(reason)
  })
