# sieve-builder

Generates a sieve script for email filtering based on a simple, declarative JSON specification.

Limited to the specific use case of matching by subject and sender, and combining many filters into one due to the filter limit in ProtonMail.

- Sieve spec: https://www.rfc-editor.org/info/rfc5228
- ProtonMail spec: https://proton.me/support/sieve-advanced-custom-filters
  - Note: ProtonMail does not support the [body](https://datatracker.ietf.org/doc/html/rfc5173) extension.
  - Limited to 50k characters

## Deploy

Builds the sieve chunks and deploys them to ProtonMail custom filters named `sieve-builder-1`, `sieve-builder-2`, etc.

```sh
npm run deploy
```

## Usage

```sh
node bin.js filters.js
```

This will generate a sieve script and save it to `./out/1.sieve`, etc. You don't normally need to run this since it is executed as part of the deploy script.

### Prerequisites

- `npx playwright install chromium`
- Create sieve filters named `sieve-builder-1`, `sieve-builder-2`, etc. in ProtonMail manually (one-time setup)
- First run requires logging in to ProtonMail in the browser window that opens (session is saved for subsequent runs)

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

## Copilot Skill

The `add-email-filter` skill lets you add filters by attaching a screenshot of an email in Copilot chat. It extracts the sender, creates a wildcard pattern, and inserts the entry into `filters.js`.

Invoke with `/add-email-filter` or just attach a screenshot and ask to add a filter.
