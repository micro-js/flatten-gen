
# flatten-gen

[![Build status][travis-image]][travis-url]
[![Git tag][git-image]][git-url]
[![NPM version][npm-image]][npm-url]
[![Code style][standard-image]][standard-url]

Flatten a generator.

## Installation

    $ npm install @f/flatten-gen

## Usage

```js
var flatten = require('@f/flatten-gen')

let it = flatten(nested)()

// 1
it.next()
// 2
it.next()

function * nested () {
  yield 1
  yield two()
}

function * two () {
  yield 2
}
```

## API

### flattenGen(gen, tail)

- `gen` - nested generator to flatten
- `tail` - whether to yield the return values if they are generators

**Returns:** a flattened generator

## License

MIT

[travis-image]: https://img.shields.io/travis/micro-js/flatten-gen.svg?style=flat-square
[travis-url]: https://travis-ci.org/micro-js/flatten-gen
[git-image]: https://img.shields.io/github/tag/micro-js/flatten-gen.svg
[git-url]: https://github.com/micro-js/flatten-gen
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat
[standard-url]: https://github.com/feross/standard
[npm-image]: https://img.shields.io/npm/v/@f/flatten-gen.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@f/flatten-gen
