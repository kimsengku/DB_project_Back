const pool = require("../DB/db");

exports.gethome = async (req, res) => {
  console.log("로그인 완료되었습니다.");
  res.send("로그인 됐습니다.");
};

exports.posthome = async (req, res) => {
  const [test] = await pool.query("SELECT * FROM user");
  console.log(test);
};
