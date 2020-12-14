const sieve = require('./index')

test('simple', () => {

  const filters = [
    {
      comment: 'Grubhub Receipt',
      condition: {
        from: 'noreply@grubhub.com',
        subject: 'Here is your Grubhub Receipt',
      },
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
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Grubhub Receipt", address :all :comparator "i;unicode-casemap" :contains "From" "noreply@grubhub.com") {
    fileinto "archive";
    fileinto "Receipts";
}
`)
})
