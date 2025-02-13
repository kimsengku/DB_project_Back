const pool = require("../DB/db");

exports.getMypage = async (req, res) => {
  //const user = "123"; //test
  const user = req.session.user;

  const my = await pool.query("SELECT * FROM user WHERE id = ?"[user]);
  const card = await pool.query("SELECT * FROM card WHERE id = ?"[user]);
  const home = await pool.query("SELECT * FROM address WHERE num = ?"[user]);
  if (card[0].length === 0 && home[0].length === 0) {
    return res.send({ msg: "카드와 주소 정보를 입력해주세요." });
  } else if (card[0].length > 0 && home[0].length === 0) {
    return res.send({ msg: "주소 정보를 입력해주세요" });
  } else if (card[0].length === 0 && home[0].length > 0) {
    return res.send({ msg: "카드 정보를 입력해주세요" });
  } else {
    res.send({
      name: my[0][0].name,
      card: card[0],
      home: home[0],
    });
  }
};
