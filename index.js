/** Render functions */

const Header = `require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];

# do not run script on spam messages
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "$\{1}") {
    return;
}

`

const Action = ({ fileinto }) =>
  fileinto.map(Fileinto).join('\n')

const Fileinto = dest => `    fileinto "${dest}";`

const Comment = comment => `# ${comment}\n`

const Condition = ({ from, subject }) =>
  `${subject ? Subject(subject) + ', ' : ''}address :all :comparator "i;unicode-casemap" :contains "From" "${from}"`

const Rule = ({ actions, comment, condition }) =>
  `${Comment(comment)}if allof (${Condition(condition)}) {
${actions.map(Action).join('')}
}
`

const MultiRule = ({ actions, comment, conditions }) =>
  `${conditions.map(condition => Rule({
    actions,
    comment: condition.comment || comment,
    condition,
  })).join('\n')}`

const Main = filters =>
  `${Header}${filters.map(MultiRule).join('\n')}`

const Subject = subject =>
  `header :comparator "i;unicode-casemap" :contains "Subject" "${subject}"`

/** Main */

const sieve = filters => {

  const output = Main(filters)
  return output
}

module.exports = sieve
