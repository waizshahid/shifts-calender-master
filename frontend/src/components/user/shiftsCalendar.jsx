import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import dayGridPlugin from "@fullcalendar/daygrid";
import axios from "axios";
import { Modal,Card,Select,Button,Row,Col } from "antd";
import jwt_decode from 'jwt-decode'
const { Option } = Select;
let date = "";
let shiftNameUser = "";

let name=""
let day=""
let sName=""

const ShiftsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [oneEvent, setOneEvent] = useState({});
  const [visible, setVisible] = useState(false);
  const [exchangeVisible, setexchangeVisible] = useState(false);
  const [failexchangeVisible, setFailexchangeVisible] = useState(false);
  const [commentVisible, setcommentVisible] = useState("");
  const [dateVisible, setDateVisible] = useState(false);
  const [data, setData] = useState([]);
  const [login,setLoginUserShift] = useState([]);
  const [filderedData, setFData] = useState([]);
  const [off, setOff] = useState([]);
  const [assign, setAssign] = useState("");
  const [shiftType, setShiftType] = useState("");
  const [adminCheck, setAdminCheck] = useState("")
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [approval, setApproval] = useState("");
  const [comment, setComment] = useState("");
  const [id2, setTargetId] = useState("");
  const token = localStorage.usertoken
  const decoded = jwt_decode(token)
  const currentId = decoded.id
  const showModal = (e) => {
    date = e.dateStr
    let dateCurrent = new Date().toISOString().slice(0,10);
    console.log(date)
    console.log(dateCurrent)
    if(date >= dateCurrent){
        setVisible(true)
      
    }else{
      setDateVisible(true)
    }
    
  };
  const handelFrom = (e) => {
    setTargetId(e);
};
  
  const handelAssign = (e) => {
    e.preventDefault();
    setAssign(e.target.value);
  };
  useEffect((e) => {
    setShiftType(shiftNameUser);
  }, [commentVisible]);
  function setRequestEvent(e){
    shiftNameUser = e.target.value.substring(0,e.target.value.indexOf(":"))
    setcommentVisible("true")
  }

  function setOffEvent(e){
    shiftNameUser = e.target.value.substring(0,e.target.value.indexOf(":"))
    setcommentVisible("false")
  }
  const handelShift = (e) => {
    if(e.target.value.substring(e.target.value.indexOf(":") + 1) === 'Request'){
        setRequestEvent(e)
    }else{
        setOffEvent(e)
    }

    // setShiftType(e.target.value.substring(0,e.target.value.indexOf(":")));
    // console.log(e.target.value.substring(0,e.target.value.indexOf(":")));
    // console.log(e.target.value.substring(e.target.value.indexOf(":") + 1))
    // {
    //   e.target.value.substring(e.target.value.indexOf(":") + 1) == 'Request' ?
    //   setcommentVisible(true):setcommentVisible(false)

    // }
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

  const getAndSetOffStatus = (data) => {
    console.log(data)
        setOff(data)
       
  }
  

  const AfterSetOff = () => {
    console.log(off)
    const userId = currentId;
    let shiftTypeId = shiftType;
    console.log(userId)
    console.log(shiftTypeId)
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
      if(off[i] !== null){
        if(off[i].status === 'Approved'){
          countStatus++;
        }
      }
    }

    console.log('countStatus: '+countStatus)
    if(off.length < 8){   // || countStatus < 8
      offAprovalStat = "Approved"  
    }else{
      offAprovalStat = "Unapproved"  
    }

    const options = {
      url: "shift/createShift",
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
      data: {
        userId: currentId,
        comment: comment,
        start: date,
        end: date,
        requestApprovalStatus: 'Unapproved',
        offApprovalStatus: offAprovalStat,
        shiftTypeId: shiftTypeId,
        swapable: swapable
      },
    };
    axios(options)
    .then((res) => {
      alert("Shift Created Successfully");
      window.location.reload();
    })
    .catch((err)=> {
      console.log('Failed to make user event')
    })
  }
  
  const handleOk = (e) => {
    setVisible(false);
  let tempArray = []
    axios.get("shift/currentShifts")
    .then((res) => {
      
      console.log(res.data.shifts)
      for(let i = 0 ; i < res.data.shifts.length ; i++){
        if(res.data.shifts[i].shiftname === "Off"){
            tempArray.push(res.data.shifts[i])
        }
      }
      getAndSetOffStatus(tempArray);
        console.log(tempArray.length)
        console.log(tempArray)
    })
    .catch((err) => {
      console.log('Failed to get and set current date off events from database');
    })
    
  };
  const handleCancel = (e) => {
    setVisible(false);
  };

  const handelSelect = (e) => {
    if (e.target.value === "All Shifts") {
      axios.get("shift/currentShifts").then((res) => {
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
        .get("shift/currentUserShifts/"+currentId)
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
        .get("shift/currentUserOffShifts/"+currentId)
        .then((res) => {
          
          if (res.data !== null) {
            setEvents(res.data);
          } else {
            setEvents([]);
          }
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
  };

  useEffect(() => {
    axios.get("shift/currentShifts").then((res) => {
      let temp1 = []
      let temp2 = []
      let count = 0;
      console.log(off.length)
      let temp = []
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
        }else{
          temp2.push(res.data.shifts[i])
        }
      }

      temp = [...temp1,...temp2]
      console.log(temp)  
    setEvents(temp);
    });
    const options = {
      url: "shift/getshifts",
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
  }, [visible]);
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
  const handleEventClick = ({ event, el }) => {
    date = new Date().toISOString().slice(0,10);
    console.log(event)
    name = event.title.substring(event.title.indexOf(":") + 1)
    sName = event.title.substring(0, event.title.indexOf(':'))
    day = new Date(event.startStr).toLocaleString('default', { month: 'short', day: 'numeric', year: 'numeric' })
    if(event.startStr >= date){
      if(event._def.extendedProps.userId !== currentId){
        settingEvent(event._def.extendedProps)
      }else{
        setAdminCheck(true)
      }
    }else{
      setFailexchangeVisible(true)
    }
    
    // console.log(event.startStr)
  };
    const passNotification = () => {
        const userId1 = oneEvent.userId;
        const shiftId1 = oneEvent._id;
        let userId2 = currentId
        // let shiftId2 = id2.substring(0, id2.indexOf(':'));
        let date = new Date().toISOString().slice(0,10);
        const message = "One of the User wants to swap his shift with you. Click for the details"
        const requester ="User"
        const currentUserId = currentId;
        const messageFrom = "Your request has been sent. Wait for the Response"
        const requestStatus = "true"
        let shiftName=""
        console.log(userId1,userId2,shiftId1)

        if(oneEvent.start <= date){
          setFailexchangeVisible(true);
        }else{
          axios.get("shift/getShiftName/"+shiftId1)
        .then((res) => {
          shiftName = res.data.shiftname
          axios.post("user/userNotification",{
            currentUserId,
            userId1,
            userId2,
            shiftId1,
            message,
            messageFrom,
            date,
            requester,
            requestStatus,
            shiftName
        })
        .then((res) => {
            console.log(res.data);
            window.location.reload()
        })
        .catch((err) => {
          console.log(err.response);
        });
        })
        .catch((err) => {
          console.log(err)
        })
        }
    
  }
  return (
    <div>
        <div className="container-fluid">
           <div className="row">
           <select
              id="cars"
              name="cars"
              className="custom-select bg-light m-2 shadow-sm float-right w-25"
              onChange={handelSelect}
            >
              <option value="All Shifts">View All </option>
              <option value="Off">My Off's Only </option>
              <option value="My Shifts">My Shifts Only</option>
              {filderedData.map((dat) => (
              <option value={dat._id} key={dat._id}>
                {/* Shifts without {' '}{dat.shiftname} */}
                Shifts Only
              </option>
            ))}
              {/* <option value="Shifts Offered">Shifts Offered </option> */}
              
            </select>
          </div>
           </div>
        <br/>
        <FullCalendar
          defaultView="dayGridMonth"
          plugins={[dayGridPlugin, interactionPlugin]}
          events={events}
          titleFormat={{ month: 'long' ,year: 'numeric' }}
          headerToolbar={{
            left: '',
            end:'',
            center:  'prev,title,next'
          }}
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
                    title="Swap Request Failed"
                    visible={adminCheck}
                    maskClosable={true}
                    onCancel={() => setAdminCheck(false)}
                    footer={[
                      <Button key="1" onClick={() => setAdminCheck(false)}>Cancel</Button>,
                      
                    ]}
                  >
                    <div>
                    <Card type="inner">
                        You can't request your own shift
                    </Card>
                  </div></Modal>




                  <Modal
                    title="Confirm Request"
                    visible={exchangeVisible}
                    maskClosable={true}
                    onCancel={() => setexchangeVisible(false)}
                    footer={[
                      <Button key="1" onClick={() => setexchangeVisible(false)}>Cancel</Button>,
                      <Button onClick={passNotification} key="2" type="primary">
                        Confirm
                      </Button>
                    ]}
                  >
                    <div>
                      <Card type="inner">
                          Please confirm to send swap request for <b>{name}</b>{','} <b>{day}</b>  {' '}{' '}<br/> <b>{sName}</b>{' '} call
                      </Card>
                    </div>
                  </Modal>
                  <Modal
                    title="Choose current date"
                    visible={dateVisible}
                    maskClosable={true}
                    onCancel={() => setDateVisible(false)}
                    footer={[
                      <Button key="1" type="primary" onClick={() => setDateVisible(false)}>Ok</Button>,
                      
                    ]}
                  >
                    <div>
                    <Card type="inner">
                        Please click on current date or future dates to create event
                    </Card>
                  </div></Modal>
                  <Modal
                    title="Swapped Request Failed"
                    visible={failexchangeVisible}
                    onCancel={() => setFailexchangeVisible(false)}
                    maskClosable={true}
                    footer={[
                      <Button type="primary" key="1" onClick={() => setFailexchangeVisible(false)}>Cancel</Button>,
                    ]}
                  >
                    <div>
                    <Card type="inner">
                      Please choose current dates or dates in the future to send swapping request
                    </Card>
                  </div>
                
                  </Modal>
    </div>
  );
};

export default ShiftsCalendar;
