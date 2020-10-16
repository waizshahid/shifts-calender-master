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
  BellFilled,
  MinusCircleOutlined
} from "@ant-design/icons";

const { Header, Content, Footer, Sider } = Layout;
    

const Side = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dsplayMessage, setMessage] = useState([]);
  const [shifts, setShifts] = useState([]);
  const token = localStorage.usertoken
  const decoded = jwt_decode(token)
  const currentId = decoded.id
  const [visible, setVisible] = useState(false);
  const [sentVisible, setsentVisible] = useState(false)
  const [visible2, set2Visible] = useState(false);
  const [index, setIndex] = useState();
  const swapShift = () => {
    console.log(index)
    exchangeAndDelete()
    set2Visible(false)
  }

  const exchangeAndDelete = () => {
    console.log(index)
    console.log(dsplayMessage[index])
    const id = dsplayMessage[index]._id
    const shiftId1 = dsplayMessage[index].shiftFrom
    const userToExchange = dsplayMessage[index].to

    console.log(id)
    console.log(userToExchange)

  axios.get("shift/swapShiftUser/"+shiftId1+'/'+userToExchange)
    .then((res) => {
      axios.delete("user/deleteCurrentNotification/"+id)
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
  
  const deleteNotification = () => {
    const notificationId =  dsplayMessage[index]._id  
    console.log(dsplayMessage[index]._id)
      axios.delete("user/deleteCurrentNotification/"+notificationId)
      .then((res) => {
          console.log(res.data);
          window.location.reload();
        })
      .catch((err) =>{
        console.log(err)
      })
  }
  useEffect(() => {
      getNotifications()
  }, [shifts]);

  const getNotifications = () => {
    axios.get("user/getCurrentUserNotificationsTo/"+currentId).then((res1) => {
      axios.get("user/getCurrentUserNotificationsFrom/"+currentId).then((res2) => {
      let array = [...res1.data,...res2.data];
      // console.log(currentId)
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
   
    if(dsplayMessage[message.key].requesterType == 'User'){
        if(dsplayMessage[message.key].to === currentId){
          setsentVisible(true)
        }else{
          set2Visible(true)  
        }
    }else{
      setVisible(true)  
    }

  //  {dsplayMessage[message.key].requesterType == 'User' ?
  //     set2Visible(true)
  //   :
  //   setVisible(true)
  //  } 
   console.log(currentId)
console.log(dsplayMessage[message.key].shiftFrom)
    axios.get("user/getShiftTo/"+dsplayMessage[message.key].to).then((res1) => {
      axios.get("user/getShiftFrom/"+dsplayMessage[message.key].shiftFrom).then((res2) => {
         let shiftArray = [res1.data[0] ,res2.data.shifts[0]]
        //  console.log(res1.data.shifts)
        let temp = []
        for(let i = 0 ; i < shiftArray.length ; i++){
          if(shiftArray[i] != undefined)
          {
            temp.push(shiftArray[i])
          }
        }  
        console.log(temp)
           setShifts(temp)
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
                  {
                    message.requesterType === 'Default' ?
                    <div>
                      <Tag color="success">{message.requesterType}</Tag> <br/>{message.message}
                      <Tag color="default">{message.regDate}</Tag>
                    </div> :
                    
                    <div>
                      {
                        message.from === currentId ?
                        <div>
                          <Tag color="green">{message.requesterType}</Tag> <br/>{message.message}
                          <Tag color="default">{message.regDate}</Tag>
                        </div>
                          :
                        <div>
                          <Tag color="green">{message.requesterType}</Tag><br/> {message.message}
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
              <h5 className="pt-4 pb-2 text-center text-muted">{user.firstName}{user.lastName}</h5>
              <Menu theme="dark" mode="inline" defaultSelectedKeys={[]}>
                <Menu.Item key="1" icon={<UserOutlined />}>
                  <Link to="/user/profile">Profile</Link>
                </Menu.Item>
                <Menu.Item key="2" icon={<CalendarOutlined />}>
                  <Link to="/user/shifts-calender">Shifts Calender</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<SwapOutlined />}>
                  <Link to="/user/user-shifts/my-shifts">My Shifts</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<MinusCircleOutlined />}>
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
            <Link to="/user/profile">
              <span className="ml-2">
                <Avatar
                  style={{
                    backgroundColor: "#001529",
                    verticalAlign: "middle",
                  }}
                  size="large"
                >
                  {user.firstName.split(" ")[0].charAt(0).toUpperCase()}{user.lastName.split(" ")[0].charAt(0).toUpperCase()}
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
                   onOk={() => setVisible(false)}
                  >
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      {shifts.map((dat,index) => (
                          <div>
                              {
                                  index === 0 ?
                                  <Card type="inner">
                              
                                  <div>
                                    <b>Assigned Doctor Details</b><br/>
                                      {'Name:'+' '+dat.firstName+' '+dat.lastName}<br/>
                                      {'Email:'+' '+dat.email}<br/>
 
                                  </div>
                                  </Card>
                                  :
                                  <div>
                                    <br/>
                                    <Card type="inner">
                              
                              <div>
                                  <b>Assigned Shift Details</b><br/>
                                  {'Date:'+' '+dat.start}<br/>
                                  {'Shift Name:'+' '+dat.shifname}

                              </div>
                              </Card>
                                    </div>
                                  
                            }
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
                              {
                                  index === 0 ?
                                  <Card type="inner">
                              
                                  <div>
                                    <b>Requester Details</b><br/>
                                      {'Name:'+' '+dat.firstName+' '+dat.lastName}<br/>
                                      {'Email:'+' '+dat.email}<br/>
 
                                  </div>
                                  </Card>
                                  :
                                  <div>
                              <br/>
                                    <Card type="inner">
                              
                              <div>
                                <b>Shift Details</b><br/>
                                  {'Current Doctor:'+' '+dat.title}<br/>
                                  {'Date:'+' '+dat.start}<br/>
                                  {'Shift Name:'+' '+dat.shifname}

                              </div>
                              </Card>
                              
                                  </div>
                            }
                          </div>
                        ))}
                        
                      </Col>
                      
                    </Row>
                            <br/>
                    <Row>
                    <Col lg={16} xs={16} xl={16} sm={16}></Col>
                    <Col lg={4} xs={4} xl={4} sm={4}>
                      <Button type="primary" onClick={deleteNotification}>Ignore</Button>
                    </Col>
                      <Col lg={4} xs={4} xl={4} sm={4}><Button type="primary" onClick={swapShift}>Exchange</Button>
                        </Col>
                    </Row>
                </Modal>

                <Modal
                  title="Sent shift details"
                  visible={sentVisible}
                  maskClosable={true}
                  footer={[
                    <Button onClick={() => setsentVisible(false)} key="2" type="primary">
                      Cancel
                    </Button>
                  ]}
                  onCancel={() => setsentVisible(false)}
                  // // onOk={handleOk}
                  // footer={null}
                >
                  <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      {shifts.map((dat,index) => (
                          <div>
                              {
                                  index === 0 ?
                                  <Card type="inner">
                              
                                  <div>
                                    <b>Requester Details</b><br/>
                                      {'Name:'+' '+dat.firstName+' '+dat.lastName}<br/>
                                      {'Email:'+' '+dat.email}<br/>
 
                                  </div>
                                  </Card>
                                  :
                                  <div>
                              <br/>
                                    <Card type="inner">
                              
                              <div>
                                <b>Shift Details</b><br/>
                                  {'Current Doctor:'+' '+dat.title}<br/>
                                  {'Date:'+' '+dat.start}<br/>
                                  {'Shift Name:'+' '+dat.shifname}

                              </div>
                              </Card>
                              
                                  </div>
                            }
                          </div>
                        ))}
                        
                      </Col>
                      
                    </Row>
                            <br/>
                    
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
