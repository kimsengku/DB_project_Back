// @./routes/index.js //만들어 둔 폴더 밑에 index.js파일 생성후 아래 코드 작성

const express = require("express");
const router = express.Router();

const loginRouter = require("../controller/loginCtrl");
const main = require("../controller/main");
const logoutRouter = require("../controller/logoutCtrl");
const signUp = require("../controller/signUp");
//const indexCtrl = require("../controller/indexCtrl"); //사용할 컨트롤러 선언
const book = require("../controller/book");
const cart = require("../controller/cart");
const mypage = require("../controller/mypage");

router.get("/", main.getMain); //기본주소에있는 값 받기

router.post("/login", loginRouter.postLogin);
router.post("/logout", logoutRouter.postLogout);

router.get("/signup", signUp.getSignUp);
router.post("/signup", signUp.postSignUp);

router.get("/book", book.getBookList);

router.get("/cart", cart.getCart);
router.post("/cart", cart.postCart);

router.get("/mypage", mypage.getMypage);

module.exports = router;
