const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const gravatar = require("gravatar");
const userauth = require("../middleware/userauth");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const createShift = require("../models/createShift");
const Notification = require("../models/Notifications");
const Admin = require("../models/Admin");
const saltRounds = 10;

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
// router.get("/getusers", (req, res) => {
// 	User.find().then((allUsers) => {
// 		res.status(200).json({
// 			count:allUsers.length,
// 			users : allUsers
// 		});
// 	});
// });
router.get("/getusers", (req, res) => {
	User.find().then((allUsers) => {
		res.send(allUsers);
	});
});
router.get("/getNotifcations", (req, res) => {
	Notification.find().then((allUsers) => {
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

router.get("/getCurrentUserNotificationsTo/:id", (req,res) => {
	const Id = req.params.id;
	Notification.find({
		to : Id
		})
	.then((notifcations)=> {
		res.send(notifcations)
	})
	.catch((err)=> {
		console.log(err);
	})
})
router.get("/getCurrentUserNotificationsFrom/:id", (req,res) => {
	const Id = req.params.id;
	Notification.find({
		from : Id
		})
	.then((notifcations)=> {
		res.send(notifcations)
	})
	.catch((err)=> {
		console.log(err);
	})
})

router.delete("/deleteAllNotifications", (req, res) => {
	Notification.remove().then((resp) => {
	  console.log(resp);
	  res.send(resp);
	})
	.catch((err)=> {
		console.log(err)
	})
  });

  router.delete("/deleteCurrentNotification/:id", (req, res) => {
	Notification.findByIdAndDelete({ _id: req.params.id })
	.then((resp) => {
	  console.log(resp);
	  res.send(resp);
	});
  });

  router.get('/getShiftTo/:id', (req,res)=> {
	const userId = req.params.id
	User.find({
		_id : userId
	})
	.then((resp) => {
		res.send(resp)
	})
	.catch((err) => {
		console.log(err)
	})

	//   Notification.find({
	// 	  _id: req.params.id
	//   })
// 	  createShift.find({
// 		_id: req.params.id
// 	})
// 	.sort({_id:-1})
// 	.populate('userId')
// 		.populate('shiftTypeId')
// 		.exec()
// 		.then(shifts => {
// 			res.status(200).json({
// 			shifts : shifts.map(shift => {
// 				return {
// 					_id : shift._id,
// 					start : shift.start,
// 					priority : shift.shiftTypeId.priority,
// 					//shiftTypeId: shift.shiftTypeId,
// 					end : shift.end,
// 					title : shift.userId.firstName+" " +shift.userId.lastName,
// 					color : shift.shiftTypeId.color,
// 					swapable: shift.swapable,
// 					shifname: shift.shiftTypeId.shiftname,
// 					comment: shift.comment,
// 					status: shift.offApprovalStatus
// 				}
				
// 				})
// 			})
// 			})
//     .catch(err=> {
//       res.status(500).json({
//         error : err
//       })
// })


})

  router.get('/getShiftFrom/:id', (req,res)=> {
	createShift.find({
		_id: req.params.id
	})
	.sort({_id:-1})
	.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then(shifts => {
			res.status(200).json({
			shifts : shifts.map(shift => {
				return {
					_id : shift._id,
					start : shift.start,
					priority : shift.shiftTypeId.priority,
					//shiftTypeId: shift.shiftTypeId,
					end : shift.end,
					title : shift.userId.firstName+" " +shift.userId.lastName,
					color : shift.shiftTypeId.color,
					swapable: shift.swapable,
					shifname: shift.shiftTypeId.shiftname,
					comment: shift.comment,
					status: shift.offApprovalStatus
				}
				
				})
			})
			})
    .catch(err=> {
      res.status(500).json({
        error : err
      })
})
})

router.get("/getSpecificNotification/:id", (req, res) => {
	Notification.findOne({
		_id: req.params.id
	})
	.populate("to")
	.populate("from")
	.populate("shiftFrom")
	.exec()
	.then((notification) => {
		res.send(notification)
	})
    .catch(err=> {
      res.status(500).json({
        error : err
      })
})

});


// router.get('/getSuperNotifcations/:id', (req,res)=> {
// 	console.log(req.params.id)
// 	Notification.findOne({
// 		_id: req.params.id
// 	})
// 	.then((res)=>{
// 		res.send(res)
// 	})
//     .catch(err=> {
//       res.status(500).json({
//         error : err
//       })
// })
// })


  router.get('/AllNotifications',(req,res)=>{
	  Notification.find()
	  .sort({_id:-1})
	  .then((resp)=>{
		//   console.log(res)
		  res.send(resp)
	  })
	  .catch((err) => {
		  res.send(err)
	  })
  })

router.post("/userNotification", (req, res) => {
    console.log(req.body);
  if (req.body === null) res.status(400).send("Bad Request");
  let newNotification = new Notification({
    shiftFrom:  req.body.shiftId1,
    currentUserId: req.body.currentUserId,
	from:       req.body.userId1,
    to:     req.body.userId2,
	message:  req.body.message,
	adminresponse: req.body.adminresponse,
	regDate:  req.body.date,
	requesterType: req.body.requester,
	messageFrom: req.body.messageFrom,
	requestStatus:req.body.requestStatus
  });

  console.log("Notification created as: "+newNotification)
  newNotification
    .save()
    .then((newShift) => res.send(newShift))
    .catch((err) => console.log(err));
});

router.delete("/deleteAndUpdateUsers", (req, res) => {
	User.remove()
	.then((resp) => {
	  console.log('All Users and Admins deleted');
	  res.send(resp)
	})
	.catch((err) => 
		{
			console.log('User delete failed: '+err)
		}
	)
	

	  
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


router.get("/getUserDetail/:id",(req,res) => {
	const userDate = req.params.id
	User.findOne({
		_id: userDate
	})
	.then((resp) => {
		res.send(resp)
	})
	.catch((err) => {
		console.log(err)
	})
})

router.get("/deleteShiftForOneUser/:id", (req, res) => {
	const removedUserId = req.params.id
	createShift.deleteMany({userId: removedUserId})
	.then((resp)=>{
		res.send(resp)
	})
	.catch((err) => {
		res.send(err)
	})
	// createShift.findByIdAndDelete({ userId: req.params.id })
	// 	.then((resp) => {
	// 		console.log(resp);
	// 		res.send(resp);
	// 	})
	// 	.catch((err) => {
	// 		  res.send(err);
			
	// 	});
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
				// Admin.findOne({ email: req.body.newData.email }).then((person) => {
				// 	if (person) {
				// 		return res.status(400).json({ email: "Email already exists!" });
				// 	}
				// });
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
				// User.findOne({ email: req.body.newData.email }).then((person) => {
				// 	if (person) {
				// 		return res.status(400).json({ email: "Email already exists!" });
				// 	}
				// });
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

router.post("/createUserFromExcel",async(req,res) => {
	var hasheduserArray = [];
	const userArray = req.body;
	console.log(userArray)
	var hashArray = [];
   	// console.log(userArray)
	// console.log('Array recieved to backend')

	for(const user of userArray){
	
	await bcrypt.hash(user.pass, saltRounds, function(err,hash){
		if(err){
			return res.status(500).json({
				error: err
			})
		}else{
			user.pass = hash;
			hashArray.push(user)
			if(hashArray.length == userArray.length){
				// console.log("hashArray");
				// console.log(hashArray);
				hashArray.forEach(tempObj => {
					var user = new User({
						username : tempObj.username,
						firstName : tempObj.firstName,
						lastName : tempObj.lastName,
						email:tempObj.email,
						type:tempObj.type,
						pass:tempObj.pass,
						avatar:tempObj.avatar,
						regDate:tempObj.regDate,
						partener:tempObj.partener
					});
					hasheduserArray.push(user);

				});

				if(userArray.length == hasheduserArray.length){
					// console.log(hasheduserArray)
					var i = 0;
					hasheduserArray.forEach(user=>{
						user.save();
						i++;
						if(i==hasheduserArray.length){
							res.status(201).json({message:"users added successfully"})
						}
					})
					
				}
			}	
		}
	})


	}

})


   
module.exports = router;
