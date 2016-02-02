"use strict";

/**
 * Modules
 */

var isGeneratorObject = require('@f/is-generator-object')
var isGenerator = require('@f/is-generator')

/**
 * Expose flatten
 */

module.exports = flatten['default'] = flatten

/**
 * Flatten nested generators
 * @param  {Generator} gen
 * @param  {Boolean} tail  whether to yield the return value as well
 * @return {Generator}
 */

function flatten (gen, tail) {
  var self = this
  return function * () {
    let it = isGeneratorObject(gen) ? gen : gen.apply(self, arguments)
    let next = it.next()
    let arg
    while (!next.done) {
      try {
        if (isGeneratorObject(next.value) || isGenerator(next.value)) {
          arg = yield yield* flatten.call(self, next.value)(arg)
        } else {
          arg = yield next.value
        }
        next = it.next(arg)
      } catch (e) {
        next = it.throw(e)
      }
    }
    if (tail && (isGeneratorObject(next.value) || isGenerator(next.value))) {
      return yield* flatten.call(self, next.value, tail)(arg)
    } else {
      return next.value
    }
  }
}
