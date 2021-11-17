const db = require('../models')
const Scholar = db.scholars
const Account = db.accounts
const bcrypt = require('bcryptjs')

module.exports = {
  async findAll(req, res) {
    try {
      const scholars = await Scholar.findAll()
      res.status(200).send({
        status: true,
        messages: 'Success get all scholar',
        results: scholars
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Some error occured while retrieving Scholar',
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
          messages: 'Success get scholar',
          results: scholar
        })
      } else {
        res.status(404).send({
          status: false,
          messages: 'Scholar not found',
          results: null
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Some error occurred while retrieving Scholar',
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
          messages: 'Account already register scholar',
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
          messages: 'Success create scholar',
          results: scholar
        })
      } else {
        res.status(404).send({
          status: false,
          messages: 'Akun tidak ditemukan',
          results: null
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Some error occurred while create Scholar',
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
        gender: req.body.gender
      }

      const scholar = await Scholar.update(body, {
        where: {
          id: id
        }
      })
      res.status(200).send({
        status: true,
        messages: 'Success update scholar',
        results: scholar
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Some error occurred while update Scholar',
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
        messages: `${scholar} scholar deleted`,
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
