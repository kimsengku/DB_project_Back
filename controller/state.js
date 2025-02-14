const pool = require("../DB/db");

exports.getState = async (req, res) => {
  const user = req.session.user;
  res.send(user);
};
