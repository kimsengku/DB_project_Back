// const pool = require("../DB/db")

// exports.getOrderList = async(req, res) => {
//     const user = req.session.user

//     const searchOrderList = await pool.query(`
//         SELECT `)
// }

const pool = require("../DB/db");

exports.getOrderList = async (req, res) => {
  try {
    const user = req.session.user;

    if (!user) {
      return res.status(401).json({ msg: "로그인이 필요합니다." });
    }

    const selectOrderList = await pool.query(
      `
      SELECT 
        book.name AS book_name, 
        order_category.amount AS quantity, 
        order_category.price, 
        order.date AS order_date, 
        order.amount AS total_quantity, 
        order.cardnum AS card_id, 
        order.home AS home_address, 
        order.home_detail AS home_detail_address
      FROM \`order\`
      INNER JOIN order_category ON order.number = order_category.order_number
      INNER JOIN book ON order_category.book_num = book.num
      WHERE order.user_id = ?
      ORDER BY order.date DESC
      `,
      [user]
    );

    res.send(selectOrderList[0]);
  } catch (error) {
    console.error(" 주문 목록 조회 중 오류 발생:", error);
    res.status(500).json({ msg: "서버 오류 발생" });
  }
};
