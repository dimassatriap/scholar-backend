const db = require('../models')
const Publication = db.publications
const PublicationKeywords = db.publications_keywords
const { Op } = require('sequelize')
const paginate = require('../utils/paginate')
const Sequelize = require('sequelize')

module.exports = {
  async findAll(req, res) {
    try {
      const where = {}
      const query = req.query.search
      let keywords = req.query.keywords
      if (keywords?.length) {
        keywords = keywords.split(',')
      }

      if (!!query) {
        where[Op.or] = [
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."name"')), {
            [Op.like]: '%' + query.toLowerCase() + '%'
          }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."abstract"')), {
            [Op.like]: '%' + query.toLowerCase() + '%'
          }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."coAuthor"')), {
            [Op.like]: '%' + query.toLowerCase() + '%'
          }),
          // { '$scholar.name$': { [Op.like]: '%' + query + '%' } }
        ]
      }

      let publishYear = req.query.publishYear
      if (publishYear?.length) {
        publishYear = publishYear.split(',')
      }
      if (publishYear) {
        where[Op.and] = [
          Sequelize.where(Sequelize.literal('extract(YEAR from "publications"."publishDate")'), {
            [Op.in]: publishYear
          }),
        ]
      }

      // if (keywords) {
      //   where['$keywords.id$'] = { [Op.in]: keywords }
      // }

      const include = [
        {
          model: db.keywords,
          as: 'keywords',
          attributes: ['id', 'name'],
          through: {
            attributes: [],
            where: keywords
              ? {
                  keywordId: { [Op.in]: keywords }
                }
              : undefined
          },
          required: !!keywords
        }
      ]

      const withScholars = req.query.withScholars
      if (!!withScholars) {
        include.push({
          model: db.scholars,
          as: 'scholar'
        })
      }

      const page = Number(req.query?.page || 1)
      const limit = Number(req.query?.itemsPerPage || 10)
      const orderPublishDate = req.query?.orderPublishDate || 'DESC'

      const publication = await Publication.findAndCountAll({
        distinct: true,
        include,
        where,
        ...(req.query?.itemsPerPage != -1 && {
          offset: (page - 1) * limit,
          limit
        }),
        order: [
          ['publishDate', orderPublishDate]
        ]
      })

      res.status(200).send({
        status: true,
        messages: 'Berhasil mangambil data publikasi.',
        ...paginate(publication, page, limit)
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat pengambilan data publication.',
        results: error
      })
    }
  },

  async getPublishYear(req, res){
    try {
      const years = await Publication.findAll({
        attributes: [
          [Sequelize.literal('extract(YEAR from "publications"."publishDate")'), "year"],
        ],
        group: ["year"],
        order: [
          [Sequelize.literal('year'), "DESC"]
        ]
      });

      const publishYears = years.map((e) => e.dataValues.year).filter(e => !!e)

      res.status(200).send({
        status: true,
        messages: 'Berhasil dapatkan semua tahun publikasi.',
        results: publishYears,
      })
    } catch(error){
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil tahun publikasi.',
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
          messages: 'Berhasil mangambil data publikasi.',
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

      let keywords = req.body.keywords
      if (keywords?.length) {
        keywords = keywords.split(',')

        const numberKeywords = keywords.filter((e) => !isNaN(e))
        const pubKeywords = numberKeywords.map((n) => {
          return { publicationId: publication.id, keywordId: n }
        })

        const stringKeywords = keywords.filter((e) => isNaN(e))
        if (stringKeywords.length) {
          const names = stringKeywords.map((s) => {
            return { name: s }
          })
          const res = await db.keywords.bulkCreate(names)
          for (let i = 0; i < res.length; i++) {
            const keyword = res[i]
            pubKeywords.push({ publicationId: publication.id, keywordId: keyword.id })
          }
        }

        await PublicationKeywords.bulkCreate(pubKeywords)
      }

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
      let keywords = req.body.keywords

      const publicationUpdated = await Publication.update(body, {
        where: {
          id: id
        }
      })

      if (keywords == '') {
        await PublicationKeywords.destroy({ where: { publicationId: id } })
      }

      if (keywords?.length) {
        keywords = keywords.split(',')

        const numberKeywords = keywords.filter((e) => !isNaN(e))
        const pubKeywords = numberKeywords.map((n) => {
          return { publicationId: id, keywordId: n }
        })

        const stringKeywords = keywords.filter((e) => isNaN(e))
        if (stringKeywords.length) {
          const names = stringKeywords.map((s) => {
            return { name: s }
          })
          const res = await db.keywords.bulkCreate(names)
          for (let i = 0; i < res.length; i++) {
            const keyword = res[i]
            pubKeywords.push({ publicationId: id, keywordId: keyword.id })
          }
        }

        await PublicationKeywords.destroy({ where: { publicationId: id } })
        await PublicationKeywords.bulkCreate(pubKeywords)
      }

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
