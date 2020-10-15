import React from "react";
import "antd/dist/antd.css";
import "../css/Register.css";
import { Form, Input, Button, Select, Row, Col } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";

const { Option } = Select;

const Register = (props) => {
	const [error, setError] = React.useState(" ");

	const [form] = Form.useForm();
	const onFinish = (values) => {
		const { Gender, Email, UserName, NickName, Pass } = values;
		setError("");
		//Student registered
		axios
			.post("http://localhost:4000/api/students", {
				Gender,
				Email,
				UserName,
				NickName,
				Pass,
			})
			.then((res) => {
				console.log(res);
				props.history.push("/");
			})
			.catch((err) => {
				setError(err.response.data.error[0]);
				//console.log(err.response.data.error[0]);
			});

		console.log("Received values of form: ", values);
	};

	return (
		<div className="outer d-flex align-items-center justify-content-center">
			<Form
				form={form}
				name="register"
				onFinish={onFinish}
				className="register-form shadow-lg p-4 bg-white border border-dark rounded"
			>
				<h5 className="d-flex justify-content-center">Create your BrainBuster Account</h5>
				<br />
				<Form.Item
					name="UserName"
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
					name="Email"
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
							name="NickName"
							rules={[
								{
									required: true,
									message: "Please input your nickname!",
									whitespace: true,
								},
							]}
						>
							<Input placeholder="Nick Name" />
						</Form.Item>
					</Col>
					<Col span={2}></Col>
					<Col span={11}>
						<Form.Item
							name="Gender"
							rules={[
								{
									required: true,
									message: "Please select your gender!",
								},
							]}
						>
							<Select placeholder="Select gender">
								<Option value="M">male</Option>
								<Option value="F">female</Option>
							</Select>
						</Form.Item>
					</Col>
				</Row>
				<Row>
					<Col span={11}>
						<Form.Item
							name="Pass"
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
							dependencies={["Pass"]}
							hasFeedback
							rules={[
								{
									required: true,
									message: "Please confirm your password!",
								},
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || getFieldValue("Pass") === value) {
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
				<label className="text-danger">{error.msg}</label>
				<Row>
					<Col span={11}>
						<Link to="/">Sign in instead</Link>
					</Col>
					<Col span={2}></Col>
					<Col span={11}>
						<Form.Item>
							<Button className="w-100" type="primary" htmlType="submit">
								Register
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</div>
	);
};

export default Register;
