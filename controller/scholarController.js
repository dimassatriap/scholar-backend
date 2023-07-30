const db = require('../models')
const Scholar = db.scholars
const Account = db.accounts
const { Op } = require('sequelize')
const paginate = require('../utils/paginate');


module.exports = {
  async findAll(req, res) {
    try {
      const include = [
        {
          attributes: ['name'],
          model: db.departments,
          include: [
            {
              attributes: ['name'],
              model: db.faculties,
              include: [
                {
                  attributes: ['name'],
                  model: db.universities
                }
              ]
            }
          ]
        }
      ]
      const withPublications = req.query.withPublications
      if (!!withPublications) {
        include.push({
          model: db.publications
        })
      }

      const where = {
        [Op.and]: []
      }

      const query = req.query.search
      if (!!query) {
        where[Op.or] = [{ name: { [Op.like]: '%' + query + '%' } }]
      }

      const validated = req.query.validated
      if (validated != 'all') {
        where[Op.and] = [
          ...where[Op.and],
          { validated: { [Op.ne]: false } }
        ]
      }

      if (where[Op.and].length < 1) delete where[Op.and]

      const page = Number(req.query?.page || 1);
      const limit = Number(req.query?.itemsPerPage || 12);

      const scholars = await Scholar.findAndCountAll({
        include,
        where,
        ...(req.query?.itemsPerPage != -1 && {
          offset: (page - 1) * limit,
          limit
        }),
        order: [
          ['createdAt', 'ASC']
        ]
      })
      res.status(200).send({
        status: true,
        messages: 'Berhasil mendapat seluruh data scholar.',
        ...paginate(scholars, page, limit)
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
      const include = [
        {
          attributes: ['name'],
          model: db.departments,
          include: [
            {
              attributes: ['name'],
              model: db.faculties,
              include: [
                {
                  attributes: ['name'],
                  model: db.universities
                }
              ]
            }
          ]
        }
      ]

      const id = req.params.id
      const scholar = await Scholar.findByPk(id, {
        include
      })
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
      const scholar = await Scholar.findByPk(id, {
        include: [
          {
            attributes: ['name'],
            model: db.departments,
            include: [
              {
                attributes: ['name'],
                model: db.faculties,
                include: [
                  {
                    attributes: ['name'],
                    model: db.universities
                  }
                ]
              }
            ]
          }
        ]
      })
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
        include: [
          {
            model: db.scholars
          }
        ]
      })
      if (account && account.dataValues.scholar !== null) {
        res.status(404).send({
          status: false,
          messages: 'Akun tersebut sudah mendaftarkan scholar.',
          results: null
        })
      } else if (account) {
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
        ...req.body
      }

      const scholarUpdated = await Scholar.update(body, {
        where: {
          id: id
        }
      })

      const include = [
        {
          attributes: ['name'],
          model: db.departments,
          include: [
            {
              attributes: ['name'],
              model: db.faculties,
              include: [
                {
                  attributes: ['name'],
                  model: db.universities
                }
              ]
            }
          ]
        }
      ]

      const scholar = await Scholar.findByPk(id, { include })

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
