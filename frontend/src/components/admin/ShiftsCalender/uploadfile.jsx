import React, { Component } from "react";
import { Button, Upload } from "antd";
import axios from "axios";
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import {FileExcelOutlined} from "@ant-design/icons";
import { Modal } from "antd";

class uploadfile extends Component {
  state = { 
    file: null ,
    types: '',
    startDate: '',
    endDate: '',
    users: '',
    finalArray: '',
    visible: false,
    visibleFail:false
  };
  componentDidMount = () =>  {
    axios.get("user/getusers").then((response1) => {
				console.log(response1.data)
				this.setState({users: response1.data})
		});
		
    axios.get("shift/getshifts").then((response) => {
      
      let typeArr = []
      response.data.map(resp=> {
        typeArr.push({"name":resp.shiftname,
      "id":resp._id })
      })
      this.setState({types: typeArr});
    });
    axios.get("shift/currentShifts").then((res) => {
        console.log(res.data.shifts);
      });
  }
  ExcelDateToJSDate= (serial)=> {
    var utc_days  = Math.floor(serial - 25569);
    var utc_value = utc_days * 86400;                                        
    var date_info = new Date(utc_value * 1000);
 
    var fractional_day = serial - Math.floor(serial) + 0.0000001;
 
    var total_seconds = Math.floor(86400 * fractional_day);
 
    var seconds = total_seconds % 60;
 
    total_seconds -= seconds;
 
    var hours = Math.floor(total_seconds / (60 * 60));
    var minutes = Math.floor(total_seconds / 60) % 60;
 
    return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
 }
  onFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
    let fileObj = event.target.files[0];

    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if(err){
        console.log(err);            
      }
      else{
        let newRows=[];
        resp.rows.map((rows, index) => {
          if(rows.length >2)
          newRows.push(rows)
        })
        this.setState({
          cols: resp.cols,
          rows: newRows
        });
        this.UpdateExcel(newRows)
        let last;
        this.setState({startDate:this.ExcelDateToJSDate(resp.rows[1][0]).toISOString().toString().slice(0,10)})
        resp.rows.map((rows, index) => {
          if(rows.length >5)
          last = index
        })
        this.setState({endDate:this.ExcelDateToJSDate(resp.rows[last][0]).toISOString().toString().slice(0,10)})
      }
    });
  };


  UpdateExcel = (rows) => {
    // this.deletePreviousData();
    let shiftTitles = []
    let shiftTitleIndex = []
    console.log(this.state.types)

    console.log(rows[0])

    let newArr =[]
    rows[0].map((name, index) => {
      this.state.types.map(type => {
        if(name === type.name)
        {
          newArr.push(type);
          shiftTitleIndex.push(index)
        }
        
      })
    })
    console.log(newArr);
    console.log(shiftTitleIndex)
    let Arr =[]
    let Obj ={}
    newArr.map((shift,index) => {
        this.state.rows[0].map((row,index )=> {
          if(row === shift.name)
          this.state.rows.map((col,i) => {
            if(i>0){
              let JSdate = this.ExcelDateToJSDate(col[0]).toISOString().toString().slice(0,10)
              this.state.users.map(user => {
                if(user.username === col[index]){
                      Obj = {"name": col[index],"userId":user._id, "shiftTypeId": shift.id, "start": JSdate, "end": JSdate, "swappable": true}
                      Arr.push(Obj)
                }
              })
            }
          })
        })
    })
    console.log('Array to be pass to backend')
    console.log(Arr)
    
    	this.setState({finalArray: Arr})	
        
  }


  Process = () => {
    if(this.state.finalArray !== ''){
      // console.log(this.state.finalArray)
      axios
      .get("shift/deleteEventsBetweenTwoDates/"+this.state.startDate+'/'+this.state.endDate)
      .then((response) => {
          console.log("response", response);
          axios.post("shift/createShiftsFromExcel",this.state.finalArray)
          .then((res) => {
           this.setState({
              visible: true,
            });
          })
          .catch((err) => console.log(err));
        })
        .catch((err) => console.log("err", err));
    }else{
      this.setState({
        visibleFail: true,
      });
    }
    
    
  }
  

  

   deletePreviousData = () => {
    axios
        .get("shift/deleteEventsBetweenTwoDates/"+this.state.startDate+'/'+this.state.endDate)
        .then((response) => {
          console.log("response", response);
        })
        .catch((err) => console.log("err", err));
   }
   handleCancel = e => {
    this.props.history.push(`/admin/shifts-calender`)
            
  };
  handleFailCancel = e => {
    console.log(e);
    this.setState({
      visibleFail: false,
    });
  };
  render() {
    return (
      
            <div className="container"> 
               <div className="center">
               <input
                    className="mb-2"
                    type="file"
                    onChange={this.onFileChange}
                  />

              <Button  type="primary" onClick={this.Process}>
                <div className="row">
                  <div className="col-1">
                  <i class="fa fa-file-excel-o" aria-hidden="true"></i>
                  </div>
                  <div className="col-8">
                  Upload Excel sheet      
                  </div>
                </div>
              
              </Button>
               </div>
              
                {/* {this.state.file && (
                    <Upload variant="info" onClick={this.UpdateExcel}>
                      Update Existing Sheet
                    </Upload>
                )} */}
            
              <br />
              
              {/* <Button type="primary" className="mb-3" variant="info" onClick={this.deletePreviousData}>
                Delete
              </Button> */}

              {this.state.rows && 
                <OutTable data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
              }
              
              <div>
              <Modal
                  title="Shifts added successfuly"
                  onCancel={this.handleCancel}
                  visible={this.state.visible}
                  footer={[
                    <Button key="1" onClick={this.handleCancel}>OK</Button>,
                  ]}
                >
                  <p>Shifts updated successfuly</p>
                  
                </Modal>

                <Modal
                  title="Shifts creation failed"
                  maskClosable={true}
                  onCancel={this.handleFailCancel}
                  visible={this.state.visibleFail}
                  footer={[
                    <Button key="1" onClick={this.handleFailCancel}>Cancel</Button>,
                  ]}
                >
                  <p>Please choose a correct formatted excel file to add Shifts</p>
                  
                </Modal>
              </div>
            
            </div> 
    );
  }
}
export default uploadfile;