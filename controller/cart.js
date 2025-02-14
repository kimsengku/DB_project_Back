const pool = require("../DB/db");

exports.getCart = async (req, res) => {
  //const user = "123"; //test
  const user = req.session.user;
  const checkCart = await pool.query(
    "SELECT cart.id FROM cart WHERE user_id = ?",
    [user]
  );
  const invenBook = await pool.query(
    `SELECT a.num,  b.name, a.amount, b.price, b.num,
        a.cart_id, b.amount
        FROM cart_inven a INNER JOIN book b ON a.book_num = b.num
        WHERE a.cart_id = ?`,
    [checkCart[0][0].cart_id]
  );
  res.send(invenBook[0]);
};

exports.postCart = async (req, res) => {
  //const user = "123"; //test
  const user = req.session.user;
  const { book, cart_inven_amount } = req.body;

  const checkCart = await pool.query(
    "SELECT cart.id FROM cart WHERE user_id = ?",
    [user]
  );
  if (checkCart[0].length === 0) {
    return res.send({ msg: "현재 바구니에 아무것도 담겨있지 않습니다." });
  }
  const invenUp = await pool.query(
    "SELECT cart_inven.num FROM cart_inven JOIN book ON cart_inven.book_num = book.num WHERE cart_inven.cart_id =? AND book.num =?",
    [checkCart[0][0].cart_id, book.num]
  );
  if (invenUp[0].length === 0) {
    const invenUpdate = await pool.query(
      //"UPDATE cart_inven SET cart_inven.amount = cart_inven.amount + ? WHERE cart_inven.book_num = ? AND cart_inven.cart_id = ?", //test
      "UPDATE cart_inven SET cart_inven.amount = cart_inven.amount + ? WHERE cart_inven.book_num = ? AND cart_inven.cart_id = ?",
      [cart_inven_amount, book.num, checkCart[0][0].cart_id]
    );
    //return res.send({ msg: "해당 책의 재고가 소진되었거나 없는 책입니다." });
  } else {
    const invenAdd = await pool.query(
      "INSERT INTO cart_inven VALUES(null, ?, ?, ?)"[
        (checkCart[0][0].cart_id, book.num, cart_inven.amount)
      ]
    );
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
