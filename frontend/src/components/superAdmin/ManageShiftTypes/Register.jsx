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
		const { shiftname, color } = values;
		setError("");
		//Student registered
		if (isEdit) {
			axios
				.put("http://localhost:4000/api/shift/updateshift", {
					id,
					newData: { shiftname, color },
				})
				.then((res) => {
					setEditVisible(false);
					console.log(res.data);
				})
				.catch((err) => {
					console.log(err.response);
					setError(err.response.data);
				});
		} else {
			axios
				.post("http://localhost:4000/api/shift/register", {
					shiftname,
					color,
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
			<Form
				form={form}
				name="register"
				onFinish={onFinish}
				className="register-form shadow-lg p-4 bg-white border border-dark rounded"
			>
				<h5 className="d-flex justify-content-center">Create New Shift Type</h5>
				<br />
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
