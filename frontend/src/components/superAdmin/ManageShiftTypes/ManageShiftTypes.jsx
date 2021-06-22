import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Table, Button, Row, Col, Input, Switch,Form } from "antd";
import { Link } from "react-router-dom";
import Register from "./Register";

const ManageShiftTypes = () => {
	const [result, setResult] = useState();
	const [targetShift, setTargetShift] = useState("");
	const [visible, setVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [delVisible, setDelVisible] = useState(false);
	const [defined, setDefined] = useState({})
	const [error, setError] = React.useState(" ");
	const [fields, setFields] = React.useState([
		{
		  name: ["editable"],
		  value: false,
		},
		{
			name: ["color"],
			value: "#ab12ac",
		  },
	  ]);
	  const [form] = Form.useForm();

	  const onFinish = (values) => {
		const { shiftname, color, editable, priority} = values;
		console.log(values)
		setError("");
			axios
				.post("shift/register", {
					shiftname,
					color,
					editable,
					priority
				})
				.then((res) => {
					setVisible(false);
					// console.log(res.data);
					window.location.reload()
				})
				.catch((err) => {
					console.log(err.response);
					setError(err.response.data);
				});
			console.log("Received values for register are: ", values);
	};

	const getRequiredValues = (data) => {
		let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
				key: data[i]._id,
				shiftname: data[i].shiftname,
				editable: data[i].editable,
				priority: data[i].priority,
				color: <div style={{ backgroundColor: data[i].color, width: "30px", height: "20px" }}></div>,
				action: (
					<div>
						<i
							className="fa fa-edit"
							id={data[i]._id}
							onClick={(e) => {
								axios.get("shift/getUserById/"+e.target.id) 
								.then((resp) => {
									setDefined(resp.data)
									// setTargetUser(data[i]._id)
								})
								
								setTargetShift(e.target.id);
							}}
							style={{ fontSize: "18px", cursor: "pointer" }}
						></i>
						{/* <i
							className="fa fa-edit"
							id={data[i]._id}
							onClick={(e) => {
								axios.get("shift/getUserById/"+e.target.id)
								.then((res) => {
									setUserObj(res.data)
								})
								.catch((err) =>{
									console.log(err)
								})
								setTargetShift(e.target.id)
							}}
							style={{ fontSize: "18px", cursor: "pointer" }}
						></i> */}
						&nbsp;&nbsp;
						<i
							className="fa fa-trash-o"
							id={data[i]._id}
							onClick={(e) => {
								setDelVisible(true);
								setTargetShift(e.target.id);
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
	// const callingEditModal = () => {
	// 	setEditVisible(true)
	// }
	// useEffect(() => {
		
	// 	console.log(userObj)
	// },[userObj])
	// useEffect(() => {
	// 	console.log(userObj)
	// 	if(userObj !== undefined){
	// 		callingEditModal(userObj)		
	// 	}
	// },[userObj])

	// useEffect(() => {
	// 	// console.log(targetShift)
	// 	axios.get("shift/getUserById/"+targetShift)
	// 	.then((res) => {
	// 		// console.log(targetShift)
	// 		setUserObj(res.data)
	// 		console.log(res.data)
	// 	})
	// 	.catch((err) =>{
	// 		console.log(err)
	// 	})
	// },[targetShift])

	useEffect(() => {
		axios.get("shift/getshifts").then((response) => {
			setResult(getRequiredValues(response.data));
		});
	}, []);

	const deleteUser = () => {
		axios
			.delete("shift/deleteshift", { params: { id: targetShift } })
			.then((response) => {
				setDelVisible(false);
				window.location.reload()
			});
		
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
			title: "Editable",
			dataIndex: "editable",
			key: "editable",
			// sorter: (a, b) => a.editable.localeCompare(b.editable),
		},
		{
			title: "Priority",
			dataIndex: "priority",
			key: "priority",
			// sorter: (a, b) => a.priority.localeCompare(b.priority),
		},
		{
			title: "Action",
			dataIndex: "action",
			key: "action",
		},
	];

	return (
		<div className="container pt-5">
			
				
				<Button type="primary"
				
				onClick={() => setVisible(true)}>
				<div className="row">
					<div className="col-1">
					<i class="fa fa-plus-circle"></i>
					</div>
				
				<div className="col-8">Create Shift Type</div>
				</div>
			</Button>
		
			
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
						<Form
						form={form}
						fields={fields}
						name="register"
						onFinish={onFinish}
						className="register-form p-2 bg-white"
					>
						<Form.Item
							name="shiftname"
							rules={[
								{
									required: true,
									message: "Please input your Shift name!",
									whitespace: true,
								},
							]}
						>
							<Input placeholder="Shift Name" />
						</Form.Item>
						<Form.Item
							name="color"
							rules={[
								{
									required: true,
									message: "Please input your Color !",
									whitespace: true,
								},
							]}
						>
							<Input type="color" placeholder="Color " />
						</Form.Item>
						
						<Row>
							<Col span={10}>
								<Form.Item
									name="priority"
									rules={[
										{
											required: true,
											message: "Please input your Shift Priority!",
										},
									]}
								>
									<Input min="0" type="number" placeholder="Shift Priority" />
								</Form.Item>
							</Col>
							<Col span={4}></Col>
							<Col span={10}>
									<Form.Item
									name="editable"
									>
									<Switch
										checkedChildren="Enabled Editable By User"
										unCheckedChildren="Disabled Editable By User"
										size="large"
									/>
								</Form.Item>
							</Col>
						</Row>
						

						<label className="text-danger">{error.email}</label>
						<Row>
							<Col span={11}>
								<Link to="/">Sign in instead</Link>
							</Col>
							<Col span={2}></Col>
							<Col span={11}>
								<Form.Item>
									<Button className="w-100" type="primary" htmlType="submit">
										<p>Register</p>
									</Button>
								</Form.Item>
							</Col>
						</Row>
					</Form>
			</Modal>
			{/* Edit User */}
			<Modal
				title="Edit Shift"
				maskClosable={true}
				onCancel={() => window.location.reload()}
				visible={editVisible}
				footer={false}
			>
				<Register setEditVisible={(val) => setEditVisible(val)} isEdit={true} id={targetShift}  userObj={defined} />
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
