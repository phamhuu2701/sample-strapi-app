const transformResponse = require('../../../../helpers/transformResponse')
const bcrypt = require('bcryptjs')

const UID = 'api::customer.customer'

/**
 * Hashes a password
 * @param {string} password - password to hash
 * @returns {string} hashed password
 */
const hashPassword = async (password) => await bcrypt.hash(password, 10)

/**
 * Validate a password
 * @param {string} password
 * @param {string} hash
 * @returns {boolean} is the password valid
 */
const validatePassword = async (password, hash) => await bcrypt.compare(password, hash)

module.exports = {
  findByHandle: async (ctx, next) => {
    try {
      const { handle } = ctx.request.params

      let entry = null

      // find by id
      if (!entry) {
        entry = await strapi.entityService
          .findOne(UID, handle, {
            populate: {},
          })
          .then((res) => res)
          .catch((err) => null)
      }

      // find by username
      if (!entry) {
        entry = await strapi.entityService
          .findMany(UID, {
            filters: { username: handle },
            populate: {},
          })
          .then((res) => res[0])
          .catch((err) => null)
      }

      if (!entry) {
        throw new Error('Not found')
      }

      return transformResponse({
        ok: true,
        data: entry,
      })
    } catch (error) {
      return transformResponse({ ok: false, error })
    }
  },

  register: async (ctx, next) => {
    try {
      let entry = await strapi.entityService.create(UID, {
        data: ctx.request.body,
      })

      return transformResponse({
        ok: true,
        data: entry,
      })
    } catch (error) {
      return transformResponse({ ok: false, error })
    }
  },

  login: async (ctx, next) => {
    try {
      const { username, password } = ctx.request.body

      let entry = null

      // find by username
      if (!entry) {
        entry = await strapi.entityService
          .findMany(UID, {
            filters: { username },
            populate: {},
          })
          .then((res) => res[0])
          .catch((err) => null)
      }

      // find by email
      if (!entry) {
        entry = await strapi.entityService
          .findMany(UID, {
            filters: { email: username },
            populate: {},
          })
          .then((res) => res[0])
          .catch((err) => null)
      }

      // find by phone
      if (!entry) {
        entry = await strapi.entityService
          .findMany(UID, {
            filters: { phone: username },
            populate: {},
          })
          .then((res) => res[0])
          .catch((err) => null)
      }

      if (!entry) {
        throw new Error('Username or Password is incorrect')
      }

      // validate password
      const hash = await hashPassword(password)
      const bool = await validatePassword(password, hash)

      if (!bool) {
        throw new Error('Username or Password is incorrect')
      }

      return transformResponse({
        ok: true,
        data: entry,
      })
    } catch (error) {
      return transformResponse({ ok: false, error })
    }
  },
}
