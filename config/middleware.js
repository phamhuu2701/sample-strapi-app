module.exports = ({ env }) => ({
  settings: {
    cache: {
      enabled: true,
      type: 'redis',
      maxAge: 2600000,
      max: 400,
      cacheTimeout: 400,
      enableEtagSupport: true,
      logs: true,
      populateContext: false,
      models: ['customers'],
    },
  },
})
