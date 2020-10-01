import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
// import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Modal, Table, Popconfirm } from "antd";

import Register from "./Register";

const ManageUsers = () => {
	const [result, setResult] = useState();
	const [targetUser, setTargetUser] = useState("");
	const [visible, setVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [delVisible, setDelVisible] = useState(false);

	const getRequiredValues = (data) => {
		let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
				key: data[i]._id,
				username: data[i].username,
				firstName: data[i].firstName,
				lastName: data[i].lastName,
				email: data[i].email,
				type: data[i].type,
				partener: data[i].partener,
				regDate: data[i].regDate,
				action: (
					<div>
						<i
							className="fa fa-edit"
							id={data[i]._id}
							onClick={(e) => {
								setEditVisible(true);
								setTargetUser(e.target.id);
							}}
							style={{ fontSize: "18px", cursor: "pointer" }}
						></i>
						&nbsp;&nbsp;
						<i
							className="fa fa-trash-o"
							id={data[i]._id}
							onClick={(e) => {
								setDelVisible(true);
								setTargetUser(e.target.id);
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
		axios.get("http://localhost:4000/api/user/getusers").then((response1) => {
			
				console.log("res1 = ", response1);
				setResult(response1.data);
			});

		// axios.get("http://localhost:4000/api/admin/getadmins").then((response) => {
		// 	setResult(result.concat(getRequiredValues(response.data)));
		// });
	}, [visible, editVisible, delVisible]);

	const requestBody = {
		whatEver: "to-send",
	};

	var config = {};
	config.data = requestBody;

	const deleteUser = () => {
		axios
			.delete("http://localhost:4000/api/user/deleteuser", {
				params: { id: targetUser },
			})
			.then((response) => {
				console.log(response.data);
			});
		setDelVisible(false);
	};

	// const editUser=()=>{

	// }

	const columns = [
		{
			title: "UserName",
			dataIndex: "username",
			key: "username",
		},
		{
			title: "First Name",
			dataIndex: "firstName",
			key: "firstName",
		},
		{
			title: "Last Name",
			dataIndex: "lastName",
			key: "lastName",
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Partener",
			dataIndex: "partener",
			key: "partener",
		},
		{
			title: "Reg Date",
			dataIndex: "regDate",
			key: "regDate",
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
				+ Add New User
			</button>
			<br />
			<br />
			<Table dataSource={result} columns={columns} />;{/* Register New User */}
			<Modal
				title="Create New User"
				maskClosable={true}
				onCancel={() => setVisible(false)}
				visible={visible}
				footer={false}
			>
				<Register setVisible={(val) => setVisible(val)} isEdit={false} id={0} />
			</Modal>
			{/* Edit User */}
			<Modal
				title="Edit User"
				maskClosable={true}
				onCancel={() => setEditVisible(false)}
				visible={editVisible}
				footer={false}
			>
				<Register  setEditVisible={(val) => setEditVisible(val)} isEdit={true} id={targetUser} />
			</Modal>
			{/* Delete User */}
			<Modal
				title="Warning"
				maskClosable={true}
				onCancel={() => setDelVisible(false)}
				onOk={deleteUser}
				visible={delVisible}
			>
				<p>Are you sure delete this user?</p>
			</Modal>
		</div>
	);
};

export default ManageUsers;
