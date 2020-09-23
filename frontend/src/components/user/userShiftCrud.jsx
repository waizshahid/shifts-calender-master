import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Table, Popconfirm } from "antd";
import Register from "../../components/superAdmin/ManageShiftTypes/Register"


const UserShiftCrud = () => {
    
    const [result, setResult] = useState();
	const [targetShift, setTargetShift] = useState("");
	const [visible, setVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
    const [delVisible, setDelVisible] = useState(false);
    
    const getRequiredValues = (data) => {
		let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
				key: data[i]._id,
				shifttitle: data[i].shiftname,
                color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
                editable: data[i].editable,
                action: (
					<div>
						<i
							className="fa fa-edit"
							id={data[i]._id}
							onClick={(e) => {
								setEditVisible(true);
								setTargetShift(e.target.id);
							}}
							style={{ fontSize: "18px", cursor: "pointer" }}
						></i>
						&nbsp;&nbsp;
						<i
							className="fa fa-trash-o"
							id={data[i]._id}
							onClick={(e) => {
								setDelVisible(true);
								setTargetShift(e.target.id);
							}}
							style={{ fontSize: "18px", cursor: "pointer", color: "red" }}
						></i>
					</div>
				),
			});
		}
		return temp;
    };
    
    const getDisabledValues = (data) => {
		let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
				key: data[i]._id,
				shifttitle: data[i].shiftname,
                color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
                editable: data[i].editable,
                action: (
					<div>
						<i
							className="fa fa-edit"
							style={{ fontSize: "18px", cursor: "pointer", color: "lightgrey" }}
						></i>
						&nbsp;&nbsp;
						<i
							className="fa fa-trash-o"
							style={{ fontSize: "18px", cursor: "pointer", color: "lightgrey" }}
						></i>
					</div>
				),
			});
		}
		return temp;
	};
   
    useEffect(() => {
		axios.get("http://localhost:4000/api/shift/getshifts").then((response) => {
            var disableArray = [];
            var enableArray = [];
            for(let i = 0 ; i < response.data.length; i++){
                if(response.data[i].editable === "enable"){
                    enableArray.push(response.data[i]);
                }else if(response.data[i].editable === "disable"){
                    disableArray.push(response.data[i]);
                }
            }

             var temp1 = [];
             temp1 = temp1.concat(getRequiredValues(enableArray));
             temp1 = temp1.concat(getDisabledValues(disableArray));
            
             setResult(temp1)
        // // if(response.data.editable === "enable"){
        //     for(let i = 0 ; i < response.data.length; i++){
        //         if(response.data[i].editable === "enable"){
        //             setResult(getRequiredValues(response.data[i]));
        //             //console.log('enable data gotten');
        //             console.log(response.data[0].editable);
        //         }
        //         // else{
        //         //     setResult(getDisabledValues(response.data));
        //         //     console.log('disable data gotten');
        //         //     console.log(response.data[0].editable);
        //         // }    
        //     }    
                
        //     // }
        //     // else{
        //     //     setResult(getDisabledValues(response.data));
        //     //     console.log("Exchange Shift data"+response.data);
            // }
		});
    }, [visible, editVisible, delVisible]);
    const deleteUser = () => {
		axios
			.delete("http://localhost:4000/api/shift/deleteshiftUser", { params: { id: targetShift } })
			.then((response) => {
				console.log(response.data);
			});
		setDelVisible(false);
	};
    const columns = [
		{
			title: "Shift title",
			dataIndex: "shifttitle",
			key: "shifttitle",
        },
        {
			title: "Color",
			dataIndex: "color",
			key: "color",
        },
        {
			title: "Editable",
			dataIndex: "editable",
			key: "editable",
        },
        {
			title: "Action",
			dataIndex: "action",
			key: "action",
        }
    ];
    return (
        <div className="container pt-5">
			{/* <button className="btn btn-outline-primary" onClick={() => setVisible(true)}>
				+ Add New Shift Type
			</button> */}
            <h2 className="text-center">
                User CRUD options
            </h2>
			<br />
			<br />
			<Table dataSource={result} columns={columns} />;{/* Register New User */}
			<Modal
				title="Create a new Shift Type"
				maskClosable={true}
				onCancel={() => setVisible(false)}
				visible={visible}
				footer={false}
			>
				<Register setVisible={(val) => setVisible(val)} isEdit={false} id={0} />
			</Modal>
			{/* Edit User */}
			<Modal
				title="Edit Shift"
				maskClosable={true}
				onCancel={() => setEditVisible(false)}
				visible={editVisible}
				footer={false}
			>
				<Register setEditVisible={(val) => setEditVisible(val)} isEdit={true} id={targetShift} />
			</Modal>
			{/* Delete User */}
			<Modal
				title="Warning"
				maskClosable={true}
				onCancel={() => setDelVisible(false)}
				onOk={deleteUser}
				visible={delVisible}
			>
				<p>Are you sure delete this shift type?</p>
			</Modal>
		</div>
    )
    
}
export default UserShiftCrud;