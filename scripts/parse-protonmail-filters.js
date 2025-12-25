/** Parses manual filters from https://account.proton.me/u/0/mail/filters. */
let lastLabel
console.log(
  [...$$('td > [title]')]
    .map(el => el.textContent)
    .filter(text => text.includes(' - '))
    .map(text => text.split(' - '))
    .sort(([email1, label1], [email2, label2]) => (label1 > label2 ? 1 : label2 > label1 ? -1 : email1 > email2 ? 1 : email2 > email1 ? -1 : 0))
    .map(([email, label]) => {
      // remove numbers from duplicate filters
      const labelClean = label.replace(/ [12345]/g, '')
      let labelString = ''
      if (lastLabel !== labelClean) {
        lastLabel = labelClean
        labelString = `\n${labelClean}\n`
      }
      const emailClean = email.replace(/^(do-?)?not?-?reply|hello|help|office|info|notifications|reply|contact|mailinglist|marketing|newsletter/g, '*')
      return labelString + `'${emailClean}',`
    })
    .join('\n'),
)

/* Deletes individual filters from ProtonMail UI. */
function waitUntil(fn) {
  return new Promise(r => {
    const i = setInterval(() => {
      const result = fn()
      if (result) clearInterval(i), r(result)
    }, 50)
  })
}

let lastDeleted
while (true) {
  lastDeleted = document.querySelectorAll('table .text-ellipsis')[2].textContent
  const filterDropdown = document.querySelectorAll('[data-testid="dropdownActions:dropdown"]')[2]
  if (!filterDropdown) {
    console.log('All done!')
    break
  }
  filterDropdown.click()
  ;(await waitUntil(() => document.querySelector('[aria-label^="Delete filter"]'))).click()
  ;(await waitUntil(() => document.querySelector('.button-solid-danger'))).click()

  await waitUntil(() => document.querySelectorAll('table .text-ellipsis')[2].textContent !== lastDeleted)
}
