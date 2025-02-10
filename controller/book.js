const pool = require("../DB/db");

exports.getBookList = async (req, res) => {
  //const user = req.session.user; 책 list는 회원이 아니여도 볼 수 있어야 됨
  const bookList = await pool.query("SELECT * FROM book");
  res.send({ user: user, list: bookList[0] });
};
