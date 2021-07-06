import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, Switch, Route } from 'react-router-dom';
import Sidebar from 'react-sidebar';
import Profile from './Profile/Profile';
import ShiftsCalender from './ShiftsCalender/ShiftsCalender';
import ExchangeShift from './exchangeShifts';
import ManageShiftTypes from './ManageShiftTypes/ManageShiftTypes';
import OffShift from './OffShiftsRequest';
import ManageUsers from '../superAdmin/ManageUsers/ManageUsers';
import RequestShift from './ShiftsCalender/requestShift';
import Logout from './Logout/Logout';
import Upload from './ShiftsCalender/uploadfile';
import EditUser from './EditSuperAdmin';
import UserSheet from './ManageUsers/uploadUsersSheet';
import NotificationEmail from './EmailNotification/EmailNotificaiton';
import jwt_decode from 'jwt-decode';
import { Layout, Menu, Avatar, Modal, Button, Col, Card, Tag, Dropdown, Badge } from 'antd';
import { FormOutlined, PullRequestOutlined, LogoutOutlined, BellFilled, MenuOutlined, CalendarOutlined, EditOutlined, MinusCircleOutlined, FileExcelOutlined, UsergroupAddOutlined, NotificationOutlined } from '@ant-design/icons';

const { Header, Content, Footer, Sider } = Layout;
let notificationId = '';
const SuperAdmin = ({ superAdmin }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [visible, setVisible] = useState(false);
	const [delVisible, setdelVisible] = useState(false);
	const [index, setIndex] = useState();
	const [shifts, setShifts] = useState([]);
	const [dsplayMessage, setMessage] = useState([]);
	const [myDetails, setMyDetails] = useState({});
	const [editProfile, setEditProfile] = useState(false);
	const token = localStorage.superadmintoken;
	const decoded = jwt_decode(token);
	const currentId = decoded.id;

	const editingProfile = () => {
		setEditProfile(true);
	};

	useEffect(() => {
		axios
			.get('user/getSuperAdminDetails/' + currentId)
			.then((resp) => {
				setMyDetails(resp.data);
				console.log(currentId);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [editProfile]);

	const showShiftModal = (message) => {
		console.log(message.key);
		notificationId = dsplayMessage[message.key]._id;
		setVisible(true);
	};

	useEffect(() => {
		console.log(notificationId);
		axios
			.get('user/getSpecificNotification/' + notificationId)
			.then((res) => {
				console.log(res.data.shifts);
				setShifts(res.data.shifts);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [visible]);

	const menu = (
		<Menu
			onClick={showShiftModal}
			style={{
				width: '400',
				borderRadius: '6px',
				marginRight: '30px',
				marginTop: '20px',
			}}>
			{dsplayMessage.length === 0 ? (
				<div
					style={{
						color: 'black',
						padding: '5px 5px 5px 5px',
						fontSize: '14px',
					}}>
					No notification right now
				</div>
			) : (
				<div></div>
			)}
			{dsplayMessage.map((message, index) => (
				<Menu.Item key={index}>
					<div
						style={{
							textAlign: 'end',
						}}>
						<div>
							<div className='row'>
								<div
									className='col-8'
									style={{
										display: 'flex',
									}}>
									<Tag color='success'>{message.requesterType}</Tag>
								</div>
								<div className='col-4'>
									<Tag color='default'>{message.from.regDate}</Tag>
								</div>
							</div>
							{/* {message.adminresponse} */}
							{'Your call for the shift named ' + message.shiftName + ' has been swapped'}
						</div>
					</div>
				</Menu.Item>
			))}
		</Menu>
	);
	useEffect(() => {
		console.log(superAdmin);
	}, []);

	useEffect(() => {
		axios
			.delete('user/deleteCurrentNotification/' + notificationId)
			.then((res) => {
				console.log(res.data);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err);
			});
	}, [delVisible]);
	useEffect(() => {
		getNotifications();
	}, [shifts]);

	const getNotifications = () => {
		axios
			.get('user/getNotifcations')
			.then((res1) => {
				let temp = [];
				console.log(res1);
				for (let i = 0; i < res1.data.length; i++) {
					if (res1.data[i].requesterType === 'Super Admin') {
						temp.push(res1.data[i]);
					}
				}
				console.log(temp);
				setMessage(temp);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	const onSetSidebarOpen = (open) => {
		setSidebarOpen(open);
	};

	return (
		<div>
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
					title='Swapped shifts details'
					visible={visible}
					maskClosable={true}
					onCancel={() => setVisible(false)}
					footer={[
						<Button key='1' onClick={() => setdelVisible(true)}>
							Delete this notification
						</Button>,
						<Button key='2' type='primary' onClick={() => setVisible(false)}>
							OK
						</Button>,
					]}>
					{shifts.map((message) => (
						<div style={{}}>
							<div>
								<div className='container'>
									<div className='row'>
										<b>Date:</b>
										{' ' + message.date}
									</div>
								</div>
								<br />
								<div className='row'>
									<div className='col-6'>
										<div
											style={{
												border: '1px solid lightgrey',
												padding: '10px 10px 10px 10px',
											}}>
											<b>Person 1</b>
											<br />
											<b>Name:</b>
											{' ' + message.user1Name}
											<br />
											<b>Type:</b>
											{' ' + message.user1Type}
										</div>
									</div>
									<div className='col-6'>
										<div
											style={{
												border: '1px solid lightgrey',
												padding: '10px 10px 10px 10px',
											}}>
											<b>Person 2</b>
											<br />
											<b>Name:</b>
											{' ' + message.user2Name}
											<br />
											<b>Type:</b>
											{' ' + message.user2Type}
										</div>
									</div>
								</div>
							</div>
						</div>
					))}
				</Modal>
			</div>
			<Sidebar
				sidebar={
					<div style={{ backgroundColor: 'black' }}>
						<Sider style={{ height: '100vh' }}>
							<h5 className='pt-4 pb-2 text-center text-muted'>{superAdmin.username}</h5>
							<Menu theme='dark' mode='inline' defaultSelectedKeys={[]}>
								<Menu.Item key='1' icon={<CalendarOutlined />}>
									<Link to='/superadmin/shifts-calender'>Shifts Calender</Link>
								</Menu.Item>
								<Menu.Item key='2' icon={<EditOutlined />} onClick={editingProfile}>
									Edit Profile
								</Menu.Item>
								<Menu.Item key='3' icon={<FormOutlined />}>
									<Link to='/superadmin/manage-shift-types'>Manage Shift Types</Link>
								</Menu.Item>
								<Menu.Item key='4' icon={<UsergroupAddOutlined />}>
									<Link to='/superadmin/manage-users'>Manage Users</Link>
								</Menu.Item>
								<Menu.Item key='5' icon={<FileExcelOutlined />}>
									<Link to='/superadmin/upload'>Shifts Excel Sheet</Link>
								</Menu.Item>
								<Menu.Item key='6' icon={<MinusCircleOutlined />}>
									<Link to='/superadmin/off-shifts'>Off Shifts</Link>
								</Menu.Item>
								<Menu.Item key='9' icon={<PullRequestOutlined />}>
									<Link to='/superadmin/manage-requestShifts'>Requested Shifts</Link>
								</Menu.Item>
								<Menu.Item key='10' icon={<NotificationOutlined />}>
									<Link to='/superadmin/notification-email'>Notification Email</Link>
								</Menu.Item>
								<Menu.Item key='11' icon={<LogoutOutlined />}>
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
								<Badge color="geekblue" >
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
							<span className='ml-2'>
								<Dropdown overlay={menu} trigger={['click']} placement='bottomCenter'>
									<Avatar
										style={{
											backgroundColor: '#001529',
											verticalAlign: 'middle',
											cursor: 'pointer',
										}}
										size='large'>
										{console.log(superAdmin)}
										{superAdmin.first_name.split(' ')[0].charAt(0).toUpperCase() + superAdmin.last_name.split(' ')[0].charAt(0).toUpperCase()}
									</Avatar>
								</Dropdown>
							</span>
						) : (
							<span>
								<span className='ml-2'>
									<Dropdown overlay={menu} trigger={['click']} placement='bottomCenter'>
										<Badge color='red'>
											<Avatar
												style={{
													backgroundColor: '#001529',
													verticalAlign: 'middle',
													cursor: 'pointer',
												}}
												size='large'>
												{console.log(superAdmin)}
												{superAdmin.first_name.split(' ')[0].charAt(0).toUpperCase() + superAdmin.last_name.split(' ')[0].charAt(0).toUpperCase()}
											</Avatar>
										</Badge>
									</Dropdown>
								</span>
							</span>
						)}

						{/* <span className="ml-2" onClick={editingProfile} > */}
						{/* <span className="ml-2">
								<Dropdown overlay={menu} placement="bottomCenter">
									<Badge color="geekblue" >
										<Avatar style={{ backgroundColor: "#001529", verticalAlign: "middle", cursor: "pointer" }} size="large">
											{console.log(superAdmin)}
											{superAdmin.first_name.split(" ")[0].charAt(0).toUpperCase()+superAdmin.last_name.split(" ")[0].charAt(0).toUpperCase()}
										</Avatar>
									</Badge>
								</Dropdown>
								
							</span> */}
					</div>
				</nav>

				<div>
					{/* <Modal
                  title="Swapped shifts details"
                  visible={visible}
                  maskClosable={true}
                  onCancel={() => setVisible(false)}
                  // onOk={handleOk}
                  >
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        {shifts.map((dat,index) => (
                            <div>
                              <Card type="inner">
                        
                                <b>Shift {index+1}</b><br/><br/>
                                {'Name:'+' '+dat.title}<br/>
                                {'Date:'+' '+dat.start}<br/>
                                {'Shift Name:'+' '+dat.shifname}

                                <br/>
                                <br/>
                              </Card>
                            <br/>
                            </div>
                        
                        ))}
                      </Col>
                      
                    </Row>
                    
                </Modal> */}
				</div>
				<Switch>
					<Route exact path='/superadmin/profile' component={Profile} />
					<Route exact path='/superadmin/shifts-calender' component={ShiftsCalender} />
					<Route exact path='/superadmin/manage-shift-types' component={ManageShiftTypes} />
					<Route exact path='/superadmin/manage-users' component={ManageUsers} />
					<Route exact path='/superadmin/manage-requestShifts' component={RequestShift} />
					<Route exact path='/superadmin/upload' component={Upload} />
					<Route exact path='/superadmin/off-shifts' component={OffShift} />
					<Route exact path='/superadmin/exchange-shifts' component={ExchangeShift} />
					<Route exact path='/superadmin/users-sheet' component={UserSheet} />
					<Route exact path='/superadmin/notification-email' component={NotificationEmail} />
					<Route exact path='/superadmin/logout' component={Logout} />
				</Switch>
			</Sidebar>

			{/* <h1>Super Admin</h1>
			<h1>{superAdmin.email}</h1> */}
		</div>
	);
};

export default SuperAdmin;
