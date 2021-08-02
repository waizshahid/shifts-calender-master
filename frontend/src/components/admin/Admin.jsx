import React, { useState, useEffect } from 'react';
import { Link, Switch, Route } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import Profile from './Profile/Profile';
import ShiftsCalender from './ShiftsCalender/ShiftsCalender';
import ManageUsers from './ManageUsers/ManageUsers';
import Logout from './Logout/Logout';
import ExchangeShift from './requestShift';
import axios from 'axios';
import Side from '../user/sidebar';
import jwt_decode from 'jwt-decode';
import EditUser from '../user/editUser';
// import UploadFile from './ShiftsCalender/uploadfile'
import { Layout, Menu, Avatar, Tag, Dropdown, Badge, Modal, Col, Row, Card, Button } from 'antd';
import { BellFilled, EditOutlined, LogoutOutlined, MenuOutlined, CalendarOutlined, PullRequestOutlined, FileExcelOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
let user1 = '';
let user2 = '';
let date = '';
let shiftname = '';
let users = [];

const Admin = ({ admin }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [dsplayMessage, setMessage] = useState([]);
	const token = localStorage.admintoken;
	const decoded = jwt_decode(token);
	const currentId = decoded.id;
	const [shifts, setShifts] = useState([]);
	const [editProfile, setEditProfile] = useState(false);
	const [index, setIndex] = useState();
	const [myDetails, setMyDetails] = useState({});
	const [visible, setVisible] = useState(false);
	const [visible2, set2Visible] = useState(false);
	const [notificationVisible, setNotificationVisible] = useState(false);

	useEffect(() => {
		console.log(admin);
	}, []);
	const editingProfile = () => {
		setEditProfile(true);
	};
	useEffect(() => {
		axios
			.get('user/getMyDetails/' + currentId)
			.then((resp) => {
				setMyDetails(resp.data);
				console.log('admin detailssss', resp.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [editProfile]);
	const onSetSidebarOpen = (open) => {
		setSidebarOpen(open);
	};
	useEffect(() => {
		getNotifications();
	}, [shifts]);
	useEffect(() => {
		getNotifications();
	}, []);
	const swapShift = () => {
		console.log(index);
		exchangeAndDelete();
		set2Visible(false);
	};

	const exchangeAndDelete = () => {
		console.log(index);
		console.log(dsplayMessage[index]);
		const id = dsplayMessage[index]._id;
		const shiftId1 = dsplayMessage[index].shiftFrom;
		const userToExchange = dsplayMessage[index].to;

		console.log(id);
		console.log(userToExchange);

		axios
			.get('shift/swapShiftUser/' + shiftId1 + '/' + userToExchange)
			.then((res) => {
				//   axios.delete("user/deleteCurrentNotification/"+id)
				axios
					.put('user/updateResponses/' + id)
					.then((res) => {
						refresh();
					})
					.catch((err) => {
						console.log(err);
					});
				console.log(res);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const deleteNotification = (index) => {
		console.log('display mesage index', dsplayMessage[index]);
		const notificationId = dsplayMessage[index]?._id;
		console.log(dsplayMessage[index]?._id);
		axios
			.delete('user/deleteCurrentNotification/' + notificationId)
			.then((res) => {
				console.log(res.data);
				getNotifications();
				setNotificationVisible(true)
			})
			.catch((err) => {
				console.log(err);
			});
	};


	const deleteNotificationFromMeonly = (message) => {
		console.log('message lelo', message);
		const notificationId = dsplayMessage[message]._id;
		console.log(dsplayMessage[message]._id);
		axios.put('user/deleteforme/' + notificationId)
			.then((res) => {
				console.log(res)
				getNotifications();
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const handleVisibleChange = (flag) => {
		setNotificationVisible(flag)
	}

	const getNotifications = () => {
		//   axios.get("user/getCurrentUserNotificationsTo/"+currentId).then((res1) => {
		// axios.get("user/getCurrentUserNotificationsFrom/"+currentId).then((res2) => {
		// let array = [...res1.data,...res2.data];
		// // console.log(array)
		// setMessage(array)
		// })
		// })
		axios
			.get('user/getNotifcations')
			.then(async (res1) => {
				console.log(res1);
				let array = [];
				for (let i = 0; i < res1.data.length; i++) {
					if (res1.data[i].requesterType === 'Super Admin') {
						array.push(res1.data[i]);
					} else if (res1.data[i].requesterType === 'Admin' && (res1.data[i].currentUserId === currentId || res1.data[i].from?._id == currentId) && res1.data[i].to?._id != null && res1.data[i].to != null) {
						array.push(res1.data[i]);
					} else if (res1.data[i].requesterType === 'User' && (res1.data[i].from?._id === currentId || res1.data[i].from?._id == currentId)) {
						array.push(res1.data[i]);
					}
				}

				console.log(array, array.length, "my notification array")
				// for (let i = 0; i < array.length; i++) {

				// 	let user = await axios.get('user/getuser' + '/' + array[i].currentUserId)
				// 	console.log(user, "user")
				// 	users.push(user.data);
				// }
				console.log('notificationssss', array, users);
				setMessage(array);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const deleteNotification1 = (message, sendEmail) => {
		console.log('message lelo', message);
		const notificationId = dsplayMessage[message]._id;
		console.log(dsplayMessage[message]._id);
		axios
			.delete('user/deleteCurrentNotification/' + notificationId, { sendEmail: sendEmail })
			.then((res) => {
				getNotifications();
			})
			.catch((err) => {
				console.log(err);
			});
	};
	const updateHistory = (currentUserId, userId1, userId2, shiftId1, message, adminresponse, date, requester, shiftName) => {
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
			})
			.then((res) => {
				refresh();
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
		console.log("data in fff", shiftId1, userToExchange, userId1)
		axios
			.get('shift/swapShiftUser/' + shiftId1._id + '/' + userToExchange + '/' + userId1)
			.then((res) => {
				console.log(res);
				axios
					.put('user/updateResponses/' + id)
					.then((res) => {
						// console.log(res)
						updateHistory(currentUserId, userId1, userId2, shiftId1, message1, adminresponse, date, requester, shiftName);
					})
					.catch((err) => {
						console.log(err);
					});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const updateNotification1 = (message) => {
		const notificationId = dsplayMessage[message]._id;
		console.log(dsplayMessage[message]._id);
		axios
			.put('user/updateResponsesandDelete/' + notificationId)
			.then((res) => {
				refresh();
			})
			.catch((err) => {
				console.log(err);
			});
		window.location.reload();
	};

	const showShiftModal1 = (message) => {
		console.log(message);
		settingIndex(message);

		{
			dsplayMessage[message].requesterType == 'User' ? set2Visible(true) : setVisible(false);
		}
		const editingProfile = () => {
			setEditProfile(true);
		};

		axios
			.get('user/getShiftTo/' + dsplayMessage[message].from)
			.then((res1) => {
				axios.get('user/getShiftFrom/' + dsplayMessage[message].shiftFrom).then((res2) => {
					axios.get('user/getShiftTo/' + dsplayMessage[message].to).then((res3) => {
						let shiftArray = [res1.data[0], res2.data.shifts[0], res3.data[0]];
						let temp = [];
						for (let i = 0; i < shiftArray.length; i++) {
							if (shiftArray[i] != undefined) {
								temp.push(shiftArray[i]);
							}
						}
						let user2firstName = temp[2].firstName ? temp[2].firstName : temp[1].firstName;
						let user2lastName = temp[2].lastName ? temp[2].lastName : temp[1].lastName;
						user1 = temp[0].firstName + ' ' + temp[0].lastName;
						user2 = user2lastName + ' ' + user2firstName;
						date = new Date(temp[1].start).toLocaleString('default', {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						});
						shiftname = temp[1].shifname;
						console.log(temp);
						console.log(user1, user2, date, shiftname);
						console.log('temp data to be stored', temp);
						setShifts(temp);
					});
				});
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const showShiftModal = (message) => {
		console.log(message.key);
		settingIndex(message.key);

		{
			dsplayMessage[message.key].requesterType == 'User' ? set2Visible(true) : setVisible(false);
		}
		const editingProfile = () => {
			setEditProfile(true);
		};

		axios
			.get('user/getShiftTo/' + dsplayMessage[message.key].from)
			.then((res1) => {
				axios.get('user/getShiftFrom/' + dsplayMessage[message.key].shiftFrom).then((res2) => {
					axios.get('user/getShiftTo/' + dsplayMessage[message.key].to).then((res3) => {
						let shiftArray = [res1.data[0], res2.data.shifts[0], res3.data[0]];
						let temp = [];
						for (let i = 0; i < shiftArray.length; i++) {
							if (shiftArray[i] != undefined) {
								temp.push(shiftArray[i]);
							}
						}
						user1 = temp[0].firstName + ' ' + temp[0].lastName;
						//user2 = temp[2].firstName + " " + temp[2].lastName;
						date = new Date(temp[1].start).toLocaleString('default', {
							month: 'short',
							day: 'numeric',
							year: 'numeric',
						});
						shiftname = temp[1].shifname;
						console.log(temp);
						console.log(user1, user2, date, shiftname);
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
			//onClick={showShiftModal}
			style={{
				width: '94%',
				borderRadius: '6px',
				marginRight: '30px',
				marginTop: '30px',
			}}>
			{/* <b style={{
			backgroundColor:'rosybrown',
			color: 'white',
			padding: '15px 15px',
			display: 'block',
		  }}>Notification</b>
	 */}
			{console.log('==============', dsplayMessage)}
			{dsplayMessage
				.filter((msg) => !msg.adminEdit)
				.map((message, index) => (
					<Menu.Item key={index}>
						<div
							style={{
								width: '400',
								borderRadius: '6px',
								marginRight: '10px',
								textAlign: 'end',
							}}>
							{message.requesterType === 'Super Admin' ? (
								<div>
									<div className='row'>
										<Tag className='col-2' color='success' onClick={() => showShiftModal1(index)}>
											Detail
										</Tag>
										<div
											className='col-6'
											style={{
												display: 'flex',
											}}>
											<Tag color='success'>{message.requesterType}</Tag>
										</div>
										<div className='col-4'>
											<Tag color='default'>{message.from.regDate}</Tag>
										</div>
									</div>
									<div className='row'>{message.message}</div>
									<hr />
								</div>
							) : message.requesterType === 'Admin' ? (
								<div>
									{message.currentUserId === currentId ? (
										<div>
											<div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ justifyContent: "flex-end", width: "101px", border: "1px solid gray", marginTop: "5px", marginBottom: "10px", textAlign: "center", borderRadius: "5px" }} onClick={() => deleteNotificationFromMeonly(index)}>
												Acknowledge
											</div></div>
											<div style={{ margin: 2, width: "309px", wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
												{/* {console.log(oneE, "opopopop")} */}
												<p>Your request for {message.shiftName} on {message.shiftFrom?.start} to {message?.from?.lastName} , {message?.from?.firstName.charAt(0)}  has been {message.status === 'accepted' ? 'accepted' : 'sent'} </p>
											</div>
											{/* {message.status === 'accepted' && (
												<Button style={{ margin: 20 }} key='1' onClick={() => deleteNotification(index)}>
													Delete this Request
												</Button>
											)} */}
											<div>
												{/* <Button style={{ margin: 20 }} key='1' onClick={deleteNotification}>
												Delete this Request
											</Button>
											<Button style={{ paddingLeft: 20 }} onClick={() => setVisible(false)} key='2' type='primary'>
												OK
											</Button> */}
											</div>
											<hr />
										</div>
									) : (
										message.status == 'pending' ?
											(<div>

												{message.message == "One of the User wants to swap his shift with you. Click for the detail..."}
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
															{message.currentUserId.lastName} , {message.currentUserId?.firstName?.charAt(0) + ' is requesting ' + message.shiftName + ' call on ' + message.shiftFrom?.start}
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
															<Button type='primary' className='button2setting' onClick={() => { swapShift1(index) }}>
																Accept
															</Button>
															<Button onClick={() => deleteNotification1(index, true)} className='rejectbutton'>
																Reject
															</Button>
														</Row>
													</div>
													<hr />
												</div>
											</div>
											)
											:
											(
												<div>
													<div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ justifyContent: "flex-end", width: "101px", border: "1px solid gray", marginTop: "5px", marginBottom: "10px", textAlign: "center", borderRadius: "5px" }} onClick={() => deleteNotificationFromMeonly(index)}>
														Acknowledge
													</div></div>
													<div style={{ margin: 2, width: "309px", wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
														{/* {console.log(oneE, "opopopop")} */}
														<p>Your request for {message.shiftName} call on {message.shiftFrom?.start} to {message?.from?.lastName} , {message?.from?.firstName.charAt(0)}  has been {message.status === 'accepted' ? 'accepted' : 'sent'} </p>
													</div>
													{/* {message.status === 'accepted' && (
												<Button style={{ margin: 20 }} key='1' onClick={() => deleteNotification(index)}>
													Delete this Request
												</Button>
											)} */}
													<div>
														{/* <Button style={{ margin: 20 }} key='1' onClick={deleteNotification}>
												Delete this Request
											</Button>
											<Button style={{ paddingLeft: 20 }} onClick={() => setVisible(false)} key='2' type='primary'>
												OK
											</Button> */}
													</div>
													<hr />
												</div>
											)
									)
									}
								</div>
							) : (

								<div>
									{message.requesterType === 'User' ? (
										<div className=''>
											{message?.from?._id === currentId || message?.to?._id === currentId ? (
												<div>
													{' '}
													{message.message !== 'Your swap request for the shift has been accepted' && message.message !== 'Your rejection response has been sent to the swap requester' && message.message !== 'Your shift has been exchanged. View Details' && message.message !== 'Your shift has been swapped. Click for details' ? (
														<div>
															{/* <Tag color='success' onClick={() => showShiftModal1(index)}>
															Detail
														</Tag>
														<Tag color='green'>{message.requesterType}</Tag> */}
															<br /> {message.currentUserId.lastName} , {message.currentUserId.firstName.charAt(0) + ' is requesting ' + message?.shiftName + ' call on ' + message.shiftFrom?.start}
															<br />
															{/* <Tag color='default'>{message.regDate}</Tag> */}
															<Row className='buttonsetting'>
																{/* <Button style={{ marginRight: 25 }} onClick={() => deleteNotification1(index)}>
																Delete this notification
															</Button>
															<Button onClick={() => updateNotification1(index)} className='rejectbutton'>
																Reject
															</Button>
															<Button type='primary' className='button2setting' onClick={() => swapShift1(index)}>
																Exchange
															</Button> */}

																{/* <Button style={{ marginRight: 25 }} onClick={() => deleteNotification1(index)}>
																Delete this notification
															</Button> */}
																<Button onClick={() => deleteNotification1(index, true)} className='rejectbutton'>
																	Reject
																</Button>
																<Button type='primary' className='button2setting' onClick={() => swapShift1(index)}>
																	Accept
																</Button>
															</Row>{' '}
															<hr />
														</div>
													) : (
														message.message == 'Your shift has been exchanged. View Details' ? (<div>
															<div style={{ display: "flex", justifyContent: "flex-end" }}><div style={{ justifyContent: "flex-end", width: "101px", border: "1px solid gray", marginTop: "5px", marginBottom: "10px", textAlign: "center", borderRadius: "5px" }} onClick={() => deleteNotification1(index, true)}>
																Acknowledge
															</div></div>
															<div style={{ margin: 2, width: "309px", wordWrap: "break-word", whiteSpace: "pre-wrap" }}>
																{/* {console.log(oneE, "opopopop")} */}
																<p>Your {message.shiftName} call for {message.shiftFrom?.start} has been exchanged to {message?.to?.lastName} , {message?.to?.firstName.charAt(0)}</p>
															</div>

															<hr />
														</div>
														) : (
															<div>
																<div>
																	<div className='row'>
																		{/* <div className='col-2'>
																	{' '}
																	<Tag color='success' onClick={() => showShiftModal1(index)}>
																		Detail
																	</Tag>{' '}
																</div> */}
																		<div className='col-4'>
																			<Tag color='success'>{message.requesterType}</Tag>
																		</div>
																		<div className='col-2'>
																			<Tag color='default'>{message.shiftName}</Tag>
																		</div>
																		<div className='col-2'>
																			<Tag color='default'>{message.shiftFrom?.start}</Tag>
																		</div>
																	</div>
																	<div className='row'>{message.message}</div>
																	<Button style={{ marginRight: 25 }} onClick={() => deleteNotification1(index)}>
																		Delete this notification
																	</Button>
																	<hr />
																</div>
															</div>)
													)}
												</div>
											) : (
												<div>
													{/* <Tag color="green">{message.requesterType}</Tag> <br/>{message.message}
										<Tag color="default">{message.regDate}</Tag> */}
												</div>
											)}
										</div>
									) : (
										<div className=''></div>
									)}
								</div>
							)}
						</div>
					</Menu.Item>
				))}
		</Menu>
	);
	const refresh = () => {
		window.location.reload();
	};
	const updateNotification = () => {
		const notificationId = dsplayMessage[index]._id;
		console.log(dsplayMessage[index]._id);
		axios
			.put('user/updateResponsesandDelete/' + notificationId)
			.then((res) => {
				refresh();
			})
			.catch((err) => {
				console.log(err);
			});
		window.location.reload();
	};

	return (
		<div>
			<Sidebar
				sidebar={
					<div style={{ backgroundColor: 'black' }}>
						<Sider style={{ height: '100vh' }}>
							<h5 className='pt-4 pb-2 text-center text-muted'>{admin.lastName + ' , ' + admin.firstName.charAt(0)}</h5>
							<Menu theme='dark' mode='inline' defaultSelectedKeys={[]}>
								{/* <Menu.Item key="1" icon={<UserOutlined />}>
									<Link to="/admin/profile">Profile</Link>
								</Menu.Item> */}
								<Menu.Item key='1' icon={<CalendarOutlined />}>
									<Link to='/admin/shifts-calender'>Shifts Calender</Link>
								</Menu.Item>
								<Menu.Item key='2' icon={<EditOutlined />} onClick={editingProfile}>
									Edit Profile
								</Menu.Item>
								{/* <Menu.Item key="4" icon={<UsergroupAddOutlined />}>
									<Link to="/admin/manage-users">Manage Users</Link>
								</Menu.Item> */}
								<Menu.Item key='3' icon={<PullRequestOutlined />}>
									<Link to='/admin/exchange-shifts'>Requested Shifts</Link>
								</Menu.Item>
								{/* <Menu.Item key="5" icon={<FileExcelOutlined />}>
									<Link to="/admin/upload">Upload Shifts Excel</Link>
								</Menu.Item> */}
								<Menu.Item key='10' icon={<LogoutOutlined />}>
									<Link to='/admin/logout'>Logout</Link>
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

						{dsplayMessage.length === 0 ? (
							<span>
								<Dropdown overlay={menu} visible={notificationVisible} trigger={['click']} placement='topCenter'>
									<Avatar
										style={{
											backgroundColor: '#001529',
											verticalAlign: 'middle',
											cursor: 'pointer',
										}}
										size='large'>
										{console.log(admin)}
										{admin.firstName.split(' ')[0].charAt(0).toUpperCase() + admin.lastName.split(' ')[0].charAt(0).toUpperCase()}
									</Avatar>
								</Dropdown>
							</span>
						) : (
							<span>
								<Dropdown overlay={menu} visible={notificationVisible} trigger={['click']} onVisibleChange={handleVisibleChange} placement='bottomCenter'>
									<Badge color='red'>
										<Avatar
											style={{
												backgroundColor: '#001529',
												verticalAlign: 'middle',
												cursor: 'pointer',
											}}
											size='large'>
											{console.log('admin1111', admin)}
											{admin.firstName.split(' ')[0].charAt(0).toUpperCase() + admin.lastName.split(' ')[0].charAt(0).toUpperCase()}
										</Avatar>
									</Badge>
								</Dropdown>
							</span>
						)}

						{/* <span className="ml-2" onClick={editingProfile}>
								<Avatar style={{ backgroundColor: "#001529", verticalAlign: "middle", cursor: 'pointer' }} size="large">
									{console.log(admin)}
									{admin.firstName.split(" ")[0].charAt(0).toUpperCase()+admin.lastName.split(" ")[0].charAt(0).toUpperCase()}
								</Avatar>
							</span> */}
					</div>
				</nav>

				<Switch>
					<Route exact path='/admin/profile' component={Profile} />
					<Route exact path='/admin/shifts-calender' component={ShiftsCalender} userObj={myDetails} />
					<Route exact path='/admin/manage-users' component={ManageUsers} />
					<Route exact path='/admin/exchange-shifts' component={ExchangeShift} />
					{/* <Route exact path="/admin/upload" component={UploadFile} /> */}
					<Route exact path='/admin/logout' component={Logout} />
				</Switch>
			</Sidebar>
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
				title='Swapped shifts details'
				visible={visible}
				maskClosable={true}
				onCancel={() => setVisible(false)}
				onOk={() => setVisible(false)}
				footer={[
					<Button key='1' onClick={deleteNotification}>
						Delete this notification
					</Button>,
					<Button onClick={() => setVisible(false)} key='2' type='primary'>
						OK
					</Button>,
				]}
			// onOk={handleOk}
			>
				<Row>
					{/* <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      {shifts.map((dat,index) => (
                          <div>
                              {
                                  index === 0 ?
                                  <Card type="inner">
                              
                                  <div>
                                    <b>Assigned Doctor Details</b><br/>
									<div className="row">
										<div className="col-2">
										Name:
										</div>
										<div className="col-6">
										{dat.firstName+' '+dat.lastName}
										</div>
									</div>
									<div className="row">
										<div className="col-2">
										Email:
										</div>
										<div className="col-6">
										{dat.email}
										</div>
									</div>
                                  </div>
                                  </Card>
                                  :
                                  (
									  index === 1
									  ?
											<div>
											<br/>
											<Card type="inner">
									
									<div>
										<b>Assigned Shift Details</b><br/>
										<div className="row">
											<div className="col-3">Date:</div>
											<div className="col-6"> {dat.start} </div>
										</div>
										<div className="row">
											<div className="col-3">Shift Name:</div>
											<div className="col-6"> {dat.shifname} </div>
										</div>

									</div>
									</Card>
											</div>
										 :
										 <Card>
										 <div className="row">
										<div className="col-2">
										Name:
										</div>
										<div className="col-6">
										{dat.firstName+' '+dat.lastName}
										</div>
									</div>
									<div className="row">
										<div className="col-2">
										Email:
										</div>
										<div className="col-6">
										{dat.email}
										</div>
									</div>
                                  
                                  </Card> 
								  )
                                  
                            }
                          </div>
                        ))}
                      </Col>
                       */}
					<div>
						Swapping <b>{shiftname + ' '}</b> calls for <b> {date + ' '}</b> from <b>{user1 + ' '}</b> to <b>{user2}</b>
					</div>
				</Row>
			</Modal>
			<Modal
				title='Accept or decline Shift'
				visible={visible2}
				maskClosable={true}
				onCancel={() => set2Visible(false)}
				// onOk={handleOk}
				//   footer={[
				// 	<Button key="1" onClick={deleteNotification}>Ignore</Button>,
				// 	<Button key="2" type="primary" onClick={swapShift}>Exchange</Button>
				//   ]}
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
											{shifts[2].firstName ? 'Name:' + ' ' + shifts[2].firstName + ' ' + shifts[2].lastName : 'Name:' + ' ' + shifts[1].firstName + ' ' + shifts[1].lastName}
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
				<br />
				<Row>
					<Col lg={6} xs={6} xl={6} sm={6}>
						<Button onClick={deleteNotification}>Delete this notifications</Button>
					</Col>
					<Col lg={10} xs={10} xl={10} sm={10}></Col>
					<Col lg={4} xs={4} xl={4} sm={4}>
						<Button onClick={updateNotification}>Reject</Button>
						{/* <Button>Reject</Button> */}
					</Col>
					<Col lg={4} xs={4} xl={4} sm={4}>
						<Button type='primary' onClick={swapShift}>
							Exchange
						</Button>
					</Col>
				</Row>
				<Row>
					{/* <Col lg={16} xs={16} xl={16} sm={16}></Col>
                    <Col lg={4} xs={4} xl={4} sm={4}>
                      <Button type="primary" onClick={deleteNotification}>Ignore</Button>
                    </Col>
                      <Col lg={4} xs={4} xl={4} sm={4}><Button type="primary" onClick={swapShift}>Exchange</Button>
                        </Col> */}
				</Row>
			</Modal>
			{/* <h1>Super Admin</h1>
			<h1>{superAdmin.email}</h1> */}
		</div>
	);
};

export default Admin;
