import React, { useState, useEffect } from "react";
import axios from'axios'
import { Modal, Table,DatePicker,Card, Button,Row,Col } from "antd";
import { Select } from 'antd';
import jwt_decode from 'jwt-decode'
const { Option } = Select;
const ExchangeShifts = () => {
    const [result, setResult] = useState();
    const [visible, setVisible] = useState(false);
    const [id1, setId1] = useState("");
    const [id2, setId2] = useState("");
    const [editVisible, setEditVisible] = useState(false);
    const [targetShift, setTargetShift] = useState("");
    const [data, setData] = useState([]);
    const [targetData, setTargetData] = useState([]);
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    const currentId = decoded.id
    const handelId1 = (e) => {
        setId1(e);
    };
    const handelId2 = (e) => {
        setId2(e);
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
        setData(trueSwapableArray);
      });
    }

    function onChangeTarget(date,dateString){
        console.log(dateString);
        axios.get("shift/specifictargetDateShifts/"+dateString+"/"+currentId)
        .then((res) => {
        var trueSwapableArray = [];
        for(let i = 0; i < res.data.shifts.length ; i++){
            if(res.data.shifts[i].swapable === 'true'){
                trueSwapableArray.push(res.data.shifts[i]);
            }
        }
        console.log(trueSwapableArray)
        setTargetData(trueSwapableArray);
      
      });
    }
    useEffect(() => {
		axios.get("shift/currentShifts").then((res) => {
               setResult(getRequiredValues(res.data.shifts));
                
        });
    }, [visible,editVisible]);

    

    const handleOk = (e) => {

        console.log('ID 1 HAI: '+id1);
        console.log('ID 2 HAI: '+id2);
        let userId1 = id1.substring(id1.indexOf(":") + 1)
        let userId2 = id2.substring(id2.indexOf(":") + 1)
        let shiftId1 = id1.substring(0, id1.indexOf(':'));
        let shiftId2 = id2.substring(0, id2.indexOf(':'));
        let date = new Date();
        const message = "One of the User wants to swap his shift with you. Click for the details"
        const requester ="User"
        const currentUserId = currentId;
        const messageFrom = "Your request has been sent. Wait for the Response"
        const requestStatus = "true"
        const adminresponse = "Two of the shifts has been swapped by the users"
        console.log('UserID 1 HAI: '+userId1);
        console.log('USERID 2 HAI: '+userId2);
        console.log('ShiftID 1 HAI: '+shiftId1);
        console.log('ShiftID 2 HAI: '+shiftId2);
        // axios.get("shift/swapShift/"+shiftId1+'/'+shiftId2)
        // .then((res) => {
        //     // console.log(res.data);
            axios.post("user/userNotification",{
                adminresponse,currentUserId,userId1,userId2,shiftId1,shiftId2,message,messageFrom,date,requester,requestStatus
            })
            .then((res) => {
                    console.log(res.data);
                    setVisible(false)
				})
				.catch((err) => {
					console.log(err.response);
				});
        //   })
        //   .catch((err) => {
        //       console.log(err)
        //   })
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
    
    const handleCancel = () =>{
        setVisible(false)
    }
    
    return (
        <div className="container">
            <h2 className="text-center">
                User Exchange Request
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
                    footer={null}
                >
                    <div>
                    <Card type="inner">
                    <b>Select Your Shift</b><br/>
                        <DatePicker placeholder="Select date to shift" style={{ width: 400 }} onChange={onChange}/><br/><br/>
                        <Select defaultValue="Select your shift" style={{ width: 400 }} onChange={handelId1}>
                            {data.map((dat) => (
                                <Option value={dat._id+':'+dat.userId} key={dat._id}>
                                    {dat.title+'  '+'('+dat.shifname+')'}
                                </Option>
                            ))}
                            
                            </Select>
                    </Card>
                        
                                          </div>
                    <div>
                        <br/>
                        <br/>
                    <Card type="inner">
                    <b>Select Shift to exchange</b><br/>
                        <DatePicker placeholder="Select date to shift" style={{ width: 400 }} onChange={onChangeTarget}/><br/><br/>
                        <Select defaultValue="Select Shift to exchange" style={{ width: 400 }} onChange={handelId2}>
                            {targetData.map((dat) => (
                                <Option value={dat._id+':'+dat.userId} key={dat._id}>
                                    {dat.title+'  '+'('+dat.shifname+')'}
                                </Option>
                            ))}
                            
                            </Select>
                    </Card>
                        
                                      </div>
                    <br/>
                    {/* <Button type="primary" onClick={handleOk}>
                        Request Swap
                    </Button> */}
                    <Row>
                        <Col><Button onClick={handleCancel}  size="large">
                        Cancel
                    </Button></Col>
                        <Col>
                        <Button type="primary" onClick={handleOk} size="large">
                        Request Swap
                    </Button></Col>
                    </Row>
                    
                    
                </Modal>
        </div>
    )
}
export default ExchangeShifts;