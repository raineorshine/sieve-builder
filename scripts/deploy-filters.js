#!/usr/bin/env node
/**
 * Builds sieve chunks and deploys them to ProtonMail custom filters.
 *
 * Usage:
 *   node scripts/deploy-filters.js
 *
 * Prerequisites:
 *   - npx playwright install chromium
 *   - Existing sieve filters named "sieve-builder-1", "sieve-builder-2", etc. in ProtonMail
 *   - First run requires manual login (persistent context saves session)
 */
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

const PROTONMAIL_FILTERS_URL = 'https://account.proton.me/u/0/mail/filters'
const OUT_DIR = path.join(__dirname, '..', 'out')
const USER_DATA_DIR = path.join(__dirname, '..', '.playwright-user-data')
const FILTER_NAME_PREFIX = 'sieve-builder-'

async function main() {
  // 1. Build sieve chunks
  console.info('Building sieve chunks...')
  execSync('node bin.js filters.js', { cwd: path.join(__dirname, '..'), stdio: 'inherit' })

  // 2. Read generated .sieve files
  const sieveFiles = fs
    .readdirSync(OUT_DIR)
    .filter(f => /^\d+\.sieve$/.test(f))
    .sort((a, b) => parseInt(a) - parseInt(b))
    .map(f => ({
      name: `${FILTER_NAME_PREFIX}${path.basename(f, '.sieve')}`,
      content: fs.readFileSync(path.join(OUT_DIR, f), 'utf-8'),
    }))

  if (sieveFiles.length === 0) {
    console.error('No .sieve files found in out/')
    process.exit(1)
  }

  console.info(`Found ${sieveFiles.length} sieve chunk(s): ${sieveFiles.map(f => f.name).join(', ')}`)

  // 3. Launch browser with persistent context (reuses ProtonMail login)
  const browser = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1280, height: 900 },
  })

  const page = browser.pages()[0] || (await browser.newPage())

  try {
    // 4. Navigate to filters page
    console.info('Navigating to ProtonMail filters...')
    await page.goto(PROTONMAIL_FILTERS_URL, { waitUntil: 'networkidle', timeout: 120000 })

    // Wait for an edit button to confirm page is loaded
    await page.locator('button[aria-label*="sieve-builder"]').first().waitFor({ timeout: 120000 })
    console.info('Filters page loaded.')

    // 5. Deploy each sieve chunk
    for (const { name, content } of sieveFiles) {
      console.info(`Deploying ${name}...`)
      await deploySieveFilter(page, name, content)
    }

    console.info('All filters deployed successfully!')
  } finally {
    await browser.close()
  }
}

async function deploySieveFilter(page, filterName, sieveContent) {
  // The button's visible text is "Edit Sieve" but aria-label includes the filter name
  const editButton = page.locator(`button[aria-label*="${filterName}"]`)

  await editButton.waitFor({ timeout: 30000 })
  await editButton.click()

  // Wait for the editor textarea to appear
  await page.locator('textarea').waitFor({ timeout: 10000 })

  // Select all content and replace with new sieve content
  await page.locator('textarea').press('ControlOrMeta+a')
  await page.locator('textarea').fill(sieveContent)

  // Save
  await page.getByRole('button', { name: 'Save' }).click()

  // Wait for confirmation
  await page.getByText(`Filter ${filterName} updated`).waitFor({ timeout: 10000 })
  console.info(`  ✓ ${filterName} updated`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
