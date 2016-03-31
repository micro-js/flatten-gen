"use strict";

/**
 * Imports
 */

var flatten = require('../src')
var test = require('tape')

/**
 * Tests
 */

test('should handle no yield', (t) => {
  let it = flatten(justReturn)()
  let next = it.next()
  t.equal(next.value, 'foo')
  t.equal(next.done, true)
  t.end()

  function * justReturn () {
    return 'foo'
  }

})

test('should handle only yield', (t) => {
  let it = flatten(justYield)()
  let next = it.next()
  t.equal(next.value, 'foo')
  t.equal(next.done, false)
  next = it.next()
  t.equal(next.value, undefined)
  t.equal(next.done, true)
  t.end()

  function * justYield () {
    yield 'foo'
  }
})

test('should catch errors', (t) => {
  let it = flatten(error)()
  let next = it.next()
  t.equal(next.value, 'foo')
  next = it.throw(new Error('test'))
  t.equal(next.value, 'bar')
  t.end()
  function * error () {
    try {
      yield 'foo'
    } catch (e) {
      yield 'bar'
    }
  }
})

test('should yield proper values', (t) => {
  let it = flatten(yieldIn)('in')

  t.equal(it.next().value, 'in')
  t.equal(it.next('foo').value, 'foo')

  let next = it.next('bar')
  t.equal(next.value, 'bar')
  t.equal(next.done, true)

  t.end()


})

test('should be equaivalent to iterator', (t) => {
 checkItEqual(t, flatten(yieldIn)('in'), yieldIn('in'), [undefined, 'foo', 'bar'])
 t.end()
})

function checkItEqual(t, it1, it2, ins) {
  let val1
  let val2
  let i = 0
  do {
     val1 = it1.next(ins[i])
     val2 = it2.next(ins[i])
     t.deepEqual(val1, val2)
     i++
  } while (!val1.done)
}


function * yieldIn(input) {
  let res = yield input
  res = yield res
  return res
}

test('should flatten', (t) => {

  let it = flatten(parent)()

  t.equal(it.next().value, 'parent start')
  t.equal(it.next().value, 'child 1')
  t.equal(it.next().value, 'child 2')
  t.equal(it.next().value, 'parent end')

  t.end()

  function * child1 () {
    yield 'child 1'
  }

  function * child2 () {
    yield 'child 2'
    return 'hello'
  }

  function * parent () {
    yield 'parent start'
    yield child1()
    t.equal(yield child2(), 'hello')
    yield 'parent end'
  }
})

test('should handle deply nested and yield *s', (t) => {
  let it = flatten(actions)('foo', 'bar')

  // * action 1 yield
  t.deepEqual(it.next().value, {
    type: 'ACTION_1',
    payload: {
      opt1: 'foo',
      opt2: 'bar'
    }
  })
  // * action 1 res
  t.equal(it.next({res: 200}).value, undefined)
  // action 1 internal yield
  t.deepEqual(it.next().value, {
    type: 'ACTION_1',
    payload: {
      opt1: 'foo',
      opt2: 'bar'
    }
  })
  // action 1 yield
  t.ok(it.next().value === undefined, 'action 1 done')

  // * action 2 yield 1
  t.deepEqual(it.next().value, {
    type: 'ASYNC',
    payload: 'foo'
  })
  // * action 2 yield 2
  t.deepEqual(it.next('bat').value, {
    type: 'ACTION_2',
    payload: {
      async: 'bat'
    }
  })
  // * action 2 return
  t.deepEqual(it.next().value,  'hello')

  t.deepEqual(it.next().value, {
    type: 'ASYNC',
    payload: 'foo'
  })

  // action 2 yield
  t.deepEqual(it.next('bat').value, {
    type: 'ACTION_2',
    payload: {
      async: 'bat'
    }
  })
  // action 2 res
  let next = it.next({res: 200})
  t.deepEqual(next.value, 'hello')
  t.equal(next.done, true)

  t.end()

  function * actions (opt1, opt2) {
    let res
    res = yield * action1(opt1, opt2)
    yield res
    res = yield action1(opt1, opt2)
    yield res
    res = yield * action2(opt1, opt2)
    yield res
    res = yield action2(opt1, opt2)
    return res
  }

  function * action1 (opt1, opt2) {
    yield {
      type: 'ACTION_1',
      payload: {
        opt1: opt1,
        opt2: opt2
      }
    }
  }

  function * action2 (opt1, opt2) {
    yield {
      type: 'ACTION_2',
      payload: {
        async: yield async(opt1, opt2)
      }
    }
    return 'hello'
  }

  function * async(opt1, opt2) {
    let res = yield {
      type: 'ASYNC',
      payload: opt1
    }
    return res
  }
})
