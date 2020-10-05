import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import ExchangeShift from './exchangeShifts'
import Profile from "./Profile/Profile";
import ShiftsCalender from "./ShiftsCalender/ShiftsCalender";
import ManageUsers from "./ManageUsers/ManageUsers";
import Logout from "./Logout/Logout";
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import { Layout, Menu, Avatar, Tag, Card, Dropdown, Badge } from "antd";
import {
	BellFilled,
	UserOutlined,
	LogoutOutlined,
	SwapOutlined,
	MenuOutlined,
	CalendarOutlined,
	UsergroupAddOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const Admin = ({ admin }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [dsplayMessage, setMessage] = useState([]);
	const token = localStorage.admintoken
	const decoded = jwt_decode(token)
	const currentId = decoded.id
	const [shifts, setShifts] = useState([]);
	const [index, setIndex] = useState();
	const [visible, setVisible] = useState(false);
  	const [visible2, set2Visible] = useState(false);
	useEffect(() => {
		console.log(admin);
	}, []);

	const onSetSidebarOpen = (open) => {
		setSidebarOpen(open);
	};
	useEffect(() => {
		getNotifications()
	}, [shifts]);
  
	const getNotifications = () => {
	  axios.get("http://localhost:4000/api/user/getCurrentUserNotificationsTo/"+currentId).then((res1) => {
		axios.get("http://localhost:4000/api/user/getCurrentUserNotificationsFrom/"+currentId).then((res2) => {
		let array = [...res1.data,...res2.data];
		// console.log(array)  
		setMessage(array)
		})})
		.catch((err) => {
		  console.log(err)
		})
	}
	const showShiftModal = (message) => {
		console.log(message.key)
		settingIndex(message.key)
		
		{dsplayMessage[message.key].requesterType == 'User' ?
		set2Visible(true):setVisible(true)
		} 
		
		 axios.get("http://localhost:4000/api/user/getShiftTo/"+dsplayMessage[message.key].shiftTo).then((res1) => {
		   axios.get("http://localhost:4000/api/user/getShiftFrom/"+dsplayMessage[message.key].shiftFrom).then((res2) => {
			  let shiftArray = [res1.data.shifts[0] ,res2.data.shifts[0]]
			 //  console.log(res1.data.shifts)
			   // console.log(shiftArray)
			   setShifts(shiftArray)
		   })})
		   .catch((err) => {
			 console.log(err)
		   })
	   };
	   const settingIndex = (key) => {
		 console.log(key)
		 setIndex(key)
	   }
	const menu = (
		<Menu onClick={showShiftModal}>
		  <b style={{
			backgroundColor:'rosybrown',
			color: 'white',
			padding: '15px 15px',
			display: 'block',
		  }}>Notification</b>
	
			  {dsplayMessage.map((message,index) => (
				  <Menu.Item key = {index}>
				  <div style={{
				  }} 
				  >
					  {
						message.requesterType === 'Default' ?
						<div>
						  <Tag color="success">{message.requesterType}</Tag> {message.message}
						  <Tag color="default">{message.regDate}</Tag>
						</div> :
						
						<div>
						  {
							message.from === currentId ?
							<div>
							  <Tag color="green">{message.requesterType}</Tag> {message.message}
							  <Tag color="default">{message.regDate}</Tag>
							</div>
							  :
							<div>
							  <Tag color="green">{message.requesterType}</Tag> {message.messageFrom}
							  <Tag color="default">{message.regDate}</Tag>
							</div>
						  }
	
						</div> 
					  }
					  
					  
				  </div>
				  </Menu.Item>
		  
			  ))}
	
		</Menu>
	  );
	return (
		<div>
			<Sidebar
				sidebar={
					<div style={{ backgroundColor: "black" }}>
						<Sider style={{ height: "100vh" }}>
							<h5 className="pt-4 pb-2 text-center text-muted">{admin.firstName.charAt(0)+' '+admin.lastName}</h5>
							<Menu theme="dark" mode="inline" defaultSelectedKeys={[]}>
								<Menu.Item key="1" icon={<UserOutlined />}>
									<Link to="/admin/profile">Profile</Link>
								</Menu.Item>
								<Menu.Item key="2" icon={<CalendarOutlined />}>
									<Link to="/admin/shifts-calender">Shifts Calender</Link>
								</Menu.Item>
								<Menu.Item key="4" icon={<UsergroupAddOutlined />}>
									<Link to="/admin/manage-users">Manage Users</Link>
								</Menu.Item>
								<Menu.Item key="5" icon={<SwapOutlined />}>
									<Link to="/admin/exchange-shifts">Exhange Shifts</Link>
								</Menu.Item>
								<Menu.Item key="10" icon={<LogoutOutlined />}>
									<Link to="/admin/logout">Logout</Link>
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
						<Link to="/admin/profile">
							<span className="ml-2">
								<Avatar style={{ backgroundColor: "#001529", verticalAlign: "middle" }} size="large">
									{console.log(admin)}
									{admin.username.split(" ")[0].charAt(0).toUpperCase()}
								</Avatar>
							</span>
						</Link>
					</div>
				</nav>

				<Switch>
					<Route exact path="/admin/profile" component={Profile} />
					<Route exact path="/admin/shifts-calender" component={ShiftsCalender} />
					<Route exact path="/admin/manage-users" component={ManageUsers} />
					<Route exact path="/admin/exchange-shifts" component={ExchangeShift} />
					<Route exact path="/admin/logout" component={Logout} />
				</Switch>
			</Sidebar>

			{/* <h1>Super Admin</h1>
			<h1>{superAdmin.email}</h1> */}
		</div>
	);
};

export default Admin;
