const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const { check, validationResult } = require("express-validator");
const adminauth = require("../middleware/adminauth");
// const Admin = require("../models/Admin");
const User = require("../models/User");

//@route  GET api/adminauth/test
//@desc   Test Admin Route
//@access Private
// router.get("/test", adminauth, (req, res) => {
// 	res.send("Admin works!");
// });

//@route  GET api/admin
//@desc   Test Loggen In Admin Data
//@access Private
router.get("/", adminauth, async (req, res) => {
	try {
		User.findById(req.admin.id).then((admin) => {
			res.json(admin);
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

//@route  GET api/admin/getadmins
//@desc   Get all admins
//@access Public
router.get("/getadmins", (req, res) => {
	User.find().then((allAdmins) => {
		res.send(allAdmins);
	});
});

//@route  DELETE api/admin/deleteadmin
//@desc   Delete Admin by id
//@access Public
router.delete("/deleteadmin", (req, res) => {
	User.findOneAndDelete({ _id: req.query.id }).then((resp) => {
		console.log(resp);
		res.send(resp);
	});
});

//@route  PUT api/admin/updateadmin
//@desc   Update Admin by id
//@access Public
router.put(
	"/updateadmin",
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
		// const errors = validationResult(req.body);
		// console.log("Out Error !");
		// console.log(errors);
		// if (!errors.isEmpty()) {
		// 	console.log("in Error !");
		// 	return res.status(400).json({ errors: errors.array() });
		// }
		try {
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
				pass: req.body.newData.pass,
				avatar,
				regDate: year + "-" + month + "-" + date,
			};

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newPerson.pass, salt, (err, hash) => {
					if (err) throw err;
					newPerson.pass = hash;
					// Admin.findOneAndUpdate({ _id: req.body.id }, req.body.newData);
					// console.log(newPerson);
					Admin.update({ _id: req.body.id }, { $set: newPerson }).then((resp) => {
						console.log(resp);
					});
					// newPerson
					// 	.save()
					// 	.then((newperson) => res.json({ newperson }))
					// 	.catch((err) => console.log(err));
				});
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

module.exports = router;
