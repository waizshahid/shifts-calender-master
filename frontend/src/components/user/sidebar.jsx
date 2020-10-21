import React, { useState, useEffect } from "react";
import { Link, Switch, Route } from "react-router-dom";
import Sidebar from "react-sidebar";
import Logout from "../superAdmin/Logout/Logout";
import OffShift from './OffShifts'
import ReqShift from './requestShift'
import ShiftsCalendar from "../user/shiftsCalendar";
import UserExchangeShift from './userExchangeShifts'
import UserShiftCrud from "./userShiftCrud"
import RestricSwapping from './restrictSwappingUser'
import { Layout, Menu,Modal, Avatar, Dropdown,Badge,Row, Col,Card, Tag,Button,Form, Divider  } from "antd";
import axios from 'axios'
import jwt_decode from 'jwt-decode'

import {
  UserOutlined,
  PullRequestOutlined,
  LogoutOutlined,
  MenuOutlined,
  CalendarOutlined,
  SwapOutlined,
  BellFilled,
  MinusCircleOutlined
} from "@ant-design/icons";
import EditUser from "./editUser";

const { Header, Content, Footer, Sider } = Layout;
    

const Side = ({ user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dsplayMessage, setMessage] = useState([]);
  const [shifts, setShifts] = useState([]);
  const token = localStorage.usertoken
  const decoded = jwt_decode(token)
  const currentId = decoded.id
  const currentFName = decoded.firstName
  const currentLName = decoded.lastName
  const currentEmail = decoded.email
  
  const [visible, setVisible] = useState(false);
  const [sentVisible, setsentVisible] = useState(false)
  const [editProfile,setEditProfile] = useState(false)
  const [visible2, set2Visible] = useState(false);
  const [index, setIndex] = useState();
  const [myDetails,setMyDetails] = useState({})
  const [fields, setFields] = React.useState([
    {
		  name: ["firstName"],
		  value: myDetails.firstName,
		},
		{
			name: ["lastName"],
			value: myDetails.lastName,
		},
		// {
		// 	name: ["username"],
		// 	value: userObj.username,
		// },
		{
			name: ["email"],
			value: myDetails.email,
    },
    {
			name: ["pass"],
			value: "",
    },
    {
			name: ["confirm"],
			value: "",
		},
  ])

  useEffect(() => {
    
  })
  const editingProfile = () => {
    setEditProfile(true)
  }
  useEffect(() => {
        axios.get('user/getMyDetails/'+currentId)
        .then((resp) => {
          setMyDetails(resp.data)
        })
        .catch((err) => {
          console.log(err)
        })
  },[editProfile])

  const swapShift = () => {
    console.log(index)
    exchangeAndDelete()
    set2Visible(false)
  }
  const [form] = Form.useForm();
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
      axios.put("user/updateResponses/"+id)
      .then((res) => {
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
  
  const updateNotification = () => {
    const notificationId =  dsplayMessage[index]._id  
    console.log(dsplayMessage[index]._id)
      axios.put("user/updateResponsesandDelete/"+notificationId)
      .then((res) => {
        refresh();
        })
      .catch((err) =>{
        console.log(err)
      })
      window.location.reload();
  }

  const deleteNotification = () => {
    const notificationId =  dsplayMessage[index]._id  
    console.log(dsplayMessage[index]._id)
      axios.delete("user/deleteCurrentNotification/"+notificationId)
      .then((res) => {
          refresh();
        })
      .catch((err) =>{
        console.log(err)
      })
      
  }

  const refresh = () => {
    window.location.reload();
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
              <div>
                  {
                    message.requesterType === 'Super Admin' ?
                    <div>
                      <div className="row">
                        <div className="col-6">
                        <Tag color="success">{message.requesterType}</Tag>
                        </div>
                        <div className="col-6">
                        <Tag color="default">{message.shiftName}</Tag>
                        <Tag color="default">{message.regDate}</Tag>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-12">
                        {message.message}
                        </div>
                      </div>

                    </div> :
                    <div>
                        {
                          message.requesterType === 'Admin' ?
                          <div>
                            <div className="row">
                              <div className="col-6">
                              <Tag color="success">{message.requesterType}</Tag>
                              </div>
                              <div className="col-6">
                              <Tag color="default">{message.shiftName}</Tag><Tag color="default">{message.regDate}</Tag>
                              </div>
                            </div>
                            <div className="row">
                              <div className="col-12">
                                {message.message}
                              </div>
                            </div>
                            
                          </div> :
                          <div>
                          {
                            message.from === currentId ?
                            <div>
                              <div className="row">
                                <div className="col-6"><Tag color="green">{message.requesterType}</Tag></div>
                                <div className="col-6"><Tag color="default">{message.shiftName}</Tag><Tag color="default">{message.regDate}</Tag></div>
                              </div>
                              <div className="row">
                                <div className="col-12">
                                {message.message}
                                </div>
                              </div>
                              
                            </div>
                              :
                            <div>
                              <div className="row">
                                <div className="col-6"><Tag color="green">{message.requesterType}</Tag></div>
                                <div className="col-6"><Tag color="default">{message.shiftName}</Tag><Tag color="default">{message.regDate}</Tag></div>
                                
                              </div>
                              <div className="row">
                                <div className="col-12">
                                {message.messageFrom}
                                </div>
                              </div>
                              
                            </div>
                          }
    
                        </div>
                        }
                    </div>
                     
                  }
                  
              <div className="row">
                  <div className="col-12">
                    <div style={{
                      borderBottom: '1px solid lightgrey',
                      marginTop: '2px',
                      marginBottom: '2px'
                    }}></div>
                  </div>
              </div>    
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
                {/* <Menu.Item key="1" icon={<UserOutlined />}>
                  <Link to="/user/profile">Profile</Link>
                </Menu.Item> */}
                <Menu.Item key="2" icon={<CalendarOutlined />}>
                  <Link to="/user/shifts-calender">Shifts Calender</Link>
                </Menu.Item>
                <Menu.Item key="3" icon={<SwapOutlined />}>
                  <Link to="/user/user-shifts/my-shifts">My Shifts</Link>
                </Menu.Item>
                <Menu.Item key="4" icon={<MinusCircleOutlined />}>
                  <Link to="/user/user-shifts/my-off-shifts">Off Shifts</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<PullRequestOutlined />}>
                  <Link to="/user/user-shifts/my-req-shifts">Requested Shifts</Link>
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
            {/* <Link to="/user/profile"> */}
              <span className="ml-2" onClick={editingProfile}>
                <Avatar
                  style={{
                    backgroundColor: "#001529",
                    verticalAlign: "middle",
                    cursor: 'pointer'
                  }}
                  size="large"
                >
                  {user.firstName.split(" ")[0].charAt(0).toUpperCase()}{user.lastName.split(" ")[0].charAt(0).toUpperCase()}
                </Avatar>
              </span>
            {/* </Link> */}
          </div>
        </nav>
              <div>
                <Modal
                  title="Swapped shifts details"
                  visible={visible}
                  maskClosable={true}
                  onCancel={() => setVisible(false)}
                  footer={[
                    <Button key="1" onClick={deleteNotification}>Delete this notification</Button>,
                    <Button key="2" type="primary" onClick={() => setVisible(false)}>OK</Button>
                  ]}
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
                  title="Edit Profile"
                  visible={editProfile}
                  maskClosable={true}
                  onCancel={() => setEditProfile(false)}
                  // onOk={handleOk}
                  footer={null}
                >
                  <EditUser setEditProfile={(val) => setEditProfile(val)} userObj={myDetails} id={myDetails._id} />
              </Modal>

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
                    <Col lg={6} xs={6} xl={6} sm={6}>
                      <Button onClick={deleteNotification}>Delete this notification</Button>
                    </Col>
                    <Col lg={10} xs={10} xl={10} sm={10}></Col>
                    <Col lg={4} xs={4} xl={4} sm={4}>
                      <Button onClick={updateNotification}>Reject</Button>
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
                    <Button onClick={deleteNotification} key="1">
                      Delete this notification
                    </Button>,
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
          <Route exact path="/user/user-shifts/my-req-shifts" component={ReqShift} />
          <Route exact path="/user/user-shifts/user-exchange-shifts" component={UserExchangeShift} />
          <Route exact path="/superadmin/logout" component={Logout} />
        </Switch>
      </Sidebar>
    </div>
  );
};

export default Side;
