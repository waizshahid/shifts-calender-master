import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import Logout from "../superAdmin/Logout/Logout";
import OffShift from './OffShifts'
import ShiftsCalendar from "../user/shiftsCalendar";
import UserShiftCrud from "./userShiftCrud"
import RestricSwapping from './restrictSwappingUser'
import { Layout, Menu, Avatar, notification } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CalendarOutlined,
  SwapOutlined,

} from "@ant-design/icons";
import OffShifts from "./OffShifts";

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
const Side = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    //   console.log(superAdmin);
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
              <h5 className="pt-4 pb-2 text-center text-muted">{user.username}</h5>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={[]}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                  <Link to="/user/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<CalendarOutlined />}>
                  <Link to="/user/shifts-calender">Shifts Calender</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<SwapOutlined />}>
                  <Link to="/user/user-shifts/my-shifts">All Shifts</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/user/user-shifts/my-off-shifts">Off Shifts</Link>
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
        <nav
          className="navbar navbar-dark bg-primary"
          style={{ height: "80px" }}
        >
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
                <Avatar
                  style={{
                    backgroundColor: "#001529",
                    verticalAlign: "middle",
                  }}
                  size="large"
                >
                  {user.username.split(" ")[0].charAt(0).toUpperCase()}
                </Avatar>
              </span>
            </Link>
          </div>
        </nav>

        <Switch>
          <Route
            exact
            path="/user/shifts-calender"
            component={ShiftsCalendar}
          />
          <Route exact path="/user/user-shifts/my-shifts" component={RestricSwapping} />
          <Route exact path="/user/user-shifts" component={UserShiftCrud} />
          <Route exact path="/user/user-shifts/my-off-shifts" component={OffShift} />
          <Route exact path="/superadmin/logout" component={Logout} />
        </Switch>
      </Sidebar>
    </div>
  );
};

export default Side;
