const pool = require("../DB/db");

exports.getCart = async (req, res) => {
  const user = "123"; //test
  //const user = req.session.user;
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
  const user = "123"; //test
  //const user = req.session.user;
  const { book, cart_inven_amount } = req.body;

  const checkCart = await pool.query(
    "SELECT cart_id FROM cart WHERE user_id = ?",
    [user]
  );
  if (checkCart[0].length === 0) {
    return res.send({ msg: "현재 바구니에 아무것도 담겨있지 않습니다." });
  }
  const invenUp = await pool.query(
    "SELECT cart_inven_num FROM cart_inven WHERE cart_inven_cart_id =? AND book_num =?",
    [checkCart[0][0].cart_id, book.num]
  );
  if (invenUp[0].length === 0) {
    const invenUpdate = await pool.query(
      "UPDATE cart_inven SET cart_inven_amount = cart_inven_amount + ? WHERE book_num = ? AND cart_id",
      [cart_inven_amount, book.num, checkCart[0][0].cart_id]
    );
    //return res.send({ msg: "해당 책의 재고가 소진되었거나 없는 책입니다." });
  } else {
    const invenAdd = await pool.query(
      "INSERT INTO cart_inven VALUES(null, ?, ?, ?)"[
        (checkCart[0][0].cart_id, book.num, cart_inven_amount)
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
};
