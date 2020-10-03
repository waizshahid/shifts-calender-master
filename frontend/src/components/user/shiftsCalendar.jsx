import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import { Modal } from "antd";
import jwt_decode from 'jwt-decode'
const ShiftsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [oneEvent, setOneEvent] = useState();
  const [visible, setVisible] = useState(false);
  const [commentVisible, setcommentVisible] = useState(false);
  const [data, setData] = useState([]);
  const [off, setOff] = useState([]);
  const [assign, setAssign] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [approval, setApproval] = useState("");
  const [comment, setComment] = useState("");
  const showModal = () => {
    setVisible(true);
  };

  
  const handelAssign = (e) => {
    e.preventDefault();
    setAssign(e.target.value);
  };
  const handelShift = (e) => {
    setShiftType(e.target.value.substring(0,e.target.value.indexOf(":")));
    console.log(e.target.value.substring(0,e.target.value.indexOf(":")));
    console.log(e.target.value.substring(e.target.value.indexOf(":") + 1))
    {
      e.target.value.substring(e.target.value.indexOf(":") + 1) == 'Request' ?
      setcommentVisible(true):setcommentVisible(false)

    }
  };

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

  useEffect(() => {
    AfterSetOff()
  }, [off]);

  const getAndSetOffStatus = (res) => {
    console.log(res.data.shifts)
        setOff(res.data.shifts)
       
  }
  

  const AfterSetOff = () => {
    console.log(off)
    const userId = assign;
    let shiftTypeId = shiftType;
    var swapable = "true";
    for (let i = 0; i < data.length; i++) {
      if (shiftType === data[i].shiftname) {
        shiftTypeId = data[i]._id;
        break;
      }
    }
    console.log('off.length: '+off.length)
    let offAprovalStat;
   let countStatus = 0;
    for(let i = 0 ; i < off.length ; i++){
      if(off[i].status === 'Approved'){
        countStatus++;
      }
    }

    console.log('countStatus: '+countStatus)
    if(off.length < 8 || countStatus < 8){
      offAprovalStat = "Approved"  
    }else{
      offAprovalStat = "Unapproved"  
    }

    const options = {
      url: "http://localhost:4000/api/shift/createShift",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        userId: currentId,
        comment: comment,
        start: start,
        end: end,
        requestApprovalStatus: 'unapproved',
        offApprovalStatus: 'approval',
        shiftTypeId: shiftTypeId,
        swapable: swapable
      },
    };
    axios(options).then((res) => {
      alert("Shift Created Successfully");
      window.location.reload();
    });
  }
  
  const handleOk = (e) => {
    setVisible(false);
  
    axios.get("http://localhost:4000/api/shift/specificDateOffEvents/"+start)
    .then((res) => {
        getAndSetOffStatus(res);
        console.log(res.data.shifts)
    })
    .catch((err) => {
      console.log('Failed to get and set current date off events from database');
    })
    
  };
  const handleCancel = (e) => {
    setVisible(false);
  };

  const token = localStorage.usertoken
  const decoded = jwt_decode(token)
  const currentId = decoded.id
  
  const handelSelect = (e) => {
    if (e.target.value === "Default") {
      axios.get("http://localhost:4000/api/shift/currentShifts").then((res) => {
        // let temp1 = []
        // let temp2 = []
        // for(let i =0 ; i<res.data.shifts.length; i++){

        // }
        // console.log(res.data.shifts)
        setEvents(res.data.shifts);
      });
    }
    if (e.target.value === "My Shifts") {
      console.log('User Logged In');
      console.log('User Id:'+currentId);
      axios
        .get("http://localhost:4000/api/shift/currentUserShifts/"+currentId)
        .then((res) => {
          if (res.data !== null) {
            setEvents(res.data);
          } else {
            setEvents([]);
          }
        });
    }
    if (e.target.value === "Off") {
      console.log('User Logged In OFF');
          console.log('User Id:'+currentId);
      axios
        .get("http://localhost:4000/api/shift/currentUserOffShifts/"+currentId)
        .then((res) => {
          
          if (res.data !== null) {
            setEvents(res.data);
          } else {
            setEvents([]);
          }
        });
    }
  };

  useEffect(() => {
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
    const options = {
      url: "http://localhost:4000/api/shift/getshifts",
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    axios(options).then((res) => {
      var temp = [];
      for(let i = 0; i < res.data.length ; i++){
          if(res.data[i].editable === "true"){
                temp.push(res.data[i]);
                console.log(res.data[i])
              }
      }
      
      setData(temp);
    });

  }, [visible]);
  
  const settingEvent = (event) => {
    setOneEvent(event)
  }
  const handleEventClick = ({ event, el }) => {
  // this.toggle();
    settingEvent(event._def.extendedProps)
    if(oneEvent !== 'undefined'){
      console.log(oneEvent)
    }else{
      console.log('Add the shift again')
    }
};
  return (
    <div className="m-sm-4 m-2">
        <div className="container">
          <div className="row">
            <select
              id="cars"
              name="cars"
              className="custom-select bg-light m-2 shadow-sm float-right w-25"
              onChange={handelSelect}
            >
              <option defaultValue="Default">Default </option>
              <option value="My Shifts">My Shifts </option>
              <option value="Off">Off </option>
              <option value="Shifts Offered">Shifts Offered </option>
            </select>
          </div>
        </div>
        <br/>
        <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin, interactionPlugin]}
          events={events}
          dateClick={showModal}
          eventClick={handleEventClick}
          eventOrder="priority"
          weekNumberCalculation = 'ISO'
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
          onChange={handelShift}
        >
          <option defaultValue="Shift Type " id="shType">
            No shift right now
          </option>
          {data.map((sh) => (
            <option value={sh._id+':'+sh.shiftname} key={sh._id}>
              {sh.shiftname}
            </option>
          ))}
        </select>
          <input
            type="text"
            className="form-control m-2 bg-light shadow-sm"
            placeholder="Comments for requested shift type"
            onChange={handleComment}
            visible = {commentVisible}
          />
            
        <input
          type="date"
          className="form-control m-2 bg-light shadow-sm"
          placeholder="Start Date"
          onChange={handelDate}
        />
        <input
          type="date"
          className="form-control m-2 bg-light shadow-sm"
          placeholder="End Date"
          onChange={handelEndDate}
          defaultValue={start}
        />
      </Modal>
    </div>
  );
};

export default ShiftsCalendar;
