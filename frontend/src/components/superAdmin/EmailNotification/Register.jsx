import React, { useEffect, useState } from 'react';
import 'antd/dist/antd.css';
import '../../../css/Register.css';
import { Form, Input, Button, Modal, Row, Col, Switch } from 'antd';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setEditVisible, id, userObj }) => {
	const [error, setError] = useState(' ');
	const [failVisible, setFailVisible] = useState(false);
	const [success, setEditSuccess] = React.useState(false);
	const [fields, setFields] = useState([
		{
			name: ['email'],
			value: userObj.email,
		},
	]);

	const [form] = Form.useForm();
	const onFinish = (values) => {
		const { email } = values;
		console.log(values);

		setError('');
		axios
			.put('notificationEmail/updateEmail/' + id, {
				id,
				newData: {
					email,
				},
			})
			.then((res) => {
				console.log(res.data);
				setEditVisible(false);
				setEditSuccess(true);
			})
			.catch((err) => {
				console.log(err.response);
				setFailVisible(true);
			});
		// window.location.reload()

		console.log('Received values of form: ', values);
	};
	// const handleToggler = (e) => {
	//     setToggler(e.target.value);
	// };
	return (
		<div className='p-0'>
			<Modal
				title='Email Updated Successfully'
				visible={success}
				maskClosable={true}
				onCancel={() => window.location.reload()}
				// onOk={handleOk}
				footer={[
					<Button type='primary' key='1' onClick={() => window.location.reload()}>
						{' '}
						OK{' '}
					</Button>,
				]}>
				<b
					style={{
						color: '#5cb85c',
					}}>
					Email has been updated successfully
				</b>
			</Modal>
			<Form form={form} fields={fields} name='register' onFinish={onFinish} className='register-form p-2 bg-white'>
				<Form.Item
					name='email'
					rules={[
						{
							required: true,
							message: 'Please input your Shift name!',
							whitespace: true,
						},
					]}>
					<Input placeholder='Shift Name' />
				</Form.Item>

				<label className='text-danger'>{error.email}</label>
				<Row>
					<Col span={2}></Col>
					<Col span={11}>
						<Form.Item>
							<Button className='w-100' type='primary' htmlType='submit'>
								<p>Update</p>
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
			<div>
				<Modal
					title='email create failed'
					visible={failVisible}
					onCancel={() => setFailVisible(false)}
					footer={[
						<Button key='1' onClick={() => setFailVisible(false)}>
							Cancel
						</Button>,
					]}>
					<b
						style={{
							color: 'red',
						}}>
						The given credentials are already created or empty
					</b>
				</Modal>
			</div>
		</div>
	);
};

export default Register;
