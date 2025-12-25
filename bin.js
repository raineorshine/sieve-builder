#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const sieve = require('./index')
const filename = process.argv[2] || 'filters.js'
const filters = require(path.resolve(filename))
const output = sieve(filters)

// Ensure out directory exists
const outDir = path.join(__dirname, 'out')
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

// Write output to file
const outputFile = path.join(outDir, '1.sieve.txt')
fs.writeFileSync(outputFile, output)
console.info(`Sieve script written to ${outputFile}`)
