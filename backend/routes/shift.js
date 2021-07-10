const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const gravatar = require('gravatar');
const userauth = require('../middleware/userauth');
const { check, validationResult } = require('express-validator');
const Shift = require('../models/Shift');
const createShift = require('../models/createShift');
const NotificationEmail = require('../models/notificationEmail');
const User = require('../models/User');
const Notifications = require('../models/Notifications');
var nodemailer = require('nodemailer');
var bodyParser = require('body-parser');
router.use(bodyParser.json());
var multer = require('multer');
const { eventNames } = require('../models/Shift');
const { assign } = require('nodemailer/lib/shared');

const getNotificationEmail = async () => {
	let notiEmail = await NotificationEmail.findOne({});
	if (notiEmail) {
		console.log(notiEmail);
		return notiEmail.email;
	} else {
		return 'softthrivetest@gmail.com';
	}
};

//@route  GET api/shift/getshift
//@desc   Get all shift
//@access Public

router.get('/getshifts', (req, res) => {
	Shift.find()
		.sort({
			priority: 1,
		})
		.then((allShift) => {
			res.send(allShift);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/filterShift/:id', (req, res) => {
	const id = req.params.id;

	// console.log("Name searched with id = " + id);

	// createShift.find({ shiftTypeId: { $nin: id } })
	// .populate('userId')
	// .populate('shiftTypeId')
	// .sort({
	//   priority : 1
	// })
	// .exec()
	// .then(async (shifts) => {
	//   console.log(shifts);
	//   res.status(200).json({
	//     shifts: shifts.map(shift => {
	//       console.log(shift.title)
	//       return {
	//         _id: shift._id,
	//         start: shift.start,
	//         end: shift.end,
	//         title: shift.shiftTypeId.shiftname + ":" + " " + shift.userId.firstName.charAt(0) + " " + shift.userId.lastName,
	//         color: shift.shiftTypeId.color,
	//         swapable: shift.swapable
	//       }
	//     })
	//   })
	// });
	console.log('shifts');
	createShift
		.find({ shiftTypeId: { $nin: id } })
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then((shifts) => {
			// console.log(shifts);

			// userId, start, end, title, color
			res.status(200).json({
				shifts: shifts.map((shift) => {
					return {
						_id: shift._id,
						start: shift.start,
						priority: shift.shiftTypeId.priority,
						end: shift.end,
						shiftname: shift.shiftTypeId.shiftname,
						requestApprovalStatus: shift.requestApprovalStatus,
						title: shift.shiftTypeId.shiftname + ':' + ' ' + shift.userId.firstName.charAt(0) + ' ' + shift.userId.lastName,
						color: shift.shiftTypeId.color,
						swapable: shift.swapable,
						userId: shift.userId._id,
						userType: shift.userId.type,
						comment: shift.comment,
						offApprovalStatus: shift.offApprovalStatus,
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

router.delete('/deletetypes', (req, res) => {
	Shift.deleteMany()
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
		});
});

//@route  DELETE api/shift/deleteshift
//@desc   Delete shift by id
//@access Public
router.delete('/deleteshift', (req, res) => {
	Shift.findOneAndDelete({ _id: req.query.id })
		.then(async (resp) => {
			var transport = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				requireTLS: true,
				auth: {
					// enter your account details to send email from
					user: 'softthrivetest@gmail.com', // generated ethereal user
					pass: 'strong12345678', // generated ethereal password
				},
			});

			console.log('email => ', getNotificationEmail());
			var mailOptions = {
				from: 'softthrivetest@gmail.com',
				to: await getNotificationEmail(),
				subject: 'Shift deleted',
				html: '<p> The following shift ' + resp.shiftname + ' has been deleted.</p>',
			};

			transport.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: %s', info.messageId);
			});

			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.delete('/deleteMyshift/:id', (req, res) => {
	createShift
		.findOneAndDelete({ _id: req.params.id })
		.then((resp) => {
			console.log(resp);
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.delete('/deleteshiftUser', (req, res) => {
	createShift.findOneAndDelete({ _id: req.query.id }).then((resp) => {
		console.log(resp);
		res.send(resp);
	});
});

router.delete('/deleteAllShifts', (req, res) => {
	createShift.remove().then((resp) => {
		console.log(resp);
		res.send(resp);
	});
});

router.post('/createShiftsFromExcel', (req, res) => {
	const shiftsArray = req.body;
	let temp = [];
	shiftsArray.forEach((eachShift) => {
		const shift = new createShift({
			userId: eachShift.userId,
			start: eachShift.start,
			end: eachShift.end,
			shiftTypeId: eachShift.shiftTypeId,
			swapable: eachShift.swappable,
		});
		temp.push(shift);
	});
	console.log('Temp array');
	// console.log(temp);
	console.log('Array of Shifts recieved to backend');

	temp.forEach((tempObj) => {
		tempObj
			.save()
			.then((obj) => console.log(obj))
			.catch((err) => console.log('Could not saved shifts from excel', err));
	});

	res.status(201).json({
		message: 'users added successfully',
	});
});

router.get('/currentAll', (req, res) => {
	createShift
		.find()
		.populate('shiftTypeId')
		.populate('userId')
		.exec()
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/getTwoDates/:start/:end', (req, res) => {
	const startDate = req.params.start;
	const endDate = req.params.end;

	// const start1 = startDate.substring

	createShift
		.find({
			end: { $lte: endDate },
			start: { $gte: startDate },
		})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/getEventsBetweenTwoDates/:start/:end', (req, res) => {
	const startDate = req.params.start;
	const endDate = req.params.end;

	// const start1 = startDate.substring

	createShift
		.find({
			end: { $lte: endDate },
			start: { $gte: startDate },
		})
		.sort({
			start: 1,
		})
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then((shifts) => {
			// console.log(shifts);
			res.status(200).json({
				shifts: shifts.map((shift) => {
					// console.log(shift.title);
					if (shift.shiftTypeId.shiftname === 'Heart') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							Heart: shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === 'Peds') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							Peds: shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === 'Night') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							Night: shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === 'OB Day') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							'OB Day': shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === 'OB Night') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							'OB Night': shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === '2nd') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							'2nd': shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === '3rd') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							'3rd': shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === 'Day') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							Day: shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname == 'Off') {
						//  let arr = shifts.filter((shft) => shft && shft.start && shft.start === shift.start && shft.shiftTypeId.shiftname == 'Off').map(sh => sh.userId.lastName +" "+sh.userId.firstName);
						let offUsers = shifts
							.filter((shft) => shft && shft.start && shft.start === shift.start && shft.shiftTypeId.shiftname == 'Off')
							.map((sh) => sh.userId.username)
							.join(' & ');
						// console.log(offUsers);
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							Off: shift.userId.username,
							// Off: offUsers,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === '4th') {
						return {
							// _id: shift._id,
							Date: shift.start,
							// shiftname: shift.shiftTypeId.shiftname,
							'4th': shift.userId.username,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else if (shift.shiftTypeId.shiftname === 'Request') {
						let requestUsers = shifts
							.filter((shft) => shft && shft.start && shft.start === shift.start && shft.shiftTypeId.shiftname == 'Request')
							.map((sh) => sh.userId.username)
							.join(' & ');
						// console.log(requestUsers);
						return {
							// _id: shift._id,
							Date: shift.start,
							// // shiftname: shift.shiftTypeId.shiftname,
							Request: shift.userId.username,
							// Request: requestUsers,
							// Name: shift.userId.lastName + ' ' + shift.userId.firstName,
						};
					} else {
						// console.log('***************');
						// console.log({ Date: shift.start, [shift.shiftTypeId.shiftname.trim()]: shift.userId.username });
						// console.log('***************');
						return { Date: shift.start, [shift.shiftTypeId.shiftname]: shift.userId.username };
					}
				}),
			});
		})
		.catch((err) => {
			res.status(500).json({
				message: 'Failed to get Shifts',
			});
		});
});

//Deleting all past data
router.get('/deleteEventsBetweenTwoDates/:start/:end', async (req, res, next) => {
	const startDate = req.params.start;
	const endDate = req.params.end;
	var array = [];
	await createShift
		.find({
			end: { $lte: endDate },
			start: { $gte: startDate },
		})
		.then((allShift) => {
			//res.send(allShift);
			for (let i = 0; i < allShift.length; i++) {
				array.push(allShift[i]);
			}
		});

	console.log('Array of Shift');
	// console.log(array)

	await array.forEach((eachEvent) => {
		createShift
			.remove({
				_id: eachEvent._id,
			})
			.exec();
	});
	res.status(201).json({
		message: 'SHIFTS ARE DELETED SUCCESSFULLY',
	});
	// console.log('Deleting index: '+array[1]._id);
	//  //  for(let i = 0 ; i < array.length ; i++){
	//   // console.log(array[i]._id)
	//   createShift.remove({
	//     _id : '5f648e9720a0a7134cb83d2c'
	//   })
	//   console.log('Deleted Arry index');
	//   console.log(array.length)
	// // }
});

router.delete('/deleteCurrentShift/:id', (req, res) => {
	const id = req.params.id;
	// console.log(id);
	createShift
		.remove({ _id: id })
		.exec()
		.then((result) => {
			Shift.findById(id)
				.exec()
				.then((shift) => {
					// console.log(shift);
					if (result.deletedCount > 0) {
						res.status(201).json({
							message: 'shift deleted successfully',
						});
					} else {
						res.status(404).json({
							message: 'no shift found',
						});
					}
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
	// Shift.findByIdAndDelete({ _id: req.params.id }).then((resp) => {
	//   console.log(resp);
	//   res.send(resp);
	// });
});

router.get('/getUserById/:id', (req, res) => {
	Shift.findById({
		_id: req.params.id,
	})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			console.log(err);
		});
});

router.get('/allShift', (req, res) => {
	createShift
		.find()
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/getUserByName/:id', async (req, res) => {
	const id = req.params.id;

	var shiftsList = [];
	// console.log('Name searched with id = ' + id);

	createShift
		.find({ userId: id })
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then(async (shifts) => {
			// console.log(shifts);
			res.status(200).json({
				shifts: shifts.map((shift) => {
					// console.log(shift.title);
					return {
						_id: shift._id,
						start: shift.start,
						end: shift.end,
						title: shift.shiftTypeId.shiftname + ':' + ' ' + shift.userId.firstName.charAt(0) + ' ' + shift.userId.lastName,
						color: shift.shiftTypeId.color,
						swapable: shift.swapable,
					};
				}),
			});
		});
});

router.post('/createShift', (req, res) => {
	// console.log(req.body);
	if (req.body === null) res.status(400).send('Bad Request');
	let newShift = new createShift({
		// _id :
		userId: req.body.userId,
		start: req.body.start,
		end: req.body.end,
		shiftTypeId: req.body.shiftTypeId,
		swapable: req.body.swapable,
		comment: req.body.comment,
		offApprovalStatus: req.body.offApprovalStatus,
		requestApprovalStatus: req.body.requestApprovalStatus,
	});

	// console.log('Shift created as: ' + newShift);
	newShift
		.save()
		.then(async (newShift) => {
			let user =await User.findOne({_id : newShift.userId})
			let shift =await Shift.findOne({_id : newShift.shiftTypeId})
			console.log(user , shift , "data to be send")
			var transport = nodemailer.createTransport({
				host: 'smtp.gmail.com',
				port: 587,
				secure: false,
				requireTLS: true,
				auth: {
					// enter your account details to send email from
					user: 'softthrivetest@gmail.com', // generated ethereal user
					pass: 'strong12345678', // generated ethereal password
				},
			});
			console.log('email => ',await getNotificationEmail());
			var mailOptions = {
				from: 'softthrivetest@gmail.com',
				to: await getNotificationEmail(),
				subject: 'Shift Created',
				html: '<p> The '+ shift.shiftname +' for ' +  newShift.start  +  ' has been created by '+ user.username +'</p>',
			};
			transport.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: %s', info.messageId);
			});
			res.send(newShift);
		})
		.catch((err) => console.log(err));
});

//Restriction of swap and unswap
// router.put('/restrict-swap/:id/:toggler', (req, res, next) => {
//   const thing = new createShift({
//     _id: req.params.id,
//     swapable: req.params.swapable
//   });
//   createShift.updateOne({_id: req.params.id}, thing).then(
//     () => {
//       res.status(201).json({
//         message: 'Thing updated successfully!'
//       });
//     }
//   ).catch(
//     (error) => {
//       res.status(400).json({
//         error: error
//       });
//     }
//   );
// });

router.get('/restrict-swap/:id/:swapable', (req, res) => {
	const id = req.params.id;
	createShift
		.findById(id)
		.exec()
		.then((shift) => {
			shift.swapable = req.params.swapable;
			shift
				.save()
				.then((shiftObj) => {
					res.status(201).json({
						message: 'shift updated successfully',
						shift: shiftObj,
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/updateRequestApproval/:id', (req, res) => {
	const shiftId = req.params.id;
	// console.log('Shift ID' + shiftId);
	createShift
		.findOne({
			_id: shiftId,
		})
		.exec()
		.then((shift) => {
			shift.requestApprovalStatus = 'approved';
			shift
				.save()
				.then((shiftObj) => {
					res.status(201).json({
						message: 'shift status changed successfully',
						shift: shiftObj,
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/updateApprovalStatustoFalse/:id', (req, res) => {
	const shiftId = req.params.id;
	// console.log('Shift IIIIIID' + shiftId);
	createShift
		.findOne({
			_id: shiftId,
		})
		.exec()
		.then((shift) => {
			shift.offApprovalStatus = 'Unapproved';
			shift
				.save()
				.then((shiftObj) => {
					res.status(201).json({
						message: 'shift status changed successfully',
						shift: shiftObj,
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/updateApprovalStatustoTrue/:id', (req, res) => {
	const shiftId = req.params.id;
	// console.log('Shift ID' + shiftId);
	createShift
		.findOne({
			_id: shiftId,
		})
		.exec()
		.then((shift) => {
			shift.offApprovalStatus = 'Approved';
			shift
				.save()
				.then((shiftObj) => {
					res.status(201).json({
						message: 'shift status changed successfully',
						shift: shiftObj,
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/RequestEvents', (req, res) => {
	createShift
		.find()
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then((shifts) => {
			res.status(200).json({
				shifts: shifts.map((shift) => {
					if (shift.shiftTypeId.shiftname === 'Request') {
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
							requestApproval: shift.requestApprovalStatus,
						};
					}
				}),
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/specificDateShifts/:date/:id', (req, res) => {
	createShift
		.find({
			start: req.params.date,
			userId: req.params.id,
		})
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
						userId: shift.userId._id,
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

router.get('/AllspecificDateShifts/:date', (req, res) => {
	createShift
		.find({
			start: req.params.date,
		})
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
						userId: shift.userId._id,
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

router.get('/specifictargetDateShifts/:date/:id', (req, res) => {
	createShift
		.find({
			start: req.params.date,
			userId: { $nin: req.params.id },
		})
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
						userId: shift.userId._id,
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
router.get('/AllOffEvents', (req, res) => {
	createShift
		.find()
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then((shifts) => {
			res.status(200).json({
				shifts: shifts.map((shift) => {
					if (shift.shiftTypeId.shiftname === 'Off') {
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
							offApprovalStatus: shift.offApprovalStatus,
						};
					}
				}),
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.get('/specificDateOffEvents/:start', (req, res) => {
	const startDate = req.params.start;
	createShift
		.find({
			start: { $gte: startDate },
		})
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then((shifts) => {
			res.status(200).json({
				shifts: shifts.map((shift) => {
					if (shift.shiftTypeId.shiftname === 'Off') {
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
							offApprovalStatus: shift.offApprovalStatus,
						};
					}
				}),
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});





router.get('/swapShiftUserbyAdmin/:shiftId/:userId', (req, res) => {
	const id = req.params.shiftId;
	const userId = req.params.userId;
	createShift
		.findOne({ _id: id })
		.exec()
		.then((shift) => {
			shift.userId = userId;
			shift
				.save()
				.then(async(shiftObj) => {
				console.log(id , userId , shift , "params , param , response")
			    var transport = nodemailer.createTransport({
				host: 'smtp.gmail.com',  //outgoing
				port: 587,
				secure: false,
				requireTLS: true,
				auth: {
					// enter your account details to send email from
					user: 'softthrivetest@gmail.com', // generated ethereal user
					pass: 'strong12345678', // generated ethereal password
				},
			});
			// console.log('email => ',await getNotificationEmail());
			var mailOptions = {
				from: 'softthrivetest@gmail.com',
				to: await getNotificationEmail(),
				subject: 'Shift transfered',
				 html: '<p> The'+ shift.shiftname +'for date :' +  newShift.start  +  'has been created by userName'+ user.username +'</p>',
			};
			transport.sendMail(mailOptions, (error, info) => {
				if (error) {
					return console.log(error);
				}
				console.log('Message sent: %s', info.messageId);
			});
			// res.send(newShift);
			})

					res.status(201).json({
						message: 'user swapped successfully',
						shift: shiftObj,
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})


router.get('/swapShiftUser/:shiftId/:userId/:userId1', (req, res) => {
	const id = req.params.shiftId;
	const userId = req.params.userId;
	const userid1 = req.params.userId1;
	createShift
		.findOne({ _id: id })
		.exec()
		.then((shift) => {
			// console.log(shift , "shift in first then")
			shift.userId = userId;
			shift
				.save()
				.then(async(shiftObj) => {
					console.log(userid1 , "userid1")
					console.log(id , userId , userid1 , shiftObj , shift.shiftTypeId , "shiftid , userid , shiftobjResponse");
					var shift1 = await Shift.findOne({_id : shift.shiftTypeId});
					var user1 = await User.findOne({_id : userId});
					var user2 = await User.findOne({_id : userid1 });

					console.log(shift1 , user1 , user2 , "shift1 , user1");

					var transport =await nodemailer.createTransport({
										host: 'smtp.gmail.com',
										port: 587,
										secure: false,
										requireTLS: true,
										auth: {
											// enter your account details to send email from
											user: 'softthrivetest@gmail.com', // generated ethereal user
											pass: 'strong12345678', // generated ethereal password
										},
									});
									console.log('email => ',await getNotificationEmail());
									var mailOptions = {
										from: 'softthrivetest@gmail.com',
										to: await getNotificationEmail(),
										subject: 'testing on approval',
									       html: '<p> The '+ shift1.shiftname +'for date : ' +  shiftObj.start  +  'has been transferred to userName '+ user1.username +  '</br> by '+ user2.username +'</p>',
									};
									 transport.sendMail(mailOptions, (error, info) => {
										if (error) {
											return console.log(error);
										}
										console.log('Message sent: %s', info.messageId);
									});

						res.status(201).json({
										message: 'user swapped successfully',
										shift: shiftObj,
				                    	})
									})
				
				.catch((err) => {
					console.log("in catch1")
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			console.log("in catch2")
			res.status(500).json({
				erroe: err,
			});
		});
});

router.get('/editCurrentShiftType/:id', (req, res) => {
	Shift.findOne({
		_id: req.params.id,
	})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/deleteThisShift/:id', (req, res) => {
	createShift
		.findByIdAndDelete(req.params.id)
		.then((resp) => {
			console.log(resp);

			res.send('Shift Deleted Successfully');
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/getShiftName/:id', (req, res) => {
	createShift
		.findOne({
			_id: req.params.id,
		})
		.populate('shiftTypeId')
		.exec()
		// .then((resp) => {
		//   res.send(resp)
		// })
		.then((shiftname) => {
			res.status(200).json({
				shiftname: shiftname.shiftTypeId.shiftname,
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});
router.get('/pendingShifts/:myid', (req, res) => {
	// console.log('req.params in api', req.params.myid);
	Notifications.find({ message: 'One of the User wants to swap his shift with you. Click for the details', to: req.params.myid })
		.populate('from')
		.populate('shiftFrom')
		.populate('shifttypeid')
		.select({
			// _id: 0,
			// shiftFrom: 1,
		})
		.then((pendings) => {
			// console.log(pendings);
			res.status(200).json({
				pendings: pendings.map((pending) => {
					// console.log(pending);
					if (pending.shiftFrom && pending.shifttypeid) {
						return {
							_id: pending.shiftFrom._id,
							start: pending.shiftFrom.start,
							priority: pending.shifttypeid.priority,
							end: pending.shiftFrom.end,
							shiftname: pending.shifttypeid.shiftname,
							requestApprovalStatus: pending.shiftFrom.requestApprovalStatus,
							title: pending.shifttypeid.shiftname + ':' + ' ' + pending.from.lastName + ' (' + pending.shiftFrom.comment.substring(0, 14) + '...' + ')',
							color: pending.shifttypeid.color,
							swapable: pending.shiftFrom.swapable,
							userId: pending.from._id,
							userType: pending.from.type,
							comment: pending.shiftFrom.comment,
							offApprovalStatus: pending.shiftFrom.offApprovalStatus,
						};
					} else {
						return {};
					}

					// const fetchedGames = [];
					// for (let key in pending) {
					// fetchedGames.push(pending[key].shiftFrom);
					//  }
					//  let assignarray = []
					//  res.status(200).json({
					//    pending : pending.map(pending => {createShift.findOne(pending.shiftFrom)
					//     .then(
					//       (res)=>{ assignarray.push(res)
					//     })
					//     .then(
					//       () =>{console.log("assign",assignarray)
				}),
			});
		});
});

router.get('/currentShifts', (req, res) => {
	// console.log('shifts');
	createShift
		.find()
		.populate('userId')
		.populate('shiftTypeId')

		.sort({ start: -1 })
		.exec()
		.then((shifts) => {
			var date1 = shifts[0].start;
			// console.log(shifts);
			var count = 0;
			// userId, start, end, title, color
			res.status(200).json({
				shifts: shifts.map((shift) => {
					var date2 = shift.start;

					if (date1 === date2) {
						if (shift.shiftTypeId.shiftname == 'Off') {
							// console.log('off shits if increased count')
							count++;
						}
						// else{
						// console.log(date1)
						// console.log(date2)
						// console.log('off shits else increased count')

						// }
					} else {
						// console.log('off shits count set to 1')

						date1 = shift.start;
						count = 0;
					}
					if (shift.shiftTypeId.shiftname === 'Request') {
						// let dottedComment;
						// if(shift.comment.length > 10) {
						//   dottedComment = shift.comment.substring(0,3);
						// }
						//  dottedComment.append('...')
						// console.log(shift.comment);
						if (shift.comment && shift.comment.length > 8) {
							return {
								_id: shift._id,
								start: shift.start,
								priority: shift.shiftTypeId.priority,
								end: shift.end,
								shiftname: shift.shiftTypeId.shiftname,
								requestApprovalStatus: shift.requestApprovalStatus,
								title: shift.shiftTypeId.shiftname.substring(0, 3) + ':' + ' ' + shift.userId.lastName + ' (' + shift.comment.substring(0, 14) + '...' + ')',
								color: count > 8 ? 'red' : shift.shiftTypeId.color,
								swapable: shift.swapable,
								userId: shift.userId._id,
								userType: shift.userId.type,
								comment: shift.comment,
								offApprovalStatus: shift.offApprovalStatus,
							};
						} else {
							return {
								_id: shift._id,
								start: shift.start,
								priority: shift.shiftTypeId.priority,
								end: shift.end,
								shiftname: shift.shiftTypeId.shiftname,
								requestApprovalStatus: shift.requestApprovalStatus,
								title: shift.comment ? shift.shiftTypeId.shiftname.substring(0, 3) + ':' + ' ' + shift.userId.lastName + ' (' + shift.comment + ')' : shift.shiftTypeId.shiftname.substring(0, 3) + ':' + ' ' + shift.userId.lastName + ', ' + shift.userId.firstName,
								color: count > 8 ? 'red' : shift.shiftTypeId.color,
								swapable: shift.swapable,
								userId: shift.userId._id,
								userType: shift.userId.type,
								comment: shift.comment,
								offApprovalStatus: shift.offApprovalStatus,
							};
						}
					} else {
						return {
							_id: shift._id,
							start: shift.start,
							priority: shift.shiftTypeId.priority,
							end: shift.end,
							shiftname: shift.shiftTypeId.shiftname,
							requestApprovalStatus: shift.requestApprovalStatus,
							title: shift.shiftTypeId.shiftname + ':' + ' ' + shift.userId.firstName.charAt(0) + ' ' + shift.userId.lastName,
							// title: shift.shiftTypeId.shiftname + ':' + ' ' + shift.userId.lastName + ',' + shift.userId.firstName,
							color: count > 8 ? 'red' : shift.shiftTypeId.color,
							swapable: shift.swapable,
							userId: shift.userId._id,
							userType: shift.userId.type,
							comment: shift.comment,
							offApprovalStatus: shift.offApprovalStatus,
						};
					}
				}),
			});
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err,
			});
		});
	// createShift.find().populate('userId').exec().then((shfts) => {
	//   res.send(shfts);
	// });
});

router.get('/currentUserShifts/:id', (req, res) => {
	const id = req.params.id;
	createShift
		.find({ userId: id })
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then((shifts) => {
			// userId, start, end, title, color
			res.status(200).json(
				shifts.map((shift) => {
					return {
						_id: shift._id,
						start: shift.start,
						end: shift.end,
						title: shift.shiftTypeId.shiftname + ':' + ' ' + shift.userId.lastName.charAt(0) + ' ' + shift.userId.firstName,
						color: shift.shiftTypeId.color,
						swapable: shift.swapable,
						shiftname: shift.shiftTypeId.shiftname,
						offApprovalStatus: shift.offApprovalStatus,
					};
				}),
			);
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
	// createShift.find().populate('userId').exec().then((shfts) => {
	//   res.send(shfts);
	// });
});

// router.get("/currentUserShifts", (req, res) => {
//   if (req.query === null) res.status(400).send("Bad Request");
//   createShift.find({ title: { $regex: req.query.username } }).then((shfts) => {
//     res.send(shfts);
//   });
// });

router.get('/currentUserOffShifts/:id', async (req, res) => {
	const id = req.params.id;
	var offId;
	await Shift.findOne({ shiftname: 'Off' })
		.exec()
		.then((obj) => {
			offId = obj._id;
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
	await createShift
		.find({ userId: id, shiftTypeId: offId })
		.populate('userId')
		.populate('shiftTypeId')
		.exec()
		.then((shifts) => {
			res.status(200).json(
				shifts.map((shift) => {
					return {
						_id: shift._id,
						start: shift.start,
						end: shift.end,
						title: shift.shiftTypeId.shiftname + ':' + ' ' + shift.userId.firstName.charAt(0) + ' ' + shift.userId.lastName,
						color: shift.shiftTypeId.color,
						swapable: shift.swapable,
					};
				}),
			);
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

router.put('/swapShifts', (req, res) => {
	if (req.body === null) res.status(400).send('Bad Request');
	try {
		createShift.replaceOne({ _id: req.body.id1 }, { title: req.body.title1, start: req.body.start1, end: req.body.end1 }).then(() => {
			createShift
				.replaceOne(
					{ _id: req.body.id2 },
					{
						title: req.body.title2,
						start: req.body.start2,
						end: req.body.end2,
					},
				)
				.then(() => {
					User.find({
						$or: [{ username: { $regex: req.body.title1.split(' ')[0] } }, { username: { $regex: req.body.title2.split(' ')[0] } }],
					}).then((user) => {
						sendMail(user[0].email, user[1].email, req.body.title1.toString(), req.body.title2.toString());
						res.send('Shifts are swapped');
					});
				});
		});
	} catch (err) {
		console.log(err);
	}
});
async function sendMail(user1, user2, title_1, title_2) {
	var transport = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		
		auth: {
			// enter your account details to send email from
			user: 'softthrivetest@gmail.com', // generated ethereal user
			pass: 'strong12345678', // generated ethereal password
		},
	});

	console.log('email => ' + "Email sent as shift transfer log", getNotificationEmail());
	var mailOptions = {
		from: 'softthrivetest@gmail.com',
		to: await getNotificationEmail(),
		subject: 'Shift Transfer Log',
		html: '<p> This mail sent as shift transfer log. <br/> Shift <b>' + title_1 + '</b> to this <b>' + title_2 + '</b> </p>',
	};

	transport.sendMail(mailOptions, (error, info) => {
		if (error) {
			return console.log(error);
		}
		console.log('Message sent: %s', info.messageId);
	});
}

router.get('/getShiftId/:name', (req, res) => {
	Shift.findOne({
		shiftname: req.params.name,
	})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

//@route  PUT api/shift/updateshift
//@desc   Update shift by id
//@access Public
router.put(
	'/updateshift',
	[
		check('shiftname', 'Please enter a valid name.').not().isEmpty(),
		// check('editable', 'Please enter an editable option.').not().isEmpty(),
		check('priority', 'Please enter an priority option.').not().isEmpty(),
		// shiftname must be an email
		check('color', 'Please enter a valid color.').not().isEmpty(),
	],
	async (req, res) => {
		try {
			let newPerson = {
				shiftname: req.body.newData.shiftname,
				color: req.body.newData.color,
				// editable: req.body.newData.editable,
				priority: req.body.newData.priority,
			};

			Shift.update({ _id: req.body.id }, { $set: newPerson }).then(async (resp) => {
				console.log(resp)
				var transport = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 587,
					secure: false,
					requireTLS: true,
					auth: {
						// enter your account details to send email from
						user: 'softthrivetest@gmail.com', // generated ethereal user
						pass: 'strong12345678', // generated ethereal password
					},
				});
				console.log('email => ' + "following shift has been updated"  + resp.shiftname , getNotificationEmail());
				var mailOptions = {
					from: 'softthrivetest@gmail.com',
					to: await getNotificationEmail(),
					subject: 'Shift Updated',
					html: '<p> The following shift ' + resp.shiftname + ' has been updated.</p>',
				};

				transport.sendMail(mailOptions, (error, info) => {
					if (error) {
						return console.log(error);
					}
					console.log('Message sent: %s', info.messageId);
				});
				res.send(resp);
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	},
);

//@route POST api/shift/changeEditable
//@desc temp route to change editable true for all
//@access public

router.post('/changeEditable', async (req, res) => {
	try {
		let shifts = await Shift.find();
		if (shifts.length > 0) {
			for (let i = 0; i < shifts.length; i++) {
				let shift = shifts[i];
				shift.editable = true;
				await shift.save();
			}
			return res.json({
				shifts: shifts,
			});
		}
	} catch (err) {
		console.log(err);
	}
});

//@route  POST api/shift/register
//@desc   Register New Shift
//@access Public
router.post(
	'/register',
	[
		check('shiftname', 'Please enter a valid name.').not().isEmpty(),
		// check('editable', 'Select for editable option').not().isEmpty(),
		check('priority', 'Select for priority option').not().isEmpty(),
		// shiftname must be an color
		check('color', 'Please enter a valid color.').not().isEmpty(),
	],
	async (req, res) => {
		try {
			//check if shift exists

			Shift.findOne({ shiftname: req.body.shiftname }).then((person) => {
				if (person) {
					return res.status(400).json({ email: 'Shift already exists!' });
				} else {
					try {
						Shift.findOne({ priority: req.body.priority }).then((person) => {
							if (person) {
								return res.status(400).json({ email: 'Priority already exists!' });
							}
							let newPerson = new Shift({
								shiftname: req.body.shiftname,
								color: req.body.color,
								// editable: req.body.editable,
								editable: true,
								priority: req.body.priority,
							});

							newPerson
								.save()
								.then((newperson) => res.json({ newperson }))
								.catch((err) => console.log(err));
						});
					} catch (err) {
						console.error(err.message);
						res.status(500).send('Server error');
					}
				}
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send('Server error');
		}
	},
);

module.exports = router;

router.get('/deleteAllNotify', (req, res) => {
	Notifications.deleteMany()
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/getNotification', (req, res) => {
	Notifications.find()
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/findCurrentShiftNotification/:userId/:shiftId', (req, res) => {
	// console.log(req.params.userId);
	Notifications.find({
		$and: [
			{
				shiftFrom: req.params.shiftId,
			},
			{
				currentUserId: req.params.userId,
			},
		],
	})
		.then((resp) => {
			res.send(resp);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.get('/swapShift/:id1/:id2', (req, res, next) => {
	const id1 = req.params.id1;
	const id2 = req.params.id2;
	var shift1;
	createShift
		.findById(id1)
		.exec()
		.then((shift1Obj) => {
			shift1 = shift1Obj.userId;
			createShift
				.findById(id2)
				.exec()
				.then((shift2Obj) => {
					shift1Obj.userId = shift2Obj.userId;
					shift2Obj.userId = shift1;

					shift1Obj
						.save()
						.then((result1) => {
							shift2Obj
								.save()
								.then((result2) => {
									res.status(201).json({
										shift1: result1,
										shift2: result2,
									});
								})
								.catch((err) => {
									res.status(500).json({
										error: err,
									});
								});
						})
						.catch((err) => {
							res.status(500).json({
								error: err,
							});
						});
				})
				.catch((err) => {
					res.status(500).json({
						error: err,
					});
				});
		})
		.catch((err) => {
			res.status(500).json({
				error: err,
			});
		});
});

module.exports = router;
