const db = require("../models");
const University = db.universities;

module.exports = {
  async findAll(req, res){
    try {
      const universities = await University.findAll({
        attributes: ['id', 'name', 'createdAt', 'updatedAt'],
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
        status: true,
        messages: 'Berhasil dapatkan semua universitas.',
        results: universities,
      })
    } catch(error){
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil universitas.',
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
          status: true,
          messages: 'Berhasil mendapatkan universitas.',
          results: university
        });
      } else {
        res.status(404).send({
          status: false,
          messages: 'universitas tidak ditemukan.',
          results: null
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil universitas.',
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
        status: true,
        messages: 'Berhasil buat universitas.',
        results: university
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat membuat universitas.',
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
        status: true,
        messages: 'Berhasil mengubah universitas.',
        results: university
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat memperbarui universitas.',
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
        status: true,
        messages: `Universitias berhasil dihapus`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat menghapus universitas',
        results: error
      });
    }
  },
}
