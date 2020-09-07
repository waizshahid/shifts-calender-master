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
  };
  const handelEndDate = (e) => {
    setEnd(e.target.value);
  };

  const handleOk = (e) => {
    setVisible(false);
    const title = assign + " " + shiftType;
    const options = {
      url: "http://localhost:4000/api/shift/createShift",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        title: title.toString(),
        start: start,
        end: end,
      },
    };
    axios(options).then((res) => {
      alert("Shift Created Successfully");
    });
  };
  const handleCancel = (e) => {
    setVisible(false);
  };
  useEffect(() => {
    axios.get("http://localhost:4000/api/shift/currentShifts").then((res) => {
      setEvents(res.data);
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
      setData(res.data);
    });

    axios.get("http://localhost:4000/api/user/getusers").then((res) => {
      setUsers(res.data);
    });
  }, []);

  const cutomEvent = () => {
    return (
      <div style={{ backgroundColor: "red" }}>
        <p>{events.title}</p>
      </div>
    );
  };
  console.log(events);
  return (
    <div className="m-sm-4 m-2">
      <FullCalendar
        defaultView="dayGridMonth"
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={showModal}
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
            <option value={dat.username} key={dat._id}>
              {dat.username}
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
        />
      </Modal>
    </div>
  );
};

export default ShiftsCalender;
