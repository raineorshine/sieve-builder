---
name: add-email-filter
description: 'Add a new email filter from a screenshot. Use when: user shares a screenshot of an email and wants to add a filter rule, create a sieve filter, file/label mail, block sender, or sort emails into folders.'
argument-hint: 'Attach a screenshot of the email to filter'
---

# Add Email Filter from Screenshot

Add a new filter entry to `filters.js` by extracting the sender address from a screenshot and filing it into the appropriate label.

## Procedure

### 1. Extract Sender Info

From the attached screenshot, identify:

- **Sender email address** (the full `From` address)
- **Sender name or organization** (for the `comment` field)
- **Subject line** (only if needed to distinguish this filter from others with the same sender)

### 2. Determine Wildcard Pattern

Create the most general wildcard pattern that will match all emails from this sender:

| Scenario                                     | Pattern          | Example                |
| -------------------------------------------- | ---------------- | ---------------------- |
| Single known address                         | exact address    | `no-reply@example.com` |
| Unique domain, any local part                | `*@domain.com`   | `*@sweetgreen.com`     |
| Subdomain varies (e.g. marketing subdomains) | `*@*.domain.com` | `*@*.nordstrom.com`    |
| Both subdomain and local part vary           | `*@*.domain.com` | `*@*.chase.com`        |

**Prefer wildcards.** Use `*@domain.com` or `*@*.domain.com` unless the domain is shared (e.g. `gmail.com`, `outlook.com`, `yahoo.com`, `protonmail.com`, `icloud.com`, `hotmail.com`, `substack.com`, `ccsend.com`, `stripe.com`). For shared domains, use the exact address.

### 3. Determine Label and Archive Behavior

Ask the user which label to file into if it's not obvious from context. Check existing sections in `filters.js` for the appropriate label. Common labels:

- Art, Birds, Cybersemics, Development, Dog, Education, Events, Family, Fashion, Film, Finance, Friends, Health, Legal, Products, Receipts, Taxes, Travel, Work

If the user doesn't specify whether the email should be archived, use the ask-questions tool to prompt them with these options:

- **Categorize only** — files into the label and keeps in inbox (e.g. `['Health']`)
- **Categorize and archive** — files into the label and archives (e.g. `['Health', 'archive']`)
- **Trash** — deletes the email

These correspond to different sections in `filters.js` (e.g. `// Health` vs `// Health (archive)`).

Compound labels are supported (e.g. `['Art', 'Legal']`, `['Finance', 'archive']`).

Special actions:

- `['archive']` — archive only (non-priority mail)
- `['trash']` — delete (spam-like mail that can't be unsubscribed)
- `['Label', 'archive']` — label + archive

### 4. Determine Placement

Filters are evaluated top-to-bottom, first match wins. Place the new entry:

- In the existing section for the target label
- If using a subject filter AND there's a more general wildcard for the same domain below, place it **above** that general rule
- Alphabetically within the section when no ordering constraint exists

### 5. Format the Entry

Use the simplest format that matches:

**String shorthand** (from-only, no subject, no comment needed):

```js
'*@domain.com',
```

**Object with from only:**

```js
{ comment: 'Sender Name', from: '*@domain.com' },
```

**Object with from and subject:**

```js
{ comment: 'Sender Name - Context', from: '*@domain.com', subject: 'Subject fragment' },
```

Only include `subject` if needed to distinguish this filter from others or to target specific unwanted emails from an otherwise useful sender.

### 6. Add to `filters.js`

Insert the new condition into the appropriate `conditions` array in `filters.js`. If no existing section matches the target label + action combination, create a new filter block following the existing pattern.

### 7. Confirm

After adding, summarize:

- The pattern used
- The label/action applied
- Where it was placed in the file

**Do NOT commit to git.** `filters.js` is gitignored.
