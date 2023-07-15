const db = require("../models");
const Helpdesk = db.helpdesk;

module.exports = {
  async findAll(req, res){
    try {
      const helpdesks = await Helpdesk.findAll();
      res.status(200).send({
        status: true,
        messages: 'Berhasil dapatkan semua helpdesk.',
        results: helpdesks,
      })
    } catch(error){
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil helpdesk.',
        results: error
      })
    }
  },

  async findOne(req, res){
    try {
      const id = req.params.id;
      const helpdesk = await Helpdesk.findByPk(id);
      if (helpdesk){
        res.status(200).send({
          status: true,
          messages: 'Berhasil mendapatkan helpdesk.',
          results: helpdesk
        });
      } else {
        res.status(404).send({
          status: false,
          messages: 'helpdesk tidak ditemukan.',
          results: null
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil helpdesk.',
        results: error
      })
    }
  },

  async create(req, res) {
    try {
      const body = {
        ...req.body,
      };
      const helpdesk = await Helpdesk.create(body);
      res.status(200).send({
        status: true,
        messages: 'Berhasil buat helpdesk.',
        results: helpdesk
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat membuat helpdesk.',
        results: error
      })
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const body = {
        ...req.body,
      };
      const helpdesk = await Helpdesk.update(body, {
        where: {
          id: id,
        },
      });
      res.status(200).send({
        status: true,
        messages: 'Berhasil mengubah helpdesk.',
        results: helpdesk
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat memperbarui helpdesk.',
        results: error
      });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      const helpdesk = await Helpdesk.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).send({
        status: true,
        messages: `Helpdesk berhasil dihapus`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat menghapus helpdesk',
        results: error
      });
    }
  },
}
