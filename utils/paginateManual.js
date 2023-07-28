const paginateManual = (data, page, limit) => {
  const totalPage = Math.ceil(data.count / limit)
  let results = data.rows
  if (limit != -1) {
    const offset = (page - 1) * limit;
    results = data.rows.slice(offset, offset + limit)
  }

  return {
    results,
    count: data.count,
    page,
    totalPage: limit != -1 ? totalPage : 1,
    itemsPerPage: limit
  }
}

module.exports = paginateManual
