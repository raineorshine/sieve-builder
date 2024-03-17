#!/usr/bin/env node
const path = require('path')
const sieve = require('./index')
const filename = process.argv[2]
const filters = require(path.resolve(filename))
const output = sieve(filters)
console.info(output)
