const db = require("../models");
const Faculty = db.faculties;

module.exports = {
  async findAll(req, res){
    try {
      const faculties = await Faculty.findAll({
        include: [
          {
            attributes: ['id', 'name'],
            model: db.universities,
          },
          {
            attributes: ['id', 'name'],
            model: db.departments,
          }
        ]
      });
      res.status(200).send({
        status: true,
        messages: 'Berhasil dapatkan semua fakultas.',
        results: faculties
      })
    } catch(error){
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil fakultas.',
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
          status: true,
          messages: 'Berhasil mendapatkan fakultas.',
          results: faculty
        });
      } else {
        res.status(404).send({
          status: false,
          messages: 'Fakultas tidak ditemukan.',
          results: null
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil fakultas.',
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
        status: true,
        messages: 'Berhasil buat fakultas.',
        results: faculty
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat membuat fakultas.',
        results: error
      })
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const body = {
        name: req.body.name,
        universityId: req.body.universityId
      };
      const faculty = await Faculty.update(body, {
        where: {
          id: id,
        },
      });
      res.status(200).send({
        status: true,
        messages: 'Berhasil mengubah fakultas.',
        results: faculty
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat memperbarui fakultas.',
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
        status: true,
        messages: `Fakultas berhasil dihapus`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat menghapus fakultas',
        results: error
      });
    }
  },
}
