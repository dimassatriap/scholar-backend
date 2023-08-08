const db = require('../models')
const Publication = db.publications
const PublicationKeywords = db.publications_keywords
const { Op } = require('sequelize')
const paginateManual = require('../utils/paginateManual')
const Sequelize = require('sequelize')

module.exports = {
  async findAll(req, res) {
    try {
      const where = {
        [Op.or]: [],
        [Op.and]: []
      }
      const query = req.query.search

      let keywords = req.query.keywords
      if (keywords?.length) {
        keywords = keywords.split(',')
      }

      let firstAuthors = req.query.firstAuthors
      if (firstAuthors?.length) {
        firstAuthors = firstAuthors.split(',')
      }

      let otherAuthors = req.query.otherAuthors
      if (otherAuthors?.length) {
        otherAuthors = otherAuthors.split(',')
      }

      let departmentIds = req.query.departmentIds
      if (departmentIds?.length) {
        departmentIds = departmentIds.split(',')
      }

      const publicationType = req.query.publicationType
      const validated = req.query.validated

      if (!!query) {
        where[Op.or] = [
          ...where[Op.or],
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."name"')), {
            [Op.like]: '%' + query.toLowerCase() + '%'
          }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."abstract"')), {
            [Op.like]: '%' + query.toLowerCase() + '%'
          }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."coAuthor"')), {
            [Op.like]: '%' + query.toLowerCase() + '%'
          }),
          Sequelize.where(Sequelize.fn('lower', Sequelize.col('"scholar"."name"')), {
            [Op.like]: '%' + query.toLowerCase() + '%'
          }),
        ]
      }

      if (!!firstAuthors) {
        where[Op.and] = [
          ...where[Op.and],
          Sequelize.where(Sequelize.col('"scholar"."id"'), {
            [Op.in]: firstAuthors
          }),
        ]
      }

      if (!!otherAuthors) {
        for (let i = 0; i < otherAuthors.length; i++) {
          const author = otherAuthors[i];
          where[Op.or] = [
            ...where[Op.or],
            Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."coAuthor"')), {
              [Op.like]: '%' + author.toLowerCase() + '%'
            }),
          ] 
        }
      }

      if (!!departmentIds) {
        where[Op.and] = [
          ...where[Op.and],
          Sequelize.where(Sequelize.col('"scholar"."departmentId"'), {
            [Op.in]: departmentIds
          }),
        ]
      }

      if (publicationType == 'conference') {
        where[Op.and] = [
          ...where[Op.and],
          Sequelize.where(Sequelize.col('"publications"."conference"'), {
            [Op.ne]: null
          }),
        ]
      } else if (publicationType == 'journal') {
        where[Op.and] = [
          ...where[Op.and],
          Sequelize.where(Sequelize.col('"publications"."journal"'), {
            [Op.ne]: null
          }),
        ]
      }

      if (validated != 'all') {
        where[Op.and] = [
          ...where[Op.and],
          Sequelize.where(Sequelize.col('"publications"."validated"'), {
            [Op.ne]: false
          }),
        ]
      }

      let publishYear = req.query.publishYear
      if (publishYear?.length) {
        publishYear = publishYear.split(',')
      }
      if (publishYear) {
        where[Op.and] = [
          ...where[Op.and],
          ...( process.env.NODE_ENV == 'development' 
            ? [
              // MySQL
              Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('publishDate')), {
                [Op.in]: publishYear
              }),
            ]
            : [
              // PostgreSQL
              Sequelize.where(Sequelize.literal('extract(YEAR from "publications"."publishDate")'), {
                [Op.in]: publishYear
              }),
            ]
          )
        ]
      }

      if (where[Op.or].length < 1) delete where[Op.or]
      if (where[Op.and].length < 1) delete where[Op.and]

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
        subQuery: false,
        distinct: true,
        include,
        where,
        order: [
          ['publishDate', orderPublishDate]
        ]
      })

      res.status(200).send({
        status: true,
        messages: 'Berhasil mangambil data publikasi.',
        ...paginateManual(publication, page, limit)
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
      let years;
      if (process.env.NODE_ENV == 'development') {
        // MySQL
        years = await Publication.findAll({
          attributes: [
            [Sequelize.fn("YEAR", Sequelize.col("publishDate")), "year"],
          ],
          group: ["year"],
          order: [
            ['publishDate', 'DESC']
          ]
        });
      } else {
        // PostgreSQL
        years = await Publication.findAll({
          attributes: [
            [Sequelize.literal('extract(YEAR from "publications"."publishDate")'), "year"],
          ],
          group: ["year"],
          order: [
            [Sequelize.literal('year'), "DESC"]
          ]
        });
      }

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

      const existing = await Publication.findOne({
        where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."name"')), body.name?.toLowerCase()),
        include: db.scholars
      });

      let existingISSN;
      if (body.ISSN) {
        existingISSN = await Publication.findOne({
          where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."ISSN"')), body.ISSN?.toLowerCase()),
          include: db.scholars
        });
      }

      if (existing) {
        return res.status(400).send({
          status: false,
          messages: 'Publikasi dengan judul tersebut sudah terbuat sebelumnya.',
          results: null
        })
      } else if (existingISSN) {
        return res.status(400).send({
          status: false,
          messages: 'Publikasi dengan ISSN tersebut sudah terbuat sebelumnya.',
          results: null
        })
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

      const existing = await Publication.findOne({
        where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."name"')), body.name.toLowerCase()),
        include: db.scholars
      });

      let existingISSN;
      if (body.ISSN) {
        existingISSN = await Publication.findOne({
          where: Sequelize.where(Sequelize.fn('lower', Sequelize.col('"publications"."ISSN"')), body.ISSN?.toLowerCase()),
          include: db.scholars
        });
      }

      if (existing && existing.id != body.id) {
        return res.status(400).send({
          status: false,
          messages: 'Publikasi dengan judul tersebut sudah terbuat sebelumnya.',
          results: null
        })
      } else if (existingISSN && existingISSN.id != body.id) {
        return res.status(400).send({
          status: false,
          messages: 'Publikasi dengan ISSN tersebut sudah terbuat sebelumnya.',
          results: null
        })
      }

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
