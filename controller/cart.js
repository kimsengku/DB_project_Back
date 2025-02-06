const pool = require("../DB/db");

exports.getCart = async (req, res) => {
  const user = req.session.user;
  const checkCart = await pool.query("SELECT cart_id FROM WHERE user_id = ?", [
    user,
  ]);
  const invenBook = await pool.query(
    `SELECT cart_inven_num, book_name, cart_inven_amount, book_price, book_num,
        cart_inven_cart_id, b.amount
        FROM cart_inven a INNER JOIN book b ON a.book_book_num = b.book_num
        WHERE cart_inven_cart_id = ?`,
    [checkCart[0][0].cart_id]
  );
  res.send(invenBook);
};

exports.postCart = async (req, res) => {
  const user = req.session.user;
  const { book, cart_inven_amount } = req.body;

  const checkCart = await pool.query(
    "SELECT cart_id FROM cart WHERE user_id = ?",
    [user]
  );
};
