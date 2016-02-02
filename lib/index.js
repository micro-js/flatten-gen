"use strict";

/**
 * Modules
 */

var isGeneratorObject = require('@f/is-generator-object')
var slice = require('@f/slice')


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
    let it = isGeneratorObject(gen) ? gen : gen.apply(self, slice(arguments))
    let next = it.next()
    let arg
    while (!next.done) {
      try {
        if (isGeneratorObject(next.value)) {
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
