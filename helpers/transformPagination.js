const transformPagination = ({ total, page, pageSize }) => {
  return {
    total,
    page,
    pageSize,
    pageCount: Math.ceil(total / pageSize),
  }
}

module.exports = transformPagination
