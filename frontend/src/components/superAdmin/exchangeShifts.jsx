
import React, { useState, useEffect } from "react";
import axios from'axios'
import { Modal, Table, DatePicker,Card } from "antd";
const ExchangeShifts = () => {
    const [result, setResult] = useState();
    const [visible, setVisible] = useState(false);
    const [id1, setId1] = useState("");
    const [id2, setId2] = useState("");
    const [dateFirst, setDateFirst] = useState([]);
    const [dateSecond, setDateSecond] = useState([]);
    const [editVisible, setEditVisible] = useState(false);
    const [targetShift, setTargetShift] = useState("");
    const [data, setData] = useState([]);
    const handelId1 = (e) => {
        setId1(e.target.value);
    };
    const handelId2 = (e) => {
        setId2(e.target.value);
    };


    const getRequiredValues = (data) => {
        let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
                key: data[i]._id,
                title: data[i].title,
                startdate: data[i].start,
                enddate: data[i].end,
                swapable: data[i].swapable,

			});
		}
		return temp;
    };
    function onChange(date, dateString) {
        console.log(dateString);
        axios.get("shift/AllspecificDateShifts/"+dateString)
        .then((res) => {
            var trueSwapableArray = [];
            for(let i = 0; i < res.data.shifts.length ; i++){
                if(res.data.shifts[i].swapable === 'true'){
                    trueSwapableArray.push(res.data.shifts[i]);
                }
            }
            console.log(res.data.shifts)
            setDateFirst(trueSwapableArray)
        })
        .catch((err) => {
            console.log(err)
        })
    }
    function onChange1(date, dateString) {
        console.log(dateString);
        axios.get("shift/AllspecificDateShifts/"+dateString)
        .then((res) => {
            var trueSwapableArray = [];
            for(let i = 0; i < res.data.shifts.length ; i++){
                if(res.data.shifts[i].swapable === 'true'){
                    trueSwapableArray.push(res.data.shifts[i]);
                }
            }
            console.log(res.data.shifts)
            setDateSecond(trueSwapableArray)
        })
        .catch((err) => {
            console.log(err)
        })
    }
    useEffect(() => {
		axios.get("shift/currentShifts").then((res) => {
               setResult(getRequiredValues(res.data.shifts));
                
        });
    }, [visible,editVisible]);

    axios.get("shift/currentShifts").then((res) => {
        var trueSwapableArray = [];
        for(let i = 0; i < res.data.shifts.length ; i++){
            if(res.data.shifts[i].swapable === 'true'){
                trueSwapableArray.push(res.data.shifts[i]);
            }
        }
        setData(trueSwapableArray);
      });

    const handleOk = (e) => {

        console.log('ID 1 HAI: '+id1);
        console.log('ID 2 HAI: '+id2);
        let userId1 = id1.substring(id1.indexOf(":") + 1)
        let userId2 = id2.substring(id2.indexOf(":") + 1)
        let shiftId1 = id1.substring(0, id1.indexOf(':'));
        let shiftId2 = id2.substring(0, id2.indexOf(':'));
        let date = new Date().toISOString().slice(0,10);
        const message = "Your shift has been swapped. Click for details"
        const requester = "Default"
        const adminresponse = "The requested shifts  has been swapped."    
        console.log('UserID 1 HAI: '+userId1);
        console.log('USERID 2 HAI: '+userId2);
        console.log('ShiftID 1 HAI: '+shiftId1);
        console.log('ShiftID 2 HAI: '+shiftId2);
        axios.get("shift/swapShift/"+shiftId1+'/'+shiftId2)
        .then((res) => {
            // console.log(res.data);
            axios.post("user/userNotification",{
                userId1,userId2,shiftId1,shiftId2,message,date,requester,adminresponse
            })
            .then((res) => {
                    console.log(res.data);
                    window.location.reload();
				})
				.catch((err) => {
					console.log(err.response);
				});
          })
          .catch((err) => {
              console.log(err)
          })
        //   window.location.reload();
    }
    const columns = [
        {
			title: "Current Id",
			dataIndex: "key",
            key: "key",
            
        },
        {
			title: "Shift title",
			dataIndex: "title",
            key: "title",
            sorter: {
                compare: (a, b) => a.title - b.title,
                multiple: 4,
            },
        },
        {
			title: "Start Date",
			dataIndex: "startdate",
            key: "startdate",
            sorter: {
                compare: (a, b) => a.startdate - b.startdate,
                multiple: 4,
            },
        },
        {
			title: "End Date",
			dataIndex: "enddate",
            key: "enddate",
            sorter: {
                compare: (a, b) => a.enddate - b.enddate,
                multiple: 4,
            },
        },
        {
			title: "Swapable",
			dataIndex: "swapable",
            key: "swapable",
            sorter: {
                compare: (a, b) => a.swapable - b.swapable,
                multiple: 4,
            },
        }
    ];
    
    
    
    return (
        <div className="container">
            <h2 className="text-center">
                Super Admin Exchange Shifts
            </h2>
            <button className="btn btn-outline-primary" onClick={() => setVisible(true)}>
				 Swap Shifts
			</button>
            <br/>
            <br/>
                <Table dataSource={result} columns={columns} />
                <Modal
                    title="Update Shifts"
                    visible={visible}
                    maskClosable={true}
                    onCancel={() => setVisible(false)}
                    onOk={handleOk}
                >
                    <Card type="inner" title="Shift 1 Credentials">
                    <DatePicker placeholder="Select Date" onChange={onChange}/>
                    <select
                        id="cars"
                        name="cars"
                        className="custom-select bg-light m-2 shadow-sm"
                        onChange={handelId1}
                        >
                        <option defaultValue="" id="assi">
                            Select Shift
                        </option>
                        {dateFirst.map((dat) => (
                            <option value={dat._id+':'+dat.userId} key={dat._id}>
                            {dat.title+' '+'('+dat.shifname+')'}
                        </option>
                        ))}
                    </select>
                    </Card>
                    <br/>
                    <br/>
                    <Card type="inner" title="Shift 2 Credentials">
                    <DatePicker placeholder="Select Date" onChange={onChange1}/>
                    <select
                        id="cars"
                        name="cars"
                        className="custom-select bg-light m-2 shadow-sm"
                        onChange={handelId2}
                        >
                        <option defaultValue="" id="assi">
                            Select Shift
                        </option>
                        {dateSecond.map((dat) => (
                            <option value={dat._id+':'+dat.userId} key={dat._id}>
                            {dat.title+' '+'('+dat.shifname+')'}
                        </option>
                        ))}
                    </select>
                    </Card>
                    <br/>
                    {/* <button className="btn btn-primary btn-sm" onSubmit={handleOk}>
                        Swap Shifts
                    </button> */}
                </Modal>
        </div>
    )
}
export default ExchangeShifts;