const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const gravatar = require("gravatar");
const superadminauth = require("../middleware/superadminauth");
const { check, validationResult } = require("express-validator");
const SuperAdmin = require("../models/SuperAdmin");

//@route  GET api/superadminauth/test
//@desc   Test Super Admin Route
//@access Private
router.get("/test", superadminauth, (req, res) => {
	res.send("Super Admin works!");
});

//@route  GET api/superadmin
//@desc   Test Loggen In SuperAdmin Data
//@access Private
router.get("/", superadminauth, async (req, res) => {
	try {
		SuperAdmin.findById(req.superadmin.id).then((superadmin) => {
			res.json(superadmin);
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
