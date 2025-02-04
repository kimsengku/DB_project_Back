const pool = require("../DB/db");

exports.getSignUp = async (req, res) => {
  try {
    const [user] = await pool.query("SELECT * FROM user");
    console.log(user);
  } catch (err) {
    console.error(err);
  }
};

exports.postSignUp = async (req, res) => {
  try {
    const { id, pw, name } = req.body.user;
    console.log(id, pw, name);
    const [insertInfo] = await pool.query("INSERT INTO user VALUES(?,?,?)", [
      id,
      pw,
      name,
    ]);
    res.send({ msg: "회원가입 완료되었습니다." });
  } catch (err) {
    console.error(err);
  }
};
