import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Select, Card, Tabs, Divider, message  } from "antd";
import { HistoryOutlined,EditOutlined } from '@ant-design/icons';
import CustomeEvents from "./components/customEvents/CustomeEvents";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import dayGridPlugin from "@fullcalendar/daygrid";
import Spinner from '../../download.png'
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from "axios";
// import Loader from 'react-loader-spinner'
import "antd/dist/antd.css";
import jwt_decode from 'jwt-decode'
import ShowHistory from './showHistory'
moment.locale("ko", {
  week: {
    dow: 1,
    doy: 1,
  },
});
const localizer = momentLocalizer(moment);
const { Option } = Select;
const { TabPane } = Tabs;
let date = ""
let title= ""
let currentShift = ""
let shiftUserName = ""
let shiftNameUser = ""
let users = []
const ShiftsCalender = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [history, setHistory] = useState([]);
  const [oneEvent, setOneEvent] = useState({});
  const [events, setEvents] = useState([]);
  const [assign, setAssign] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [start, setStart] = useState("");
  const [loading, setLoading] = useState(true)
  const [filderedData, setFData] = useState([]);
  const [end, setEnd] = useState("");
  const [users, setUsers] = useState([]);
  const [lastNameUsers, setlastNameUsers] = useState([]);
  const [stop, setStop] = useState(0);
  const [adminCheck, setAdminCheck] = useState("")
  const [exchangeVisible, setexchangeVisible] = useState(false);
  const [createShiftID , setCreateShiftId] = useState("")
  const [id2, setTargetId] = useState("");
  const token = localStorage.admintoken
  const [commentVisible, setcommentVisible] = useState("");
  const [comment, setComment] = useState("");
  const decoded = jwt_decode(token)
  const [login,setLoginUserShift] = useState([]);
  const currentId = decoded.id
 
  function callback(key) {
    console.log(key);
  }

  const showModal = (e) => {
    date = e.dateStr
    setVisible(true);
  };
  const handelFrom = (e) => {
    setTargetId(e);
};
  const handelAssign = (e) => {
    e.preventDefault();
    setAssign(e.target.value);
  };

  function setRequestEvent(e){
    console.log(e.target.value)
    shiftNameUser = e.target.value
    setcommentVisible("true")
  }
  useEffect((e) => {
    setShiftType(shiftNameUser);
  }, [commentVisible]);


  
  const handelShift = async(e) => {
    setId(e)
    if(e.target.value.substring(e.target.value.indexOf(":") + 1) === 'Request'){
      setRequestEvent(e)
    }else{
      await setcommentVisible(false);
      setComment(" ")
      // setShiftType(e.target.value);
    }
    
  };

  const setId = (e) => {
    console.log(e.target.value)
    axios.get('shift/getShiftId/'+e.target.value)
    .then((res) => {
      setCreateShiftId(res.data._id)
      console.log(res.data)
    })
    .catch((err) =>{
      message.error("Cannot find the shift type from database")
    })
  }
  const handleComment = (e) => {
    setComment(e.target.value);
  };
  const handelDate = (e) => {
    setStart(e.target.value);
    setEnd(e.target.value);
  };
  const handelEndDate = (e) => {
    setEnd(e.target.value);
  };

  const handleOk = async (e) => {
    await setVisible(false);
    setLoading(true)
    const userId = assign;
    // const title = shiftType;
    // let color = "";
    let shiftTypeId = "";
    var swapable = "true";
    // let priority = "";

    // for (let i = 0; i < data.length; i++) {
    //   if (shiftType === data[i].shiftname) {
    //     priority = data[i].priority;
    //     break;
    //   }
    // }

    // for (let i = 0; i < data.length; i++) {
    //   if (shiftType === data[i].shiftname) {
    //     shiftTypeId = data[i]._id;
    //     break;
    //   }
    // }

    // for (let i = 0; i < data.length; i++) {
    //   if (shiftType === data[i].shiftname) {
    //     color = data[i].color;
    //     break;
    //   }
    // }
    
    const options = {
      url: "shift/createShift",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        
        start: date,
        userId: userId,
        end: date,
        comment: comment,
        offApprovalStatus: 'Approved',
        requestApprovalStatus: 'approved',
        shiftTypeId: createShiftID,
        swapable: swapable,

      },
    };
    axios(options).then((res) => {
      
      
         axios.get("shift/currentShifts").then(async (res) => {
          await setEvents(res.data.shifts);
          setLoading(false)
          message.success("Shift Created Successfully");
        })
        .catch((err) => {
          setLoading(false)
          console.log(err)
        })
       
    })
    .catch((err) => {
      setLoading(false)
      message.error('Shift creation failed')
    })
  };
  const handleCancel = (e) => {
    setVisible(false);
  };
  const handleDoctors = (e) => {
    if(e.target.value === "All Users"){
      axios.get("shift/currentShifts").then((res) => {
        setEvents(res.data.shifts);
      });
    }else{
      axios.get("shift/getUserByName/"+e.target.value).then((res) => {
      setEvents(res.data.shifts);
    });
        
    }
  }

  const setDataAndUser = () => {
    const options = {
      url: "shift/getshifts",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    axios(options).then((res) => {
      console.log('Shift Ids:');
      console.log(res.data);
      setData(res.data);
    });
    axios(options).then((res) => {
      console.log('Shift Ids:');
      console.log(res.data);
      let arr = []
      for(let i = 0 ; i < res.data.length ; i++){
        if(res.data[i].shiftname === 'Off'){
            arr.push(res.data[i])
        }
      }
      setFData(arr);
    });
    axios.get("user/getusers").then((res) => {
      setUsers(res.data);
    });

    axios.get("user/getlastNameUser").then((res) => {
      setlastNameUsers(res.data)
    })
  }
  const setEventAtRender = () => {
    axios.get("shift/currentShifts").then((res) => {
      // let temp1 = []
      // let temp2 = []
      // let temp = []
      // for(let i = 0 ; i < res.data.shifts.length ; i++){
      //   if(res.data.shifts[i].shiftname === 'Request'){
      //     if(res.data.shifts[i].requestApprovalStatus === 'approved'){
      //         temp1.push(res.data.shifts[i])
      //     }
      //   }
      //   else{
      //     temp2.push(res.data.shifts[i])
      //   }
      // }

      // temp = [...temp1,...temp2]
      // console.log(temp)  
    setEvents(res.data.shifts);
    setLoading(false)
    
    });
  }
  const handleEventClick = ({ event, el }) => {
    title = event.title
    currentShift = event._def.extendedProps._id
    
    if(event._def.extendedProps.userId !== currentId){
      console.log(event._def)
      settingEvent(event._def.extendedProps)
    }else{
      setAdminCheck(true)
    }
    // settingEvent(event._def.extendedProps)
};
useEffect(() => {
  // console.log(history[0].shiftName)
  // console.log(history[0].doctorAssigned)
  // console.log(history[0].shiftDate)

  console.log(currentId)
  console.log(history)
  {
    oneEvent.userId === undefined && oneEvent._id === undefined ?
    setexchangeVisible(false)
    :
    setexchangeVisible(true)
  }
  
},[history]);
const settingEvent = (event) => {
  setOneEvent(event)
}
  function onChange(date, dateString) {
    console.log(dateString);
    console.log(currentId);
    axios.get("shift/specificDateShifts/"+dateString+"/"+currentId)
    .then((res) => {
    var trueSwapableArray = [];
    for(let i = 0; i < res.data.shifts.length ; i++){
        if(res.data.shifts[i].swapable === 'true'){
            trueSwapableArray.push(res.data.shifts[i]);
        }
    }
    console.log(trueSwapableArray)
    setLoginUserShift(trueSwapableArray);
  });
}
  useEffect(() => {
    console.log('Use Effect checking')
    setEventAtRender()
    setDataAndUser()
    
  }, [stop]);

  // useEffect(()=>{
  //   console.log(history)
  // },[history])
  useEffect(()=>{
    console.log(oneEvent._id)
    axios.get("user/getEventHistory/"+oneEvent._id)
    .then((res) => {
      
      setHistory(res.data.shifts)
    })
    .catch((err)=>{
      console.log(err)
    })  
  },[oneEvent])

 const deleteShift = async () => {
    console.log(currentShift)
    const key = 'updatable';
    await setLoading(true)
    await setexchangeVisible(false)
    await setAdminCheck(false)
    axios.get("shift/deleteThisShift/"+currentShift)
        .then((res1) => {
          console.log(res1)
          console.log(res1.data)
  
          // message.loading({ content: 'Deleting...', key });
          setTimeout(() => {
            
            axios.get("shift/currentShifts").then(async (res) => {
              console.log(res.data.shifts);
              
              await setEvents(res.data.shifts);
              
              setLoading(false)
              message.success({ content: res1.data, key, duration: 2 });
            })
            .catch((err) =>{
              console.log(err)
            })
          }, 2000);
          
          

          
        })
        .catch((err => {
            console.log(err)
            message.err(err)
        }))
       
  }

  const passNotification = () => {
    // console.log(oneEvent.userId)
        const userId1 = oneEvent.userId;
        const shiftId1 = oneEvent._id;
        let userId2 = id2
        let date = new Date().toISOString().slice(0,10);
        const message = "Your shift has been swapped. Click for details"
        const adminresponse = "The requested shifts  has been swapped."   
        const requester ="Admin"
        const currentUserId = currentId;
        console.log(userId1,userId2,shiftId1)
        let shiftName=""

        axios.get("shift/getShiftName/"+shiftId1)
        .then((res) => {
          shiftName = res.data.shiftname
          axios.post("user/userNotification",{
            currentUserId,userId1,userId2,shiftId1,message,adminresponse,date,requester,shiftName
        })
        .then((res) => {
          axios.post("user/createNotificationHistory",{
            currentUserId,userId1,userId2,shiftId1,message,adminresponse,date,requester,shiftName
          })
          .then((resp) => {
            axios.get("shift/swapShiftUser/"+shiftId1+'/'+userId2)
            .then((res1) => {
                console.log(res1)
                window.location.reload()  
              
            })
            .catch((err) => {
              console.log(err)
            })
             
          })
          .catch((err) => {
            console.log(err)
          })
          
        })
        .catch((err) => {
          console.log(err.response);
        });
        })
        .catch((err) => {
          console.log(err)
        })
        
  }

  const filterShift = (e) => {
    console.log(e.target.value)
    if(e.target.value === "View All"){
     axios.get("shift/currentShifts").then((res) => {
       console.log(res.data.shifts);
       setEvents(res.data.shifts);
     });
    }else if(e.target.value === "Off"){
       
        axios.get("shift/currentShifts")
        .then((res) => {
          let offArr = []
          for(let i = 0 ; i < res.data.shifts.length ; i++)
          {
            if(res.data.shifts[i].shiftname === 'Off')
            {
              offArr.push(res.data.shifts[i])
            }
          }
          setEvents(offArr)
        })
        .catch((err) => {
          console.log(err)
        })
    }else if (e.target.value === "My Shifts") {
      console.log('User Logged In');
      console.log('User Id:'+currentId);
      axios
        .get("shift/currentUserShifts/"+currentId)
        .then((res) => {
          if (res.data !== null) {
            setEvents(res.data);
          } else {
            setEvents([]);
          }
        })
    }else{
     axios.get("shift/filterShift/"+e.target.value)
     .then((res) => {
       setEvents(res.data.shifts)
     })
     .catch((err) => {
       console.log(err)
     })
    }
    
  }

  function showHistory(){
    return <div>
      {/* {
        history.map((dat,index) => {
          <div>
            {dat.shiftname}
          </div>
        })
      } */}
    </div>
  }

  return (
    <div className="m-sm-4 m-2">
        <div className="row">
        <div className="col-3">
          <select
            id="selectDoctor"
            name="cars"
            className="custom-select bg-light m-2 shadow-sm"
            onChange={handleDoctors}
          >
            <option defaultValue="All Users">
            All Users
            </option>
            {users.map((dat) => (
              <option value={dat._id} key={dat._id}>
                {dat.lastName+','+dat.firstName}
              </option>
            ))}
            </select>
          </div>
          <div className="col-3">
          <select
            id="selectDoctor"
            name="cars"
            className="custom-select bg-light m-2 shadow-sm"
             onChange={filterShift}
          >
            <option defaultValue="All Users">
            View All
            </option>
            <option value="My Shifts">My Shifts Only</option>
            {filderedData.map((dat) => (
              <option value={dat._id} key={dat._id}>
                Shifts Only 
              </option>
            ))}
            <option value="Off">
              OFF Shifts
            </option>
            {/* <option value="Shifts Offered">Shifts Offered </option> */}
            </select>
          </div>
          {/* <div className="col-5"></div>
          <div className="col-4"> */}
            {/* <UploadShiftFile /> */}
          {/* </div> */}
      </div>
        <br/>
        <br/>
          {
            loading === false
            ?
            <FullCalendar
            defaultView="dayGridMonth"
            plugins={[dayGridPlugin, interactionPlugin]}
            weekNumberCalculation = 'ISO'
            dateClick={showModal}
            eventClick={handleEventClick}
            titleFormat={{ month: 'long', year: 'numeric' }}
            headerToolbar={{
              left: '',
              end:'',
              center:  'prev,title,next'
            }}
            eventOrder="priority"
            // eventClick={handelModal}
            events={events}
          />
          : 
          <div className="row" className="spinner">
            <img src={Spinner}  className="loading" alt="" />
          </div>
          }
      <Modal
        title="Swap Request Failed"
        visible={adminCheck}
        maskClosable={true}
        onCancel={() => setAdminCheck(false)}
        footer={null}
      >
        <div>
        <Card type="inner">
            You can't request your own shift
        </Card>
        <br/>
                  </div>

            
          <div className="container">
          <div className="row">
              <div className="col-3">
              <Button key="1" danger type="primary" onClick={deleteShift}>Delete</Button>
              </div>
              <div className="col-6"></div>
              <div className="col-3">
              <Button key="2" onClick={() => setAdminCheck(false)}>Cancel</Button>
              </div>
            </div>
          </div>
                  
                  </Modal>

      {/* <Calendar
        selectable
        localizer={localizer}
        onSelectSlot={showModal}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView={Views.MONTH}
        views={{ month: true, week: true }}
        style={{ minHeight: '300vh' }}
        components={{
          event: CustomeEvents,
        }}
      /> */}

      <Modal
        title="Create Shift"
        visible={visible}
        // onOk={handleOk}
         onCancel={handleCancel}
        footer={[
          <Button key="1" onClick={handleCancel}>Cancel</Button>,
          <Button onClick={handleOk} key="2" type="primary">
            Create
          </Button>
        ]}
      >
        <select
          id="cars"
          name="cars"
          className="custom-select bg-light m-2 shadow-sm"
          onChange={handelAssign}
        >
          <option defaultValue="Doctor Assigned" id="assi">
            Doctor Assigned
          </option>
          {users.map((dat) => (
            <option value={dat._id} key={dat._id}>
              {dat.lastName+','+dat.firstName}
            </option>
          ))}
        </select>
        <select
          id="cars"
          name="cars"
          className="custom-select bg-light m-2 shadow-sm"
          onChange={handelShift}
        >
          <option defaultValue="Shift Type " id="shType">
            Shift Type
          </option>
          {data.map((sh) => (
            <option value={sh.shiftname} key={sh._id}>
              {sh.shiftname}
            </option>
          ))}
        </select>
        {
          commentVisible === 'true'
          ?
          <div>
            <input
            type="text"
            className="form-control m-2 bg-light shadow-sm"
            placeholder="Comments for requested shift type"
            onChange={handleComment}
          />
          </div>
          :
          <div></div>
        }
        
      </Modal>
                <Modal
                    title="Update Shift"
                    visible={exchangeVisible}
                    maskClosable={true}
                     onCancel={() => setexchangeVisible(false)}
                    // onOk={passNotification}
                    footer={null}
                >
                  <Tabs defaultActiveKey="1" onChange={callback}>
                    <TabPane tab={
                      <span>
                        <EditOutlined />
                        Edit Shift
                      </span>
                    } key="1">
                    <div>
                    <Card type="inner">
                      <div className="row">
                         <div className="col-4" style={{
                                    textAlign: 'right'
                                }}><b>Select User:</b></div>
                         <div className="col-6">
                         <Select defaultValue="Select Any User" style={{ width: 280 }} onChange={handelFrom}>
                            {lastNameUsers.map((dat) => (
                                <Option value={dat._id} key={dat._id}>
                                    {dat.firstName+' '+dat.lastName}
                                </Option>
                            ))}
                            
                            </Select>
                         </div>
                      </div>
                    
                        <br/>
                            
                            <div className="row">
                                <div className="col-4" style={{
                                    textAlign: 'right'
                                }}><b>Shift Name:</b></div>
                                <div className="col-6">{oneEvent.shiftname}</div>
                            </div>

                            <br/>
                            <div className="row">
                                <div className="col-4" style={{
                                    textAlign: 'right'
                                }}><b>Shift title:</b></div>
                                <div className="col-6">{title}</div>
                            </div>
                            {/* <div className="row">
                                <div className="col-4" style={{
                                    textAlign: 'right'
                                }}><b>Current User:</b></div>
                                <div className="col-6">{title.substring(
                                    title.lastIndexOf(":") + 1
                                )}</div>
                            </div> */}
                         {
                        oneEvent.comment == undefined ?
                        <div>
                          
                        </div>
                        :
                        <div>
                          <Divider/>
                          <div style={{
                            textAlign: 'center',
                            fontStyle: 'italic'
                         }}>{oneEvent.comment}</div>
                         
                        </div>
                      }
                      
                    </Card>
                    <br/>
                    <div className="row">
                    <div className="col-2">
                        <Button type="primary" danger onClick={deleteShift} >Delete</Button>
                      </div>
                      <div className="col-5"></div>
                      <div className="col-2">
                      <Button onClick={() => setexchangeVisible(false)}>Cancel</Button></div>
                      <div className="col-2">
                      <Button onClick={passNotification} type="primary">
                        Update
                      </Button>
                      </div>
                    </div>
                      
                  </div>  
                    </TabPane>
                    <TabPane 
                    tab={
                      <span>
                        <HistoryOutlined />
                        History
                      </span>
                    }
                     key="2">
                       <ShowHistory historyObj= {history} />
                       <div className="row">
                         <div className="col-9"></div>
                         <div className="col-3">
                         <Button onClick={() => setexchangeVisible(false)}>Cancel</Button>
                         </div>
                       </div>
                       
                    </TabPane>
                  </Tabs>
                    </Modal>
{/* 
                  <Modal
                    title="Confirm Request"
                    visible={exchangeVisible}
                    maskClosable={true}
                    onCancel={() => setexchangeVisible(false)}
                    onOk={passNotification}
                  >
                    <div>
                    <Card type="inner">
                        Please confirm to send swap request
                    </Card>
                  </div></Modal> */}
    </div>
  );
};

export default ShiftsCalender;

/*

*/