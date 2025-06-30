# sieve-builder

Generates a sieve script for email filtering based on a simple, declarative JSON specification.

Limited to the specific use case of matching by subject and sender, and combining many filters into one due to the filter limit in ProtonMail.

- Sieve spec: https://www.rfc-editor.org/info/rfc5228
- ProtonMail spec: https://proton.me/support/sieve-advanced-custom-filters
  - Note: ProtonMail does not support the [body](https://datatracker.ietf.org/doc/html/rfc5173) extension.

## Usage

```sh
node bin.js filters.js
```

**filters.js:**

```js
const filters = [
  {
    conditions: [
      {
        comment: 'Grubhub Receipt',
        from: 'noreply@grubhub.com',
        subject: 'Here is your Grubhub Receipt',
      },
    ],
    actions: [
      {
        fileinto: ['archive', 'Receipts'],
      },
    ],
  },
]

module.exports = filters
```

**Output:**

```sh
require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "${1}") {return;}
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Grubhub Receipt", address :all :comparator "i;unicode-casemap" :matches "From" "noreply@grubhub.com"){fileinto "archive";fileinto "Receipts";}
```

## To Do

- [ ] Group rules with the same action into `anyof` blocks (syntax confirmed):

```sieve
if anyof (
  allof (
    header :comparator "i;unicode-casemap" :contains "Subject" "account statement",
    address :all :comparator "i;unicode-casemap" :matches "From" "*@robinhood.com"
  ),
  allof (
    header :comparator "i;unicode-casemap" :contains "Subject" "event contracts statement",
    address :all :comparator "i;unicode-casemap" :matches "From" "*@robinhood.com"
  )
) {
  fileinto "archive";
}
```
