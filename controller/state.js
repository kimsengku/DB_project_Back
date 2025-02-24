const pool = require("../DB/db");

exports.getState = async (req, res) => {
  console.log("현재 세션 값:", req.session.user);

  if (req.session.user) {
    res.json({ isLoggedIn: true, userInfo: req.session.user });
  } else {
    res.json({ isLoggedIn: false });
  }
};

// exports.getState = async (req, res) => {
//   if (req.session.user) {
//     res.json({ isLoggedIn: true, userInfo: req.session.user });
//   } else {
//     res.json({ isLoggedIn: false });
//   }
// };

// exports.getState = async (req, res) => {
//   const user = req.session.user || null;
//   res.json({ user });
// };

// exports.getState = async (req, res) => {
//   const user = req.session.user;
//   res.send(user);
// }; 변경전 코드
