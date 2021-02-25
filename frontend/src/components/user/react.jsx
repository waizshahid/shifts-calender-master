import React, { Component, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@material-ui/core';
import '../../../../../src/App.css';
import { withStyles } from '@material-ui/styles';
import '../../../../App.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import CustomeEvents from './CustomeEvents';
import CustomToolBar from './CustomToolBar';
import CloseIcon from '@material-ui/icons/Close';
import { Link, withRouter } from 'react-router-dom';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import axios from 'axios';
import { DataContext } from '../../../../Context/DataContext';
import moment_timezone from 'moment-timezone';
import { tConvert, dConvert, dateAdd } from '../../../../utils';

moment_timezone.tz.setDefault('America/Puerto_Rico');
const localizer = momentLocalizer(moment_timezone);

const styles = theme => ({
  root: {
    backgroundImage: 'none'
  }
});
class Landingpage extends React.Component {
  static contextType = DataContext;
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 1),
          end: new Date(2020, 7, 1),
          id: 0
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 2),
          end: new Date(2020, 7, 2),
          id: 1
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 3),
          end: new Date(2020, 7, 3),
          id: 2
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 5),
          end: new Date(2020, 7, 5),
          id: 3
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 6),
          end: new Date(2020, 7, 6),
          id: 4
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 7),
          end: new Date(2020, 7, 7),
          id: 5
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 8),
          end: new Date(2020, 7, 8),
          id: 6
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 9),
          end: new Date(2020, 7, 9),
          id: 7
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 10),
          end: new Date(2020, 7, 10),
          id: 8
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 11),
          end: new Date(2020, 7, 11),
          id: 9
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 12),
          end: new Date(2020, 7, 12),
          id: 10
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 13),
          end: new Date(2020, 7, 13),
          id: 11
        },
        {
          title: 'Book now',
          allDay: true,
          avalable: 5,
          start: new Date(2020, 7, 14),
          end: new Date(2020, 7, 14),
          id: 12
        }
      ]
    };
  }

  componentDidMount() {
    this.fetchdata();
  }

  fetchdata = async () => {
    console.log(this.context.selectedRoom);
    let newSchedules = [];
    let allScheduels = await axios.get('/schedules');
    if (allScheduels.status === 200) {
      for (let j = 0; j < allScheduels.data.schedules.length; j++) {
        
        let scheduledDate = new Date(
          `${allScheduels.data.schedules[j].date} ${allScheduels.data.schedules[j].time}`.replace(
            ' ',
            'T'
          )
        );
        let minTimeBeforeBooking = dateAdd(
          scheduledDate,
          'minute',
          -allScheduels.data.schedules[j].room.minTimeBeforeBooking
        );
        let maxTimeOfBooking = dateAdd(
          scheduledDate,
          'minute',
          -allScheduels.data.schedules[j].room.maxTimeOfBooking
        );
        
        let d = new Date(
          `${allScheduels.data.schedules[j].date} ${allScheduels.data.schedules[j].time}`.replace(
            ' ',
            'T'
          )
        );

        if (
          allScheduels.data.schedules[j].room?._id ===
            this.context.selectedRoom?._id &&
          // Date.parse(new Date(d)) >= Date.parse(new Date()) &&
          Date.parse(scheduledDate) >= Date.parse(new Date()) &&
          Date.parse(new Date()) >= Date.parse(maxTimeOfBooking) &&
          Date.parse(new Date()) < Date.parse(minTimeBeforeBooking) &&
          allScheduels.data.schedules[j].status === 'available' &&
          allScheduels.data.schedules[j].available !== undefined
        ) {
          let startDate = allScheduels.data.schedules[j].date.replace(
            /-/g,
            '/'
          );
          startDate = new Date(startDate);
          allScheduels.data.schedules[j].start = new Date(startDate);
          allScheduels.data.schedules[j].end = new Date(startDate);
          allScheduels.data.schedules[
            j
          ].available = allScheduels.data.schedules.filter(
            schd =>
              schd.available &&
              schd?.room?._id === this.context.selectedRoom?._id &&
              schd.date === allScheduels.data.schedules[j].date
          ).length;
          newSchedules.push(allScheduels.data.schedules[j]);
        }
      }
    }
    console.log(newSchedules);
    var resArr = [];
    newSchedules.filter(item => {
      if (
        item.room &&
        item.available &&
        item.room._id === this.context.selectedRoom?._id
      ) {
        var i = resArr.findIndex(x => x.date === item.date);
        if (i <= -1) {
          // console.log(item);
          resArr.push({
            id: item._id,
            date: item.date,
            time: item.time,
            start: item.start,
            end: item.end,
            available: item.available,
            status: item.status,
            room: item.room
          });
        }
        return null;
      }
    });

    this.setState({
      events: resArr
    });
    // console.log(resArr);
    // console.log(this.state.events);
  };
  render() {
    const { classes } = this.props;
    const { className, onSidebarOpen, ...rest } = this.props;
    return (
      <Grid
        container
        xs={12}
        md={11}
        align="center"
        style={{
          justifyContent: 'center',
          marginTop: '-2rem',
          margin: 'auto'
        }}>
        <Grid container xs={12} style={{ justifyContent: 'center' }}>
          <Grid container xs={11}>
            <Grid item xs={12} align="right">
              <Link to="/">
                    <CloseIcon style={{ fontSize: '30px' }} />
                 </Link>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          container
          justify="space-around"
          xs={12}
          align="left"
          style={{ fontSize: '35px', fontWeight: 500, marginBottom: '2rem' }}>
          BOOKING
        </Grid>
        {/* <a href="/laststep" style={{ width: '100%', textDecoration: 'none' }}> */}
        <Calendar
          style={{ width: '90%', height: '130vh' }}
          events={this.state.events}
          startAccessor="start"
          id={this.state.id}
          endAccessor="end"
          // defaultDate={moment()
          //   .utcOffset('-4')
          //   .toDate()}
          localizer={localizer}
          components={{
            event: CustomeEvents,
            toolbar: CustomToolBar
          }}
        />
        {/* </a> */}
      </Grid>
    );
  }
}
Landingpage.propTypes = {
  className: PropTypes.string
};

export default withRouter(withStyles(styles)(Landingpage));
import React from 'react';
import './CustomToolBar.css';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CustomToolBar = toolbar => {
  const goToBack = () => {
    let mDate = toolbar.date;
    let newDate = new Date(mDate.getFullYear(), mDate.getMonth() - 1, 1);
    toolbar.onNavigate('prev', newDate);
  };
  const goToNext = () => {
    let mDate = toolbar.date;
    let newDate = new Date(mDate.getFullYear(), mDate.getMonth() + 1, 1);
    toolbar.onNavigate('next', newDate);
  };
  return (
    <div className="CustomToolBar">
      <div
        className="prev"
        onClick={() => {
          goToBack();
        }}>
        <FiChevronLeft />
      </div>
      <div className="title">{toolbar.label}</div>
      <div
        className="next"
        onClick={() => {
          goToNext();
        }}>
        <FiChevronRight />
      </div>
    </div>
  );
};

export default CustomToolBar;
 import React from 'react';
import './CustomEvents.css';
import { Link } from 'react-router-dom';

const CustomeEvents = even => {
  return (
    <div className="custEvent">
      <small className="">Avalable: {even.event.available} </small>
      <Link className="button" to={{pathname:'/laststep', query:{event : even.event}}}>
        <span> Book Now </span>
      </Link>
    </div>
  );
};

export default CustomeEvents;
 .custEvent .button {
  background-color: #232323 !important;
  color: #fff !important;
  width: 100% !important;
  text-align: center !important;
  height: 35px !important;
  border-radius: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  text-transform: uppercase !important;
  font-size: 12px !important;
  letter-spacing: 0.02em !important;
  position: relative;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
}

.custEvent .button::before {
  content: '';
  display: block;
  width: 0%;
  height: 100%;
  background-color: #fb383c;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10;
  transition: 0.5s;
}

.custEvent .button:hover::before {
  width: 100%;
  transition: 0.5s;
}

.custEvent .button span {
  z-index: 15;
}

small {
  color: #232323;
  text-transform: none;
  display: block;
  padding: 36px 0 10px;
}

@media only screen and (max-width: 1024px) {
  small {
    font-size: 10px;
  }

  .custEvent .button {
    font-size: 10px !important;
  }
}

@media only screen and (max-width: 575px) {
  small {
    font-size: 7px;
    word-break: break-word;
    white-space: break-spaces;
    padding: 18px 0 2px;
  }

  .custEvent .button {
    font-size: 8px !important;
    padding: 0;
    white-space: break-spaces;
    text-align: center !important;
    height: 30px !important;
  }
}
[12:03 PM, 2/17/2021] Yamin Bhai: .CustomToolBar {
  display: flex;
  justify-content: center;
  align-items: center;
}

.CustomToolBar .next,
.CustomToolBar .prev {
  border: 2px solid #232323;
  color: #232323;
  /* padding: 0 15px; */
  margin: 0 75px;
  width: 45px;
  height: 45px;
  font-size: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ebf2f666;
  cursor: pointer;
  transition: 0.3s;
}

.CustomToolBar .next:hover,
.CustomToolBar .prev:hover {
  background-color: #232323;
  color: #fff;
  transition: 0.3s;
}

.CustomToolBar .title {
  font-size: 30px;
  text-transform: uppercase;
  text-align: center;
  letter-spacing: 0.05em;
  font-weight: 300;
  color: #444;
}

@media only screen and (max-width: 575px) {
  .CustomToolBar .next,
  .CustomToolBar .prev {
    margin: 0 25px;
    width: 30px;
    height: 30px;
    font-size: 20px;
  }
  .CustomToolBar .title {
    font-size: 18px;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.05em;
    font-weight: 300;
    color: #444;
  }
}