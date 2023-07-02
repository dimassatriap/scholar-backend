const paginate = (data, page, limit) => {
  const totalPage = Math.ceil(data.count / limit)
  return {
    results: data.rows,
    count: data.count,
    page,
    totalPage: limit != -1 ? totalPage : 1,
    itemsPerPage: limit
  }
}

module.exports = paginate
