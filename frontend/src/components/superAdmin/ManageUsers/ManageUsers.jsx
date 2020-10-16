import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Table, Button } from "antd";
import UploadUserExcel from './uploadUsersSheet'

import Register from "../../superAdmin/ManageUsers/Register";

const ManageUsers = () => {
	const [result, setResult] = useState();
	const [targetUser, setTargetUser] = useState("");
	const [visible, setVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [delVisible, setDelVisible] = useState(false);
	const [defined, setDefined] = useState({})
	const [emptyUser, setEmptyUser] = useState({
		firstName: '',
		lastName: '',
		email: '',
		username: '',
		person: '',
		pass: '',
		confirm: '',
		partener: ''
	})
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
								axios.get("user/getUserDetail/"+e.target.id) 
								.then((resp) => {
									setDefined(resp.data)
									
								})
								
								// setTargetUser(e.target.id);
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
							style={{ fontSize: "18px", cursor: "pointer"}}
						></i>
					</div>
				),
			});
		}
		return temp;
	};
	const callingEditModal = (userObj) => {
		setEditVisible(true)
	}
	useEffect(() => {
		// if(defined === undefined){
		// 	// setEditVisible(true);
		// }
		// setDelVisible(true)
		if(defined._id !== undefined){
			callingEditModal(defined)
		}
		console.log(defined._id)
	}, [defined]);
	useEffect(() => {
		axios.get("user/getusers").then((response1) => {
			
				console.log("res1 = ", response1);
				setResult(getRequiredValues(response1.data));
			});

	}, [visible, editVisible, delVisible]);

	const requestBody = {
		whatEver: "to-send",
	};

	var config = {};
	config.data = requestBody;

	const deleteUser = () => {
		console.log(targetUser)
		axios.get("user/deleteShiftForOneUser/"+targetUser)
			.then((res) => {
				console.log(res)
				axios.delete("user/deleteuser", {
					params: { id: targetUser },
				})
				.then((response) => {
					setDelVisible(false);
				})
				.catch((err) => {
					console.log(err)
				})
				// setDelVisible(false);
			})	
			.catch((err)=>{
				console.log(err)
			})
		

		
		// /deleteShiftForOneUser
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
			<div className="row">
				<div className="col-6">
					
					<Button type="default" onClick={() => setVisible(true)}>
					<div className="row">
						<div className="col-1">
						<i class="fa fa-user-plus" aria-hidden="true"></i>
						</div>
						<div className="col-8">
							Create New User      
						</div>
					</div>
					</Button>
				</div>	
				<div className="col-6">
					<UploadUserExcel/>	
				</div>	
			</div>
			
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
				<Register setVisible={(val) => setVisible(val)} isEdit={false} id={0} userObj={emptyUser} />
			</Modal>
			{/* Edit User */}
			<Modal
				title="Edit User"
				maskClosable={true}
				onCancel={() => setEditVisible(false)}
				visible={editVisible}
				footer={false}
			>
				<Register  setEditVisible={(val) => setEditVisible(val)} isEdit={true} id={targetUser} userObj={defined} />
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
