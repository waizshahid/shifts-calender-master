import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Table, Button } from "antd";
import jwt_decode from 'jwt-decode'

  import { Switch } from "antd";
const RestrictSwappingUser = () => { 
	const [result, setResult] = useState();
	 const [visible, setVisible] = useState(false);
	const getRequiredTrueValues = (data) => {
		let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
				key: data[i]._id,
				title: data[i].title,
                startdate: data[i].start,
                enddate: data[i].end,
                swapable: data[i].swapable,
				color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
			    action: (
					<i
							className="fa fa-toggle-off"
							id={data[i]._id}
							onClick={(e) => {
								console.log('True value: '+e.target.id)
								axios.get("http://localhost:4000/api/shift/restrict-swap/"+e.target.id+'/'+'false').then((response) => {
									console.log(response.data);
									window.location.reload();
								});
							}}
							style={{color: "lightgrey", fontSize: "18px", cursor: "pointer" }}
					></i>
				),
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
                swapable: data[i].swapable,
				color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
			    action: (
					<i
							className="fa fa-toggle-on"
							id={data[i]._id}
							onClick={(e) => {
								console.log('False value: '+e.target.id)
								axios.get("http://localhost:4000/api/shift/restrict-swap/"+e.target.id+'/'+'true').then((response) => {
									console.log(response.data);
									window.location.reload();
								});
							}}
							style={{color: "grey", fontSize: "18px", cursor: "pointer" }}
					></i>
				),
			});
		}
		return temp;
	};
	
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    const currentId = decoded.id
  

	// const swapTofalse = (id) => {
	// 	console.log('swapTofalse: '+id)
	// }
	// const swapTotrue = (id) => {
	// 	console.log('swapTotrue: '+id)
	// }
	
	// function swapTofalse(id){
	// 	console.log('swapTofalse: '+id)
	// }
	// function swapTotrue(id){
	// 	console.log('swapTotrue: '+id)
	// }

	// function turnTrue(index,id){
	// 	console.log('Turn True'+turnFlag,targetShift);
	// 	// axios.get("http://localhost:4000/api/shift/restrict-swap/"+ +'true').then((response) => {
	// 	// 	setResult(getRequiredValues(response.data));
	// 	// });
	// }
	// function turnFalse(index,id){
	// 	console.log('Turn False'+index,id);
	// 	// axios.get("http://localhost:4000/api/shift/restrict-swap/"+ +'false').then((response) => {
	// 	// 	setResult(getRequiredValues(response.data));
	// 	// });
	// }

    useEffect(() => {
		axios
        .get("http://localhost:4000/api/shift/currentUserShifts/"+currentId)
        .then((res) => {
			var trueVal = [];
			var falseVal = [];
			for(let i = 0 ; i < res.data.length ; i++){
				if(res.data[i].swapable === 'true'){
					trueVal.push(res.data[i]);
					//console.log('Ran True');
					//setResult(getRequiredTrueValues(trueVal));
				}else{
					falseVal.push(res.data[i]);
					// console.log('Ran False');
					//setResult(getRequiredFalseValues(falseVal));
				}
			}
				//appendArray = trueVal.concat(falseVal);
			 var appendArray = getRequiredFalseValues(falseVal).concat(getRequiredTrueValues(trueVal)); 
			 setResult(appendArray);
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
			sorter: {
				compare: (a, b) => a.startdate - b.startdate,
				multiple: 3,
			  },
        },
        {
			title: "End Date",
			dataIndex: "enddate",
			key: "enddate",
			sorter: {
				compare: (a, b) => a.enddate - b.enddate,
				multiple: 2,
			  },
		},
		{
			title: "Swapable",
			dataIndex: "swapable",
			key: "swapable",
        },
        {
			title: "Restrict Swap",
			dataIndex: "action",
			key: "action",
		},

    ];
    
    return (
        <div className="container pt-5">
            <h4 className="text-center">Change swap permission</h4>
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
export default RestrictSwappingUser;
// 	if(flag === 'true'){
	// 		axios
	// 		.get("http://localhost:4000/api/shift/restrict-swap/"+id+'/'+'false')
	// 		.then((res) => {
	// 			setResult(getRequiredValues(res.data))
			
	// 		});
	// 	}else if(flag === 'false'){
	// 		axios
	// 		.get("http://localhost:4000/api/shift/restrict-swap/"+id+'/'+'true')
	// 		.then((res) => {
	// 			setResult(getRequiredValues(res.data))
			
	// 		});
		
	//   }