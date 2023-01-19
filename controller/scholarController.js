const db = require('../models')
const Scholar = db.scholars
const Account = db.accounts
const bcrypt = require('bcryptjs')
const { Op } = require("sequelize")

module.exports = {
  async findAll(req, res) {
    try {
      const include = []
      const withPublications = req.query.withPublications
      if (!!withPublications) {
        include.push({
          model: db.publications
        })
      }

      const where = {}
      const query = req.query.search
      if (!!query) {
        where[Op.or] = [
          { 'name': { [Op.like]: '%' + query + '%' } },
        ]
      }

      const scholars = await Scholar.findAll({
        include,
        where,
      })
      res.status(200).send({
        status: true,
        messages: 'Berhasil mendapat seluruh data scholar.',
        results: scholars
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat pengambilan data scholar.',
        results: error
      })
    }
  },

  async findOne(req, res) {
    try {
      const id = req.params.id
      const scholar = await Scholar.findByPk(id)
      if (scholar) {
        res.status(200).send({
          status: true,
          messages: 'Berhasil mendapatkan data scholar.',
          results: scholar
        })
      } else {
        res.status(404).send({
          status: false,
          messages: 'Scholar tidak ditemukan.',
          results: null
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat pengambilan data Scholar',
        results: error
      })
    }
  },

  async findScholarWithPublication(req, res) {
    try {
      const id = req.params.id
      const scholar = await Scholar.findByPk(id, { include: [
        {
          model: db.publications
        }
      ] })
      if (scholar) {
        res.status(200).send({
          status: true,
          messages: 'Berhasil mendapatkan data scholar dengan publikasinya.',
          results: scholar
        })
      } else {
        res.status(404).send({
          status: false,
          messages: 'Scholar tidak ditemukan.',
          results: null
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat pengambilan data scholar.',
        results: error
      })
    }
  },

  async create(req, res) {
    try {
      const id = req.body.accountId
      const account = await Account.findByPk(id, {
        include: [{
          model: db.scholars
        }]
      })
      if (account && account.dataValues.scholar !== null) {
        res.status(404).send({
          status: false,
          messages: 'Akun tersebut sudah mendaftarkan scholar.',
          results: null
        })
      }
      else if (account) {
        const body = {
          ...req.body
        }
        const scholar = await Scholar.create(body)
        res.status(200).send({
          status: true,
          messages: 'Berhasil membuat scholar.',
          results: scholar
        })
      } else {
        res.status(404).send({
          status: false,
          messages: 'Akun tidak ditemukan.',
          results: null
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat pengambilan data scholar.',
        results: error
      })
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id
      const body = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        address: req.body.address,
        gender: req.body.gender,
        birthDate: req.body.birthDate,
        image: req.body.image,
        accountId: req.body.accountId
      }

      const scholarUpdated = await Scholar.update(body, {
        where: {
          id: id
        }
      })
      const scholar = await Scholar.findByPk(id)

      res.status(200).send({
        status: true,
        messages: 'Berhasil mengubah scholar',
        results: scholar
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat perubahan data scholar',
        results: error
      })
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id
      const scholar = await Scholar.destroy({
        where: {
          id: id
        }
      })
      res.status(200).send({
        status: true,
        messages: `Scholar berhasil dihapus.`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat penghapusan data scholar.',
        results: error
      })
    }
  }
}
