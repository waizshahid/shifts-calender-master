import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal } from "antd";
import CustomeEvents from "./components/customEvents/CustomeEvents";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
moment.locale("ko", {
  week: {
    dow: 1,
    doy: 1,
  },
});
const localizer = momentLocalizer(moment);

const ShiftsCalender = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState([]);
  const [events, setEvents] = useState([]);
  const [assign, setAssign] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [users, setUsers] = useState([]);
  const [stop, setStop] = useState(0);

 
  const showModal = () => {
    setVisible(true);
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
        
        start: start,
        userId: userId,
        end: end,
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
  useEffect(() => {
    console.log('Use Effect checking')
    setEventAtRender()
    setDataAndUser()
    
  }, [stop]);

  const cutomEvent = () => {
    return (
      <div style={{ backgroundColor: "red" }}>
        <p>{events.title}</p>
      </div>
    );
  };
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
          defaultValue= {start}
        />
      </Modal>
    </div>
  );
};

export default ShiftsCalender;

/*

*/