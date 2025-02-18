const pool = require("../DB/db");

//exports.getLogin = async (req, res) => {};

exports.postLogin = async (req, res) => {
  try {
    const { id, pw } = req.body.user;
    // const id = req.body.id; 테스트용 코드
    // const pw = req.body.pw;
    //console.log(id, pw);
    const [checkUser] = await pool.query(
      "SELECT * FROM user WHERE id = ? AND pw = ?",
      [id, pw]
    );
    console.log(checkUser);
    if (checkUser.length > 0) {
      req.session.user = id;
      req.session.save();
      console.log(req.session.user);
      res.send({ msg: "로그인 완료" });
    } else {
      res.send({ msg: "존재하지 않는 사용자입니다." });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getLogin = async (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
};
