const catchAsync = require("../utils/catchAsync");

exports.getHomeStats = (req, res) => {
  res.json(req.app.get("home-stats"));
};

exports.getSuggestions = catchAsync(async (req, res) => {
  res.json({
    qtyUnits: ["م", "م²", "قطعة", "عود", "ايام عمل", "عبوة"],
    titles: [
      "زجاج سيكوريت ١٠مل شفاف",
      "اكسسوار",
      "مصنعية",
      "مسطرة مستورد",
      "طقم باب سيكوريت",
      "ماكينة باب سيكوريت",
      "مقبض باب سيكوريت",
      "مساطر وزوايا",
      "F حرف الومونيوم",
      "U حرف الومونيوم",
      "قطاع",
      "كفر قطاع",
    ],
  });
});

exports.login = (req, res) => {
  const { password } = req.body;

  const getToken = (password) =>
    ({
      [process.env.MAIN_ADMINPASSWORD]: process.env.MAIN_ADMINTOKEN,
      [process.env.ROSHDY_PASSWORD]: process.env.ROSHDY_TOKEN,
      [process.env.TEST_PASSWORD]: process.env.TEST_TOKEN,
    }[password]);

  if (getToken(password)) {
    return res.status(200).json({ token: getToken(password) });
  }

  res.sendStatus(401);
};
