const db = require('../models')
const Account = db.accounts
const bcrypt = require('bcryptjs')

module.exports = {
  async findAll(req, res) {
    try {
      const accounts = await Account.findAll({
        attributes: ['id', 'username', 'email']
      })
      res.status(200).send({
        status: true,
        message: 'Success get all account',
        results: accounts
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        message: 'Some error occured while retrieving Account',
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
          message: 'Success get account',
          results: account.dataValues
        })
      } else {
        res.status(404).send({
          status: false,
          message: 'Account not found',
          results: null
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        message: 'Some error occurred while retrieving Account',
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
        message: 'Success create account',
        results: account
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        message: 'Some error occurred while create Account',
        results: error
      })
    }
  },

  async update(req, res) {
    const hasedPassword = await bcrypt.hashSync(req.body.password)
    try {
      const id = req.params.id
      const body = {
        username: req.body.username,
        email: req.body.email,
        password: hasedPassword
      }

      try {
        const account = await Account.findByPk(id)
        if (account) {
          const account = await Account.findOne({ where: { username: req.body.username } })
          if (!account) {
            const account = await Account.update(body, {
              where: {
                id: id
              }
            })
            res.status(200).send({
              status: true,
              message: 'Success update account',
              results: account
            })
          } else {
            res.status(400).send({
              status: false,
              messages: 'Username already exist',
              results: null
            })
          }
        } else {
          res.status(404).send({
            status: false,
            message: 'Account not found',
            results: null
          })
        }
      } catch (error) {
        res.status(500).send({
          status: false,
          message: 'Some error occurred while update Account',
          results: error
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        message: 'Some error occurred while update Account',
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
        message: `${account} account deleted`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        message: 'Some error occurred while delete Account',
        results: error
      })
    }
  }
}
