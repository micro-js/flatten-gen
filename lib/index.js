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
 * @return {Generator}
 */

function flatten (gen) {
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
    return next.value
  }
}
