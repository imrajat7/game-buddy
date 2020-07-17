const router = require("express").Router();
const User = require("../models/user");
const shortid = require("shortid");

// function createEntry() {
//   const newUser = new User({
//     name: "akhil",
//     phone: 456789234,
//     referralCode: shortid.generate(6),
//   });

//   newUser
//     .save()
//     .then((data) => {
//       console.log(data);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// }

const isUniqueReferralCode = async (refcodeGenerated) => {
  let isUnique = false;

  let data = await User.find({ referralCode: refcodeGenerated });
  if (data.length == 0) {
    isUnique = true;
  } else {
    isUnique = false;
  }
  return isUnique;
};

const createUniqueReferralCode = async () => {
  let uniqueReferralCode;
  let loop = true;

  let refcodeGenerated = shortid.generate();
  while (loop == true) {
    const prmise = await isUniqueReferralCode(refcodeGenerated);
    if (prmise === true) {
      uniqueReferralCode = refcodeGenerated;
      loop = false;
    } else {
      refcodeGenerated = shortid.generate();
    }
  }
  return uniqueReferralCode;
};

router.post("/signup", async (req, res) => {
  const { name, phone, pubgUsername } = req.body;

  let referralCodeGenerated = await createUniqueReferralCode();

  res.status(200).json(referralCodeGenerated);
});

module.exports = router;
