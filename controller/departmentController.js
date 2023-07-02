const db = require('../models')
const Department = db.departments

module.exports = {
  async findAll(req, res) {
    try {
      const departments = await Department.findAll({
        include: [
          {
            attributes: ['id', 'name'],
            model: db.faculties,
            include: [{
              attributes: ['id', 'name'],
              model: db.universities
            }]
          }
        ]
      })
      res.status(200).send({
        status: true,
        messages: 'Berhasil dapatkan semua departemen.',
        results: departments
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil departemen.',
        results: error
      })
    }
  },

  async findOne(req, res) {
    try {
      const id = req.params.id
      const department = await Department.findByPk(id)
      if (department) {
        res.status(200).send({
          status: true,
          messages: 'Berhasil mendapatkan departemen.',
          results: department
        })
      } else {
        res.status(404).send({
          status: false,
          messages: 'Departemen tidak ditemukan.',
          results: null
        })
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil departemen.',
        results: error
      })
    }
  },

  async create(req, res) {
    try {
      const body = {
        name: req.body.name,
        facultyId: req.body.facultyId
      }
      const department = await Department.create(body)
      res.status(200).send({
        status: true,
        messages: 'Berhasil buat departemen.',
        results: department
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat membuat departemen.',
        results: error
      })
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id
      const body = {
        name: req.body.name,
        facultyId: req.body.facultyId
      }
      const department = await Department.update(body, {
        where: {
          id: id
        }
      })
      res.status(200).send({
        status: true,
        messages: 'Berhasil mengubah departemen.',
        results: department
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat memperbarui departemen.',
        results: error
      })
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id
      const department = await Department.destroy({
        where: {
          id: id
        }
      })
      res.status(200).send({
        status: true,
        messages: `Departemen berhasil dihapus`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat menghapus departemen',
        results: error
      })
    }
  }
}
