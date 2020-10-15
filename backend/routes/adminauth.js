const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const config = require("config");
const Admin = require("../models/Admin");
const User = require("../models/User");
//@route  POST api/adminauth/register
//@desc   Register New Admin
//@access Public

// router.post(
// 	"/register",
// 	[
// 		check("username", "Please enter a valid username.").not().isEmpty(),
// 		check("firstName", "Please enter a valid firstname.").not().isEmpty(),
// 		check("lastName", "Please enter a valid lastname.").not().isEmpty(),
// 		// username must be an email
// 		check("email", "Please enter a valid email.").isEmail(),
// 		// password must be at least 5 chars long
// 		check("pass", "Enter password of atleast 6 characters.").isLength({
// 			min: 6,
// 		}),
// 	],
// 	async (req, res) => {
// 		console.log(req.body);
// 		const errors = validationResult(req);
// 		if (!errors.isEmpty()) {
// 			return res.status(400).json({ errors: errors.array() });
// 		}

// 		try {
// 			//check if user exists
// 			User.findOne({ email: req.body.email }).then((person) => {
// 				if (person) {
// 					return res.status(400).json({ email: "Email already exists!" });
// 				} else {
// 					const avatar = gravatar.url(req.body.email, {
// 						s: "200", //mm
// 						r: "pg", //Rating
// 						d: "mm", //Default
// 					});

// 					let date_ob = new Date();
// 					// current date
// 					// adjust 0 before single digit date
// 					let date = ("0" + date_ob.getDate()).slice(-2);
// 					// current month
// 					let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
// 					// current year
// 					let year = date_ob.getFullYear();

// 					let newPerson = new User({
// 						username: req.body.username,
// 						firstName: req.body.firstName,
// 						lastName: req.body.lastName,
// 						email: req.body.email,
// 						pass: req.body.pass,
// 						avatar,
// 						regDate: year + "-" + month + "-" + date,
// 					});

// 					bcrypt.genSalt(10, (err, salt) => {
// 						bcrypt.hash(newPerson.pass, salt, (err, hash) => {
// 							if (err) throw err;
// 							newPerson.pass = hash;
// 							newPerson
// 								.save()
// 								.then((newperson) => res.json({ newperson }))
// 								.catch((err) => console.log(err));
// 						});
// 					});
// 				}
// 			});
// 		} catch (err) {
// 			console.error(err.message);
// 			res.status(500).send("Server error");
// 		}
// 	}
// );

//@route  POST api/adminauth/login
//@desc   Login Admin / Get JWT Token
//@access Public

router.post(
	"/login",
	[check("email", "Please enter a valid email.").not().isEmpty(), check("pass", "Password is required").exists()],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, pass } = req.body;

		try {
			Admin.findOne({ email }).then((person) => {
				if (!person) {
					return res.status(400).json({ errors: [{ msg: "Invalid Username or Password" }] });
				}

				bcrypt.compare(pass, person.pass).then((isMatch) => {
					if (isMatch) {
						const payload = {
							id: person.id,
							name: person.name,
							email: person.email,
							avatar: person.avatar,
						};
						//Sign Token
						jwt.sign(payload, config.get("jwtSecret"), (err, token) => {
							if (err) throw err;
							res.json({ token });
						});
					} else {
						return res.status(400).json({ errors: [{ msg: "Invalid Username or Password" }] });
					}
				});
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

// //@route PUT api/Userauth/:Userid
// //@desc Update User
// //@access Public
// // router.put(
// //   "/:Userid",
// //   [
// //     check("Gender", "Please select F or M.")
// //       .not()
// //       .isEmpty()
// //       .isLength({ max: 1 }),
// //     check("NickName", "Please enter a valid name.").not().isEmpty(),
// //     // username must be an email
// //     check("Email", "Please enter a valid email.").isEmail(),
// //     // password must be at least 5 chars long
// //     check("Pass", "Enter password of atleast 6 characters.").isLength({
// //       min: 6,
// //     }),
// //   ],
// //   Userauth,
// //   async (req, res) => {
// //     const errors = validationResult(req);
// //     if (!errors.isEmpty()) {
// //       return res.status(400).json({ errors: errors.array() });
// //     }

// //     let data = {
// //       Gender: req.body.Gender,
// //       Email: req.body.Email,
// //       NickName: req.body.NickName,
// //       Pass: req.body.Pass,
// //     };

// //     try {
// //       const salt = await bcrypt.genSalt(10);
// //       data.Pass = await bcrypt.hash(data.Pass, salt);

// //       let sql = "UPDATE Users set ? WHERE UserID = ?";
// //       let query = await conn.query(
// //         sql,
// //         [data, req.params.Userid],
// //         (err, results) => {
// //           if (err) throw err;
// //           res.send(results);
// //         }
// //       );
// //     } catch (err) {
// //       console.error(err.message);
// //       res.status(500).send("Server error");
// //     }
// //   }
// // );

module.exports = router;
