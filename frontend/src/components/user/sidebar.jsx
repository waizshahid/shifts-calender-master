import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import Logout from "../superAdmin/Logout/Logout";
import OffShift from './OffShifts'
import ShiftsCalendar from "../user/shiftsCalendar";
import UserExchangeShift from './userExchangeShifts'
import UserShiftCrud from "./userShiftCrud"
import RestricSwapping from './restrictSwappingUser'
import { Layout, Menu,Modal, Avatar, Dropdown,Badge,Row, Col,Card, Tag,Button  } from "antd";
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import {
  UserOutlined,
  UserSwitchOutlined,
  LogoutOutlined,
  MenuOutlined,
  CalendarOutlined,
  SwapOutlined,
  BellFilled
} from "@ant-design/icons";
import OffShifts from "./OffShifts";

const { Header, Content, Footer, Sider } = Layout;
    

const Side = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dsplayMessage, setMessage] = useState([]);
  const [shifts, setShifts] = useState([]);
  const token = localStorage.usertoken
  const decoded = jwt_decode(token)
  const currentId = decoded.id
  const [visible, setVisible] = useState(false);
  const [visible2, set2Visible] = useState(false);
  const [index, setIndex] = useState();
  const swapShift = () => {
    console.log(index)
    exchangeAndDelete()
    set2Visible(false)
  }

  const exchangeAndDelete = () => {
    console.log(index)
    const id = dsplayMessage[index]._id
    const shiftId1 = dsplayMessage[index].shiftFrom
    const shiftId2 = dsplayMessage[index].shiftTo
    console.log(id)
    console.log(shiftId2)
    console.log(shiftId1)

  axios.get("http://localhost:4000/api/shift/swapShift/"+shiftId1+'/'+shiftId2)
    .then((res) => {
      axios.delete("http://localhost:4000/api/user/deleteCurrentNotification/"+id)
      .then((res) => {
          console.log(res.data);
          window.location.reload();
        })
      .catch((err) =>{
        console.log(err)
      })
      console.log(res)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

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
                <Menu.Item key="4" icon={<LogoutOutlined />}>
                  <Link to="/user/user-shifts/my-off-shifts">Off Shifts</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<UserSwitchOutlined />}>
                  <Link to="/user/user-shifts/user-exchange-shifts">Exchange Shifts</Link>
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
              <div>
                <Modal
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
                    
                </Modal>
            </div>
            <div>
            <Modal
                  title="Accept or decline Shift"
                  visible={visible2}
                  maskClosable={true}
                  onCancel={() => set2Visible(false)}
                  // onOk={handleOk}
                  footer={null}
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
                    <Row>
                    <Button onClick={swapShift}>Exchange</Button>
                    </Row>
                </Modal>
            </div>    
        <Switch>
          <Route
            exact
            path="/user/shifts-calender"
            component={ShiftsCalendar}
          />
          <Route exact path="/user/user-shifts/my-shifts" component={RestricSwapping} />
          <Route exact path="/user/user-shifts" component={UserShiftCrud} />
          <Route exact path="/user/user-shifts/my-off-shifts" component={OffShift} />
          <Route exact path="/user/user-shifts/user-exchange-shifts" component={UserExchangeShift} />
          <Route exact path="/superadmin/logout" component={Logout} />
        </Switch>
      </Sidebar>
    </div>
  );
};

export default Side;
