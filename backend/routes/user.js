const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const gravatar = require('gravatar');
const userauth = require('../middleware/userauth');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const createShift = require('../models/createShift');
const Notification = require('../models/Notifications');
const History = require('../models/notificationsHistory');
const NotificationEmail = require('../models/notificationEmail');
const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');
const saltRounds = 10;
const nodemailer = require('nodemailer');

const getNotificationEmail = async () => {
	let notiEmail = await NotificationEmail.findOne({});
	if (notiEmail) {
		return notiEmail.email;
	} else {
		return 'softthrivetest@gmail.com';
	}
};
//@route  GET api/user/test
//@desc   Test User Route
//@access Private
router.get('/test', userauth, (req, res) => {
	res.send('User works!');
});

//@route  GET api/user
//@desc   Test Loggen In User Data
//@access Private
router.get('/', userauth, async (req, res) => {
	try {
		User.findById(req.user.id).then((user) => {
			res.json(user);
		});
	} catch (err) {
		console.log(err.message);
		res.status(500).send('Server Error');
	}
});

router.put('/updatingshift', async (req, res) => {
	console.log('iddsss 111', req.body.id);
	console.log('idsss in ', req.body.shiftid);
	try {
		createShift.findByIdAndUpdate(req.body.id, { shiftTypeId: req.body.shiftid }).then((data) => {
			console.log('afterupdate', data);
			res.send('confirm');
			// const token = jwt.sign({userid: User._id}, jwtkey);
			// res.send({token});
		});
	} catch (error) {
		res.send('error while updating');
	}
});

router.put('/editshift12', async (req, res) => {
	try {
		createShift.findByIdAndUpdate(req.body.id, { shiftTypeId: req.body.shiftid }).then((data) => {
			console.log('afterupdate', data);
			res.send('confirm');
			// const token = jwt.sign({userid: User._id}, jwtkey);
			// res.send({token});
		});
	} catch (error) {
		res.send('error while updating');
	}
});

router.post('/sendemail', async (req, res) => {
	console.log('nodemailer api from front end');
	let message = req.body.message;
	// create reusable transporter object using the default SMTP transport
	let transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		service: 'gmail', // true for 465, false for other ports

		ignoreTLS: false,
		secure: false,
		auth: {
			user: 'softthrivetest@gmail.com', // generated ethereal user
			pass: 'strong12345678', // generated ethereal password
		},
		tls: {
			// do not fail on invalid certs
			rejectUnauthorized: false,
		},
	});

	const mesage = {
		from: 'softthrivetest@gmail.com', // sender address
		// to: 'hmhcalls@gmail.com', // receiver
		to: getNotificationEmail(),
		subject: 'Information updated', // Subject line
		text: message, // plain text body
	};

	// send mail with defined transport object
	let info = await transporter.sendMail(mesage);

	console.log('Message sent: %s', info.messageId);
	// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

	// Preview only available when sending through an Ethereal account
	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
	// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
	res.send('Email Sent');
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
router.get('/getlastNameUser', (req, res) => {
	User.find()
		.sort({
			lastName: 1,
		})
		.then((allUsers) => {
			res.send(allUsers);
		})
		.catch((err) => {
			res.send(err);
		});
});
router.get('/getusers', (req, res) => {
	User.find()
		.sort({
			lastName: 1,
		})
		.then((allUsers) => {
			res.send(allUsers);
		})
		.catch((err) => {
			res.send(err);
		});
});
router.get('/getNotifcations', (req, res) => {
	Notification.find()
		.sort({
			regDate: 1,
		})
		// .populate('currentUserId')
		.populate('from')
		.populate('to')
		// .exec()
		.then((allUsers) => {
			res.send(allUsers);
		});
});
router.get('/getuser', (req, res) => {
	const { email, pass } = req.body;
	console.log(email);
	User.find({ email: email }).then((user) => {
		res.send(user);
	});
});

router.get('/getCurrentNotifications/:id', (req, res) => {
	const Id = req.params.id;
	Notification.find({
		currentUserId: Id,
	})
		.sort({
			regDate: 1,
		})
		.then((notifcations) => {
			res.send(notifcations);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/getCurrentUserNotificationsTo/:id', (req, res) => {
	const Id = req.params.id;
	Notification.find({
		to: Id,
	})
		.sort({
			regDate: 1,
		})
		.populate('currentUserId')
		.populate('to')
		.populate('from')
		.exec()
		.then((notifcations) => {
			res.send(notifcations);
		})
		.catch((err) => {
			console.log(err);
		});
});
router.get('/getCurrentUserNotificationsFrom/:id', (req, res) => {
	const Id = req.params.id;
	Notification.find({
		from: Id,
		status: 'pending',
	})
		.sort({
			regDate: 1,
		})
		.populate('currentUserId')
		.populate('to')
		.populate('from')
		.exec()
		.then((notifcations) => {
			res.send(notifcations);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.delete('/deleteAllNotifications', (req, res) => {
	Notification.remove()
		.then((resp) => {
			console.log(resp);
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.put('/updateResponses/:id', async (req, res) => {
	try {
		let newPerson = {
			message: 'Your shift has been exchanged. View Details',
			messageFrom: 'Your swap request for the shift has been accepted',
			status: 'accepted',
		};

		Notification.findOneAndUpdate({ _id: req.params.id }, { $set: newPerson })
			.then(async (resp) => {
				console.log(resp);
				console.log(resp.toObject());
				let sender = await User.findOne({ _id: resp.from });
				let secondUser = resp.to ? resp.to : resp.from;
				let receiver = await User.findOne({ _id: secondUser });

				console.log('sender => ', sender);
				console.log('receiver => ', sender);
				if (sender && receiver) {
					console.log('nodemailer api from front end');
					let message = 'Your Request for shift to:\n' + '\n' + sender.firstName + '\n' + 'for the Shift \n' + '\n' + resp.shiftName + ' call on \n' + '\n' + resp.regDate + '\n' + 'has been accepted.';
					// create reusable transporter object using the default SMTP transport
					let transporter = nodemailer.createTransport({
						host: 'smtp.gmail.com',
						port: 465,
						secure: true,
						service: 'gmail', // true for 465, false for other ports

						ignoreTLS: false,
						secure: false,
						auth: {
							user: 'softthrivetest@gmail.com', // generated ethereal user
							pass: 'strong12345678', // generated ethereal password
						},
						tls: {
							// do not fail on invalid certs
							rejectUnauthorized: false,
						},
					});

					const mesage = {
						from: 'softthrivetest@gmail.com', // sender address
						// to: 'hmhcalls@gmail.com', // receiver
						to: receiver.email,
						subject: 'Your Shift Request Accepted', // Subject line
						text: message, // plain text body
					};

					// send mail with defined transport object
					let info = await transporter.sendMail(mesage);

					console.log('Message sent: %s', info.messageId);
					// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

					// Preview only available when sending through an Ethereal account
					console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
				}

				res.send(resp);
			})
			.catch((err) => {
				res.send(err);
			});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

router.put('/updateResponsesandDelete/:id', async (req, res) => {
	try {
		let newPerson = {
			message: 'Your rejection response has been sent to the swap requester',
			messageFrom: 'Your swap request for the shift has been rejected',
		};

		Notification.update({ _id: req.params.id }, { $set: newPerson }).then((resp) => {
			console.log(resp);
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

router.delete('/deleteCurrentNotification/:id', (req, res) => {
	Notification.findByIdAndDelete({ _id: req.params.id }).then(async (resp) => {
		if (req.body.sendEmail) {
			let sender = await User.findOne({ _id: resp.from });
			let secondUser = resp.to ? resp.to : resp.from;
			let receiver = await User.findOne({ _id: secondUser });

			console.log('sender => ', sender);
			console.log('receiver => ', sender);
			if (sender && receiver) {
				console.log('nodemailer api from front end');
				let message = 'Your request for shift to:\n' + '\n' + sender.firstName + '\n' + 'for the shift \n' + '\n' + resp.shiftName + '\n' + 'has been rejected. \n';
				// create reusable transporter object using the default SMTP transport
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					service: 'gmail', // true for 465, false for other ports

					ignoreTLS: false,
					secure: false,
					auth: {
						user: 'softthrivetest@gmail.com', // generated ethereal user
						pass: 'strong12345678', // generated ethereal password
					},
					tls: {
						// do not fail on invalid certs
						rejectUnauthorized: false,
					},
				});

				const mesage = {
					from: 'softthrivetest@gmail.com', // sender address
					// to: 'hmhcalls@gmail.com', // receiver
					to: receiver.email,
					subject: 'Your Shift Request Rejected', // Subject line
					text: message, // plain text body
				};

				// send mail with defined transport object
				let info = await transporter.sendMail(mesage);

				console.log('Message sent: %s', info.messageId);
				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

				// Preview only available when sending through an Ethereal account
				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
				// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
			}
		}

		console.log(resp);
		res.send(resp);
	});
});

router.get('/getShiftTo/:id', (req, res) => {
	const userId = req.params.id;
	User.find({
		_id: userId,
	})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
		});

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
});

router.get('/getShiftFrom/:id', (req, res) => {
	createShift
		.find({
			_id: req.params.id,
		})
		.sort({ _id: -1 })
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then((shifts) => {
			res.status(200).json({
				shifts: shifts.map((shift) => {
					return {
						_id: shift._id,
						start: shift.start,
						priority: shift.shiftTypeId.priority,
						//shiftTypeId: shift.shiftTypeId,
						end: shift.end,
						title: shift.userId.firstName + ' ' + shift.userId.lastName,
						color: shift.shiftTypeId.color,
						swapable: shift.swapable,
						shifname: shift.shiftTypeId.shiftname,
						comment: shift.comment,
						status: shift.offApprovalStatus,
					};
				}),
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/getSpecificNotification/:id', (req, res) => {
	Notification.find({
		_id: req.params.id,
	})
		.populate('to')
		.populate('from')
		.populate('shiftFrom')
		.exec()
		// .then((notifions) => {
		// 	res.send(notifions)
		// })
		.then((shifts) => {
			// console.log(shifts);

			// userId, start, end, title, color
			res.status(200).json({
				shifts: shifts.map((shift) => {
					return {
						_id: shift._id,
						shiftId: shift.shiftFrom._id,
						date: shift.shiftFrom.start,
						user1Name: shift?.from?.firstName + ' ' + shift?.from?.lastName,
						user2Name: shift.to?.firstName + ' ' + shift.to?.lastName,
						user1Email: shift.from?.email,
						user2Email: shift.to?.email,
						user1Type: shift.from?.type,
						user2Type: shift.to.type,
					};
				}),
			});
		})
		// .then(notifications => {
		// 	res.status(200).json({
		// 		notification : notifications.map(notification => {
		// 			// res.send(notification)
		// 			return{
		//   _id : shift._id,
		//   shiftId: shift.shiftFrom._id,
		//   shiftId: shift.shiftFrom.start,
		//   user1Name: shift.from.firstName+' '+shift.from.lastName,
		//   user2Name: shift.to.firstName+' '+shift.to.lastName,
		//   user1Email: shift.from.email,
		//   user2Email: shift.to.email,
		//   user1Type: shift.from.type,
		//   user2Type: shift.to.type,
		// 			}
		// 		})
		// 	})

		// })

		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
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

router.get('/AllNotifications', (req, res) => {
	Notification.find()
		.sort({ _id: -1 })
		.then((resp) => {
			//   console.log(res)
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.post('/userNotification', (req, res) => {
	console.log(req.body);
	if (req.body === null) res.status(400).send('Bad Request');
	let newNotification = new Notification({
		shiftFrom: req.body.shiftId1,
		currentUserId: req.body.currentUserId,
		from: req.body.userId1,
		to: req.body.userId2 ? req.body.userId2 : req.body.userId1,
		message: req.body.message,
		adminresponse: req.body.adminresponse,
		regDate: req.body.date,
		requesterType: req.body.requester,
		messageFrom: req.body.messageFrom,
		shiftName: req.body.shiftName,
		requestStatus: req.body.requestStatus,
		shifttypeid: req.body.shiftIdforn,
		status: 'pending',
		adminEdit: req.body.adminEdit,
		adminSwaped: req.body.adminSwaped,
	});

	console.log('Notification created as: 2' + newNotification);
	newNotification
		.save()
		.then(async (newShift) => {
			let receiver = await User.findOne({ _id: req.body.userId1 });
			let secondUser = req.body.userId2 ? req.body.userId2 : req.body.userId1;
			let sender = await User.findOne({ _id: secondUser });

			console.log('receiver => ', receiver);
			console.log('sender => ', sender);

			if (sender && receiver) {
				console.log('nodemailer api from front end');
				let message = 'Following User Request for shift :\n' + '\n' + sender.firstName + '\n' + 'Following is the Shift Requested \n' + '\n' + req.body.shiftName + '\n' + 'Following is Shift Date \n' + '\n' + req.body.date;
				// create reusable transporter object using the default SMTP transport
				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					service: 'gmail', // true for 465, false for other ports

					ignoreTLS: false,
					secure: false,
					auth: {
						user: 'softthrivetest@gmail.com', // generated ethereal user
						pass: 'strong12345678', // generated ethereal password
					},
					tls: {
						// do not fail on invalid certs
						rejectUnauthorized: false,
					},
				});

				const mesage = {
					from: 'softthrivetest@gmail.com', // sender address
					// to: 'hmhcalls@gmail.com', // receiver
					to: receiver.email,
					subject: 'A Shift Swap Request', // Subject line
					text: message, // plain text body
				};

				// send mail with defined transport object
				let info = await transporter.sendMail(mesage);

				console.log('Message sent: %s', info.messageId);
				// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

				// Preview only available when sending through an Ethereal account
				console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
				// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
			}
			return res.send(newShift);
		})
		.catch((err) => console.log(err));
});

router.delete('/deleteAndUpdateUsers', (req, res) => {
	User.remove()
		.then((resp) => {
			console.log('All Users and Admins deleted');
			res.send(resp);
		})
		.catch((err) => {
			console.log('User delete failed: ' + err);
		});
});

router.get('/getCurrenUserNotificationName/:id', (req, res) => {
	User.findById(req.params.id)
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

//@route  DELETE api/user/deleteuser
//@desc   Delete user by id
//@access Public
router.delete('/deleteuser', (req, res) => {
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

router.get('/getUserDetail/:id', (req, res) => {
	const userDate = req.params.id;
	User.findOne({
		_id: userDate,
	})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/deleteShiftForOneUser/:id', (req, res) => {
	const removedUserId = req.params.id;
	createShift
		.deleteMany({ userId: removedUserId })
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
	// createShift.findByIdAndDelete({ userId: req.params.id })
	// 	.then((resp) => {
	// 		console.log(resp);
	// 		res.send(resp);
	// 	})
	// 	.catch((err) => {
	// 		  res.send(err);

	// 	});
});

router.put(
	'/updateMe',
	[
		check('email', 'Please enter a valid email.').not().isEmpty(),
		check('firstName', 'Please enter a first name.').not().isEmpty(),
		check('lastName', 'Please enter a last name.').not().isEmpty(),
		check('username', 'Please enter a Username.').not().isEmpty(),
		check('pass', 'Please enter a Password.').not().isEmpty(),
	],
	async (req, res) => {
		try {
			let newPerson = {
				email: req.body.newData.email,
				firstName: req.body.newData.firstName,
				lastName: req.body.newData.lastName,
				username: req.body.newData.username,
				pass: req.body.newData.pass,
			};

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newPerson.pass, salt, (err, hash) => {
					if (err) throw err;
					newPerson.pass = hash;
					// Admin.findOneAndUpdate({ _id: req.body.id }, req.body.newData);
					// console.log(newPerson);
					User.update({ _id: req.body.id }, { $set: newPerson }).then((user) => {
						res.send({ email: req.body.newData.email, firstname: req.body.newData.firstName, lastname: req.body.newData.lastName, username: req.body.newData.username });
					});
					// newPerson
					// 	.save()
					// 	.then((newperson) => res.json({ newperson }))
					// 	.catch((err) => console.log(err));
				});
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	},
);

router.put(
	'/updateSuperAdmin',
	[
		check('email', 'Please enter a valid email.').not().isEmpty(),
		//   check("firstName", "Please enter a first name.").not().isEmpty(),
		//   check("lastName", "Please enter a last name.").not().isEmpty(),
		//   check("username", "Please enter a Username.").not().isEmpty(),
		check('pass', 'Please enter a Password.').not().isEmpty(),
	],
	async (req, res) => {
		try {
			let newPerson = {
				email: req.body.newData.email,
				// firstName: req.body.newData.firstName,
				// lastName: req.body.newData.lastName,
				// username: req.body.newData.username,
				pass: req.body.newData.pass,
			};

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newPerson.pass, salt, (err, hash) => {
					if (err) throw err;
					newPerson.pass = hash;
					// Admin.findOneAndUpdate({ _id: req.body.id }, req.body.newData);
					// console.log(newPerson);
					SuperAdmin.update({ _id: req.body.id }, { $set: newPerson }).then((resp) => {
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
			res.status(500).send('Server error');
		}
	},
);

router.get('/getMyDetails/:id', (req, res) => {
	User.findOne({
		_id: req.params.id,
	})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});
router.get('/getSuperAdminDetails/:id', (req, res) => {
	SuperAdmin.findOne({
		_id: req.params.id,
	})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});
//@route  PUT api/user/updateuser
//@desc   Update user by id
//@access Public
router.put(
	'/updateuser',
	[
		check('username', 'Please enter a valid username.').not().isEmpty(),
		check('firstName', 'Please enter a valid firstname.').not().isEmpty(),
		check('lastName', 'Please enter a valid lastname.').not().isEmpty(),
		// username must be an email
		check('email', 'Please enter a valid email.').isEmail(),
		// password must be at least 5 chars long
		check('pass', 'Enter password of atleast 6 characters.').isLength({
			min: 6,
		}),
	],
	async (req, res) => {
		try {
			let newPerson = {
				username: req.body.newData.username,
				firstName: req.body.newData.firstName,
				lastName: req.body.newData.lastName,
				email: req.body.newData.email,
				partener: req.body.newData.partener,
				type: req.body.newData.person,
				pass: req.body.newData.pass,
			};

			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newPerson.pass, salt, (err, hash) => {
					if (err) throw err;
					newPerson.pass = hash;
					// Admin.findOneAndUpdate({ _id: req.body.id }, req.body.newData);
					// console.log(newPerson);
					User.update({ _id: req.body.id }, { $set: newPerson }).then((resp) => {
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
			res.status(500).send('Server error');
		}
	},
	// let newPerson = {
	// 	username: req.body.newData.username,
	// 	firstName: req.body.newData.firstName,
	// 	lastName: req.body.newData.lastName,
	// 	email: req.body.newData.email,
	// 	partener: req.body.newData.partener,
	// 	type: req.body.newData.person,
	// 	pass: req.body.newData.pass,
	// 	avatar,
	// 	regDate: year + "-" + month + "-" + date,
	// };

	// bcrypt.genSalt(10, (err, salt) => {
	// 	bcrypt.hash(newPerson.pass, salt, (err, hash) => {
	// 		if (err) throw err;
	// 		newPerson.pass = hash;

	// 		Admin.update({ _id: req.body.id }, { $set: newPerson }).then((resp) => {
	// 			console.log(resp);
	// 		});
	// 	});
	// });
);

router.post('/createUserFromExcel', async (req, res) => {
	var hasheduserArray = [];
	const userArray = req.body;
	console.log(userArray);
	var hashArray = [];
	// console.log(userArray)
	// console.log('Array recieved to backend')

	for (const user of userArray) {
		await bcrypt.hash(user.pass, saltRounds, function (err, hash) {
			if (err) {
				return res.status(500).json({
					error: err,
				});
			} else {
				user.pass = hash;
				hashArray.push(user);
				if (hashArray.length == userArray.length) {
					// console.log("hashArray");
					// console.log(hashArray);
					hashArray.forEach((tempObj) => {
						var user = new User({
							username: tempObj.username,
							firstName: tempObj.firstName,
							lastName: tempObj.lastName,
							email: tempObj.email,
							type: tempObj.type,
							pass: tempObj.pass,
							avatar: tempObj.avatar,
							regDate: tempObj.regDate,
							partener: tempObj.partener,
						});
						hasheduserArray.push(user);
					});

					if (userArray.length == hasheduserArray.length) {
						// console.log(hasheduserArray)
						var i = 0;
						hasheduserArray.forEach((user) => {
							user.save();
							i++;
							if (i == hasheduserArray.length) {
								res.status(201).json({ message: 'users added successfully' });
							}
						});
					}
				}
			}
		});
	}
});

////////////////Notifications History API'S

router.post('/createNotificationHistory', (req, res) => {
	console.log(req.body);
	if (req.body === null) res.status(400).send('Bad Request');
	let newNotification = new History({
		shiftFrom: req.body.shiftId1,
		currentUserId: req.body.currentUserId,
		from: req.body.userId1,
		to: req.body.userId2 ? req.body.userId2 : req.body.userId1,
		message: req.body.message,
		adminresponse: req.body.adminresponse,
		regDate: req.body.date,
		requesterType: req.body.requester,
		messageFrom: req.body.messageFrom,
		shiftName: req.body.shiftName,
		requestStatus: req.body.requestStatus,
		adminEdit: req.body.adminEdit,
	});
	console.log('Notification created as: 1' + newNotification);
	newNotification
		.save()
		.then(async (newShift) => {
			if (!req.body.update) {
				let sender = await User.findOne({ _id: req.body.userId1 });
				let secondUser = req.body.userId2 ? req.body.userId2 : req.body.userId1;
				let receiver = await User.findOne({ _id: secondUser });

				console.log('sender => ', sender);
				console.log('receiver => ', sender);

				if (sender && receiver) {
					console.log('nodemailer api from front end');
					let message = 'Following User Request for shift :\n' + '\n' + sender.firstName + '\n' + 'Following is the Shift Requested \n' + '\n' + req.body.shiftName + '\n' + 'Following is Shift Date \n' + '\n' + req.body.date;
					// create reusable transporter object using the default SMTP transport
					let transporter = nodemailer.createTransport({
						host: 'smtp.gmail.com',
						port: 465,
						secure: true,
						service: 'gmail', // true for 465, false for other ports

						ignoreTLS: false,
						secure: false,
						auth: {
							user: 'softthrivetest@gmail.com', // generated ethereal user
							pass: 'strong12345678', // generated ethereal password
						},
						tls: {
							// do not fail on invalid certs
							rejectUnauthorized: false,
						},
					});

					const mesage = {
						from: 'softthrivetest@gmail.com', // sender address
						// to: 'hmhcalls@gmail.com', // receiver
						to: receiver.email,
						subject: 'A Shift Swap Request', // Subject line
						text: message, // plain text body
					};

					// send mail with defined transport object
					let info = await transporter.sendMail(mesage);

					console.log('Message sent: %s', info.messageId);
					// Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

					// Preview only available when sending through an Ethereal account
					console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
					// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
				}
			}

			return res.send(newShift);
		})
		.catch((err) => console.log(err));
});

router.get('/getHistory', (req, res) => {
	History.find().then((allUsers) => {
		res.send(allUsers);
	});
});

// router.get("/getEventHistory/:id", (req, res) => {
// 	History.find({
// 		shiftFrom : req.params.id
// 	})
// 	.then((allUsers) => {
// 		res.send(allUsers);
// 	})
// 	.catch((err) => {
// 		res.send(err)
// 	})
// });

router.get('/getEventHistory/:id', async (req, res) => {
	const id = req.params.id;
	History.find({
		shiftFrom: id,
	})
		.populate('currentUserId')
		.populate('from')
		.populate('to')
		.populate('shiftFrom')
		.exec()
		//   .then((history)=>{
		// 	  res.send(history)
		//   })
		.then(async (shifts) => {
			console.log(shifts);
			res.status(200).json({
				shifts: shifts.map((shift) => {
					// console.log(shift.title)
					if (shift.requesterType === 'Super Admin') {
						return {
							_id: shift._id,
							doctorAssigned: shift.to?.firstName + ' ' + shift.to?.lastName,
							shiftName: shift.shiftName,
							swappingDate: shift.regDate,
							shiftDate: shift.shiftFrom.start,
							modifiedBy: 'soondubu@gmail.com',
						};
					} else {
						return {
							_id: shift._id,
							doctorAssigned: shift.to?.firstName + ' ' + shift.to?.lastName,
							shiftName: shift.shiftName,
							swappingDate: shift.regDate,
							shiftDate: shift.shiftFrom.start,
							modifiedBy: shift.currentUserId.email,
						};
					}
				}),
			});
		})
		//   .then(async (history) => {
		// 	console.log(history);
		// 	res.status(200).json({
		// 		history: history.map(shift => {
		// 		console.log(shift.title)
		// 		return {
		// 		  _id: shift._id,
		// 		  doctorAssigned: shift.to.firstName+ ' ' +shift.to.lastName,
		// 		  shiftName: shift.shiftName,
		// 		  swappingDate: shift.regDate,
		// 		  shiftDate: shift.shiftFrom.start,
		// 		  email: shift.currentUserId.email
		// 		}
		// 	  })
		// 	})
		//   })
		.catch((err) => {
			res.send(err);
		});
});

router.get('/deleteEventHistory', (req, res) => {
	History.deleteMany()
		.then((allUsers) => {
			res.send(allUsers);
		})
		.catch((err) => {
			res.send(err);
		});
});

module.exports = router;
// let newPerson = {
// 	username: req.body.newData.username,
// 	firstName: req.body.newData.firstName,
// 	lastName: req.body.newData.lastName,
// 	email: req.body.newData.email,
// 	partener: req.body.newData.partener,
// 	type: req.body.newData.person,
// 	pass: req.body.newData.pass,
// 	avatar,
// 	regDate: year + "-" + month + "-" + date,
// };
