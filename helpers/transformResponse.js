const transformResponse = ({ ok, data, meta, error }) => {
  let payload = { ok }

  if (data) {
    payload = { ...payload, data }
  }

  if (meta) {
    payload = { ...payload, meta }
  }

  if (error) {
    payload = { ...payload, error: { ...error, message: error.message, code: error.code } }
  }

  return payload
}

module.exports = transformResponse
