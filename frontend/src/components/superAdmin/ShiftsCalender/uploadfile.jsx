import React, { Component } from 'react';
import { Button, Form, DatePicker } from 'antd';
import axios from 'axios';
import { OutTable, ExcelRenderer } from 'react-excel-renderer';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { Modal } from 'antd';
import ExportToExcel from './exportToExcel';
import FormItem from 'antd/lib/form/FormItem';
import moment from 'moment';
const { RangePicker } = DatePicker;
const rangeConfig = {
	rules: [
		{
			type: 'array',
			required: true,
			message: 'Please select time!',
		},
	],
};
class uploadfile extends Component {
	state = {
		file: null,
		types: '',
		startDate: '',
		endDate: '',
		offrequest: false,
		users: '',
		finalArray: '',
		error: false,
		downloadToExcel: false,
		dateRangeArray: [],
		exportExcelArr: [],
		excelHeading: [],
		visible: false,
		visibleFail: false,
		showDateRange: false,
		data: [
			{ Date: '01-01-2000', Banana: 10 },
			{ Date: '01-01-2000', Apple: 15 },
			{ Date: '01-01-2000', Orange: 20 },
			{ Date: '01-02-2000', Banana: 25 },
			{ Date: '01-02-2000', Apple: 30 },
			{ Date: '01-02-2000', Orange: 35 },
		],
	};
	componentDidMount = () => {
		axios.get('user/getusers').then((response1) => {
			console.log(response1.data);
			this.setState({ users: response1.data });
		});

		axios.get('shift/getshifts').then((response) => {
			let typeArr = [];
			response.data.map((resp) => {
				typeArr.push({ name: resp.shiftname, id: resp._id });
			});
			this.setState({ types: typeArr });
		});
		axios.get('shift/currentShifts').then((res) => {
			console.log(res.data.shifts);
		});
	};
	ExcelDateToJSDate = (serial) => {
		var utc_days = Math.floor(serial - 25568);
		var utc_value = utc_days * 86400;
		var date_info = new Date(utc_value * 1000);
		var fractional_day = serial - Math.floor(serial) + 0.0000001;
		var total_seconds = Math.floor(86400 * fractional_day);
		var seconds = total_seconds % 60;
		total_seconds -= seconds;
		var hours = Math.floor(total_seconds / (60 * 60));
		var minutes = Math.floor(total_seconds / 60) % 60;
		//	console.log(new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds))
		return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
	};


	onFileChange = (event) => {
		this.setState({ file: event.target.files[0] });
		let fileObj = event.target.files[0];

		//just pass the fileObj as parameter
		ExcelRenderer(fileObj, (err, resp) => {
			if (err) {
				console.log(err);
			} else {
				let newRows = [];

				console.log(resp.rows, resp.cols)
				resp.rows.map((rows, index) => {
					if (rows.length > 2) newRows.push(rows);
				});
				this.setState({
					cols: resp.cols,
					rows: newRows,
				});
				// console.log(resp.cols);
				console.log(newRows);
				this.UpdateExcel(newRows);
				let last;
				this.setState({ startDate: this.ExcelDateToJSDate(resp.rows[1][0]).toISOString().toString().slice(0, 10) });
				resp.rows.map((rows, index) => {

					if (rows.length > 2) last = index;
				});


				this.setState({ endDate: this.ExcelDateToJSDate(resp.rows[last][0]).toISOString().toString().slice(0, 10) });
			}
		});
	};

	UpdateExcel = (rows) => {
		// this.deletePreviousData();

		let shiftTitles = [];
		let shiftTitleIndex = [];
		console.log(this.state.types);

		console.log(rows);

		let newArr = [];
		rows.map((name, index) => {
			console.log(name);
			this.state.types.map((type) => {
				if (name[1] == type.name) {
					newArr.push(type);
					shiftTitleIndex.push(index);
				}
			});
		});
		console.log(JSON.stringify(newArr));     //types array
		console.log(shiftTitleIndex);
		let Arr = [];
		let Obj = {};
		// newArr.map((shift, index) => {
		// 	this.state.rows.map((row, index) => {
		// 		if (row[index] == shift.name)
		// 			this.state.rows.map((col, i) => {
		// 				if (i > 0) {
		// 					let JSdate = this.ExcelDateToJSDate(col[0]).toISOString().toString().slice(0, 10);
		// 					this.state.users.map((user) => {
		// 						if (col[index] !== undefined) {
		// 							//console.log("col[index]", col[index]);
		// 							if (col[index].split(' & ').length > 0) {
		// 								col[index]
		// 									.split(' & ')
		// 									.map((name) => name.trim())
		// 									.map((usr, id) => {
		// 										//	console.log(usr, id);
		// 										if (user.username === usr.toLowerCase()) {
		// 											console.log("===========", usr, shift, user)
		// 											Obj = { name: usr.toLowerCase(), userId: user._id, shiftTypeId: shift.id, start: JSdate, end: JSdate, swappable: true };
		// 											Arr.push(Obj);
		// 										}
		// 									});
		// 							} else {
		// 								console.log("in else")
		// 								if (user.username === col[index].toLowerCase()) {
		// 									Obj = { name: col[index].toLowerCase(), userId: user._id, shiftTypeId: shift.id, start: JSdate, end: JSdate, swappable: true };
		// 									Arr.push(Obj);
		// 								}
		// 							}
		// 						}
		// 					});
		// 				}
		// 			});
		// 	});
		// });
		for (let d = 0; d < this.state.rows.length; d++) {
			if (d > 0) {
				let JSdate = this.ExcelDateToJSDate(this.state.rows[d][0]).toISOString().toString().slice(0, 10);

				let user;
				let shift;

				for (let u = 0; u < this.state.users.length; u++) {
					if (this.state.users[u].username == this.state.rows[d][2]) {
						user = this.state.users[u]
					}
				}
				for (let s = 0; s < newArr.length; s++) {
					if (newArr[s].name == this.state.rows[d][1]) {
						shift = newArr[s]
					}
				}
				//console.log(user, shift, JSdate)
				Obj = { name: this.state.rows[d][2].toLowerCase(), userId: user._id, shiftTypeId: shift.id, start: JSdate, end: JSdate, swappable: true };
				Arr.push(Obj);
			}
		}
		console.log('Array to be pass to backend');
		console.log(Arr);
		this.setState({ finalArray: Arr });
	};

	Process = () => {
		let result = [];
		if (this.state.finalArray !== '') {
			console.log("in process", this.state.finalArray)
			for (let check = 0; check < this.state.finalArray.length; check++) {
				for (let check2 = 0; check2 < this.state.types.length; check2++) {
					if (this.state.finalArray[check].shiftTypeId == this.state.types[check2].id && this.state.types[check2].name == "Off") {
						result.push(this.state.finalArray[check])
					}
				}
				// result = this.state.types.find(shift => this.state.finalArray[check].shiftTypeId == shift.id && shift.name == "Off")
			}
			console.log(result)
			if (result.length > 1) {
				alert("Offs not allowed")
			}

			else {

				axios
					.get('shift/deleteEventsBetweenTwoDates/' + this.state.startDate + '/' + this.state.endDate)
					.then((response) => {
						console.log('response', response, this.state.finalArray);
						axios
							.post('shift/createShiftsFromExcel', this.state.finalArray)
							.then((res) => {
								this.setState({
									visible: true,
								});
							})
							.catch((err) => console.log('err2 ', err));
					})
					.catch((err) => console.log('err1', err));
			}


		}
		else {
			this.setState({
				visibleFail: true,
			});
		}
	};

	OffProcess = () => {
		let result = [];
		if (this.state.finalArray !== '') {
			console.log("in process", this.state.finalArray, this.state.types)
			for (let check = 0; check < this.state.finalArray.length; check++) {
				for (let check2 = 0; check2 < this.state.types.length; check2++) {
					if (this.state.finalArray[check].shiftTypeId == this.state.types[check2].id && this.state.types[check2].name == "Off") {
						result.push(this.state.finalArray[check])
					}
				}
				// result = this.state.types.find(shift => this.state.finalArray[check].shiftTypeId == shift.id && shift.name == "Off")
			}
			console.log(result)
			if (result.length > 1) {

				axios
					.get('shift/deleteEventsBetweenTwoDatesOffs/' + this.state.startDate + '/' + this.state.endDate)
					.then((response) => {
						console.log('response', response);
						axios
							.post('shift/createShiftsFromExcelOffs', this.state.finalArray)
							.then((res) => {
								this.setState({
									visible: true,
								});
							})
							.catch((err) => console.log(err));
					})
					.catch((err) => console.log('err', err));
			}

			else {

				alert("Only off can upload here")
			}

		} else {
			this.setState({
				visibleFail: true,
			});
		}
	};

	deletePreviousData = () => {
		axios
			.get('shift/deleteEventsBetweenTwoDates/' + this.state.startDate + '/' + this.state.endDate)
			.then((response) => {
				console.log('response', response);
			})
			.catch((err) => console.log('err', err));
	};
	handleCancel = (e) => {
		this.props.history.push(`/superadmin/shifts-calender`);
	};
	handleFailCancel = (e) => {
		console.log(e);
		this.setState({
			visibleFail: false,
		});
	};

	selectDate = (e) => {
		console.log(e);
		this.setState({
			showDateRange: true,
		});
	};
	JSDateToExcelDate(inDate) {
		var start = new Date('1899-12-30');
		return (inDate - start) / (1000 * 60 * 60 * 24);
		// let date = inDate.getDate() < 10 ? '0' + inDate.getDate() : inDate.getDate();
		// let month = inDate.getMonth() + 1 < 10 ? '0' + (inDate.getMonth() + 1) : inDate.getMonth() + 1;
		// return date + '/' + month + '/' + inDate.getFullYear();
	}

	callDateRangeEventforOffRequest = async (fieldsValue) => {
		// this.setState({
		//   showDateRange: false
		// })
		const rangeValue = fieldsValue['range-picker'];
		if (rangeValue === undefined) {
			this.setState({
				error: true,
			});
		}
		const values = {
			...fieldsValue,
			'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
		};
		// console.log('Received values of form: ', values);
		const start = rangeValue[0].format('YYYY-MM-DD');
		const end = rangeValue[1].format('YYYY-MM-DD');

		await axios
			.get('shift/getEventsBetweenTwoDates/' + start + '/' + end)
			.then((resp) => {
				//console.log(start, end);
				//console.log(resp.data.shifts.length, resp.data.shifts)

				let arr = []
				for (let i = 0; i < resp.data.shifts.length; i++) {
					if (resp.data.shifts[i] !== null && (resp.data.shifts[i].Off || resp.data.shifts[i].Request)) {
						//console.log(resp.data.shifts[i])
						arr.push(resp.data.shifts[i])
					}
				}
				//	console.log(arr)

				this.setState({
					dateRangeArray: arr,
				});

				// console.log(JSON.stringify(this.state.dateRangeArray))
				// console.log(this.state.data)
				// console.log(this.state.dateRangeArray);
				let shortArr = [];
				for (var i = 0; i < this.state.dateRangeArray.length; i++) {
					// console.log(this.state.dateRangeArray[i]);
					if (this.state.dateRangeArray[i]) {
						this.state.dateRangeArray[i].Date = this.JSDateToExcelDate(new Date(this.state.dateRangeArray[i].Date));
						//this.state.dateRangeArray[i].Date = this.state.dateRangeArray[i].Date.substring(0, this.state.dateRangeArray[i].Date.indexOf(','));
						shortArr.push(this.state.dateRangeArray[i]);
					}
				}
				console.log(shortArr);


				var obj = {};
				// for (var i = 0; i < this.state.dateRangeArray.length; i++) {
				// 	if (this.state.dateRangeArray[i]) {
				// 		var date = this.state.dateRangeArray[i].Date;
				// 		var p_date = obj[date] || {};
				// 		obj[date] = Object.assign(p_date, this.state.dateRangeArray[i]);
				// 	}
				// }
				// var result = Object.values(obj);
				// console.log(result);



				//Hassan code with new pattern

				let arrWithnewPattern = []
				let arrtocheck = []
				let checkrep = false
				for (let i = 0; i < this.state.dateRangeArray.length; i++) {
					checkrep = false
					if (this.state.dateRangeArray[i]) {

						let datetofind = this.state.dateRangeArray[i].Date

						for (let check1 = 0; check1 < arrtocheck.length; check1++) {
							if (arrtocheck[check1] == datetofind) {
								checkrep = true
							}
						}
						if (checkrep == true) {
							console.log("continue")
							continue;
						}
						else {
							arrtocheck.push(datetofind)
							//console.log(datetofind, i)
							for (let j = 0; j < this.state.dateRangeArray.length; j++) {

								if (datetofind == this.state.dateRangeArray[j].Date) {
									var obj1 = {}
									obj1.Date = datetofind;
									obj1.Shift = Object.keys(this.state.dateRangeArray[j])[1]
									obj1.name = this.state.dateRangeArray[j][Object.keys(this.state.dateRangeArray[j])[1]]
									//console.log(obj1)
									arrWithnewPattern.push(obj1)
								}
							}
						}
					}
				}
				arrtocheck = []
				var result = arrWithnewPattern
				let heading = [];
				let items = result.map((item) => Object.keys(item));
				if (items && items.length > 0) {
					items.forEach((item) => {
						item.forEach((i) => {
							if (!heading.includes(i)) {
								heading.push(i);
							}
						});
					});
				}
				console.log(items);

				this.setState({
					exportExcelArr: result,
					excelHeading: heading,
				});
				console.log(this.state.exportExcelArr);
			})
			.catch((err) => {
				console.log(err);
			});
	}












	callDateRangeEvent = (fieldsValue) => {
		// this.setState({
		//   showDateRange: false
		// })

		const rangeValue = fieldsValue['range-picker'];
		if (rangeValue === undefined) {
			this.setState({
				error: true,
			});
		}
		const values = {
			...fieldsValue,
			'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
		};
		// console.log('Received values of form: ', values);

		const start = rangeValue[0].format('YYYY-MM-DD');
		const end = rangeValue[1].format('YYYY-MM-DD');

		axios
			.get('shift/getEventsBetweenTwoDates/' + start + '/' + end)
			.then((resp) => {
				//console.log(start, end);
				//console.log(resp.data.shifts.length, resp.data.shifts)

				let arr = []
				for (let i = 0; i < resp.data.shifts.length; i++) {
					if (resp.data.shifts[i] !== null && !resp.data.shifts[i].Off && !resp.data.shifts[i].Request) {
						arr.push(resp.data.shifts[i])
					}
				}
				console.log("array afteer loop", arr)
				this.setState({
					dateRangeArray: arr,
				});
				// console.log(JSON.stringify(this.state.dateRangeArray))
				// console.log(this.state.data)
				// console.log(this.state.dateRangeArray);
				let shortArr = [];
				for (var i = 0; i < this.state.dateRangeArray.length; i++) {
					// console.log(this.state.dateRangeArray[i]);
					if (this.state.dateRangeArray[i]) {
						this.state.dateRangeArray[i].Date = this.JSDateToExcelDate(new Date(this.state.dateRangeArray[i].Date));
						//this.state.dateRangeArray[i].Date = this.state.dateRangeArray[i].Date.substring(0, this.state.dateRangeArray[i].Date.indexOf(','));
						shortArr.push(this.state.dateRangeArray[i]);
					}
				}
				//console.log(shortArr, "array after 3");
				var obj = {};

				// previous code 


				// for (var i = 0; i < this.state.dateRangeArray.length; i++) {
				// 	if (this.state.dateRangeArray[i]) {
				// 		var date = this.state.dateRangeArray[i].Date;
				// 		// Get previous date saved inside the result

				// 		var p_date = obj[date] || {};
				// 		// console.log(p_date);
				// 		// Merge the previous date with the next date
				// 		obj[date] = Object.assign(p_date, this.state.dateRangeArray[i]);
				// 	}
				// }


				// Hassan code to change view to three column i.e, date , shift , user
				let arrWithnewPattern = []
				let arrtocheck = []
				let checkrep = false
				for (let i = 0; i < this.state.dateRangeArray.length; i++) {
					checkrep = false
					if (this.state.dateRangeArray[i]) {

						let datetofind = this.state.dateRangeArray[i].Date

						for (let check1 = 0; check1 < arrtocheck.length; check1++) {
							if (arrtocheck[check1] == datetofind) {
								checkrep = true
							}
						}
						if (checkrep == true) {
							console.log("continue")
							continue;
						}
						else {
							arrtocheck.push(datetofind)
							//console.log(datetofind, i)
							for (let j = 0; j < this.state.dateRangeArray.length; j++) {

								if (datetofind == this.state.dateRangeArray[j].Date) {
									var obj1 = {}
									obj1.Date = datetofind;
									obj1.Shift = Object.keys(this.state.dateRangeArray[j])[1]
									obj1.name = this.state.dateRangeArray[j][Object.keys(this.state.dateRangeArray[j])[1]]
									//console.log(obj1)
									arrWithnewPattern.push(obj1)
								}
							}
						}
					}
				}
				arrtocheck = []
				var result = arrWithnewPattern

				//Convert to an array
				// console.log(obj, "object")
				// var result = Object.values(obj);
				// // console.log(JSON.stringify(result))
				// console.log(result, "result")

				// let arr = []

				// for(let i = 0 ; i < result.length ; i++){
				//   result[i].Date = this.toShort(result[i].Date)
				// }
				console.log(result);
				let heading = [];
				let items = result.map((item) => Object.keys(item));

				if (items && items.length > 0) {
					items.forEach((item) => {
						item.forEach((i) => {
							if (!heading.includes(i)) {
								heading.push(i);
							}
						});
					});
				}
				console.log(items);

				this.setState({
					exportExcelArr: result,
					excelHeading: heading,
				});
				console.log(this.state.exportExcelArr);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	toShort(date) {
		return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
	}

	render() {
		return (
			<div className='container-fluid'>
				<div className='row mt-5' >
					<div className='col-xl-6 col-lg-6 col-md-12 col-sm-12'>
						<input className='mb-2' type='file' onChange={this.onFileChange} />

						<Button type='primary' onClick={this.Process}>
							<div className='row'>
								<div className='col-1'>
									<i class='fa fa-upload' aria-hidden='true'></i>
								</div>
								<div className='col-8'>Upload Excel sheet</div>
							</div>
						</Button>
						<Button className="uploadoffs" type='primary'
							onClick={this.OffProcess}
						>
							<div className='row'>
								<div className='col-1'>
									<i class='fa fa-upload' aria-hidden='true'></i>
								</div>
								<div className='col-8'>Upload offs</div>
							</div>
						</Button>
					</div>
					<div className='col-xl-6  col-lg-6 col-md-12 col-sm-12  d-flex row'>
						<Button className="twelveham" type='primary' onClick={() => { this.setState({ offrequest: false }); this.selectDate() }}>
							<div className='row'>
								<div className='col-1'>
									<i class='fa fa-download'></i>
								</div>
								<div className='col-8'>Download Excel sheet</div>
							</div>
						</Button>
						<Button className="twelveham2" type='primary' onClick={() => { this.setState({ offrequest: true }); this.selectDate() }}>
							<div className='row' >
								<div className='col-1'>
									<i class='fa fa-download'></i>
								</div>
								<div className='col-8'>Download Off and Request Shift</div>
							</div>
						</Button>

					</div>
				</div>

				<br />
				{this.state.rows && <OutTable data={this.state.rows} columns={this.state.cols} tableClassName='ExcelTable2007' tableHeaderRowClass='heading' />}

				<Modal
					title='Download Excel Sheet'
					onCancel={() =>
						this.setState({
							showDateRange: false,
						})
					}
					visible={this.state.showDateRange}
					footer={null}>
					<br />
					<Form onFinish={this.state.offrequest == true ? this.callDateRangeEventforOffRequest : this.callDateRangeEvent} {...rangeConfig}>
						<div className='row'>
							<div className='col-12'>
								<Form.Item name='range-picker' label={<b>Please Select Dates</b>}>
									<RangePicker />
									{/* {
                          this.state.error === true
                          ?
                          <div style={{
                            color: 'red',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}>
                              Range fields are empty! Please provide a date range to get the desired date events
                        </div>
                        :
                        <div></div>
                        } */}
								</Form.Item>
							</div>
						</div>
						<div className='row'>
							<div className='col-4'>
								<FormItem>
									<Button onClick={() => ExportToExcel(this.state.exportExcelArr)}>Export to excel</Button>
								</FormItem>
							</div>
							<div className='col-5'></div>
							<div className='col-3'>
								<Form.Item>
									<Button type='primary' htmlType='submit'>
										Submit
									</Button>
								</Form.Item>
							</div>
						</div>
					</Form>
				</Modal>
				<div>
					<Modal
						title='Shifts added successfuly'
						onCancel={this.handleCancel}
						visible={this.state.visible}
						footer={[
							<Button type='primary' key='1' onClick={this.handleCancel}>
								OK
							</Button>,
						]}>
						<p>Shifts updated successfuly</p>
					</Modal>

					<Modal
						title='Shifts creation failed'
						maskClosable={true}
						onCancel={this.handleFailCancel}
						visible={this.state.visibleFail}
						footer={[
							<Button type='primary' key='1' onClick={this.handleFailCancel}>
								Cancel
							</Button>,
						]}>
						<p>Please choose a correct formatted excel file to add Shifts</p>
					</Modal>
				</div>

				<table id='download-event' class='table'>
					<thead>
						<tr>
							{this.state.excelHeading.map((heading, id) => (
								<th key={id}>{heading}</th>
							))}
							{/*<th>Date</th>
							<th>Heart</th>
							<th>Peds</th>
							<th>Night</th>
							<th>OB Day</th>
							<th>OB Night</th>
							<th>2nd</th>
							<th>3rd</th>
							<th>Day</th>
							<th>4th</th>
							<th>Off</th>
							<th>Request</th> */}
						</tr>
					</thead>
					{this.state.exportExcelArr.map((value) => {
						return (
							<tr>
								{this.state.excelHeading.map((heading) => (
									heading != "Date" ?
										<td>{value[heading]}</td> : <td>{this.ExcelDateToJSDate(value[heading]).toISOString().toString().slice(0, 10)}</td>
								))}
								{/* <td>{value.Date}</td>
								<td>{value.Heart}</td>
								<td>{value.Peds}</td>
								<td>{value.Night}</td>
								<td>{value['OB Day']}</td>
								<td>{value['OB Night']}</td>
								<td>{value['2nd']}</td>
								<td>{value['3rd']}</td>
								<td>{value.Day}</td>
								<td>{value['4th']}</td>
								<td>{value.Off}</td>
								<td>{value.Request} </td> */}
							</tr>
						);
					})}
				</table>

				{/* <ReactHTMLTableToExcel  
    
                                                className="btn btn-info"  

                                                table="download-event"  

                                                filename="ReportExcel"  

                                                sheet="Sheet"  

                                                buttonText="Download Now" /> */}
			</div>
		);
	}
}
export default uploadfile;
