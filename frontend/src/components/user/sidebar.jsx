import React, { useState, useEffect } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import Logout from '../superAdmin/Logout/Logout';
import OffShift from './OffShifts';
import ReqShift from './requestShift';
import ShiftsCalendar from '../user/shiftsCalendar';
import UserExchangeShift from './userExchangeShifts';
import UserShiftCrud from './userShiftCrud';
import RestricSwapping from './restrictSwappingUser';
import { Layout, Menu, Modal, Avatar, Dropdown, Badge, Row, Col, Card, Tag, Button, Form, Divider } from 'antd';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { AiFillCloseCircle } from "react-icons/ai"
import { EditOutlined, PullRequestOutlined, LogoutOutlined, MenuOutlined, CalendarOutlined, SwapOutlined, BellFilled, MinusCircleOutlined } from '@ant-design/icons';
import EditUser from './editUser';

const { Header, Content, Footer, Sider } = Layout;
let user1 = '';
let user2 = '';
let date = '';
let shiftname = '';
let users = [];
const Side = ({ user }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [dsplayMessage, setMessage] = useState([]);
	const [shifts, setShifts] = useState([]);
	const [notiUser, setNotiUser] = useState([]);
	const token = localStorage.usertoken;
	const decoded = jwt_decode(token);
	const currentId = decoded.id;
	const currentFName = decoded.firstName;
	const currentLName = decoded.lastName;
	const currentEmail = decoded.email;

	const [visible, setVisible] = useState(false);
	const [sentVisible, setsentVisible] = useState(false);
	const [editProfile, setEditProfile] = useState(false);
	const [visible2, set2Visible] = useState(false);
	const [index, setIndex] = useState();
	const [myDetails, setMyDetails] = useState({});
	const [notificationVisible, setNotificationVisible] = useState(false);
	const [fields, setFields] = React.useState([
		{
			name: ['firstName'],
			value: myDetails.firstName,
		},
		{
			name: ['lastName'],
			value: myDetails.lastName,
		},
		// {
		// 	name: ["username"],
		// 	value: userObj.username,
		// },
		{
			name: ['email'],
			value: myDetails.email,
		},
		{
			name: ['pass'],
			value: '',
		},
		{
			name: ['confirm'],
			value: '',
		},
	]);

	const editingProfile = () => {
		setEditProfile(true);
	};
	useEffect(() => {
		axios
			.get('user/getMyDetails/' + currentId)
			.then((resp) => {
				setMyDetails(resp.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [editProfile]);

	const swapShift = () => {
		console.log(index);
		console.log(index);
		console.log(dsplayMessage[index]);
		const id = dsplayMessage[index]._id;
		const shiftId1 = dsplayMessage[index].shiftFrom;
		const userToExchange = dsplayMessage[index].to;

		console.log(id);
		console.log(userToExchange);

		const currentUserId = currentId;
		const userId1 = dsplayMessage[index].from;
		const userId2 = userToExchange;
		// const shiftId1 = dsplayMessage[index].shiftFrom
		const message = dsplayMessage[index].message;
		const adminresponse = dsplayMessage[index].adminresponse;
		const date = dsplayMessage[index].regDate;
		const requester = dsplayMessage[index].requesterType;
		const shiftName = dsplayMessage[index].shiftName;

		axios
			.get('shift/swapShiftUser/' + shiftId1 + '/' + userToExchange)
			.then((res) => {
				console.log(res);
				axios
					.put('user/updateResponses/' + id)
					.then((res) => {
						// console.log(res)
						updateHistory(currentUserId, userId1, userId2, shiftId1, message, adminresponse, date, requester, shiftName, true);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const swapShift1 = (message) => {
		console.log(message);
		//console.log(mesage)
		console.log(dsplayMessage[message]);
		const id = dsplayMessage[message]._id;
		const shiftId1 = dsplayMessage[message].shiftFrom;
		const userToExchange = dsplayMessage[message].to?._id;

		console.log(id);
		console.log(userToExchange);

		const currentUserId = currentId;
		const userId1 = dsplayMessage[message].from?._id;
		const userId2 = userToExchange;
		// const shiftId1 = dsplayMessage[index].shiftFrom
		const message1 = dsplayMessage[message].message;
		const adminresponse = dsplayMessage[message].adminresponse;
		const date = dsplayMessage[message].regDate;
		const requester = dsplayMessage[message].requesterType;
		const shiftName = dsplayMessage[message].shiftName;

		axios
			.get('shift/swapShiftUser/' + shiftId1 + '/' + userToExchange + '/' + userId1)
			.then((res) => {
				console.log(res);
				axios
					.put('user/updateResponses/' + id)
					.then((res) => {
						// console.log(res)
						updateHistory(currentUserId, userId1, userId2, shiftId1, message1, adminresponse, date, requester, shiftName, true);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const [form] = Form.useForm();
	const exchangeAndDelete = () => { };

	const updateHistory = (currentUserId, userId1, userId2, shiftId1, message, adminresponse, date, requester, shiftName, update) => {
		axios
			.post('user/createNotificationHistory', {
				currentUserId,
				userId1,
				userId2,
				shiftId1,
				message,
				adminresponse,
				date,
				requester,
				shiftName,
				update,
			})
			.then((res) => {
				refresh();
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const updateNotification = () => {
		const notificationId = dsplayMessage[index]._id;
		console.log(dsplayMessage[index]._id);
		axios
			.put('user/updateResponsesandDelete/' + notificationId)
			.then((res) => {
				getNotifications();
			})
			.catch((err) => {
				console.log(err);
			});
		window.location.reload();
	};

	const deleteNotification = () => {
		const notificationId = dsplayMessage[index]._id;
		console.log(dsplayMessage[index]._id);
		axios
			.delete('user/deleteCurrentNotification/' + notificationId)
			.then((res) => {
				getNotifications();
				setNotificationVisible(true)
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleVisibleChange = (flag) => {
		setNotificationVisible(flag)
	}

	const deleteNotification1 = (message) => {
		console.log('message lelo', message);

		const notificationId = dsplayMessage[message]._id;
		console.log(dsplayMessage[message]._id);
		axios
			.delete('user/deleteCurrentNotification/' + notificationId)
			.then((res) => {
				getNotifications();

			})
			.catch((err) => {
				console.log(err);
			});
	};


	const deleteNotificationForAdminSwap = (message) => {
		console.log('message lelo', message, dsplayMessage[message]);

		const notificationId = dsplayMessage[message]._id;
		console.log(dsplayMessage[message]._id);
		console.log();
		let currentid = jwt_decode(localStorage.getItem("usertoken")).id

		if (dsplayMessage[message].from?._id == currentid) {
			axios
				.put('user/deleteFromid/' + notificationId)
				.then((res) => {
					console.log(res)
					getNotifications();

				})
				.catch((err) => {
					console.log(err);
				});
		}

		else if (dsplayMessage[message].to._id == currentid) {
			axios
				.put('user/deleteToid/' + notificationId)
				.then((res) => {
					console.log(res)
					getNotifications();

				})
				.catch((err) => {
					console.log(err);
				});
		}

		else {
			alert("error")
		}

		// axios
		// 	.put('user/deleteCurrentNotification/' + notificationId)
		// 	.then((res) => {
		// 		getNotifications();

		// 	})
		// 	.catch((err) => {
		// 		console.log(err);
		// 	});
	};

	const updateNotification1 = (message) => {
		const notificationId = dsplayMessage[message]._id;
		console.log(dsplayMessage[message]._id);
		axios
			.put('user/updateResponsesandDelete/' + notificationId)
			.then((res) => {
				getNotifications();
			})
			.catch((err) => {
				console.log(err);
			});
		window.location.reload();
	};

	const refresh = () => {
		window.location.reload();
	};
	useEffect(() => {
		getNotifications();
	}, [shifts]);

	const getNotifications = () => {
		console.log('in notifications in admin');
		axios
			.get('user/getCurrentUserNotificationsTo/' + currentId)
			.then((res1) => {
				axios.get('user/getCurrentUserNotificationsFrom/' + currentId).then((res2) => {
					let array = [...res1.data, ...res2.data];
					// console.log(currentId)

					console.log(array);
					//  console.log(array[0].currentUserId)
					for (let i = 0; i < array.length; i++) {
						users.push(array[i].currentUserId);
					}
					setMessage(array);
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	//   useEffect(() => {

	//     // for(let i = 0 ; i < dsplayMessage.length ; i++){
	//     //   console.log(dsplayMessage[i].currentUserId)
	//     //   users.push(dsplayMessage[i].currentUserId)
	//     // }
	//     let i = 0
	//     console.log(i++)
	//     // setNotiUser(users)
	// },[dsplayMessage])

	// useEffect(() => {
	//   console.log(notiUser)
	// },[notiUser])

	const showShiftModal = (message) => {
		console.log('message in shiftmodal', message.key);
		//console.log("message in shiftmodal",index)
		settingIndex(message.key);

		if (dsplayMessage[message.key].requesterType == 'User') {
			if (dsplayMessage[message.key].to === currentId) {
				setsentVisible(true);
			} else {
				set2Visible(true);
			}
		} else {
			setVisible(true);
		}

		//  {dsplayMessage[message.key].requesterType == 'User' ?
		//     set2Visible(true)
		//   :
		//   setVisible(true)
		//  }
		console.log(currentId);
		console.log(dsplayMessage[message.key].shiftFrom);
		axios
			.get('user/getShiftTo/' + dsplayMessage[message.key].to)
			.then((res1) => {
				axios.get('user/getShiftFrom/' + dsplayMessage[message.key].shiftFrom).then((res2) => {
					axios.get('user/getShiftTo/' + dsplayMessage[message.key].from).then((res3) => {
						let shiftArray = [res1.data[0], res2.data.shifts[0], res3.data[0]];
						//  console.log(res1.data.shifts)
						let temp = [];
						for (let i = 0; i < shiftArray.length; i++) {
							if (shiftArray[i] != undefined) {
								temp.push(shiftArray[i]);
							}
						}

						user1 = temp[0].firstName + ' ' + temp[0].lastName;
						user2 = temp[2].firstName + ' ' + temp[2].lastName;
						date = new Date(temp[1].start).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
						shiftname = temp[1].shifname;
						console.log(user1, user2, date, shiftname);
						console.log(temp);
						setShifts(temp);
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const showShiftModal1 = (message) => {
		console.log('message in shiftmodal110', message, dsplayMessage[message].requesterType);
		settingIndex(message);

		if (dsplayMessage[message].requesterType == 'User' || 'Admin') {
			console.log('first if pass');
			if (dsplayMessage[message].to === currentId) {
				setsentVisible(true);
			} else {
				set2Visible(true);
			}
		} else {
			setVisible(true);
		}

		console.log(currentId);
		console.log('shiftfrom is here', dsplayMessage[message].shiftFrom);
		axios
			.get('user/getShiftTo/' + dsplayMessage[message].to)
			.then((res1) => {
				axios.get('user/getShiftFrom/' + dsplayMessage[message].shiftFrom).then((res2) => {
					axios.get('user/getShiftTo/' + dsplayMessage[message].from).then((res3) => {
						let shiftArray = [res1.data[0], res2.data.shifts[0], res3.data[0]];
						console.log('shiftarray data', shiftArray);
						let temp = [];
						for (let i = 0; i < shiftArray.length; i++) {
							if (shiftArray[i] != undefined) {
								temp.push(shiftArray[i]);
							}
							console.log('temp ka data', temp);
						}
						let user2firstName = temp[2] && temp[2].firstName ? temp[2].firstName : temp[1].firstName;
						let user2lastName = temp[2] && temp[2].lastName ? temp[2].lastName : temp[1].lastName;
						user1 = temp[0].lastName + ' ' + temp[0].firstName;
						user2 = user2lastName + ' ' + user2firstName;
						date = new Date(temp[1].start).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' });
						shiftname = temp[1].shifname;
						console.log(user1, user2, date, shiftname);
						console.log(temp);
						setShifts(temp);
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const settingIndex = (key) => {
		console.log(key);
		setIndex(key);
	};
	const menu = (
		<Menu
			style={{
				width: '94%',
				borderRadius: '6px',
				marginRight: '30px',
				marginTop: '20px',

			}}>
			{/* <b style={{
        backgroundColor:'rosybrown',
        color: 'white',
        padding: '15px 15px',
        display: 'block',
      }}>Notification</b> */}

			{dsplayMessage.map((message, index) => (
				<Menu.Item key={index}>
					<div
						style={{
							width: '400',
							borderRadius: '6px',
							margin: '10px',
							textAlign: 'end',
						}}>
						{message.requesterType === 'Super Admin' ? (
							<div>
								<div className='row'>
									<div className='col-6'>
										<Tag color='success'>{'Super Admin'}</Tag>
									</div>
									<div className='col-6'>
										<Tag color='default'>{message.shiftName}</Tag>
										<Tag color='default'>{message.from.regDate}</Tag>
									</div>
								</div>

								<div className='row'>
									<div className='col-12'>{message.message}</div>
								</div>
							</div>
						) : (
							<div>
								{message.requesterType === 'Admin' && message.adminEdit ? (
									<div>
										{' '}
										{message.message !== 'Your shift has been exchanged. View Details' && message.message !== 'Your rejection response has been sent to the swap requester' ? (
											<div>
												<div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ justifyContent: "flex-end", width: "101px", border: "1px solid gray", marginTop: "5px", marginBottom: "10px", textAlign: "center", borderRadius: "5px" }} onClick={() => deleteNotificationForAdminSwap(index)}>
													Acknowledged
												</div></div>


												<div style={{ width: "309px", wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
													{/* {message.message} */}
													<p>{message.currentUserId.firstName.charAt(0) + ' ' + message.currentUserId.lastName} has Changed {message?.from?.regDate} {message.shiftName} from {message?.from?.firstName.charAt(0) + ' ' + message?.from?.lastName} to {message.to?.firstName.charAt(0) + ' ' + message.to?.lastName}</p>
												</div>

												{/* <Row className='buttonsetting'>
													<Button onClick={() => deleteNotification1(index)} className='rejectbutton'>
														OK
													</Button>
													{/* <Button onClick={() => deleteNotification1(index)}>Delete this notification</Button>
													<Button onClick={() => updateNotification1(index)} className='rejectbutton'>
														Reject
													</Button>
													<Button type='primary' className='button2setting' onClick={() => swapShift1(index)}>
														Exchange
													</Button> */}
												{/* </Row>  */}
												<hr />
											</div>
										) : (
											<div>
												<div>
													<div className='row'>
														<div className='col-6'>
															<Tag color='green'>{users[index].firstName + ' ' + users[index].lastName}</Tag>
														</div>
														<div className='col-6'>
															<Tag color='default'>{message.shiftName}</Tag>
															<Tag color='default'>{message?.from?.regDate}</Tag>
														</div>
													</div>
													{message.message}
													<br></br>
													<Button onClick={() => deleteNotification1(index)}>Delete this notification</Button>
													<div onClick={() => showShiftModal1(index)}>
														<Tag color='red'>{'Detail'}</Tag>
													</div>
												</div>
												<hr />
											</div>
										)}
									</div>
								) : (
									<div>
										{message.from?._id === currentId ? (
											<div>
												{message.message !== 'Your shift has been exchanged. View Details' && message.message !== 'Your rejection response has been sent to the swap requester' ? (
													<div>
														<div className='row'>
															{/* <div onClick={() => showShiftModal1(index)} className='col-2'>
																<Tag color='red'>{'Detail'}</Tag>
															</div> */}
															{/* <div className='col-4'>
																<Tag color='green'>{users[index].firstName + ' ' + users[index].lastName}</Tag>
															</div> */}
															{/* <div className='col-6'>
																<Tag color='default'>{message.shiftName}</Tag>
																<Tag color='default'>{message.regDate}</Tag>
															</div> */}
														</div>
														<div className='row'>
															<div style={{ margin: 10 }} className='col-12' className='textsetting'>
																{console.log(message, "message")}
																{/* {message.requesterType} */}
																{users[index].firstName.charAt(0)} {users[index].lastName + ' is requesting ' + message.shiftName + ' call ' + message?.regDate}
															</div>
														</div>
														<div>
															<Row className='buttonsetting'>
																{/* <Button onClick={() => deleteNotification1(index)}>Delete this notification</Button> */}
																{/* <Button onClick={() => updateNotification1(index)} className='rejectbutton'>
																	Reject
																</Button>
																<Button type='primary' className='button2setting' onClick={() => swapShift1(index)}>
																	Exchange
																</Button> */}
																<Button type='primary' className='button2setting' onClick={() => swapShift1(index)}>
																	Accept
																</Button>
																<Button onClick={() => deleteNotification1(index, true)} className='rejectbutton'>
																	Reject
																</Button>
															</Row>
														</div>
														<hr />
													</div>
												) : (
													<div>
														<div>
															<div className='row'>
																{/* <div className='col-6'>
																	<Tag color='green'>{users[index].firstName + ' ' + users[index].lastName}</Tag>
																</div>
																<div className='col-6'>
																	<Tag color='default'>{message.shiftName}</Tag>
																	<Tag color='default'>{message.regDate}</Tag>
																</div> */}
															</div>

															{message.message}
															<br></br>
															{/* <div className='row'>
																<Button className='col-6' onClick={() => deleteNotification1(index)}>
																	Delete this notification
																</Button>
																<div className='col-6' onClick={() => showShiftModal1(index)}>
																	<Tag color='red'>{'Detail'}</Tag>
																</div>
															</div> */}
														</div>
														<hr />
													</div>
												)}
											</div>
										) : (
											<div>
												<div className='row'>
													{/* <div className='col-6'>
														<Tag color='green'>{users[index].firstName + ' ' + users[index].lastName}</Tag>
													</div>
													<div className='col-6'>
														<Tag color='default'>{message.shiftName}</Tag>
														<Tag color='default'>{message.regDate}</Tag>
													</div> */}
												</div>
												{/* {message.messageFrom} */}
												{message.status === 'pending' ? (<>
													<div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ justifyContent: "flex-end", width: "101px", border: "1px solid gray", marginTop: "5px", marginBottom: "10px", textAlign: "center", borderRadius: "5px" }} onClick={() => deleteNotification1(index)}>
														Acknowledged
													</div></div>
													<div>
														Your request has been sent to {message.from?.firstName[0]} {message.from?.lastName}
													</div></>
												) : (
													<><div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ justifyContent: "flex-end", width: "101px", border: "1px solid gray", marginTop: "5px", marginBottom: "10px", textAlign: "center", borderRadius: "5px" }} onClick={() => deleteNotification1(index)}>
														Acknowledged
													</div></div>
														{message.from?.firstName[0]} {message.from?.lastName}  has accepted your request,
														<br />
														{message.to?.firstName.charAt(0)} {message.to?.lastName} is now {message.shiftName} {message?.from?.regDate}.

													</>
												)}
												<br></br>
												{message.status === 'accepted' && (
													<h1></h1>
												)}
												{/* <div className='row'>
													<Button className='col-6' onClick={() => deleteNotification1(index)}>
														Delete this notification
													</Button>
													<div className='col-6' onClick={() => showShiftModal1(index)}>
														<Tag color='red'>{'Detail'}</Tag>
													</div>
												</div> */}
												<hr />
											</div>
										)}
									</div>
								)}
							</div>
						)}

						<div className='row'>
							<div className='col-12'>
								<div
									style={{
										marginTop: '2px',
										marginBottom: '2px',
									}}></div>
							</div>
						</div>
					</div>
				</Menu.Item>
			))
			}
		</Menu >
	);

	const onSetSidebarOpen = (open) => {
		setSidebarOpen(open);
	};

	return (
		<div>
			<Sidebar
				sidebar={
					<div style={{ backgroundColor: 'black' }}>
						<Sider style={{ height: '100vh' }}>
							<h5 className='pt-4 pb-2 text-center text-muted'>
								{user.firstName}
								{user.lastName}
							</h5>
							<Menu theme='dark' mode='inline' defaultSelectedKeys={[]}>
								{/*  */}
								<Menu.Item key='1' icon={<CalendarOutlined />}>
									<Link to='/user/shifts-calender'>Shifts Calender</Link>
								</Menu.Item>
								<Menu.Item key='2' icon={<EditOutlined />} onClick={editingProfile}>
									Edit Profile
								</Menu.Item>
								<Menu.Item key='3' icon={<SwapOutlined />}>
									<Link to='/user/user-shifts/my-shifts'>My Shifts</Link>
								</Menu.Item>
								<Menu.Item key='4' icon={<MinusCircleOutlined />}>
									<Link to='/user/user-shifts/my-off-shifts'>Off Shifts</Link>
								</Menu.Item>
								<Menu.Item key='5' icon={<PullRequestOutlined />}>
									<Link to='/user/user-shifts/my-req-shifts'>Requested Shifts</Link>
								</Menu.Item>

								<Menu.Item key='10' icon={<LogoutOutlined />}>
									<Link to='/superadmin/logout'>Logout</Link>
								</Menu.Item>
							</Menu>
						</Sider>
					</div>
				}
				open={sidebarOpen}
				onSetOpen={onSetSidebarOpen}
				touch={true}
				styles={{ backgroundColor: 'black' }}>
				<nav className='navbar navbar-dark bg-primary' style={{ height: '80px' }}>
					<MenuOutlined className='text-white' style={{ fontSize: '25px' }} onClick={() => onSetSidebarOpen(true)} />
					<a className='navbar-brand'>ShiftsCalender</a>

					<div>
						{/* <span>
              <Dropdown overlay={menu} placement="bottomCenter">
                <Badge dot>
                  <BellFilled style = {{
                    color: 'white',
                     cursor: 'pointer'
                  }} />
                </Badge>  
              </Dropdown>
                
            </span> */}
						{/* {
                dsplayMessage.length === 0
                ?
                <span>
              <Dropdown overlay={menu} placement="bottomCenter">
                  <BellFilled style = {{
                    color: 'white',
                     cursor: 'pointer',
                     fontSize: '20px',
                  }} />
              </Dropdown>
                
            </span>
            :
            <span>
              <Dropdown overlay={menu} placement="bottomCenter">
                <Badge color="geekblue">
                  <BellFilled style = {{
                    color: 'white',
                     cursor: 'pointer',
                     fontSize: '20px',
                  }} />
                </Badge>  
              </Dropdown>
                
            </span>
              } */}
						{/* <Link to="/user/profile"> */}
						{/* <span className="ml-2" onClick={editingProfile} > */}

						{dsplayMessage.length === 0 ? (
							<span className='ml-2'>
								<Dropdown overlay={menu} visible={notificationVisible} trigger={['click']} placement='bottomCenter'>
									<Avatar
										style={{
											backgroundColor: '#001529',
											verticalAlign: 'middle',
											cursor: 'pointer',
										}}
										size='large'>
										{user.firstName.split(' ')[0].charAt(0).toUpperCase()}
										{user.lastName.split(' ')[0].charAt(0).toUpperCase()}
									</Avatar>
								</Dropdown>
							</span>
						) : (
							<span className='ml-2'>
								<Dropdown overlay={menu} visible={notificationVisible} trigger={['click']} onVisibleChange={handleVisibleChange} placement='topCenter'>
									<Badge color='red'>
										<Avatar
											style={{
												backgroundColor: '#001529',
												verticalAlign: 'middle',
												cursor: 'pointer',
											}}
											size='large'>
											{user.firstName.split(' ')[0].charAt(0).toUpperCase()}
											{user.lastName.split(' ')[0].charAt(0).toUpperCase()}
										</Avatar>
									</Badge>
								</Dropdown>
							</span>
						)}
						{/* <span className="ml-2" >
                <Avatar
                  style={{
                    backgroundColor: "#001529",
                    verticalAlign: "middle",
                    cursor: 'pointer'
                  }}
                  size="large"
                >
                  {user.firstName.split(" ")[0].charAt(0).toUpperCase()}{user.lastName.split(" ")[0].charAt(0).toUpperCase()}
                </Avatar>
              </span> */}
						{/* </Link> */}
					</div>
				</nav>
				<div>
					<Modal
						title='Swapped shifts details'
						visible={visible}
						maskClosable={true}
						onCancel={() => setVisible(false)}
						footer={[
							<Button key='1' onClick={deleteNotification}>
								Delete this notification
							</Button>,
							<Button key='2' type='primary' onClick={() => setVisible(false)}>
								OK
							</Button>,
						]}>
						<Row>
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								{shifts.map((dat, index) => (
									<div>
										{index === 0 ? (
											<Card type='inner'>
												<div>
													<b>Currently Assigned Doctor</b>
													<br />
													{'Name:' + ' ' + dat.firstName + ' ' + dat.lastName}
													<br />
													{'Email:' + ' ' + dat.email}
													<br />
												</div>
											</Card>
										) : (
											<div>
												{index === 1 ? (
													<div>
														<br />
														<Card type='inner'>
															<div>
																<b>Shift Details</b>
																<br />
																{'Date:' + ' ' + new Date(dat.start).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
																<br />
																{'Shift Name:' + ' ' + dat.shifname}
															</div>
														</Card>
													</div>
												) : (
													<Card type='inner'>
														<div>
															<b>Previously Assigned Doctor</b>
															<br />
															{'Name:' + ' ' + dat.firstName + ' ' + dat.lastName}
															<br />
															{'Email:' + ' ' + dat.email}
															<br />
														</div>
													</Card>
												)}
											</div>
										)}
									</div>
								))}
							</Col>
						</Row>
					</Modal>
				</div>
				<div>
					<Modal
						title='Edit Profile'
						visible={editProfile}
						maskClosable={true}
						onCancel={() => setEditProfile(false)}
						// onOk={handleOk}
						footer={null}>
						<EditUser setEditProfile={(val) => setEditProfile(val)} userObj={myDetails} id={myDetails._id} />
					</Modal>

					<Modal
						title='Accept or decline Shift'
						visible={visible2}
						maskClosable={true}
						onCancel={() => set2Visible(false)}
						// onOk={handleOk}
						footer={null}>
						<Row>
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								{shifts.map((dat, index) => (
									<div>
										{index === 0 ? (
											<Card type='inner'>
												<div>
													<b>Requester Details</b>
													<br />
													{'Name:' + ' ' + dat.firstName + ' ' + dat.lastName}
													<br />
													{'Email:' + ' ' + dat.email}
													<br />
												</div>
											</Card>
										) : (
											<div>
												{index === 1 ? (
													<div>
														<br />
														<Card type='inner'>
															<div>
																<b>Shift Details</b>
																<br />
																{'Current Doctor:' + ' ' + dat.title}
																<br />
																{'Date:' + ' ' + dat.start}
																<br />
																{'Shift Name:' + ' ' + dat.shifname}
															</div>
														</Card>
													</div>
												) : (
													<div></div>
												)}
											</div>
										)}
									</div>
								))}
							</Col>
						</Row>
						<br />
						<Row>
							<Col lg={6} xs={6} xl={6} sm={6}>
								<Button onClick={deleteNotification}>Delete this notification</Button>
							</Col>
							<Col lg={10} xs={10} xl={10} sm={10}></Col>
							<Col lg={4} xs={4} xl={4} sm={4}>
								<Button onClick={updateNotification}>Reject</Button>
							</Col>
							<Col lg={4} xs={4} xl={4} sm={4}>
								<Button type='primary' onClick={swapShift}>
									Exchange
								</Button>
							</Col>
						</Row>
					</Modal>

					<Modal
						title='Sent shift details'
						visible={sentVisible}
						maskClosable={true}
						footer={[
							<Button onClick={deleteNotification} key='1'>
								Delete this notification
							</Button>,
							<Button onClick={() => setsentVisible(false)} key='2' type='primary'>
								Cancel
							</Button>,
						]}
						onCancel={() => setsentVisible(false)}
					// // onOk={handleOk}
					// footer={null}
					>
						<Row>
							<Col xs={24} sm={24} md={24} lg={24} xl={24}>
								{shifts.map((dat, index) => (
									<div>
										{index === 0 ? (
											<Card type='inner'>
												<div>
													<b>Requester Details</b>
													<br />
													{'Name:' + ' ' + dat.firstName + ' ' + dat.lastName}
													<br />
													{'Email:' + ' ' + dat.email}
													<br />
												</div>
											</Card>
										) : (
											<div>
												{index === 1 ? (
													<div>
														<br />
														<Card type='inner'>
															<div>
																<b>Shift Details</b>
																<br />
																{'Current Doctor:' + ' ' + dat.title}
																<br />
																{'Date:' + ' ' + new Date(dat.start).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })}
																<br />
																{'Shift Name:' + ' ' + dat.shifname}
															</div>
														</Card>
													</div>
												) : (
													<div></div>
												)}
											</div>
										)}
									</div>
								))}
							</Col>
						</Row>
						<br />
					</Modal>
				</div>
				<Switch>
					<Route exact path='/user/shifts-calender' component={ShiftsCalendar} />
					<Route exact path='/user/user-shifts/my-shifts' component={RestricSwapping} />
					<Route exact path='/user/user-shifts' component={UserShiftCrud} />
					<Route exact path='/user/user-shifts/my-off-shifts' component={OffShift} />
					<Route exact path='/user/user-shifts/my-req-shifts' component={ReqShift} />
					<Route exact path='/user/user-shifts/user-exchange-shifts' component={UserExchangeShift} />
					<Route exact path='/superadmin/logout' component={Logout} />
				</Switch>
			</Sidebar>
		</div>
	);
};

export default Side;
