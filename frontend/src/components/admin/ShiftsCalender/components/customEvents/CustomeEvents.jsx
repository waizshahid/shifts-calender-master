import React from 'react';
import './CustomEvents.scss';
import { Link } from 'react-router-dom';

const CustomeEvents = event => {
  return (
    <div className="custEvent">
      <small className="">No Such Title</small>
      {/* <small className="">{event.title !== '' ? `${event.title}` : 'No Such Title' }</small> */}
    </div>
  );
};

export default CustomeEvents;
