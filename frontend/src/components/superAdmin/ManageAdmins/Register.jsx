import React from "react";
import "antd/dist/antd.css";
import "../../../css/Register.css";
import { Form, Input, Button, Select, Row, Col } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const Register = ({ setVisible, setEditVisible, isEdit, id }) => {
	const [error, setError] = React.useState(" ");

	const [form] = Form.useForm();
	const onFinish = (values) => {
		const { email, username, pass } = values;
		setError("");
		//Student registered
		if (isEdit) {
			axios
				.put("http://localhost:4000/api/admin/updateadmin", {
					id,
					newData: { email, username, pass },
				})
				.then((res) => {
					setEditVisible(false);
					console.log(res.data);
				})
				.catch((err) => {
					setError(err.response.data);
				});
		} else {
			axios
				.post("http://localhost:4000/api/adminauth/register", {
					email,
					username,
					pass,
				})
				.then((res) => {
					setVisible(false);
					console.log(res.data);
				})
				.catch((err) => {
					setError(err.response.data);
				});
		}
		console.log("Received values of form: ", values);
	};

	return (
		<div className="p-0">
			<Form
				form={form}
				name="register"
				onFinish={onFinish}
				className="register-form shadow-lg p-4 bg-white border border-dark rounded"
			>
				<h5 className="d-flex justify-content-center">Create New Admin</h5>
				<br />
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
								{isEdit ? <p>Register</p> : <p>Update</p>}
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default Register;
