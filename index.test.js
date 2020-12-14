const sieve = require('./index')

test('sieve', () => {

  const filters = [
    {
      conditions: [
        { comment: 'Grubhub Receipt', from: 'noreply@grubhub.com', subject: 'Here is your Grubhub receipt' },
        { comment: 'Lyft Receipt', from: 'noreply@lyft.com', subject: 'Here is your Lyft receipt' },
      ],
      actions: [{
        fileinto: ['archive', 'Receipts'],
      }]
    }
  ]

  expect(sieve(filters))
    .toBe(`require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];

# do not run script on spam messages
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "$\{1}") {
    return;
}

# Grubhub Receipt
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Grubhub receipt", address :all :comparator "i;unicode-casemap" :contains "From" "noreply@grubhub.com") {
    fileinto "archive";
    fileinto "Receipts";
}

# Lyft Receipt
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Lyft receipt", address :all :comparator "i;unicode-casemap" :contains "From" "noreply@lyft.com") {
    fileinto "archive";
    fileinto "Receipts";
}
`)
})
