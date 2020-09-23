import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, DatePicker, Space , Button } from "antd";

import {
	EyeFilled
} from "@ant-design/icons";
const OffShiftsRequest = () => {
	const [result, setResult] = useState();
    function onChange(date, dateString) {
        console.log(dateString);
        axios.get("http://localhost:4000/api/shift/specificDateOffEvents/"+dateString).then((res) => {
            console.log(res.data.shifts)
            setResult(getRequiredValues(res.data.shifts));
      })
    }	
    function onClickAll() {
        axios.get("http://localhost:4000/api/shift/AllOffEvents").then((res) => {
            setResult(getRequiredValuesAll(res.data.shifts));
    })
    }	
	const getRequiredValues = (data) => {
        let temp = [];
        var count = 8;
		for (var i = 0; i < data.length; i++) {
			if(data[i] !== null){
                if(i < count && data[i].status === 'Approved'){
                    temp.push({
                        key: data[i]._id,
                        username: data[i].title,
                        start: data[i].start,
                        end: data[i].end,
                        shifttype: data[i].shifname,
                        color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
                        status: 
                        (
                            <div>
                                <i
							className="fa fa-toggle-on"
							id={data[i]._id}
							onClick={(e) => {
                                console.log('Status: '+e.target.status)
                                // data[i].status = 'Unapproved'
                                // count--;
                                console.log('Count after off'+count)
							}}
							style={{color: "grey", fontSize: "30px", cursor: "pointer" }}
					    ></i>
                            </div>
                        )
                    });
                }else{
                    temp.push({
                        key: data[i]._id,
                        username: data[i].title,
                        start: data[i].start,
                        end: data[i].end,
                        shifttype: data[i].shifname,
                        color: <div style={{ backgroundColor: 'red', width: "30px", height: "20px" }}></div>,
                        status: 
                        (
                            <div>
                                <i
                                    className="fa fa-toggle-off"
                                    id={data[i]._id}
                                    onClick={(e) => {
                                        data[i].status = 'Approved'
                                        // count++;
                                        console.log('Count after on'+count)
                                        
                                        
                                    }}
                                    style={{color: "red", fontSize: "30px", cursor: "pointer" }}
                                ></i>   
                            </div>
                        )
                    });
                }
            }
		}
		return temp;
    };

    const getRequiredValuesAll = (data) => {
        let temp = [];
		for (var i = 0; i < data.length; i++) {
			if(data[i] !== null){
                temp.push({
                    key: data[i]._id,
                    username: data[i].title,
                    start: data[i].start,
                    end: data[i].end,
                    shifttype: data[i].shifname,
                    color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
                });
            }
		}
		return temp;
    }
	useEffect(() => {
        axios.get("http://localhost:4000/api/shift/AllOffEvents").then((res) => {
            setResult(getRequiredValuesAll(res.data.shifts));
             
     });
	}, []);



	const columns = [
		{
			title: "UserName",
			dataIndex: "username",
			key: "username",
        },
        {
			title: "Shift Type",
			dataIndex: "shifttype",
			key: "shifttype",
        },
        {
			title: "Start Date",
			dataIndex: "start",
			key: "start",
        },
        {
			title: "End Date",
			dataIndex: "end",
			key: "end",
        },
        {
			title: "Color",
			dataIndex: "color",
			key: "color",
        },
        {
			title: "Approval",
			dataIndex: "status",
			key: "status",
		},
		
	];

	return (
		<div className="container pt-5">
            <Space direction="vertical">
                <DatePicker placeholder="Select off shifts" onChange={onChange}/>
            </Space><Button type="primary" icon={ <EyeFilled/> } onClick={onClickAll}> View All</Button>
            
            <br/>
            <br/>
            
			<Table dataSource={result} columns={columns} />;
		</div>
	);
};

export default OffShiftsRequest;
