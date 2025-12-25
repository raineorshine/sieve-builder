# sieve-builder

Generates a sieve script for email filtering based on a simple, declarative JSON specification.

Limited to the specific use case of matching by subject and sender, and combining many filters into one due to the filter limit in ProtonMail.

- Sieve spec: https://www.rfc-editor.org/info/rfc5228
- ProtonMail spec: https://proton.me/support/sieve-advanced-custom-filters
  - Note: ProtonMail does not support the [body](https://datatracker.ietf.org/doc/html/rfc5173) extension.
  - Limited to 50k characters

## Usage

```sh
node bin.js filters.js
```

This will generate a sieve script and save it to `./out/1.sieve.txt`.

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

**Output (./out/1.sieve.txt):**

```sieve
require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "${1}") {return;}
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Grubhub Receipt", address :all :comparator "i;unicode-casemap" :matches "From" "noreply@grubhub.com"){fileinto "archive";fileinto "Receipts";}
```
