import React from "react";
import "antd/dist/antd.css";
import "../../../css/Register.css";
import { Form, Input, Button, Select, Row, Col, Switch } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";


const { Option } = Select;

const Register = ({ setVisible, setEditVisible, isEdit, id }) => {
	const [error, setError] = React.useState(" ");
	const [form] = Form.useForm();
	const onFinish = (values) => {
		const { shiftname, color, editable, priority} = values;
		setError("");
		//Student registered
		if (isEdit) {
			axios
				.put("http://localhost:4000/api/shift/updateshift", {
					id,
					newData: { 
						shiftname,
						color,
						editable,
						priority
					},
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
					editable,
					priority
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
	// const handleToggler = (e) => {
    //     setToggler(e.target.value);
    // };
	return (
		<div className="p-0">
			<Form
				form={form}
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
								//onChange={handleToggler}
								defaultChecked = {false}
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
