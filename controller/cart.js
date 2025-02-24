const pool = require("../DB/db");

exports.getCart = async (req, res) => {
  //const user = "123"; //test
  const user = req.session.user;
  //console.log("현재 사용자:", user);

  if (!user) {
    return res.state(401).json({ msg: "로그인이 필요합니다." });
  }
  const checkCart = await pool.query(
    "SELECT cart.id FROM cart WHERE user_id = ?",
    [user]
  );
  // const creatCart = await pool.query(
  //   "SELECT cart.id FROM cart WHERE user_id =?"
  // )

  console.log("checkCart:", checkCart);
  console.log("checkCart[0]:", checkCart[0]);

  if (checkCart[0].length === 0) {
    const creatCart = await pool.query(
      "INSERT INTO cart (user_id) VALUES (?)",
      [user]
    );
    const newCart = creatCart[0].insertId;

    console.log(newCart);
  }
  console.log("checkCart[0][0]:", checkCart[0][0]);

  // checkCart[0]은 [](빈 배열) → SELECT cart.id FROM cart WHERE user_id = ? 결과가 없음.
  // checkCart[0][0]이 undefined인 이유 → 해당 user_id에 해당하는 cart 데이터가 없기 때문.
  // 즉, 사용자의 장바구니(cart 테이블)가 비어 있거나, user_id가 존재하지 않음.
  // 수정할꺼

  const cartId = checkCart[0][0].id;

  const invenBook = await pool.query(
    `SELECT a.num, b.name, a.amount, b.price, b.num,
      a.cart_id, b.amount
   FROM cart_inven a INNER JOIN book b ON a.book_num = b.num
   WHERE a.cart_id = ?`,
    [cartId]
  );
  res.send(invenBook[0]);
};

exports.postCart = async (req, res) => {
  try {
    const user = "123"; //test
    //const user = req.session.user;
    console.log("현재 사용자:", user);
    const { book_num, amount } = req.body;

    console.log("장바구니 추가 요청:", { user, book_num, amount });

    let checkCart = await pool.query(
      "SELECT cart.id FROM cart WHERE user_id = ?",
      [user]
    );

    console.log("checkCart 결과:", checkCart[0]);

    if (checkCart[0].length === 0) {
      console.log(" 장바구니가 없어서 새로 생성합니다.");
      const createCart = await pool.query(
        "INSERT INTO cart (user_id) VALUES (?)",
        [user]
      );
      checkCart = await pool.query(
        "SELECT cart.id FROM cart WHERE user_id = ?",
        [user]
      );
    }

    const cartId = checkCart[0][0].id;

    const checkInven = await pool.query(
      "SELECT * FROM cart_inven WHERE cart_id = ? AND book_num = ?",
      [cartId, book_num]
    );

    console.log("기존 장바구니 데이터:", checkInven[0]);

    if (checkInven[0].length > 0) {
      const updateRes = await pool.query(
        "UPDATE cart_inven SET amount = amount + ? WHERE cart_id = ? AND book_num = ?",
        [amount, cartId, book_num]
      );
      console.log("기존 책 수량 업데이트 완료");
      res.send({ msg: "장바구니 업데이트 완료 (수량 증가)" });
    } else {
      // 장바구니에 새로 추가
      const insertRes = await pool.query(
        "INSERT INTO cart_inven (cart_id, book_num, amount) VALUES (?, ?, ?)",
        [cartId, book_num, amount]
      );
      console.log(" 새 책 추가 완료");
      res.send({ msg: "장바구니 업데이트 완료 (새 책 추가)" });
    }
  } catch (error) {
    console.error(" 장바구니 추가 중 오류 발생:", error);
    res.status(500).send({ msg: "서버 오류 발생" }); //오류시
  }
};

/*const cartId = checkCart[0][0].cart_id;
  const amount = invenUp[0][0].cart_inven_amount;

  await pool.query(
    `INSERT INTO cart_inven(cart_id, book_num, cart_inven_amount)
    VALUES(?,?,?)
    `
  )*/

exports.postAmount = async (req, res) => {
  const user = req.session.user;
  const { book, amount } = req.body;
  console.log(poket);
  const checkCart = await pool.query(
    "SELECT cart.id FROM cart WHERE user_id = ?",
    [user]
  );
  const checkAmount = await pool.query(
    "SELECT amount FROM cart_inven WHERE book_num =? AND cart.id=?",
    [book, checkCart[0][0].cart.id]
  );
  console.log(chekckAmount[0][0].amount);

  if (state === "plus") {
    if (poket <= checkCart[0][0].amount) {
      res.send({ msg: "재고가 부족합니다" });
    } else {
      const plusAmount = await pool.query(
        `UPDATE cart_inven SET amount = amount + 1 WHERE book.num=? AND cart_cart_id=?`,
        [book, checkCart[0][0].cart.id]
      );
    }
  } else {
    const checkAmount = await pool.query(
      "SELECT amount FROM cart_inven WHERE book.num=? AND cart_cart_id=?",
      [book, checkCart[0][0].cart_id]
    );
    if (checkAmount[0][0].amount === 1) {
      const minus = await pool.query(
        "DELETE FROM cart_inven WHERE amount = 1 AND book.num=?",
        [book]
      );
    } else {
      const minusAmount = await pool.query(
        `
        UPDATE cart_inven SET amount = amount - 1 WHERE book.num=? AND cart_cart_id`,
        [book, checkCart[0][0].cart_id]
      );
    }
  }
};
