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

**filters.js:**

```js
${filters}
```

**Output:**

```hs
${output}
```
