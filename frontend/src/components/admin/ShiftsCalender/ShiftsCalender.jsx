import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Select, Card } from "antd";
import CustomeEvents from "./components/customEvents/CustomeEvents";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import jwt_decode from 'jwt-decode'
moment.locale("ko", {
  week: {
    dow: 1,
    doy: 1,
  },
});
const localizer = momentLocalizer(moment);
const { Option } = Select;
let date = ""
let title= ""
const ShiftsCalender = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [oneEvent, setOneEvent] = useState({});
  const [events, setEvents] = useState([]);
  const [assign, setAssign] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [users, setUsers] = useState([]);
  const [stop, setStop] = useState(0);
  const [exchangeVisible, setexchangeVisible] = useState(false);
  const [id2, setTargetId] = useState("");
  const token = localStorage.admintoken
  const decoded = jwt_decode(token)
  const [login,setLoginUserShift] = useState([]);
  const currentId = decoded.id
 
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
  const handelShift = (e) => {
    setShiftType(e.target.value);
  };
  const handelDate = (e) => {
    setStart(e.target.value);
    setEnd(e.target.value);
  };
  const handelEndDate = (e) => {
    setEnd(e.target.value);
  };

  const handleOk = (e) => {
    setVisible(false);
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

    for (let i = 0; i < data.length; i++) {
      if (shiftType === data[i].shiftname) {
        shiftTypeId = data[i]._id;
        break;
      }
    }

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
        shiftTypeId: shiftTypeId,
        swapable: swapable,

      },
    };
    axios(options).then((res) => {
      alert("Shift Created Successfully");
      window.location.reload();
    });
  };
  const handleCancel = (e) => {
    setVisible(false);
  };
  const handleDoctors = (e) => {
    if(e.target.value === "All"){
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

    axios.get("user/getusers").then((res) => {
      setUsers(res.data);
    });
  }
  const setEventAtRender = () => {
    axios.get("shift/currentShifts").then((res) => {
      let temp1 = []
      let temp2 = []
      let temp = []
      for(let i = 0 ; i < res.data.shifts.length ; i++){
        if(res.data.shifts[i].shiftname === 'Request'){
          if(res.data.shifts[i].requestApprovalStatus === 'approved'){
              temp1.push(res.data.shifts[i])
          }
        }
        else{
          temp2.push(res.data.shifts[i])
        }
      }

      temp = [...temp1,...temp2]
      console.log(temp)  
    setEvents(temp);
    
    });
  }
  const handleEventClick = ({ event, el }) => {
    title = event.title
    settingEvent(event._def.extendedProps)
};
useEffect(() => {
  console.log(oneEvent)
  console.log(oneEvent._id)
  console.log(currentId)
  {
    oneEvent.userId === undefined && oneEvent._id === undefined ?
    setexchangeVisible(false)
    :
    setexchangeVisible(true)
  }
  
},[oneEvent]);
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

    axios.post("user/userNotification",{
                currentUserId,userId1,userId2,shiftId1,message,adminresponse,date,requester
            })
            .then((res) => {
              axios.get("shift/swapShiftUser/"+shiftId1+'/'+userId2)
              .then((res1) => {
                console.log('Admin Swap Successful')
                window.location.reload()
              })
              .catch((err) => {
                console.log(err)
              })
               
            })
            .catch((err) => {
              console.log(err.response);
            });
  }
  return (
    <div className="m-sm-4 m-2">
        <div className="col-3">
        <select
          id="selectDoctor"
          name="cars"
          className="custom-select bg-light m-2 shadow-sm"
          onChange={handleDoctors}
        >
          <option defaultValue="All">
           All
          </option>
          {users.map((dat) => (
            <option value={dat._id} key={dat._id}>
              {dat.firstName+' '+dat.lastName}
            </option>
          ))}
          </select>
        </div>
        <br/>
      <FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin]}
        weekNumberCalculation = 'ISO'
        dateClick={showModal}
        eventClick={handleEventClick}
        eventOrder="priority"
        // eventClick={handelModal}
        events={events}
      />
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
        // onCancel={handleCancel}
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
              {dat.firstName+' '+dat.lastName}
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
        
      </Modal>
                <Modal
                    title="Update Shift"
                    visible={exchangeVisible}
                    maskClosable={true}
                     onCancel={() => setexchangeVisible(false)}
                    // onOk={passNotification}
                    footer={[
                      <Button key="1" onClick={() => setexchangeVisible(false)}>Cancel</Button>,
                      <Button onClick={passNotification} key="2" type="primary">
                        Update
                      </Button>
                    ]}
                >
                    <div>
                    <Card type="inner">
                    <b>Select user for this shift</b><br/>
                        <Select defaultValue="Select Any User" style={{ width: 400 }} onChange={handelFrom}>
                            {users.map((dat) => (
                                <Option value={dat._id} key={dat._id}>
                                    {dat.firstName+' '+dat.lastName}
                                </Option>
                            ))}
                            
                            </Select>
                            <br/><br/>
                      Shift Name:
                      {oneEvent.shiftname}<br/><br/>
                      {
                        oneEvent.comment == undefined ?
                        <div>
                          
                        </div>
                        :
                        <div>
                         
                        {title+' '+oneEvent.comment}
                        </div>
                      }
                      
                    </Card>
                  </div></Modal>
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