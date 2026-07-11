const fs = require('fs')
const sieve = require('./index')
const sampleFilters = require('./filters.sample.js')

const readmeTemplate = fs.readFileSync('README-template.md', 'utf-8')
const sampleFiltersText = fs.readFileSync('filters.sample.js', 'utf-8')

const readme = readmeTemplate.replace('${filters}', () => sampleFiltersText.trim()).replace('${output}', () => sieve(sampleFilters).trim())

fs.writeFileSync('README.md', readme)
