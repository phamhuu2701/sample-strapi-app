module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/customers/:handle',
      handler: 'custom.findByHandle',
    },
    {
      method: 'POST',
      path: '/customers/register',
      handler: 'custom.register',
    },
    {
      method: 'POST',
      path: '/customers/login',
      handler: 'custom.login',
    },
  ],
}
