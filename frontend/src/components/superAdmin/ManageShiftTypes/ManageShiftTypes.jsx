import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
// import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Modal, Table, Popconfirm } from "antd";

import Register from "./Register";

const ManageShiftTypes = () => {
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
				shiftname: data[i].shiftname,
				color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
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

	useEffect(() => {
		axios.get("http://localhost:4000/api/shift/getshifts").then((response) => {
			setResult(getRequiredValues(response.data));
		});
	}, [visible, editVisible, delVisible]);

	const deleteUser = () => {
		axios
			.delete("http://localhost:4000/api/shift/deleteshift", { params: { id: targetShift } })
			.then((response) => {
				console.log(response.data);
			});
		setDelVisible(false);
	};

	// const editUser=()=>{

	// }

	const columns = [
		{
			title: "Shift Name",
			dataIndex: "shiftname",
			key: "username",
		},
		{
			title: "Color",
			dataIndex: "color",
			key: "color",
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
		},
	];

	return (
		<div className="container pt-5">
			<button className="btn btn-outline-primary" onClick={() => setVisible(true)}>
				+ Add New Shift Type
			</button>
			<br />
			<br />
			<Table dataSource={result} columns={columns} />;{/* Register New User */}
			<Modal
				title="Basic Modal"
				maskClosable={true}
				onCancel={() => setVisible(false)}
				visible={visible}
				footer={false}
			>
				<Register setVisible={(val) => setVisible(val)} isEdit={false} id={0} />
			</Modal>
			{/* Edit User */}
			<Modal
				title="Basic Modal"
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
	);
};

export default ManageShiftTypes;
