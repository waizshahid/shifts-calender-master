import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import Profile from "./Profile/Profile";
import ShiftsCalender from "./ShiftsCalender/ShiftsCalender";
import ExchangeShift from './exchangeShifts'
import ManageShiftTypes from "./ManageShiftTypes/ManageShiftTypes";
import OffShift from './OffShiftsRequest'
import ManageUsers from "./ManageUsers/ManageUsers";
import Logout from "./Logout/Logout";
import Upload from './ShiftsCalender/uploadfile'
import UserSheet from './ManageUsers/uploadUsersSheet'
import { Layout, Menu, Avatar, notification } from "antd";
import {
	FormOutlined,
	UserOutlined,
	LogoutOutlined,
	UserSwitchOutlined,
	MenuOutlined,
	CalendarOutlined,
	MinusCircleOutlined,
	UserAddOutlined,
	UploadOutlined,
	UsergroupAddOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
const openNotification = () => {
	const args = {
	  message: 'Swap Requests',
	  description:
	  {} + 'wants to swap his shift with you',
	  duration: 0,
	};
	notification.open(args);
  };
const SuperAdmin = ({ superAdmin }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		console.log(superAdmin);
	}, []);

	const onSetSidebarOpen = (open) => {
		setSidebarOpen(open);
	};

	return (
		<div>
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
								<Menu.Item key="8" icon={<UploadOutlined />}>
									<Link to="/superadmin/users-sheet">Upload User Excel</Link>
								</Menu.Item>
								<Menu.Item key="5" icon={<UserSwitchOutlined />}>
									<Link to="/superadmin/exchange-shifts">Exhange Shifts</Link>
								</Menu.Item>
								<Menu.Item key="6" icon={<MinusCircleOutlined />}>
									<Link to="/superadmin/off-shifts">Off Shifts</Link>
								</Menu.Item>
								<Menu.Item key="7" icon={<UploadOutlined />}>
									<Link to="/superadmin/upload">Upload Excel</Link>
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
					<span onClick={openNotification}><i class="fa fa-bell"></i></span>
						<Link to="/superadmin/profile">
							<span className="ml-2">
								<Avatar style={{ backgroundColor: "#001529", verticalAlign: "middle" }} size="large">
									{console.log(superAdmin)}
									{superAdmin.username.split(" ")[0].charAt(0).toUpperCase()}
								</Avatar>
							</span>
						</Link>
					</div>
				</nav>

				<Switch>
					<Route exact path="/superadmin/profile" component={Profile} />
					<Route exact path="/superadmin/shifts-calender" component={ShiftsCalender} />
					<Route exact path="/superadmin/manage-shift-types" component={ManageShiftTypes} />
					<Route exact path="/superadmin/manage-users" component={ManageUsers} />
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
