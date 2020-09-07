const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const userauth = require("../middleware/userauth");
const { check, validationResult } = require("express-validator");
const Shift = require("../models/Shift");
const createShift = require("../models/createShift");
const User = require("../models/User");

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
    title: req.body.title,
    start: new Date(req.body.start),
    end: new Date(req.body.end),
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
  createShift.createIndex({ title: "text" });
  createShift.find({ $text: { $search: "off" } }).then((shfts) => {
    res.send(shfts);
  });
});

router.put("/swapShifts", (req, res) => {
  if (req.body === null) res.status(400).send("Bad Request");
  var user1 = "";
  var user2 = "";
  User.find({ username: req.body.user1 }).then((usr) => {
    user1 = usr;
    User.find({ username: req.body.user1 }).then((usr) => {
      user2 = usr;
    });
    createShift.updateOne(
      { title: req.body.title1, start },
      {
        $set: { title: req.body.title2 },
        $currentDate: { lastModified: true },
      }
    );
    createShift.updateOne(
      { title: req.body.title2 },
      {
        $set: { title: req.body.title1 },
        $currentDate: { lastModified: true },
      }
    );
    createShift.find().then((shfts) => {
      res.send(shfts);
    });
  });
});
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
