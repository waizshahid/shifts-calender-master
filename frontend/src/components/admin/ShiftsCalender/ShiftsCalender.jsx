import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, DatePicker, Select, Card } from "antd";
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
      url: "http://localhost:4000/api/shift/createShift",
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
      axios.get("http://localhost:4000/api/shift/currentShifts").then((res) => {
        setEvents(res.data.shifts);
      });
    }else{
      axios.get("http://localhost:4000/api/shift/getUserByName/"+e.target.value).then((res) => {
      setEvents(res.data.shifts);
    });
        
    }
  }

  const setDataAndUser = () => {
    const options = {
      url: "http://localhost:4000/api/shift/getshifts",
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

    axios.get("http://localhost:4000/api/user/getusers").then((res) => {
      setUsers(res.data);
    });
  }
  const setEventAtRender = () => {
    axios.get("http://localhost:4000/api/shift/currentShifts").then((res) => {
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
    settingEvent(event._def.extendedProps)
};
useEffect(() => {
  console.log(oneEvent.userId)
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
    axios.get("http://localhost:4000/api/shift/specificDateShifts/"+dateString+"/"+currentId)
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
        let userId2 = id2.substring(id2.indexOf(":") + 1)
        let shiftId2 = id2.substring(0, id2.indexOf(':'));
        let date = new Date().toISOString().slice(0,10);
        const message = "One of the User wants to swap his shift with you. Click for the details"
        const requester ="Admin"
        const currentUserId = currentId;
        const messageFrom = "Your request has been sent. Wait for the Response"
        const requestStatus = "true"

        console.log(userId1,userId2,shiftId1,shiftId2)

    axios.post("http://localhost:4000/api/user/userNotification",{
                currentUserId,userId1,userId2,shiftId1,shiftId2,message,messageFrom,date,requester,requestStatus
            })
            .then((res) => {
                console.log(res.data);
                window.location.reload()
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
        onOk={handleOk}
        onCancel={handleCancel}
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
                    title="Update Shifts"
                    visible={exchangeVisible}
                    maskClosable={true}
                    onCancel={() => setexchangeVisible(false)}
                    onOk={passNotification}
                    
                >
                    <div>
                    <Card type="inner">
                    <b>Select Your Shift</b><br/>
                        <DatePicker placeholder="Select date to shift" style={{ width: 400 }} onChange={onChange}/><br/><br/>
                        <Select defaultValue="Select your shift" style={{ width: 400 }} onChange={handelFrom}>
                            {login.map((dat) => (
                                <Option value={dat._id+':'+dat.userId} key={dat._id}>
                                    {dat.title+'  '+'('+dat.shifname+')'}
                                </Option>
                            ))}
                            
                            </Select>
                    </Card>
                  </div></Modal>
    </div>
  );
};

export default ShiftsCalender;

/*

*/