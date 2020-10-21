import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Card } from "antd";
import FullCalendar from "@fullcalendar/react";
import UploadShiftFile from './uploadfile'
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
let date = "";
let currentShift = ""
let currentUser = ""
let currentShiftName = ""
let title = ""
let comment = ""
const ShiftsCalender = () => {
  const [visible, setVisible] = useState(false);
  const [updateVisible, setupdateVisible] = useState(false);
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [assign, setAssign] = useState("");
  const [userId2, setuserId2] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [start, setStart] = useState("");
  const [oneEvent, setOneEvent] = useState({});
  const [end, setEnd] = useState("");
  const [users, setUsers] = useState([]);
  const [stop, setStop] = useState(0);
  const token = localStorage.superadmintoken
    const decoded = jwt_decode(token)
    const currentId = decoded.id
  const showModal = (e) => {
    date = e.dateStr
    setVisible(true);
  };
  const handelAssign = (e) => {
    e.preventDefault();
    setAssign(e.target.value);
  };
  const targetUserId = (e) => {
    e.preventDefault();
    setuserId2(e.target.value);
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
    let shiftTypeId = shiftType;
    var swapable = "true";
    const options = {
      url: "shift/createShift",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        userId: userId,
        start: date,
        shiftTypeId: shiftTypeId,
        end: date,
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
   
   const filterShift = (e) => {
     console.log(e.target.value)
     if(e.target.value === "All Shifts"){
      axios.get("shift/currentShifts").then((res) => {
        console.log(res.data.shifts);
        setEvents(res.data.shifts);
      });
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

  const handleDoctors = (e) => {
    console.log(e.target.value)
    if(e.target.value === "All Users"){
      axios.get("shift/currentShifts").then((res) => {
        console.log(res.data.shifts);
        setEvents(res.data.shifts);
      });
    }else{
      axios.get("shift/getUserByName/"+e.target.value).then((res) => {
      console.log('User Id:');
      console.log(res.data.shifts);
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
      let count = 0;
      for(let i = 0 ; i < res.data.shifts.length ; i++){
        if(res.data.shifts[i].shiftname === 'Request' || res.data.shifts[i].shiftname === 'Off'){
          if(res.data.shifts[i].shiftname === 'Request'){
            if(res.data.shifts[i].requestApprovalStatus === 'approved'){
              temp1.push(res.data.shifts[i])
            }
          }else if(res.data.shifts[i].shiftname === 'Off'){
            count++;
            console.log(count)
            if(res.data.shifts[i].offApprovalStatus === 'Approved'){
              temp1.push(res.data.shifts[i])
            }else if(res.data.shifts[i].offApprovalStatus === 'Unapproved' && count <= 8){
              res.data.shifts[i].offApprovalStatus = 'Approved'
              temp1.push(res.data.shifts[i])
            }else if(res.data.shifts[i].offApprovalStatus === 'Unapproved' && count >= 8){

            }
          }
          
        // }else if(res.data.shifts[i].shiftname === 'Off'){
        //   if(res.data.shifts[i].offApprovalStatus === 'Approved'){
        //     temp3.push(res.data.shifts[i])
        //   }
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
  const handleEventClick = ({ event }) => {
    // if(event._def.extendedProps.shiftname === 'Request'){
    //   alert('Request comment: '+event._def.extendedProps.comment)
    // }else{
    //   alert('Please Choose a request event')
    // }
    // settingEvent(event._def.extendedProps)
    // console.log(event._def.extendedProps._id)
    title = event.title
    comment = event._def.extendedProps.comment
    currentShift = event._def.extendedProps._id
    currentUser = event._def.extendedProps.userId 
    currentShiftName = event._def.extendedProps.shiftname
    setupdateVisible(true)
  };

const updateShift = (e) => {
        setupdateVisible(false)
        // console.log(userId1)
        let shiftId1 = currentShift
        let userId1 = currentUser
        let date = new Date().toISOString().slice(0,10);
        const message = "Your shift has been swapped. Click for details"
        const requester = "Super Admin"
        const adminresponse = "The requested shifts  has been swapped."
        let shiftName=""   
        console.log('User 1 '+userId1)
        console.log('Shift 1 '+shiftId1)
        console.log('User 2 '+userId2)
        const currentUserId = currentId;
        
        axios.get("shift/getShiftName/"+shiftId1)
        .then((res) => {
          shiftName = res.data.shiftname
          axios.post("user/userNotification",{
            userId1,userId2,shiftId1,message,date,requester,adminresponse,currentUserId,shiftName
        })
        .then((res) => {
          axios.get("shift/swapShiftUser/"+shiftId1+'/'+userId2)
          .then((res1) => { 
          // console.log(res1.data);
          console.log(res.data)
          
          // console.log(res.data);
          window.location.reload();
    })
    .catch((err) => {
      console.log(err.response);
    });
      })
      .catch((err) => {
          console.log(err)
      })
        })
        .catch((err) => {
          console.log(err)
        })
        
        
}

  // function eventRender(info){
  //   var tooltip = new Tooltip(info.el, {
  //     title: info.event.extendedProps.title,
  //     placement: 'top',
  //     trigger: 'hover',
  //     container: 'body'
  //   });
  // }

  useEffect(() => {
    console.log('Use Effect checking')
    setEventAtRender()
    setDataAndUser()
  }, [stop]);
  
  
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
                {dat.firstName+' '+dat.lastName}
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
            All Shifts
            </option>
            {data.map((dat) => (
              <option value={dat._id} key={dat._id}>
                {dat.shiftname}
              </option>
            ))}
            </select>
          </div>
          {/* <div className="col-5"></div>
          <div className="col-4"> */}
            {/* <UploadShiftFile /> */}
          {/* </div> */}
      </div>
        <br/>
      <FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={showModal}
        weekNumberCalculation= 'ISO'
        eventOrder="priority"
        eventClick={handleEventClick}
        // eventRender={eventRender}
        titleFormat={{ month: 'long', year: 'numeric' }}
          headerToolbar={{
            left: '',
            end:'',
            center:  'prev,title,next'
          }}
        events={events}
        
      />
  
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
          ))}{" "}
        </select>
        <select
          id="cars"
          name="cars"
          className="custom-select bg-light m-2 shadow-sm"
          onChange={handelShift}
        >
          <option defaultValue="Shift Type " id="shType">
            No shift right now
          </option>
          {data.map((sh) => (
            <option value={sh._id} key={sh._id}>
              {sh.shiftname}
            </option>
          ))}
        </select>
        
      </Modal>
          <Modal
              title="Update Shift"
              visible={updateVisible}
              maskClosable={true}
              onCancel={() => setupdateVisible(false)}
              onOk={updateShift}
          >
            <Card type="inner" title="Select User">
            <select
              id="cars"
              name="cars"
              className="custom-select bg-light m-2 shadow-sm"
              onChange={targetUserId}
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
            <br/><br/>
            {'Shift Name: '+currentShiftName}<br/>
            {
              comment === undefined
              ?
              <div></div>
              :
              <div>{title+' '+comment}</div>
            }
           
          </Card>
                   </Modal>
    </div>
  );
  
};

export default ShiftsCalender;
   // // console.log('ID 1 HAI: '+id1);
        // // console.log('ID 2 HAI: '+id2);
        // // let userId1 = id1.substring(id1.indexOf(":") + 1)
        // // let userId2 = id2.substring(id2.indexOf(":") + 1)
        // // let shiftId1 = id1.substring(0, id1.indexOf(':'));
        // // let shiftId2 = id2.substring(0, id2.indexOf(':'));
        // console.log('UserID 1 HAI: '+userId1);
        // console.log('USERID 2 HAI: '+userId2);
        // console.log('ShiftID 1 HAI: '+shiftId1);
        // console.log('ShiftID 2 HAI: '+shiftId2);
     