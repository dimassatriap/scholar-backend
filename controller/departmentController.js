const db = require('../models')
const Department = db.departments

module.exports = {
  async findAll(req, res) {
    try {
      const departments = await Department.findAll({
        attributes: ['id', 'name'],
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
        status: 'Success',
        results: departments
      })
    } catch (error) {
      res.status(500).send({
        status: 'error',
        messages: 'Some error occured while retrieving Department',
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
          status: 'Success',
          results: department
        })
      } else {
        res.status(404).send({
          status: 'Success',
          messages: 'Department not found'
        })
      }
    } catch (error) {
      res.status(500).send({
        status: 'Error',
        messages: 'Some error occurred while retrieving department',
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
        is_success: true,
        status: 'Success',
        results: department
      })
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: 'Error',
        messages: 'Some error occurred while create department',
        results: error
      })
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id
      const body = {
        name: req.body.name
      }
      const department = await Department.update(body, {
        where: {
          id: id
        }
      })
      res.status(200).send({
        is_success: true,
        status: 'Success',
        results: department
      })
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: 'Error',
        messages: 'Some error occurred while update department',
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
        is_success: true,
        status: 'Success',
        messages: `${department} department deleted`
      })
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: 'Error',
        messages: 'Some error occurred while delete department',
        results: error
      })
    }
  }
}
