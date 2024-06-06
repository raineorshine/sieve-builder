const sieve = require('./index')

test('from + subject', () => {

  const filters = [
    {
      conditions: [
        { comment: 'Grubhub Receipt', from: 'noreply@grubhub.com', subject: 'Here is your Grubhub receipt' },
      ],
      actions: [{
        fileinto: ['archive', 'Receipts'],
      }]
    }
  ]

  expect(sieve(filters))
    .toBe(`require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "$\{1}") {return;}
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Grubhub receipt", address :all :comparator "i;unicode-casemap" :matches "From" "noreply@grubhub.com"){fileinto "archive";fileinto "Receipts";}`)
})

test('multiple', () => {

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
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "$\{1}") {return;}
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Grubhub receipt", address :all :comparator "i;unicode-casemap" :matches "From" "noreply@grubhub.com"){fileinto "archive";fileinto "Receipts";}
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Lyft receipt", address :all :comparator "i;unicode-casemap" :matches "From" "noreply@lyft.com"){fileinto "archive";fileinto "Receipts";}`)
})

test('from', () => {

  const filters = [
    {
      conditions: [
        { comment: 'Lyft', from: 'noreply@lyft.com' },
      ],
      actions: [{
        fileinto: ['archive'],
      }]
    }
  ]

  expect(sieve(filters))
    .toBe(`require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "$\{1}") {return;}
if allof (address :all :comparator "i;unicode-casemap" :matches "From" "noreply@lyft.com"){fileinto "archive";}`)
})

test('subject', () => {

  const filters = [
    {
      conditions: [
        { comment: 'Hello', subject: 'Hi' },
      ],
      actions: [{
        fileinto: ['archive'],
      }]
    }
  ]

  expect(sieve(filters))
    .toBe(`require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "$\{1}") {return;}
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Hi"){fileinto "archive";}`)
})
