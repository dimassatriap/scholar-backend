const db = require('../models')
const Publication = db.publications
const { Op } = require("sequelize")

module.exports = {
  async findAll(req, res) {
    try {
      const include = []
      const withScholars = req.query.withScholars
      if (!!withScholars) {
        include.push({
          model: db.scholars
        })
      }

      const where = {}
      const query = req.query.search
      if (!!withScholars && !!query) {
        where[Op.or] = [
          { 'name': { [Op.like]: '%' + query + '%' } },
          { 'abstract': { [Op.like]: '%' + query + '%' } },
          { '$scholar.name$': { [Op.like]: '%' + query + '%' } },
        ]
      }

      const publication = await Publication.findAll({
        include,
        where,
      })
      res.status(200).send({
        status: true,
        messages: 'Sukses mangambil data publikasi.',
        results: publication
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat pengambilan data publication.',
        results: error
      })
    }
  },

  async findOne(req, res) {
    try {
      const id = req.params.id
      const publication = await Publication.findByPk(id, {
        include: {
          model: db.scholars
        }
      })
      if (publication) {
        res.status(200).send({
          status: true,
          messages: 'Sukses mangambil data publikasi.',
          results: publication
        })
      } else {
        res.status(404).send({
          status: false,
          messages: 'Publikasi tidak ditemukan.'
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat pengambilan data publikasi.',
        results: error
      })
    }
  },

  async create(req, res) {
    try {
      const body = {
        ...req.body
      }
      const publication = await Publication.create(body)
      res.status(200).send({
        status: true,
        messages: 'Publikasi berhasil dibuat.',
        results: publication
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat membuat Publikasi.',
        results: error
      })
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id
      const body = {
        ...req.body
      }

      const publicationUpdated = await Publication.update(body, {
        where: {
          id: id
        }
      })
      const publication = await Publication.findByPk(id)

      res.status(200).send({
        status: true,
        messages: 'Berhasil mengubah data publikasi.',
        results: publication
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat pengubahan data publikasi',
        results: error
      })
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id
      const publication = await Publication.destroy({
        where: {
          id: id
        }
      })
      res.status(200).send({
        status: true,
        messages: `Publikasi berhasil dihapus.`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat penghapusan data publikasi.',
        results: error
      })
    }
  }
}
