# sieve-builder

Generates a [sieve](https://www.rfc-editor.org/info/rfc5228) script from a simple JSON specification.

Limited to the specific use case of matching by subject and sender, and combining many filters into one due to the filter limit in ProtonMail.

## Usage

```sh
node index.js filters.js
```

**filters.js:**

```js
${filters}
```

**Output:**

```hs
${output}
```
