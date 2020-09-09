import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";

import Profile from "./Profile/Profile";
import ShiftsCalender from "./ShiftsCalender/ShiftsCalender";
import ManageUsers from "./ManageUsers/ManageUsers";
import Logout from "./Logout/Logout";

import { Layout, Menu, Avatar } from "antd";
import {
	FormOutlined,
	UserOutlined,
	LogoutOutlined,
	MenuOutlined,
	CalendarOutlined,
	UserAddOutlined,
	UsergroupAddOutlined,
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;

const Admin = ({ admin }) => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	useEffect(() => {
		console.log(admin);
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
							<h5 className="pt-4 pb-2 text-center text-muted">{admin.username}</h5>
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
				<nav className="navbar navbar-dark bg-primary" style={{ height: "9vh" }}>
					<MenuOutlined
						className="text-white"
						style={{ fontSize: "25px" }}
						onClick={() => onSetSidebarOpen(true)}
					/>
					<a className="navbar-brand">ShiftsCalender</a>
					<div>
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
					<Route exact path="/admin/logout" component={Logout} />
				</Switch>
			</Sidebar>

			{/* <h1>Super Admin</h1>
			<h1>{superAdmin.email}</h1> */}
		</div>
	);
};

export default Admin;
