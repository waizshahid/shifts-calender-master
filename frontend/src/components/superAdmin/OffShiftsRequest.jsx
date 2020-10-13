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
        for (var i = 0; i < data.length; i++) {
			   if(data[i].status === 'Approved'){
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
                            //    console.log('Status Changing Id: '+e.target.id)
                                axios.get("http://localhost:4000/api/shift/updateApprovalStatustoFalse/"+e.target.id)
                                .then((res) => {
                                    console.log('Shift status changed to unapproved')
                                    window.location.reload();
                                })
                                .catch((err) => {
                                    console.log('Error updating shift status')
                                })
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
                                        axios.get("http://localhost:4000/api/shift/updateApprovalStatustoTrue/"+e.target.id)
                                        .then((res) => {
                                            console.log('Shift status changed to Approved')
                                            window.location.reload();
                                        })
                                        .catch((err) => {
                                            console.log('Error updating shift status')
                                        })
                                    }}
                                    style={{color: "red", fontSize: "30px", cursor: "pointer" }}
                                ></i>   
                            </div>
                        )
                    });
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
                    status: 
                    (
                      <div>
                            {
                                data[i].offApprovalStatus === 'Approved'
                            ?
                            <div>
                                <i
                                className="fa fa-toggle-on"
                                id={data[i]._id}
                                onClick={(e) => {
                                //    console.log('Status Changing Id: '+e.target.id)
                                    axios.get("http://localhost:4000/api/shift/updateApprovalStatustoFalse/"+e.target.id)
                                    .then((res) => {
                                        console.log('Shift status changed to unapproved')
                                        window.location.reload();
                                    })
                                    .catch((err) => {
                                        console.log('Error updating shift status')
                                    })
                                }}
                                style={{ fontSize: "20px", cursor: "pointer", color: "grey" }}
                            ></i>
                            </div>    
                            :
                            <i
                                    className="fa fa-toggle-off"
                                    id={data[i]._id}
                                    onClick={(e) => {
                                        axios.get("http://localhost:4000/api/shift/updateApprovalStatustoTrue/"+e.target.id)
                                        .then((res) => {
                                            console.log('Shift status changed to Approved')
                                            window.location.reload();
                                        })
                                        .catch((err) => {
                                            console.log('Error updating shift status')
                                        })
                                    }}
                                    style={{ fontSize: "20px", cursor: "pointer", color: "lightgrey" }}
                                ></i>
                            }
                      </div>
                    )
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
			title: "Off Shift",
			dataIndex: "status",
			key: "status",
		},
		
	];

	return (
		<div className="container pt-5">
            <Table dataSource={result} columns={columns} />;
		</div>
	);
};

export default OffShiftsRequest;
