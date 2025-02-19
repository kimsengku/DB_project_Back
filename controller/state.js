const pool = require("../DB/db");

exports.getState = async (req, res) => {
  const user = req.session.user || null;
  res.json({ user });
};

// exports.getState = async (req, res) => {
//   const user = req.session.user;
//   res.send(user);
// }; 변경전 코드
