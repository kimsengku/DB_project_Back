// @./routes/index.js //만들어 둔 폴더 밑에 index.js파일 생성후 아래 코드 작성

const express = require("express");
const router = express.Router();
const indexCtrl = require("../controller/controller"); //사용할 컨트롤러 선언

router.get("/", indexCtrl.gethome); //기본주소에있는 값 받기

module.exports = router;
