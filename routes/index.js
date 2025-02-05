// @./routes/index.js //만들어 둔 폴더 밑에 index.js파일 생성후 아래 코드 작성

const express = require("express");
const router = express.Router();

const loginRouter = require("../controller/loginCtrl");
const logoutRouter = require("../controller/logoutCtrl");
const signUp = require("../controller/signUp");
const indexCtrl = require("../controller/indexCtrl"); //사용할 컨트롤러 선언
const book = require("../controller/book");

router.get("/", indexCtrl.gethome); //기본주소에있는 값 받기
router.post("/", indexCtrl.posthome);

router.post("/login", loginRouter.postLogin);
router.post("/logout", logoutRouter.postLogout);

router.get("/signup", signUp.getSignUp);
router.post("/signup", signUp.postSignUp);

router.get("/book", book.getBookList);

module.exports = router;
