import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Table, Button, Row, Col, Input, Switch, Form } from 'antd';
import { Link } from 'react-router-dom';
import Register from './Register';

const NotificationEmail = () => {
	const [result, setResult] = useState();
	const [targetShift, setTargetShift] = useState('');
	const [visible, setVisible] = useState(false);
	const [editVisible, setEditVisible] = useState(false);
	const [delVisible, setDelVisible] = useState(false);
	const [defined, setDefined] = useState({});
	const [error, setError] = React.useState(' ');
	const [fields, setFields] = React.useState([
		// {
		//   name: ["editable"],
		//   value: false,
		// },
		{
			name: ['color'],
			value: '#ab12ac',
		},
	]);
	const [form] = Form.useForm();

	const onFinish = (values) => {
		const { email } = values;
		console.log(values);
		setError('');
		axios
			.post('notificationEmail/createEmail', {
				email,
			})
			.then((res) => {
				setVisible(false);
				// console.log(res.data);
				window.location.reload();
			})
			.catch((err) => {
				console.log(err.response);
				setError(err.response.data);
			});
		console.log('Received values for register are: ', values);
	};

	const getRequiredValues = (data) => {
		let temp = [];
		for (let i = 0; i < data.length; i++) {
			temp.push({
				key: data[i]._id,
				email: data[i].email,
				_id: data[i]._id,
				action: (
					<div>
						<i
							className='fa fa-edit'
							id={data[i]._id}
							onClick={(e) => {
								console.log(data[i], i);
								setDefined(data[i]);

								setTargetShift(e.target.id);
							}}
							style={{ fontSize: '18px', cursor: 'pointer' }}></i>
						&nbsp;&nbsp;
						<i
							className='fa fa-trash-o'
							id={data[i]._id}
							onClick={(e) => {
								setDelVisible(true);
								setTargetShift(e.target.id);
							}}
							style={{ fontSize: '18px', cursor: 'pointer' }}></i>
					</div>
				),
			});
		}
		console.log(temp);
		return temp;
	};

	const callingEditModal = (userObj) => {
		setEditVisible(true);
	};
	useEffect(() => {
		if (defined._id !== undefined) {
			callingEditModal(defined);
		}
		console.log(defined._id);
	}, [defined]);

	useEffect(() => {
		axios.get('notificationEmail/getEmails').then((response) => {
			setResult(getRequiredValues(response.data));
		});
	}, []);

	const deleteUser = () => {
		axios.delete('notificationEmail/deleteEmail/' + targetShift, { params: { id: targetShift } }).then((response) => {
			setDelVisible(false);
			window.location.reload();
		});
	};

	// const editUser=()=>{

	// }

	const columns = [
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'username',
		},
		{
			title: 'Action',
			dataIndex: 'action',
			key: 'action',
		},
	];

	return (
		<div className='container pt-5'>
			<Button type='primary' onClick={() => setVisible(true)}>
				<div className='row'>
					<div className='col-1'>
						<i class='fa fa-plus-circle'></i>
					</div>

					<div className='col-8'>Add Email</div>
				</div>
			</Button>
			<br />
			<br />
			<Table dataSource={result} columns={columns} />;{/* Register New User */}
			<Modal title='Create a new Email' maskClosable={true} onCancel={() => setVisible(false)} visible={visible} footer={false}>
				<Form form={form} fields={fields} name='register' onFinish={onFinish} className='register-form p-2 bg-white'>
					<Form.Item
						name='email'
						rules={[
							{
								required: true,
								message: 'Please input valid email!',
								whitespace: true,
							},
						]}>
						<Input placeholder='Email' />
					</Form.Item>

					<label className='text-danger'>{error.email}</label>
					<Row>
						<Col span={2}></Col>
						<Col span={11}>
							<Form.Item>
								<Button className='w-100' type='primary' htmlType='submit'>
									<p>Add</p>
								</Button>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Modal>
			{/* Edit User */}
			<Modal title='Edit Email' maskClosable={true} onCancel={() => window.location.reload()} visible={editVisible} footer={false}>
				<Register setEditVisible={(val) => setEditVisible(val)} isEdit={true} id={targetShift} userObj={defined} />
			</Modal>
			{/* Delete User */}
			<Modal title='Warning' maskClosable={true} onCancel={() => setDelVisible(false)} onOk={deleteUser} visible={delVisible}>
				<p>Are you sure delete this email?</p>
			</Modal>
		</div>
	);
};

export default NotificationEmail;
