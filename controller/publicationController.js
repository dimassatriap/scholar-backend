const db = require('../models')
const Publication = db.publications

module.exports = {
  async findAll(req, res) {
    try {
      const publication = await Publication.findAll()
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
      const publication = await Publication.findByPk(id)
      if (publication) {
        res.status(200).send({
          status: true,
          messages: 'Sukses mangambil data publikasi.',
          data: publication
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
        data: error
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
        messages: 'Some error occurred while delete Scholar',
        results: error
      })
    }
  }
}
