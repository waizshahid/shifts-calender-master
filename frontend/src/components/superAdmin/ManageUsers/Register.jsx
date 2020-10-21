import React from "react";
import "antd/dist/antd.css";
import "../../../css/Register.css";
import { Form, Input, Button, Select, Radio, Row, Col, Modal } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const Register = ({ setVisible, setEditVisible, isEdit, id, userObj }) => {
	const [error, setError] = React.useState(" ");
	const [success, setEditSuccess] = React.useState(false)
	const [fields, setFields] = React.useState([
		{
		  name: ["firstName"],
		  value: userObj.firstName,
		},
		{
			name: ["lastName"],
			value: userObj.lastName,
		},
		{
			name: ["username"],
			value: userObj.username,
		},
		{
			name: ["email"],
			value: userObj.email,
		},
		{
			name: ["partener"],
			value: userObj.partener,
		},
		{
			name: ["pass"],
			value: '',
		},
		{
			name: ["confirm"],
			value: '',
		},
		{
			name: ["person"],
			value: userObj.person,
		},
		
	  ]);

	const [form] = Form.useForm();
	const onFinish = (values) => {
		const { email, firstName, lastName, username, partener, pass, person } = values;
		console.log("person = ", person);
		setError("");
		//Student registered
		if (isEdit) {
			setEditVisible(false);
			setEditSuccess(true)
			console.log(id)
			axios
				.put("user/updateuser", {
					id,
					newData: { email, firstName, lastName, username, partener, pass, person },
				})
				.then((res) => {
				
					console.log(res.data);
				})
				.catch((err) => {
					console.log(err.response);
					setError(err.response.data);
				});
		} else {
			axios
				.post("userauth/register", {
					email,
					username,
					firstName,
					lastName,
					partener,
					pass,
					person,
				})
				.then((res) => {
					setVisible(false);
					console.log(res.data);
				})
				.catch((err) => {
					console.log(err.response);
					setError(err.response.data);
				});
		}
		console.log("Received values of form: ", values);
	};

	return (
		<div className="p-0">
			<Modal
                  title="Profile Updated Successfully"
                  visible={success}
                  maskClosable={true}
                  onCancel={() => setEditSuccess(false)}
                  // onOk={handleOk}
                  footer={[
					  <Button key="1" onClick={() => window.location.reload()}> OK </Button>
				  ]}
                >
                  <b style={{
					  color: '#5cb85c'
				  }}>
					  Profile has been updated successfully
				  </b>
              </Modal>
			<Form
				form={form}
				name="register"
				fields={fields}
				onFinish={onFinish}
				className="register-form p-2 bg-white"
			>
				<Row>
					<Col span={11}>
						<Form.Item
							name="firstName"
							rules={[
								{
									required: true,
									message: "Please input your First name!",
									whitespace: true,
								},
							]}
						>
							<Input placeholder="First Name" />
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={11}>
						<Form.Item
							name="lastName"
							rules={[
								{
									required: true,
									message: "Please input your Last name!",
									whitespace: true,
								},
							]}
						>
							<Input placeholder="Last Name" />
						</Form.Item>
					</Col>
				</Row>
				<Form.Item
					name="username"
					rules={[
						{
							required: true,
							message: "Please input your User name!",
							whitespace: true,
						},
					]}
				>
					<Input placeholder="User Name" />
				</Form.Item>
				<Form.Item
					name="email"
					rules={[
						{
							type: "email",
							message: "The input is not valid E-mail!",
						},
						{
							required: true,
							message: "Please input your E-mail!",
						},
					]}
				>
					<Input placeholder="E-mail" />
				</Form.Item>

				<Form.Item
					name="partener"
					hasFeedback
					rules={[
						{
							required: true,
							message: "Please select your partener!",
						},
					]}
				>
					<Select placeholder="Partener">
						<Option value="yes">Yes</Option>
						<Option value="no">No</Option>
					</Select>
				</Form.Item>

				<Row>
					<Col span={11}>
						<Form.Item
							name="pass"
							rules={[
								{
									required: true,
									min: 6,
									message: "Please enter atleast 6 characters!",
								},
							]}
							hasFeedback
						>
							<Input.Password placeholder="Password" />
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={11}>
						<Form.Item
							name="confirm"
							dependencies={["pass"]}
							hasFeedback
							rules={[
								{
									required: true,
									message: "Please confirm your password!",
								},
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || getFieldValue("pass") === value) {
											return Promise.resolve();
										}

										return Promise.reject("The two passwords that you entered do not match!");
									},
								}),
							]}
						>
							<Input.Password placeholder="Confirm Password" />
						</Form.Item>
					</Col>
				</Row>

				<Form.Item
					name="person"
					rules={[
						{
							required: true,
							message: "Please select one!",
						},
					]}
				>
					<Radio.Group>
						<Radio value="admin">Admin</Radio>
						<Radio value="user">User</Radio>
					</Radio.Group>
				</Form.Item>

				<label>Use 6 or more characters with a mix of letters, numbers & symbols</label>
				<label className="text-danger">{error.email}</label>
				<Row>
					<Col span={11}>
						<Link to="/">Sign in instead</Link>
					</Col>
					<Col span={2}></Col>
					<Col span={11}>
						<Form.Item>
							<Button className="w-100" type="primary" htmlType="submit">
								{isEdit ? <p>Update</p> : <p>Register</p>}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default Register;
