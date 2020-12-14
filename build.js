const fs = require('fs')
const _ = require('lodash')
const sieve = require('./index')
const sampleFilters = require('./filters.sample.js')

const readmeTemplate = fs.readFileSync('README-template.md', 'utf-8')
const sampleFiltersText = fs.readFileSync('filters.sample.js', 'utf-8')

const readme = _.template(readmeTemplate)({
  filters: sampleFiltersText.trim(),
  output: sieve(sampleFilters).trim(),
})

fs.writeFileSync('README.md', readme)
