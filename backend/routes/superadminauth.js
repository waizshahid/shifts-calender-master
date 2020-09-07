const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const SuperAdmin = require("../models/SuperAdmin");
const Admin = require("../models/Admin");
const User = require("../models/User");

//@route  POST api/superadminauth/register
//@desc   Register New Super Admin
//@access Public

router.post(
  "/register",
  [
    check("username", "Please enter a valid name.").not().isEmpty(),
    // username must be an email
    check("email", "Please enter a valid email.").isEmail(),
    // password must be at least 5 chars long
    check("pass", "Enter password of atleast 6 characters.").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //check if user exists
      SuperAdmin.findOne({ email: req.body.email }).then((person) => {
        if (person) {
          return res.status(400).json({ email: "Email already exists!" });
        } else {
          const avatar = gravatar.url(req.body.email, {
            s: "200", //mm
            r: "pg", //Rating
            d: "mm", //Default
          });

          let date_ob = new Date();
          // current date
          // adjust 0 before single digit date
          let date = ("0" + date_ob.getDate()).slice(-2);
          // current month
          let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
          // current year
          let year = date_ob.getFullYear();

          let newPerson = new SuperAdmin({
            username: req.body.username,
            email: req.body.email,
            pass: req.body.pass,
            avatar,
            regDate: year + "-" + month + "-" + date,
          });

          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newPerson.pass, salt, (err, hash) => {
              if (err) throw err;
              newPerson.pass = hash;
              newPerson
                .save()
                .then((newperson) => res.json({ newperson }))
                .catch((err) => console.log(err));
            });
          });
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route  POST api/superadminauth/login
//@desc   Login Super Admin / Get JWT Token
//@access Public

router.post(
  "/login",
  [
    check("email", "Please enter a valid email.").not().isEmpty(),
    check("pass", "Password is required").exists(),
  ],
  async (req, res) => {
    let arr = {};
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, pass } = req.body;

    try {
      //check for super admin
      SuperAdmin.findOne({ email }).then((person1) => {
        if (!person1) {
          // return res.status(400).json({ errors: [{ msg: "Invalid Username or Password" }] });
          //check for admin
          Admin.findOne({ email }).then((person2) => {
            if (!person2) {
              // return res.status(400).json({ errors: [{ msg: "Invalid Username or Password" }] });
              //check for user
              User.findOne({ email }).then((person3) => {
                if (!person3) {
                  return res.status(400).json({
                    errors: [{ msg: "Invalid Username or Password" }],
                  });
                } else {
                  bcrypt.compare(pass, person3.pass).then((isMatch) => {
                    if (isMatch) {
                      const payload = {
                        id: person3.id,
                        name: person3.name,
                        email: person3.email,
                        avatar: person3.avatar,
                      };
                      //Sign Token
                      jwt.sign(
                        payload,
                        config.get("jwtSecret"),
                        (err, token) => {
                          // if (err) throw err;
                          if (token) {
                            arr.type = "user";
                            arr.token = token;
                            return res.send(arr);
                          }
                        }
                      );
                    } else {
                      return res.status(400).json({
                        errors: [{ msg: "Invalid Username or Password" }],
                      });
                    }
                  });
                }
              });
            } else {
              bcrypt.compare(pass, person2.pass).then((isMatch) => {
                if (isMatch) {
                  const payload = {
                    id: person2.id,
                    name: person2.name,
                    email: person2.email,
                    avatar: person2.avatar,
                  };
                  //Sign Token
                  jwt.sign(payload, config.get("jwtSecret"), (err, token) => {
                    // if (err) throw err;
                    if (token) {
                      arr.type = "admin";
                      arr.token = token;
                      return res.send(arr);
                    }
                  });
                } else {
                  return res.status(400).json({
                    errors: [{ msg: "Invalid Username or Password" }],
                  });
                }
              });
            }
          });
        } else {
          bcrypt.compare(pass, person1.pass).then((isMatch) => {
            if (isMatch) {
              const payload = {
                id: person1.id,
                name: person1.name,
                email: person1.email,
                avatar: person1.avatar,
              };
              //Sign Token
              jwt.sign(payload, config.get("jwtSecret"), (err, token) => {
                // if (err) throw err;
                if (token) {
                  arr.type = "superadmin";
                  arr.token = token;
                  return res.send(arr);
                }
              });
            } else {
              return res
                .status(400)
                .json({ errors: [{ msg: "Invalid Username or Password" }] });
            }
          });
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

//@route PUT api/adminauth/:adminid
//@desc Update Admin
//@access Public
// router.put(
//   "/:adminid",
//   [
//     check("Gender", "Please select F or M.")
//       .not()
//       .isEmpty()
//       .isLength({ max: 1 }),
//     check("NickName", "Please enter a valid name.").not().isEmpty(),
//     // username must be an email
//     check("Email", "Please enter a valid email.").isEmail(),
//     // password must be at least 5 chars long
//     check("Pass", "Enter password of atleast 6 characters.").isLength({
//       min: 6,
//     }),
//   ],
//   adminauth,
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     let data = {
//       Gender: req.body.Gender,
//       Email: req.body.Email,
//       NickName: req.body.NickName,
//       Pass: req.body.Pass,
//     };

//     try {
//       const salt = await bcrypt.genSalt(10);
//       data.Pass = await bcrypt.hash(data.Pass, salt);

//       let sql = "UPDATE admins set ? WHERE AdminID = ?";
//       let query = await conn.query(
//         sql,
//         [data, req.params.adminid],
//         (err, results) => {
//           if (err) throw err;
//           res.send(results);
//         }
//       );
//     } catch (err) {
//       console.error(err.message);
//       res.status(500).send("Server error");
//     }
//   }
// );

module.exports = router;
