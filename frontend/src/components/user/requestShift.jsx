import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Table, Button } from "antd";
import jwt_decode from 'jwt-decode'
import { Switch } from "antd";

const OffShifts = () => { 
	const [result, setResult] = useState();
	 const [visible, setVisible] = useState(false);
	 const [delvisible, setDelVisible] = useState(false);
	const getRequiredTrueValues = (data) => {
		let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
				key: data[i]._id,
				title: data[i].title,
                startdate: data[i].start,
                enddate: data[i].end,
                color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
			    status: data[i].offApprovalStatus,
			});
		}
		return temp;
	};

	const getRequiredFalseValues = (data) => {
		let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
				key: data[i]._id,
				title: data[i].title,
                startdate: data[i].start,
                enddate: data[i].end,
                color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
				status: data[i].offApprovalStatus,
				action: (
					<div>
						<i
							className="fa fa-trash-o"
							id={data[i]._id}
							onClick={(e) => {
								axios
								.delete("shift/deleteMyshift/"+e.target.id)
								.then((response) => {
									window.location.reload()
								});
							}}
							style={{ fontSize: "18px", cursor: "pointer", color: "red" }}
						></i>
					</div>
				)
			});
		}
		return temp;
	};
	
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    const currentId = decoded.id
  

    useEffect(() => {
		axios
        .get("shift/currentUserShifts/"+currentId)
        .then((res) => {
			
			var off = [];
			for(let i = 0 ; i < res.data.length ; i++){
				if(res.data[i].shiftname === 'Request'){
					off.push(res.data[i]);
					console.log(res.data[i])
				}
			}
			  
			 setResult(getRequiredFalseValues(off));
        });
	}, [visible]);

    const columns = [
		{
			title: "Title",
			dataIndex: "title",
			key: "title",
		},
		{
			title: "Color",
			dataIndex: "color",
			key: "color",
        },
        {
			title: "Start Date",
			dataIndex: "startdate",
			key: "stardate",
			
        },
        {
			title: "End Date",
			dataIndex: "enddate",
			key: "enddate",
			
        },
        {
			title: "Status",
			dataIndex: "status",
			key: "status",
		},
        {
			title: "Action",
			dataIndex: "action",
			key: "action",
		}
    ];
    
    return (
        <div className="container pt-5">
            <h4 className="text-center">My Requested Shifts</h4>
			<br />
			<br />
            <Table dataSource={result} columns={columns} />;{/* Register New User */}

            <Modal
				title="Turn Swap On or Off"
				maskClosable={true}
				onCancel={() => setVisible(false)}
				visible={visible}
				footer={false}
			>
				<Switch
		             defaultChecked = {false}
                    checkedChildren="Swapable"
                    unCheckedChildren="Unswapable"
                    size="large"
                />
			</Modal>
        </div>
    )
}
export default OffShifts;
// 	if(flag === 'true'){
	// 		axios
	// 		.get("shift/restrict-swap/"+id+'/'+'false')
	// 		.then((res) => {
	// 			setResult(getRequiredValues(res.data))
			
	// 		});
	// 	}else if(flag === 'false'){
	// 		axios
	// 		.get("shift/restrict-swap/"+id+'/'+'true')
	// 		.then((res) => {
	// 			setResult(getRequiredValues(res.data))
			
	// 		});
		
	//   }