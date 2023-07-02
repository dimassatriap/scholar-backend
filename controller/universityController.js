const db = require("../models");
const University = db.universities;

module.exports = {
  async findAll(req, res){
    try {
      const universities = await University.findAll({
        attributes: ['id', 'name'],
        include: [
          {
            attributes: ['id', 'name'],
            model: db.faculties, 
            include: [{
              attributes: ['id', 'name'],
              model: db.departments
            }]
          }
        ]
      });
      res.status(200).send({
        status: "Success",
        results: universities,
      })
    } catch(error){
      res.status(500).send({
        status: "error",
        messages: "Some error occured while retrieving University",
        results: error
      })
    }
  },

  async findOne(req, res){
    try {
      const id = req.params.id;
      const university = await University.findByPk(id);
      if (university){
        res.status(200).send({
          status: "Success",
          results: university
        });
      } else {
        res.status(404).send({
          status: "Success",
          messages: "University not found"
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "Error",
        messages: "Some error occurred while retrieving university",
        results: error
      })
    }
  },

  async create(req, res) {
    try {
      const body = {
        name: req.body.name,
      };
      const university = await University.create(body);
      res.status(200).send({
        is_success: true,
        status: "Success",
        results: university
      });
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: "Error",
        messages: "Some error occurred while create university",
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
      const university = await University.update(body, {
        where: {
          id: id,
        },
      });
      res.status(200).send({
        is_success: true,
        status: "Success",
        results: university
      });
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: "Error",
        messages: "Some error occurred while update university",
        results: error
      });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      const university = await University.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).send({
        is_success: true,
        status: "Success",
        messages: `${university} university deleted`
      })
    } catch (error) {
      res.status(500).send({
        is_success: false,
        status: "Error",
        messages: "Some error occurred while delete university",
        results: error
      });
    }
  },
}
