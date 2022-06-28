const { fetchPost } = require("../scrapper/scrapper");

class Post {
  static async getPosts_bienIci(req, res) {
    const { id } = req.params || 1;
    const { data } = await fetchPost(id);
    return res.status(200).json(data);
  }
}

module.exports = Post;
