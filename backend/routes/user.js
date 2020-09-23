const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const userauth = require("../middleware/userauth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const Admin = require("../models/Admin");

//@route  GET api/user/test
//@desc   Test User Route
//@access Private
router.get("/test", userauth, (req, res) => {
	res.send("User works!");
});

//@route  GET api/user
//@desc   Test Loggen In User Data
//@access Private
router.get("/", userauth, async (req, res) => {
	try {
		User.findById(req.user.id).then((user) => {
			res.json(user);
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

//@route  GET api/user/getusers
//@desc   Get all users
//@access Public
router.get("/getusers", (req, res) => {
	User.find().then((allUsers) => {
		res.send(allUsers);
	});
});
router.get("/getuser", (req, res) => {
	const { email, pass } = req.body;
	console.log(email);
	User.find({ email: email }).then((user) => {
		res.send(user);
	});
});

//@route  DELETE api/user/deleteuser
//@desc   Delete user by id
//@access Public
router.delete("/deleteuser", (req, res) => {
	User.findOneAndDelete({ _id: req.query.id })
		.then((resp) => {
			console.log(resp);
			res.send(resp);
		})
		.catch((err) => {
			Admin.findOneAndDelete({ _id: req.query.id }).then((resp) => {
				console.log(resp);
				res.send(resp);
			});
		});
});

//@route  PUT api/user/updateuser
//@desc   Update user by id
//@access Public
router.put(
	"/updateuser",
	[
		check("username", "Please enter a valid username.").not().isEmpty(),
		check("firstName", "Please enter a valid firstname.").not().isEmpty(),
		check("lastName", "Please enter a valid lastname.").not().isEmpty(),
		// username must be an email
		check("email", "Please enter a valid email.").isEmail(),
		// password must be at least 5 chars long
		check("pass", "Enter password of atleast 6 characters.").isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		try {
			//check if Admin exists
			if (req.body.newData.person === "admin") {
				Admin.findOne({ email: req.body.newData.email }).then((person) => {
					if (person) {
						return res.status(400).json({ email: "Email already exists!" });
					}
				});
				console.log("in try !");
				const avatar = gravatar.url(req.body.newData.email, {
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

				let newPerson = {
					username: req.body.newData.username,
					firstName: req.body.newData.firstName,
					lastName: req.body.newData.lastName,
					email: req.body.newData.email,
					partener: req.body.newData.partener,
					type: req.body.newData.person,
					pass: req.body.newData.pass,
					avatar,
					regDate: year + "-" + month + "-" + date,
				};

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newPerson.pass, salt, (err, hash) => {
						if (err) throw err;
						newPerson.pass = hash;

						Admin.update({ _id: req.body.id }, { $set: newPerson }).then((resp) => {
							console.log(resp);
						});
					});
				});
			}
			//check if User exists
			if (req.body.newData.person === "user") {
				User.findOne({ email: req.body.newData.email }).then((person) => {
					if (person) {
						return res.status(400).json({ email: "Email already exists!" });
					}
				});
				console.log("in try !");
				const avatar = gravatar.url(req.body.newData.email, {
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

				let newPerson = {
					username: req.body.newData.username,
					firstName: req.body.newData.firstName,
					lastName: req.body.newData.lastName,
					email: req.body.newData.email,
					partener: req.body.newData.partener,
					type: req.body.newData.person,
					pass: req.body.newData.pass,
					avatar,
					regDate: year + "-" + month + "-" + date,
				};

				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newPerson.pass, salt, (err, hash) => {
						if (err) throw err;
						newPerson.pass = hash;

						User.update({ _id: req.body.id }, { $set: newPerson }).then((resp) => {
							console.log(resp);
						});
					});
				});
			}
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
