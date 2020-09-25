import React, { Component } from "react";
import { Button, Upload } from "antd";
import axios from "axios";
import {OutTable, ExcelRenderer} from 'react-excel-renderer';
import { indigo } from "@material-ui/core/colors";

class uploadfile extends Component {
  state = { 
    file: null ,
    types: '',
    startDate: '',
    endDate: '',
    users: '',
    finalArray: ''
  };
  componentDidMount = () =>  {
    axios.get("http://localhost:4000/api/user/getusers").then((response1) => {
			axios.get("http://localhost:4000/api/admin/getadmins").then((response2) => {
				
				let arr = [...response1.data, ...response2.data];
				this.setState({users: arr})
			});
		});
    axios.get("http://localhost:4000/api/shift/getshifts").then((response) => {
      
      let typeArr = []
      response.data.map(resp=> {
        typeArr.push({"name":resp.shiftname,
      "id":resp._id })
      })
      this.setState({types: typeArr});
    });
    axios.get("http://localhost:4000/api/shift/currentShifts").then((res) => {
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
    console.log('Final Array')
    console.log(this.state.finalArray);
    axios
    .post("http://localhost:4000/api/shift/createUsersFromExcel",this.state.finalArray)
    .then((res) => {
      console.log('Array sent to backend')
      console.log(res)
      // console.log(res.data);
    })
    .catch((err) => console.log(err));
  }
  

  

   deletePreviousData = () => {
    axios
        .get("http://localhost:4000/api/shift/deleteEventsBetweenTwoDates/"+this.state.startDate+'/'+this.state.endDate)
        .then((response) => {
          console.log("response", response);
        })
        .catch((err) => console.log("err", err));
   }
  render() {
    return (
      
      <div>  <br />
          <h4 className=" mt-0">Upload Excel File</h4>
                <input
                    className="mb-2"
                    type="file"
                    onChange={this.onFileChange}
                  />

              <Button type="primary" onClick={this.Process}>
                Process Excel to Database
              </Button>
              
                {/* {this.state.file && (
                    <Upload variant="info" onClick={this.UpdateExcel}>
                      Update Existing Sheet
                    </Upload>
                )} */}
            
              <br />
              <br />
              <Button className="mb-3" variant="info">
                Download File
              </Button>
              <Button type="primary" className="mb-3" variant="info" onClick={this.deletePreviousData}>
                Delete
              </Button>

              {this.state.rows && 
              <OutTable data={this.state.rows} columns={this.state.cols} tableClassName="ExcelTable2007" tableHeaderRowClass="heading" />
              }
              
            
            </div> 
    );
  }
}
export default uploadfile;