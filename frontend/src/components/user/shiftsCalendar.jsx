import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";

const ShiftsCalendar = () => {
  const [events, setEvents] = useState([]);

  const handelSelect = (e) => {
    if (e.target.value === "Default") {
      axios.get("http://localhost:4000/api/shift/currentShifts").then((res) => {
        setEvents(res.data);
      });
    }
    if (e.target.value === "My Shifts") {
      axios
        .get("http://localhost:4000/api/shift/currentUserShifts", {
          params: { username: localStorage.getItem("username").toString() },
        })
        .then((res) => {
          if (res.data !== null) {
            setEvents(res.data);
          } else {
            setEvents([]);
          }
        });
    }
    if (e.target.value === "Off") {
      axios
        .get("http://localhost:4000/api/shift/currentUserOffShifts", {
          params: { username: localStorage.getItem("username").toString() },
        })
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
      setEvents(res.data);
    });
  }, []);
  return (
    <React.Fragment>
      <div className="container-fluid">
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
          <hr />
        </div>
        <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin, interactionPlugin]}
          events={events}
        />
      </div>
    </React.Fragment>
  );
};

export default ShiftsCalendar;
