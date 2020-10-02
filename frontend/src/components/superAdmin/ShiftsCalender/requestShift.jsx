
import React, { useState, useEffect } from "react";
import axios from'axios'
import { Table } from "antd";
const RequestShifts = () => {
    
    const [result, setResult] = useState();
    const getRequiredValues = (data) => {
        let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
                key: data[i]._id,
                title: data[i].title,
                startdate: data[i].start,
                enddate: data[i].end,
                action: (
                    // res.data.shifts[i].requestApproval
					<div>
						{
                            data[i].requestApproval === 'unapproval' ?
                            <div>
                                <i
							className="fa fa-toggle-off"
							id={data[i]._id}
							onClick={(e) => {
                                axios.get("http://localhost:4000/api/shift/updateRequestApproval/"+e.target.id)
                                .then((response) => {
                                    console.log(response)
                                    window.location.reload();
                                })
                                .catch((err) => {
                                    console.log(err);
                                })
							}}
							style={{ fontSize: "20px", cursor: "pointer", color: "lightgrey" }}
						></i>
                            </div>
                        :   <div>
                                <i
                                    className="fa fa-toggle-on"
                                    id={data[i]._id}
                                    onClick={(e) => {
                                        axios.get("http://localhost:4000/api/shift/updateRequestApproval/"+e.target.id)
                                        .then((response) => {
                                            console.log(response)
                                            window.location.reload();
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                        })
                                    }}
                                    style={{ fontSize: "20px", cursor: "pointer", color: "grey" }}
                                ></i>
                        </div>
                        }
					</div>
				),
			});
		}
		return temp;
    };

    useEffect(() => {
		axios.get("http://localhost:4000/api/shift/RequestEvents").then((res) => {
            let temp = []
            for(let i = 0 ; i < res.data.shifts.length ; i++){
                if(res.data.shifts[i] !== null){
                    temp.push(res.data.shifts[i])
                }
            }   
            setResult(getRequiredValues(temp));
                
        });
    }, []);

    
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
			title: "Action",
			dataIndex: "action",
            key: "action"
            
        }
    ];
    
    
    
    return (
        <div className="container">
            <h2 className="text-center">
                Super Admin Request Shifts
            </h2>
            <br/>
            <br/>
                <Table dataSource={result} columns={columns} />
                
        </div>
    )
}
export default RequestShifts;