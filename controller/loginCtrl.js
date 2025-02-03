const pool = require("../DB/db");

exports.postLogin = async (req, res) => {
  const { user } = req.body;
  console.log(user);
};
