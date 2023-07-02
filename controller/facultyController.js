const db = require("../models");
const Faculty = db.faculties;

module.exports = {
  async findAll(req, res){
    try {
      const faculties = await Faculty.findAll({
        attributes: ['name'],
        include: [
          {
            model: db.departments,
          }
        ]
      });
      res.status(200).send({
        status: "Success",
        results: faculties,
      })
    } catch(error){
      res.status(500).send({
        status: "error",
        messages: "Some error occured while retrieving Faculty",
        results: error
      })
    }
  },

  async findOne(req, res){
    try {
      const id = req.params.id;
      const faculty = await Faculty.findByPk(id);
      if (faculty){
        res.status(200).send({
          status: "Success",
          results: faculty
        });
      } else {
        res.status(404).send({
          status: "Success",
          messages: "Faculty not found"
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "Error",
        messages: "Some error occurred while retrieving faculty",
        results: error
      })
    }
  },

  async create(req, res) {
    try {
      const body = {
        name: req.body.name,
        universityId: req.body.universityId,
      };
      const faculty = await Faculty.create(body);
      res.status(200).send({
        is_success: true,
        status: "Success",
        results: faculty
      });
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: "Error",
        messages: "Some error occurred while create faculty",
        results: error
      })
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const body = {
        name: req.body.name,
      };
      const faculty = await Faculty.update(body, {
        where: {
          id: id,
        },
      });
      res.status(200).send({
        is_success: true,
        status: "Success",
        results: faculty
      });
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: "Error",
        messages: "Some error occurred while update faculty",
        results: error
      });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      const faculty = await Faculty.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).send({
        is_success: true,
        status: "Success",
        messages: `${faculty} faculty deleted`
      })
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: "Error",
        messages: "Some error occurred while delete faculty",
        results: error
      });
    }
  },
}
