const pool = require("../DB/db");

exports.gethome = async (req, res) => {
  console.log(111);
  res.send("hello world");
};

exports.posthome = async (req, res) => {
  const [test] = await pool.query("SELECT * FROM user");
  console.log(test);
};
