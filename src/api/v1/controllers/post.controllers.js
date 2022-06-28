const Scrapper = require("../scrapper/scrapper");

class Post {
  static async getPosts_bienIci(req, res) {
    const { id } = req.params || 1;
    const { data } = await Scrapper.bienIci(id);
    return res.status(200).json(data);
  }

  static async nexity(req, res) {
    const data = await Scrapper.nexity();
    return res.status(200).json(data);
  }
}

module.exports = Post;
