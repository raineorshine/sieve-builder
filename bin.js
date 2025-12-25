#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const sieve = require('./index')
const filename = process.argv[2] || 'filters.js'
const filters = require(path.resolve(filename))

// Extract header and MultiRule from index.js
const { Header, MultiRule } = require('./index')

// Generate individual rules without header
const rules = filters.map(MultiRule)

const MAX_FILE_SIZE = 50000 // 50k characters
const outDir = path.join(__dirname, 'out')

// Ensure out directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true })
}

// Split rules into chunks that fit within the size limit
const files = []
let currentFileContent = Header
let currentFileRules = []
let fileIndex = 1

for (const rule of rules) {
  const potentialContent = currentFileContent + rule + '\n'

  if (potentialContent.length > MAX_FILE_SIZE && currentFileRules.length > 0) {
    // Save current file and start a new one
    const outputFile = path.join(outDir, `${fileIndex}.sieve.txt`)
    fs.writeFileSync(outputFile, currentFileContent)
    files.push(outputFile)

    // Start new file with header
    fileIndex++
    currentFileContent = Header + rule + '\n'
    currentFileRules = [rule]
  } else {
    // Add rule to current file
    currentFileContent = potentialContent
    currentFileRules.push(rule)
  }
}

// Write the last file if there are remaining rules
if (currentFileRules.length > 0) {
  const outputFile = path.join(outDir, `${fileIndex}.sieve.txt`)
  fs.writeFileSync(outputFile, currentFileContent)
  files.push(outputFile)
}

console.info(`Sieve script split into 50k chunks and written to ./out:`)
files.forEach(file => console.info(`  ${path.basename(file)}`))
