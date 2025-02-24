const pool = require("../DB/db");

exports.getOrder = async (req, res) => {
  const user = req.session.user;
  const homeCheck = await pool.query(
    "SELECT * FROM address WHERE user_id = ?",
    [user]
  );

  // const user = req.session.user;
  // const checkCart = await pool.query(
  //   "SELECT cart.id FROM cart WHERE user_id = ?",
  //   [user]
  // );
  const cardCheck = await pool.query("SELECT * FROM card WHERE user_id = ?", [
    user,
  ]);
  //console.log("home", homeCheck[0], "card", cardCheck[0]);
  if (homeCheck[0].length < 1 || cardCheck[0].length < 1) {
    res.send({ msg: "주소와 카드 정보가 없습니다." });
  } else {
    res.send({ hoem: homeCheck[0], card: cardCheck[0] });
  }
};

exports.postOrder = async (req, res) => {
  try {
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ msg: "로그인이 필요합니다." });
    }

    const { type, addr, card } = req.body;
    const { arr, total, Amount } = req.body.book;

    // 선택한 주소 및 카드 정보 가져오기
    const selectAddrInfo = await pool.query(
      "SELECT * FROM address WHERE addr_id = ?",
      [addr]
    );
    const selectCardInfo = await pool.query(
      "SELECT * FROM card WHERE card_id = ?",
      [card]
    );

    console.log("📦 주문한 도서 목록:", arr);

    if (type === "cart") {
      // 장바구니에서 주문할 경우
      const cartId = arr[0].cart_cart_id;

      const insertOrder = await pool.query(
        "INSERT INTO `order` (date, price, amount, user_id, company, cardnum, max_date, postnum, home, home_detail) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          total,
          quan,
          user,
          selectCardInfo[0][0].company,
          selectCardInfo[0][0].card_id,
          selectCardInfo[0][0].period,
          selectAddrInfo[0][0].zip_code,
          selectAddrInfo[0][0].home,
          selectAddrInfo[0][0].home_detail,
        ]
      );

      const selectNewOrder = await pool.query(
        "SELECT number FROM `order` ORDER BY number DESC LIMIT 1"
      );
      const orderNumber = selectNewOrder[0][0].number;

      //주문목록에서 주문한 경우
      for (const book of arr) {
        const bookId = book.num;
        const cost = book.price * book.amount;

        console.log("주문 도서:", bookId, " | 가격:", cost);

        await pool.query(
          "INSERT INTO order_category (order_number, book_num, amount, price) VALUES (?, ?, ?, ?)",
          [orderNumber, bookId, book.amount, cost]
        );

        // 책 재고 감소
        await pool.query("UPDATE book SET amount = amount - ? WHERE num = ?", [
          book.amount,
          bookId,
        ]);
      }

      // 장바구니에서 주문한 책 삭제
      await pool.query("DELETE FROM cart_list WHERE cart_cart_id = ?", [
        cartId,
      ]);
    } else {
      const bookId = arr.id;

      console.log(" 개별 도서 주문 | 가격:", total, " | 수량:", Amount);

      // `order` 테이블에 주문 정보 저장
      const insertOrder = await pool.query(
        "INSERT INTO `order` (date, price, amount, user_id, company, cardnum, max_date, postnum, home, home_detail) VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          total,
          quan,
          user,
          selectCardInfo[0][0].company,
          selectCardInfo[0][0].card_id,
          selectCardInfo[0][0].period,
          selectAddrInfo[0][0].zip_code,
          selectAddrInfo[0][0].home,
          selectAddrInfo[0][0].home_detail,
        ]
      );

      // 새로 생성된 주문 ID 가져오기
      const selectNewOrder = await pool.query(
        "SELECT number FROM `order` ORDER BY number DESC LIMIT 1"
      );
      const orderNumber = selectNewOrder[0][0].number;

      // `order_category` 테이블에 주문한 책 추가
      await pool.query(
        "INSERT INTO order_category (order_number, book_num, amount, price) VALUES (?, ?, ?, ?)",
        [orderNumber, bookId, quan, total]
      );

      // 책 재고 감소
      await pool.query("UPDATE book SET amount = amount - ? WHERE num = ?", [
        quan,
        bookId,
      ]);
    }

    res.json({ msg: "주문이 성공적으로 완료되었습니다." });
  } catch (error) {
    console.error("주문 처리 중 오류 발생:", error);
    res.status(500).json({ msg: "서버 오류 발생" });
  }
};
