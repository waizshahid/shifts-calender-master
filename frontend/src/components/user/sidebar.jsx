import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import Logout from "../superAdmin/Logout/Logout";
import OffShift from './OffShifts'
import ShiftsCalendar from "../user/shiftsCalendar";
import UserShiftCrud from "./userShiftCrud"
import RestricSwapping from './restrictSwappingUser'
import { Layout, Menu, Avatar, notification, Dropdown, Button,Badge  } from "antd";
import axios from 'axios'
import {
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  CalendarOutlined,
  SwapOutlined,
  BellFilled
} from "@ant-design/icons";
import OffShifts from "./OffShifts";
import jwt_decode from 'jwt-decode'

const { Header, Content, Footer, Sider } = Layout;
    

const Side = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dsplayMessage, setMessage] = React.useState([]);
  const [shifts, setShifts] = React.useState([]);
  const token = localStorage.usertoken
  const decoded = jwt_decode(token)
  const currentId = decoded.id

  useEffect(() => {
    console.log('Current User Login'+currentId)
    axios.get("http://localhost:4000/api/user/getCurrentUserNotificationsTo/"+currentId).then((res1) => {
      axios.get("http://localhost:4000/api/user/getCurrentUserNotificationsFrom/"+currentId).then((res2) => {
        let array = [...res1.data,...res2.data];
        setMessage(array)
      })})
      .catch((err) => {
        console.log(err)
      })

  }, []);


  const showShiftModal = (message) => {
    console.log(dsplayMessage[message.key])
    // let shiftId1 = dsplayMessage[index].shiftTo
  };
  // const swappedShifts = (to,from) => {
  //   console.log(to)
  //   console.log(from)
  //   // axios.get("http://localhost:4000/api/user/getShiftTo/"+currentId).then((res1) => {
  //   //   axios.get("http://localhost:4000/api/user/getShiftFrom/"+currentId).then((res2) => {
  //   //     let array = [...res1.data,...res2.data];
  //   //     setShifts(array)
  //   //   })})
  //   //   .catch((err) => {
  //   //     console.log(err)
  //   //   })
  // }
  const menu = (
    <Menu onClick={showShiftModal}>
      <b style={{
        backgroundColor:'rosybrown',
        color: 'white',
        padding: '15px 15px',
        display: 'block',
      }}>Notification</b>
      

          {
            dsplayMessage.forEach
          }
          {dsplayMessage.map((message,index) => (
              <Menu.Item key = {index}>
              <div style={{
              }} 
              >
                <a className="notificationStyle">
                  {message.message}
                </a>
              </div>
              </Menu.Item>
      
          ))}

    </Menu>
  );

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
