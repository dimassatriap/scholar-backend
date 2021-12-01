const db = require('../models')
const Account = db.accounts
const bcrypt = require('bcryptjs')

module.exports = {
  async findAll(req, res) {
    try {
      const accounts = await Account.findAll({
        attributes: ['id', 'username', 'email', 'createdAt', 'updatedAt']
      })
      res.status(200).send({
        status: true,
        messages: 'Sukses dapatkan semua akun.',
        results: accounts
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Beberapa kesalahan terjadi saat mengambil Akun.',
        results: error
      })
    }
  },

  async findOne(req, res) {
    try {
      const id = req.params.id
      const account = await Account.findByPk(id)
      if (account) {
        delete account.dataValues['password']
        res.status(200).send({
          status: true,
          messages: 'Berhasil mendapatkan akun.',
          results: account.dataValues
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
        messages: 'Beberapa kesalahan terjadi saat mengambil Akun.',
        results: error
      })
    }
  },

  async create(req, res) {
    try {
      const body = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      }
      const account = await Account.create(body)
      res.status(200).send({
        status: true,
        messages: 'Sukses buat akun.',
        results: account
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Beberapa kesalahan terjadi saat membuat Akun.',
        results: error
      })
    }
  },

  async update(req, res) {
    const hasedPassword = await bcrypt.hashSync(req.body.password)
    try {
      const id = parseInt(req.params.id)
      const body = {
        username: req.body.username,
        email: req.body.email,
        password: hasedPassword
      }

      try {
        const account = await Account.findByPk(id)
        if (account) {
          const account = await Account.findOne({ where: { username: req.body.username } })
          if (!account || (account.username === body.username && account.id === id)) {
            const account = await Account.update(body, {
              where: {
                id: id
              }
            })
            res.status(200).send({
              status: true,
              messages: 'Berhasil mengubah akun.',
              results: account
            })
          } else {
            res.status(400).send({
              status: false,
              messages: 'Username sudah ada.',
              results: null
            })
          }
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
          messages: 'Beberapa kesalahan terjadi saat memperbarui Akun.',
          results: error
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Beberapa kesalahan terjadi saat memperbarui Akun.',
        results: error
      })
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id
      const account = await Account.destroy({
        where: {
          id: id
        }
      })
      res.status(200).send({
        status: true,
        messages: `akun berhasil dihapus.`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Beberapa kesalahan terjadi saat menghapus Akun',
        results: error
      })
    }
  }
}
