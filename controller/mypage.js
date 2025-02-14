const pool = require("../DB/db");

// exports.getMypage = async (req, res) => {
//   try {

//   }
//   //const user = "123"; //test
//   const user = req.session.user;

//   const my = await pool.query("SELECT * FROM user WHERE id = ?"[user]);
//   const card = await pool.query("SELECT * FROM card WHERE id = ?"[user]);
//   const home = await pool.query("SELECT * FROM address WHERE num = ?"[user]);
//   if (card[0].length > 0 && home[0].length > 0) {
//     res.send({
//       name: my[0][0].name,
//       card: card[0],
//       home: home[0],
//     });
//   } else if (card[0].length > 0 && home[0].length === 0) {
//     return res.send({name:my[0][0].name,card: card[0], msg: "주소 정보를 입력해주세요" });
//   } else if (card[0].length === 0 && home[0].length > 0) {
//     return res.send({ name: my[0][0].name,home: home[0], msg: "카드 정보를 입력해주세요" });
//   } else {
//     res.send({name: my[0][0].name, msg:"주소와 카드 정보를 입력해주세요"});
//   }
// } catch (err) {
//   console.log(err);
//   res.status(500).send("서버 오류");
// };

exports.getMypage = async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.status(401).send({ msg: "로그인이 필요합니다." });
    }

    const my = await pool.query("SELECT * FROM user WHERE id = ?", [user]);
    const card = await pool.query("SELECT * FROM card WHERE id = ?", [user]);
    const home = await pool.query("SELECT * FROM address WHERE num = ?", [
      user,
    ]);

    if (my.length === 0) {
      return res.status(404).send({ msg: "사용자를 찾을 수 없습니다." });
    }

    if (card.length > 0 && home.length > 0) {
      res.send({
        name: my[0].name,
        card: card,
        home: home,
      });
    } else if (card.length > 0) {
      return res.send({
        name: my[0].name,
        card: card,
        msg: "주소 정보를 입력해주세요",
      });
    } else if (home.length > 0) {
      return res.send({
        name: my[0].name,
        home: home,
        msg: "카드 정보를 입력해주세요",
      });
    } else {
      res.send({ name: my[0].name, msg: "주소와 카드 정보를 입력해주세요" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("서버 오류");
  }
};

exports.postCard = async (req, res) => {
  const user = req.session.user;
  const { cardId, maxDate, type } = req.body.card;
  console.log("card:", cardId, maxDate, type);

  const cardCheck = await pool.query(
    "SELECT card.id FROM card WHERE card.id=?",
    [cardId]
  );

  if (cardCheck[0].length > 0) {
    res.send({ msg: "이미 존재 하는 카드 입니다." });
  } else {
    const cardData = await pool.query("INSERT INTO card VALUES(?,?,?,?)", [
      cardId,
      maxDate,
      type,
      user,
    ]);
    res.send({ msg: "카드 정보를 입력했습니다." });
  }

  const cardDel = await pool.query(
    "UPDATE card SET cardData = null WHERE user_id=?",
    [cardId]
  );
};

exports.postHome = async (req, res) => {
  const user = req.session.user;
  const { postNum, home, detail } = req.body.address;
  console.log("home:", postNum, home, detail);

  const homeCheck = await pool.query(
    "SELECT address.num FROM address WHERE address.num =? AND user_id =?",
    [postNum, user]
  );

  if (homeCheck[0].length > 0) {
    res.send({ msg: "이미 존재하는 주소입니다." });
  } else {
    const homeData = await pool.query("INSERT INTO address VALUES(?,?,?,?)", [
      postNum,
      home,
      detail,
      user,
    ]);
    res.send({ msg: "주소 정보를 입력했습니다." });
  }

  const homeDel = await pool.query(
    "UPDATE address SET homeData = null WHERE user_id=?",
    [user]
  );
};
