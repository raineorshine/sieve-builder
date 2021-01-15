# sieve-builder

Generates a [sieve](https://www.rfc-editor.org/info/rfc5228) script from a simple JSON specification.

Limited to the specific use case of matching by subject and sender, and combining many filters into one due to the filter limit in ProtonMail.

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
      }
    ],
    actions: [{
      fileinto: ['archive', 'Receipts'],
    }]
  }
]

module.exports = filters
```

**Output:**

```hs
require ["include", "environment", "variables", "relational", "comparator-i;ascii-numeric", "spamtest", "fileinto", "imap4flags"];

# do not run script on spam messages
if allof (environment :matches "vnd.proton.spam-threshold" "*", spamtest :value "ge" :comparator "i;ascii-numeric" "${1}") {
    return;
}

# Grubhub Receipt
if allof (header :comparator "i;unicode-casemap" :contains "Subject" "Here is your Grubhub Receipt", address :all :comparator "i;unicode-casemap" :contains "From" "noreply@grubhub.com") {
    fileinto "archive";
    fileinto "Receipts";
}
```
