import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick
import dayGridPlugin from '@fullcalendar/daygrid';
import axios from 'axios';
import { Modal, Card, Select, Button, message } from 'antd';
import Spinner from '../download.png';
import jwt_decode from 'jwt-decode';
import CircularProgress from '@material-ui/core/CircularProgress';
const { Option } = Select;
let date = '';
let shiftNameUser = '';
let currentShift = '';
let name = '';
let day = '';
let sName = '';

const ShiftsCalendar = () => {
	const [events, setEvents] = useState([]);
	const [oneEvent, setOneEvent] = useState({});
	const [visible, setVisible] = useState(false);
	const [exchangeVisible, setexchangeVisible] = useState(false);
	const [failexchangeVisible, setFailexchangeVisible] = useState(false);
	const [commentVisible, setcommentVisible] = useState('');
	const [dateVisible, setDateVisible] = useState(false);
	const [data, setData] = useState([]);
	const [login, setLoginUserShift] = useState([]);
	const [filderedData, setFData] = useState([]);
	const [off, setOff] = useState([]);
	const [assign, setAssign] = useState('');
	const [shiftidforn, setshiftidforn] = useState('');
	const [shiftType, setShiftType] = useState('');
	const [adminCheck, setAdminCheck] = useState('');
	const [loading, setLoading] = useState(false);
	const [start, setStart] = useState('');
	const [end, setEnd] = useState('');
	const [approval, setApproval] = useState('');
	const [comment, setComment] = useState('');
	const [id2, setTargetId] = useState('');
	const token = localStorage.usertoken;
	const decoded = jwt_decode(token);
	const currentId = decoded.id;
	const showModal = (e) => {
		console.log(e);
		date = e.dateStr;
		let dateCurrent = new Date().toISOString().slice(0, 10);
		console.log(date);
		console.log(dateCurrent);
		if (date >= dateCurrent) {
			setVisible(true);
		} else {
			setDateVisible(true);
		}
	};
	const handelFrom = (e) => {
		setTargetId(e);
	};

	const handelAssign = (e) => {
		e.preventDefault();
		setAssign(e.target.value);
	};
	useEffect(
		(e) => {

			setShiftType(shiftNameUser);
		},
		[commentVisible],
	);
	function setRequestEvent(e) {

		shiftNameUser = e.target.value.substring(0, e.target.value.indexOf(':'));

		setShiftType(shiftNameUser);
		setcommentVisible('true');
	}

	async function setOffEvent(e) {
		console.log(e.target.value, "event value in off request")
		shiftNameUser = e.target.value.substring(0, e.target.value.indexOf(':'));

		setShiftType(shiftNameUser);
		await setComment(' ');
		setcommentVisible('false');
	}
	const handelShift = (e) => {
		console.log(e.target.value.substring(e.target.value.indexOf(':') + 1), "handel shifffffftt")
		if (e.target.value.substring(e.target.value.indexOf(':') + 1) === 'Request') {
			setRequestEvent(e);
		} else {
			setOffEvent(e);
		}

		// setShiftType(e.target.value.substring(0,e.target.value.indexOf(":")));
		// console.log(e.target.value.substring(0,e.target.value.indexOf(":")));
		// console.log(e.target.value.substring(e.target.value.indexOf(":") + 1))
		// {
		//   e.target.value.substring(e.target.value.indexOf(":") + 1) == 'Request' ?
		//   setcommentVisible(true):setcommentVisible(false)

		// }
	};

	const handleComment = (e) => {
		setComment(e.target.value);
	};

	const handelDate = (e) => {
		setStart(e.target.value);
		setEnd(e.target.value);
	};
	const handelEndDate = (e) => {
		setEnd(e.target.value);
	};

	useEffect(() => {
		AfterSetOff();
	}, [off]);

	const getAndSetOffStatus = (data) => {
		console.log(data);
		setOff(data);
	};

	const AfterSetOff = () => {
		console.log('in create shift ccccccccc');
		const userId = currentId;
		let shiftTypeId = shiftType;
		console.log(userId);
		console.log(shiftTypeId);
		var swapable = 'true';
		for (let i = 0; i < data.length; i++) {
			if (shiftType === data[i].shiftname) {
				shiftTypeId = data[i]._id;
				break;
			}
		}
		console.log('off.length: ' + off.length);
		let offAprovalStat;
		let countStatus = 0;
		for (let i = 0; i < off.length; i++) {
			if (off[i] !== null) {
				if (off[i].status === 'Approved') {
					countStatus++;
				}
			}
		}

		console.log('countStatus: ' + countStatus);
		if (off.length < 8) {
			// || countStatus < 8
			offAprovalStat = 'Approved';
		} else {
			offAprovalStat = 'Unapproved';
		}

		const options = {
			url: 'shift/createShift',
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
			data: {
				userId: currentId,
				comment: comment,
				start: date,
				end: date,
				requestApprovalStatus: 'Unapproved',
				offApprovalStatus: offAprovalStat,
				shiftTypeId: shiftTypeId,
				swapable: swapable,
			},
		};
		axios(options)
			.then((res) => {
				// setTimeout(() => {
				//   message.success("Shift Created Successfully");
				// },1000)
				console.log('shiftype idss', shiftTypeId);
				axios
					.get('shift/currentShifts')
					.then(async (res) => {
						await setEvents(res.data.shifts);
						setLoading(false);
						message.success('Shift Created Successfully');
					})
					.catch((err) => {
						message.error('Error getting shifts from database');
						console.log(err);
					});
			})
			.catch((err) => {
				message.error('Shift creation failed');
			});
	};

	const handleOk = async (e) => {
		await setVisible(false);
		setLoading(true);
		let tempArray = [];
		axios
			.get('shift/currentShifts')
			.then((res) => {
				console.log(res.data.shifts);
				for (let i = 0; i < res.data.shifts.length; i++) {
					if (res.data.shifts[i].shiftname === 'Off') {
						tempArray.push(res.data.shifts[i]);
					}
				}
				getAndSetOffStatus(tempArray);
				console.log(tempArray.length);
				console.log(tempArray);
			})
			.catch((err) => {
				console.log('Failed to get and set current date off events from database');
			});
	};
	const handleCancel = (e) => {
		setVisible(false);
	};

	const handelSelect = (e) => {
		console.log("ee")
		if (e.target.value === 'All Shifts') {
			axios.get('shift/currentShifts').then((res) => {
				// let temp1 = []
				// let temp2 = []
				// for(let i =0 ; i<res.data.shifts.length; i++){

				// }
				// console.log(res.data.shifts)
				setEvents(res.data.shifts);
			});
		} else if (e.target.value === 'My Shifts') {
			console.log('User Logged In');
			console.log('User Id:' + currentId);
			axios.get('shift/currentUserShifts/' + currentId).then((res) => {
				if (res.data !== null) {
					setEvents(res.data);
				} else {
					setEvents([]);
				}
			});
		} else if (e.target.value === 'Off') {
			axios
				.get('shift/currentShifts')
				.then((res) => {
					let offArr = [];
					for (let i = 0; i < res.data.shifts.length; i++) {
						if (res.data.shifts[i].shiftname === 'Off') {
							offArr.push(res.data.shifts[i]);
						}
					}
					setEvents(offArr);
				})
				.catch((err) => {
					console.log(err);
				});
		} else if (e.target.value === 'Pending') {
			console.log('currentid in pending', currentId);
			axios
				.get('shift/pendingShifts/' + currentId)
				.then((res) => {
					console.log('res of pendings', res.data.pendings);
					let offArr = [];
					for (let i = 0; i < res.data.pendings.length; i++) {
						offArr.push(res.data.pendings[i]);
					}
					setEvents(offArr);
					console.log('events of pending', events);
				})
				.catch((err) => {
					console.log(err);
					console.log('error in calling');
				});
		} else if (e.target.value === 'shifts only') {
			axios.get('shift/currentShifts').then((res) => {
				// let temp1 = []
				// let temp2 = []
				// for(let i =0 ; i<res.data.shifts.length; i++){

				// }
				console.log(res.data.shifts)
				let withoutOff = res.data.shifts.filter(v => (v.shiftname != "Off" && v.shiftname != "Request"))
				setEvents(withoutOff);
			});
		};
	};

	useEffect(() => {
		axios.get('shift/currentShifts').then((res) => {
			// let temp1 = []
			// let temp2 = []
			// let count = 0;
			// console.log(off.length)
			// let temp = []
			// for(let i = 0 ; i < res.data.shifts.length ; i++){
			//   if(res.data.shifts[i].shiftname === 'Request' || res.data.shifts[i].shiftname === 'Off'){
			//     if(res.data.shifts[i].shiftname === 'Request'){
			//       if(res.data.shifts[i].requestApprovalStatus === 'approved'){
			//         temp1.push(res.data.shifts[i])
			//       }
			//     }else if(res.data.shifts[i].shiftname === 'Off'){
			//       // count++;
			//       // console.log(count)
			//       if(res.data.shifts[i].offApprovalStatus === 'Approved'){
			//         temp1.push(res.data.shifts[i])
			//       }else if(res.data.shifts[i].offApprovalStatus === 'Unapproved' && count <= 8){
			//         res.data.shifts[i].offApprovalStatus = 'Approved'
			//         temp1.push(res.data.shifts[i])
			//       }else if(res.data.shifts[i].offApprovalStatus === 'Unapproved' && count >= 8){

			//       }
			//     }

			//   // }else if(res.data.shifts[i].shiftname === 'Off'){
			//   //   if(res.data.shifts[i].offApprovalStatus === 'Approved'){
			//   //     temp3.push(res.data.shifts[i])
			//   //   }
			//   }else{
			//     temp2.push(res.data.shifts[i])
			//   }
			// }

			// temp = [...temp1,...temp2]
			// console.log(temp)
			setEvents(res.data.shifts);
		});
		const options = {
			url: 'shift/getshifts',
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json;charset=UTF-8',
			},
		};
		axios(options).then((res) => {
			var temp = [];
			for (let i = 0; i < res.data.length; i++) {
				if (res.data[i].editable === 'true') {
					temp.push(res.data[i]);
					console.log(res.data[i]);
				}
			}

			setData(temp);
		});

		axios(options).then((res) => {
			console.log('Shift Ids:');
			console.log(res.data);
			let arr = [];
			for (let i = 0; i < res.data.length; i++) {
				if (res.data[i].shiftname === 'Off') {
					arr.push(res.data[i]);
				}
			}
			setFData(arr);
		});
	}, [visible]);
	function onChange(date, dateString) {
		console.log(dateString);
		console.log(currentId);
		axios.get('shift/specificDateShifts/' + dateString + '/' + currentId).then((res) => {
			var trueSwapableArray = [];
			for (let i = 0; i < res.data.shifts.length; i++) {
				if (res.data.shifts[i].swapable === 'true') {
					trueSwapableArray.push(res.data.shifts[i]);
				}
			}
			console.log(trueSwapableArray);
			setLoginUserShift(trueSwapableArray);
		});
	}
	useEffect(() => {
		console.log(oneEvent.userId);
		console.log(oneEvent._id);
		console.log(currentId);

		{
			oneEvent.userId === undefined && oneEvent._id === undefined
				? setexchangeVisible(false)
				: axios.get('shift/findCurrentShiftNotification/' + currentId + '/' + oneEvent._id).then((res) => {
					if (res.data.length === 0) {
						console.log(res.data.length);
						setexchangeVisible(true);
					} else {
						message.error('You have already requested for this shift');
					}
				});
		}

		// axios.get('shift/findCurrentShiftNotification/'+userId1+'/'+shiftId1)
	}, [oneEvent]);
	const settingEvent = (event) => {
		setOneEvent(event);
	};

	function convertUTCDateToLocalDate(date) {
		var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);

		var offset = date.getTimezoneOffset() / 60;
		var hours = date.getHours();

		newDate.setHours(hours - offset);

		return newDate;
	}
	const handleEventClick = ({ event, el }) => {
		currentShift = event._def.extendedProps._id;
		date = new Date().toISOString().slice(0, 10);
		console.log(event.startStr);
		name = event.title.substring(event.title.indexOf(':') + 1);
		sName = event.title.substring(0, event.title.indexOf(':'));
		day = new Date(event.startStr).toLocaleString('default', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
		day = new Date(event.startStr).toUTCString().split(' ')[2] + ' ' + new Date(event.startStr).toUTCString().split(' ')[1] + ', ' + new Date(event.startStr).toUTCString().split(' ')[3];
		console.log(day);
		// day = convertUTCDateToLocalDate(new Date(event.startStr))
		// console.log(day.substring(0, day.indexOf('(')))

		if (event.startStr >= date) {
			if (event._def.extendedProps.userId !== currentId) {
				settingEvent(event._def.extendedProps);
			} else {
				setAdminCheck(true);
			}
		} else {
			setFailexchangeVisible(true);
		}

		// console.log(event.startStr)
	};

	const passNotification = () => {
		console.log('in notification');
		const userId1 = oneEvent.userId;
		const shiftId1 = oneEvent._id;
		let userId2 = currentId;

		// let shiftId2 = id2.substring(0, id2.indexOf(':'));
		let date = new Date().toISOString().slice(0, 10);
		const message = 'One of the User wants to swap his shift with you. Click for the details';
		const requester = 'User';
		const currentUserId = currentId;
		const messageFrom = 'Your request has been sent. Wait for the Response';
		const requestStatus = 'true';
		let shiftName = '';
		let shiftIdforn = '';
		console.log(userId1, userId2, shiftId1);

		if (oneEvent.start <= date) {
			console.log(oneEvent.start);
			setFailexchangeVisible(true);
		} else {
			axios
				.get('shift/getShiftName/' + shiftId1)
				.then((res) => {
					shiftName = res.data.shiftname;
					console.log(data, shiftName);
					// for (let i = 0; i < data.length; i++) {
					// 	console.log(data[i].shiftname);
					// 	if (shiftName === data[i].shiftname) {
					// 		shiftIdforn = data[i]._id;
					// 		break;
					// 	} else {
					// 		alert('This shift is not editable');
					// 		return;
					// 	}
					// }
					if (data.length > 0 && data.filter(d => d.shiftname === shiftName).length > 0) {
						shiftIdforn = data.filter(d => d.shiftname === shiftName)[0]._id

					} else {
						alert('This shift is not editable');
						return;
					}
					console.log(shiftIdforn);
					axios
						.post('user/userNotification', {
							currentUserId,
							userId1,
							userId2,
							shiftId1,
							message,
							messageFrom,
							date,
							requester,
							requestStatus,
							shiftName,
							shiftType,
							shiftIdforn,
						})
						.then((res) => {
							console.log(res.data);
							window.location.reload();
						})
						.catch((err) => {
							console.log(err.response);
						});
				})
				.catch((err) => {
					console.log(err);
				});
		}
	};

	const deleteShift = async () => {
		console.log(currentShift);
		const key = 'updatable';
		await setAdminCheck(false);
		await setLoading(true);
		axios
			.get('shift/deleteThisShift/' + currentShift)
			.then((res1) => {
				console.log(res1);
				console.log(res1.data);
				// message.loading({ content: 'Deleting...', key });
				// setTimeout(() => {
				//   message.success({ content: res1.data, key, duration: 2 });
				// }, 1000);
				axios
					.get('shift/currentShifts')
					.then(async (res) => {
						console.log(res.data.shifts);
						await setEvents(res.data.shifts);
						setLoading(false);
						message.success({ content: res1.data, key, duration: 2 });
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
				message.err(err);
			});
	}
	//;{filderedData.map((dat) => (
	// 						<option value={dat._id} key={dat._id}>
	// 							{/* Shifts without {' '}{dat.shiftname} */}
	// 							Shifts Only
	// 						</option>
	// 					))}
	return (
		<div>
			<div className='container-fluid'>
				<div className='row'>
					<select id='cars' name='cars' className='custom-select bg-light m-2 shadow-sm float-right w-25' onChange={handelSelect}>
						<option value='All Shifts'>View All </option>
						<option value='Off'>Off's Only </option>
						<option value='My Shifts'>My Shifts Only</option>
						{/* <option value='Pending'>My Pending Shifts</option> */}

						<option value="shifts only">
							{/* Shifts without {' '}{dat.shiftname} */}
							Shifts Only
						</option>
						{/* <option value="Shifts Offered">Shifts Offered </option> */}
					</select>
				</div>
			</div>
			<br />
			{loading === false ? (
				<FullCalendar

					defaultView='dayGridMonth'
					// timeZone='America/Chicago'
					defaultDate='2021-06-01'
					editable={false}
					defaultAllDay={true}
					plugins={[dayGridPlugin, interactionPlugin]}
					events={events}
					titleFormat={{ month: 'long', year: 'numeric' }}
					headerToolbar={{
						left: '',
						end: '',
						center: 'prev,title,next',
					}}
					dateClick={showModal}
					eventClick={(e) => handleEventClick(e)}
					eventOrder='priority'
					weekNumberCalculation='ISO'
				/>
			) : (
				<div className='row' className='spinner'>
					<img src={Spinner} className='loading' alt='' />
				</div>
			)}
			<Modal title='Create Shift' visible={visible} onOk={handleOk} onCancel={handleCancel}>
				<select id='cars' name='cars' className='custom-select bg-light m-2 shadow-sm' onChange={handelShift}>
					<option defaultValue='Shift Type ' id='shType'>
						No shift right now
					</option>
					{data.map((sh) => (
						<option value={sh._id + ':' + sh.shiftname} key={sh._id}>
							{sh.shiftname}
						</option>
					))}
				</select>
				{commentVisible === 'true' ? (
					<div>
						<input type='text' className='form-control m-2 bg-light shadow-sm' placeholder='Comments for requested shift type' onChange={handleComment} />
					</div>
				) : (
					<div></div>
				)}
			</Modal>

			<Modal title='Swap Request Failed' visible={adminCheck} maskClosable={true} onCancel={() => setAdminCheck(false)} footer={null}>
				<div>
					<Card type='inner'>You can't request your own shift</Card>
					<br />
				</div>

				<div className='container'>
					<div className='row'>
						<div className='col-2'>
							<Button key='1' type='primary' danger onClick={deleteShift}>
								Delete
							</Button>
						</div>
						<div className='col-8'></div>
						<div className='col-2'>
							<Button key='1' onClick={() => setAdminCheck(false)}>
								Cancel
							</Button>
						</div>
					</div>
				</div>
			</Modal>

			<Modal
				title='Confirm Request'
				visible={exchangeVisible}
				maskClosable={true}
				onCancel={() => setexchangeVisible(false)}
				footer={[
					<Button key='1' onClick={() => setexchangeVisible(false)}>
						Cancel
					</Button>,
					<Button onClick={passNotification} key='2' type='primary'>
						Confirm
					</Button>,
				]}>
				<div>
					<Card type='inner'>
						Please confirm to send swap request for <b>{name}</b>
						{','} <b>{day}</b> <br /> <b>{sName}</b> call
					</Card>
				</div>
			</Modal>
			<Modal
				title='Choose current date'
				visible={dateVisible}
				maskClosable={true}
				onCancel={() => setDateVisible(false)}
				footer={[
					<Button key='1' type='primary' onClick={() => setDateVisible(false)}>
						Ok
					</Button>,
				]}>
				<div>
					<Card type='inner'>Please click on current date or future dates to create event</Card>
				</div>
			</Modal>
			<Modal
				title='Swapped Request Failed'
				visible={failexchangeVisible}
				onCancel={() => setFailexchangeVisible(false)}
				maskClosable={true}
				footer={[
					<Button type='primary' key='1' onClick={() => setFailexchangeVisible(false)}>
						Cancel
					</Button>,
				]}>
				<div>
					<Card type='inner'>Please choose current dates or dates in the future to send swapping request</Card>
				</div>
			</Modal>
		</div>
	);
};

export default ShiftsCalendar;
