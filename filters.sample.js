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
