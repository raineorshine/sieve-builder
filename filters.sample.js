const filters = [
  {
    comment: 'Grubhub Receipt',
    condition: {
      from: 'noreply@grubhub.com',
      subject: 'Here is your Grubhub Receipt',
    },
    actions: [{
      fileinto: ['archive', 'Receipts'],
    }]
  }
]

module.exports = filters
