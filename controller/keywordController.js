const db = require("../models");
const Keyword = db.keywords;

module.exports = {
  async findAll(req, res){
    try {
      const keywords = await Keyword.findAll();
      res.status(200).send({
        status: true,
        messages: 'Berhasil dapatkan semua keyword.',
        results: keywords,
      })
    } catch(error){
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil keyword.',
        results: error
      })
    }
  },

  async findOne(req, res){
    try {
      const id = req.params.id;
      const keyword = await Keyword.findByPk(id);
      if (keyword){
        res.status(200).send({
          status: true,
          messages: 'Berhasil mendapatkan keyword.',
          results: keyword
        });
      } else {
        res.status(404).send({
          status: false,
          messages: 'keyword tidak ditemukan.',
          results: null
        });
      }
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat mengambil keyword.',
        results: error
      })
    }
  },

  async create(req, res) {
    try {
      const body = {
        name: req.body.name,
      };
      const keyword = await Keyword.create(body);
      res.status(200).send({
        status: true,
        messages: 'Berhasil buat keyword.',
        results: keyword
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat membuat keyword.',
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
      const keyword = await Keyword.update(body, {
        where: {
          id: id,
        },
      });
      res.status(200).send({
        status: true,
        messages: 'Berhasil mengubah keyword.',
        results: keyword
      });
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat memperbarui keyword.',
        results: error
      });
    }
  },

  async delete(req, res) {
    try {
      const id = req.params.id;
      const keyword = await Keyword.destroy({
        where: {
          id: id,
        },
      });
      res.status(200).send({
        status: true,
        messages: `Keyword berhasil dihapus`,
        results: null
      })
    } catch (error) {
      res.status(500).send({
        status: false,
        messages: 'Terjadi kesalahan saat menghapus keyword',
        results: error
      });
    }
  },
}
