const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const userauth = require("../middleware/userauth");
const { check, validationResult } = require("express-validator");
const Shift = require("../models/Shift");
const createShift = require("../models/createShift");
const User = require("../models/User");
var nodemailer = require("nodemailer");

//@route  GET api/shift/getshift
//@desc   Get all shift
//@access Public
router.get("/getshifts", (req, res) => {
  Shift.find().then((allShift) => {
    res.send(allShift);
  });
});

//@route  DELETE api/shift/deleteshift
//@desc   Delete shift by id
//@access Public
router.delete("/deleteshift", (req, res) => {
  Shift.findOneAndDelete({ _id: req.query.id }).then((resp) => {
    console.log(resp);
    res.send(resp);
  });
});
router.post("/createShift", (req, res) => {
  console.log(req.body);
  if (req.body === null) res.status(400).send("Bad Request");
  let newShift = new createShift({
    start: new Date(req.body.start),
    end: new Date(req.body.end),
    title: req.body.title,
    color: req.body.color,
  });

  newShift
    .save()
    .then((newShift) => res.send(newShift))
    .catch((err) => console.log(err));
});

router.get("/currentShifts", (req, res) => {
  createShift.find().then((shfts) => {
    res.send(shfts);
  });
});

router.get("/currentUserShifts", (req, res) => {
  if (req.body === null) res.status(400).send("Bad Request");

  createShift.find({ title: { $regex: req.body.username } }).then((shfts) => {
    res.send(shfts);
  });
});

router.get("/currentUserOffShifts", (req, res) => {
  if (req.body === null) res.status(400).send("Bad Request");
  createShift
    .find({
      $or: [
        { title: { $regex: req.body.username + " OFF" } },
        { title: { $regex: req.body.username + " off" } },
        { title: { $regex: req.body.username + " Off" } },
        { title: { $regex: req.body.username + " OFf" } },
        { title: { $regex: req.body.username + " oFF" } },
        { title: { $regex: req.body.username + " OfF" } },
      ],
    })
    .then((shfts) => {
      res.send(shfts);
    });
});

router.put("/swapShifts", (req, res) => {
  if (req.body === null) res.status(400).send("Bad Request");
  try {
    createShift
      .replaceOne(
        { _id: req.body.id1 },
        { title: req.body.title1, start: req.body.start1, end: req.body.end1 }
      )
      .then(() => {
        createShift
          .replaceOne(
            { _id: req.body.id2 },
            {
              title: req.body.title2,
              start: req.body.start2,
              end: req.body.end2,
            }
          )
          .then(() => {
            User.find({
              $or: [
                { username: { $regex: req.body.title1.split(" ")[0] } },
                { username: { $regex: req.body.title2.split(" ")[0] } },
              ],
            }).then((user) => {
              sendMail(
                user[0].email,
                user[1].email,
                req.body.title1.toString(),
                req.body.title2.toString()
              );
              res.send("Shifts are swapped");
            });
          });
      });
  } catch (err) {
    console.log(err);
  }
});
async function sendMail(user1, user2, title_1, title_2) {
  var transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      // enter your account details to send email from
      user: "",
      pass: "",
    },
  });

  var mailOptions = {
    from: user1,
    to: user2,
    subject: "Shift Transfer Log",
    html:
      "<p> This mail sent as shift transfer log. <br/> Shift <b>" +
      title_1 +
      "</b> to this <b>" +
      title_2 +
      "</b> </p>",
  };

  transport.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Message sent: %s", info.messageId);
  });
}

//@route  PUT api/shift/updateshift
//@desc   Update shift by id
//@access Public
router.put(
  "/updateshift",
  [
    check("shiftname", "Please enter a valid name.").not().isEmpty(),
    // shiftname must be an email
    check("color", "Please enter a valid color.").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      let newPerson = {
        shiftname: req.body.newData.shiftname,
        color: req.body.newData.color,
      };

      Shift.update({ _id: req.body.id }, { $set: newPerson }).then((resp) => {
        console.log(resp);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route  POST api/shift/register
//@desc   Register New Shift
//@access Public
router.post(
  "/register",
  [
    check("shiftname", "Please enter a valid name.").not().isEmpty(),
    // shiftname must be an color
    check("color", "Please enter a valid color.").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      //check if shift exists

      Shift.findOne({ shiftname: req.body.shiftname }).then((person) => {
        if (person) {
          return res.status(400).json({ email: "Shift already exists!" });
        } else {
          let newPerson = new Shift({
            shiftname: req.body.shiftname,
            color: req.body.color,
          });

          newPerson
            .save()
            .then((newperson) => res.json({ newperson }))
            .catch((err) => console.log(err));
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
