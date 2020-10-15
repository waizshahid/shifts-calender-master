import React, { useState, useEffect } from "react";
import axios from 'axios'
import { Link, Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import Profile from "./Profile/Profile";
import ShiftsCalender from "./ShiftsCalender/ShiftsCalender";
import ExchangeShift from './exchangeShifts'
import ManageShiftTypes from "./ManageShiftTypes/ManageShiftTypes";
import OffShift from './OffShiftsRequest'
import ManageUsers from "./ManageUsers/ManageUsers";
import RequestShift from './ShiftsCalender/requestShift'
import Logout from "./Logout/Logout";
import Upload from './ShiftsCalender/uploadfile'
import UserSheet from './ManageUsers/uploadUsersSheet'
import jwt_decode from 'jwt-decode'
import { Layout, Menu, Avatar, Modal,Row,Col,Card,Tag, Dropdown,Badge } from "antd";
import {
	FormOutlined,
	PullRequestOutlined,
	UserOutlined,
	LogoutOutlined,
	BellFilled,
	MenuOutlined,
	CalendarOutlined,
	MinusCircleOutlined,
	FileExcelOutlined,
	UsergroupAddOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
let notificationId=""
const SuperAdmin = ({ superAdmin }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [visible, setVisible] = useState(false);
	const [index, setIndex] = useState();
	const [shifts,setShifts] = useState({});
	const [dsplayMessage, setMessage] = useState([]);
	const token = localStorage.superadmintoken
    const decoded = jwt_decode(token)
    const currentId = decoded.id
	const showShiftModal = (message) => {
		console.log(message.key)
		// console.log(dsplayMessage[message.key]._id)
		notificationId = dsplayMessage[message.key]._id;
		setVisible(true)
		 };
		
		useEffect(()=> {
			console.log(notificationId)
			axios.get("http://localhost:4000/api/user/getSpecificNotification/"+notificationId)
			.then((res) => {
					console.log(res.data)
					setShifts(res.data)
			})
			.catch((err) => {
				console.log(err)
			})
		},[visible])
		//     useEffect(()=> {
		// 		console.log(dsplayMessage)
		// 		// console.log('User1: '+dsplayMessage.from)
		// 		// console.log('User2: '+dsplayMessage.to)
		// 		// console.log(dsplayMessage[index].to)
		//    },[index])
		//    useEffect(()=> {
		// 	console.log(currentId)
		// 	axios.get("http://localhost:4000/api/user/getSuperNotifcations/"+currentId)
		// 	.then((res) => {
		// 		let temp = []
		// 		console.log(res.data)
		// 		for(let i = 0 ; i < res.data.length ; i++){
		// 			if(res.data[i] !== undefined)
		// 			{
		// 				temp.push(res.data[i])
		// 			}
		// 		}
		// 		   setShifts(temp)
		// 	   })
		// 	   .catch((err) => {
		// 		 console.log(err)
		// 	   })
		//    },[visible])
	const menu = (
		<Menu onClick={showShiftModal}>
		  {/* <b style={{
			backgroundColor:'rosybrown',
			color: 'white',
			padding: '15px 15px',
			display: 'block',
		  }}>Notification</b> */}
	
			  {dsplayMessage.map((message,index) => (
				  <Menu.Item key = {index}>
				  <div style={{
				  }} 
				  >
							<div>
							<Tag color="success">{message.requesterType}</Tag>
							  {message.adminresponse}
							  <Tag color="default">{message.regDate}</Tag>
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
		getNotifications()
	}, [shifts]);

	const getNotifications = () => {
		axios.get("http://localhost:4000/api/user/getNotifcations")
		.then((res1) => {
			let temp = []
			for(let i = 0 ; i < res1.data.length ; i++){
				if(res1.data[i].requesterType === 'Default'){
					temp.push(res1.data[i])
				}
			}
			console.log(temp)
		  setMessage(temp)
		  })
		  .catch((err) => {
			console.log(err)
		  })
	  }

	const onSetSidebarOpen = (open) => {
		setSidebarOpen(open);
	};
	

	return (
		<div>
			<div>
                <Modal
                  title="Swapped shifts details"
                  visible={visible}
                  maskClosable={true}
                  onCancel={() => setVisible(false)}
                  // onOk={handleOk}
                  >
                    <Row>
                      {shifts.requesterType}
                      
                    </Row>
                    
                </Modal>
            </div>
			<Sidebar
				sidebar={
					<div style={{ backgroundColor: "black" }}>
						<Sider style={{ height: "100vh" }}>
							<h5 className="pt-4 pb-2 text-center text-muted">{superAdmin.username}</h5>
							<Menu theme="dark" mode="inline" defaultSelectedKeys={[]}>
								<Menu.Item key="1" icon={<UserOutlined />}>
									<Link to="/superadmin/profile">Profile</Link>
								</Menu.Item>
								<Menu.Item key="2" icon={<CalendarOutlined />}>
									<Link to="/superadmin/shifts-calender">Shifts Calender</Link>
								</Menu.Item>
								<Menu.Item key="3" icon={<FormOutlined />}>
									<Link to="/superadmin/manage-shift-types">Manage Shift Types</Link>
								</Menu.Item>
								<Menu.Item key="4" icon={<UsergroupAddOutlined />}>
									<Link to="/superadmin/manage-users">Manage Users</Link>
								</Menu.Item>
								<Menu.Item key="5" icon={<FileExcelOutlined />}>
									<Link to="/superadmin/upload">Upload Shifts Excel</Link>
								</Menu.Item>
								<Menu.Item key="6" icon={<MinusCircleOutlined />}>
									<Link to="/superadmin/off-shifts">Off Shifts</Link>
								</Menu.Item>
								<Menu.Item key="9" icon={<PullRequestOutlined />}>
									<Link to="/superadmin/manage-requestShifts">Requested Shifts</Link>
								</Menu.Item>
								<Menu.Item key="10" icon={<LogoutOutlined />}>
									<Link to="/superadmin/logout">Logout</Link>
								</Menu.Item>
							</Menu>
						</Sider>
					</div>
				}
				open={sidebarOpen}
				onSetOpen={onSetSidebarOpen}
				touch={true}
				styles={{ backgroundColor: "black" }}
			>
				<nav className="navbar navbar-dark bg-primary" style={{ height: "80px" }}>
					<MenuOutlined
						className="text-white"
						style={{ fontSize: "25px" }}
						onClick={() => onSetSidebarOpen(true)}
					/>
					<a className="navbar-brand">ShiftsCalender</a>
					<div>
					<span>
					<Dropdown overlay={menu} placement="bottomCenter">
						<Badge dot>
						<BellFilled style = {{
							color: 'white',
							cursor: 'pointer'
						}} />
						</Badge>  
					</Dropdown>
						
					</span>
						<Link to="/superadmin/profile">
							<span className="ml-2">
								<Avatar style={{ backgroundColor: "#001529", verticalAlign: "middle" }} size="large">
									{console.log(superAdmin)}
									{superAdmin.first_name.split(" ")[0].charAt(0).toUpperCase()+superAdmin.last_name.split(" ")[0].charAt(0).toUpperCase()}
								</Avatar>
							</span>
						</Link>
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
					<Route exact path="/superadmin/profile" component={Profile} />
					<Route exact path="/superadmin/shifts-calender" component={ShiftsCalender} />
					<Route exact path="/superadmin/manage-shift-types" component={ManageShiftTypes} />
					<Route exact path="/superadmin/manage-users" component={ManageUsers} />
					<Route exact path="/superadmin/manage-requestShifts" component={RequestShift} />
					<Route exact path="/superadmin/upload" component={Upload} />
					<Route exact path="/superadmin/off-shifts" component={OffShift} />
					<Route exact path="/superadmin/exchange-shifts" component={ExchangeShift} />
					<Route exact path="/superadmin/users-sheet" component={UserSheet} />
					<Route exact path="/superadmin/logout" component={Logout} />
				</Switch>
			</Sidebar>

			{/* <h1>Super Admin</h1>
			<h1>{superAdmin.email}</h1> */}
		</div>
	);
};

export default SuperAdmin;
