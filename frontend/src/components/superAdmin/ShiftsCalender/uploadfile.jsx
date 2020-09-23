import React, { Component } from "react";
import { Button, Upload } from "antd";
import axios from "axios";
import {OutTable, ExcelRenderer} from 'react-excel-renderer';

class uploadfile extends Component {
  state = { 
    file: null ,
    types: '',
    startDate: '',
    endDate: '',
  };
  componentDidMount = () =>  {
    axios.get("http://localhost:4000/api/shift/getshifts").then((response) => {
      
      let typeArr = []
      response.data.map(resp=> {
        typeArr.push(resp.shiftname)
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
        this.setState({
          cols: resp.cols,
          rows: resp.rows
        });
        let last;
        this.setState({startDate:this.ExcelDateToJSDate(resp.rows[1][1]).toISOString().toString().slice(0,10)})
        resp.rows.map((rows, index) => {
          if(rows.length >5)
          last = index
        })
        this.setState({endDate:this.ExcelDateToJSDate(resp.rows[last][1]).toISOString().toString().slice(0,10)})
      }
    });     
  };

  

  onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", this.state.file);
    let types = this.state.rows[0]

    console.log(this.state.rows[0])

  //   axios
  //     .post("http://localhost:4000/api/shift/excelFile/uploadFile", formData)
  //     .then((response) => {
  //       console.log("response", response);
  //     })
  //     .catch((err) => console.log("err", err));
   };

   deletePreviousData = () => {
    axios
        .post("http://localhost:4000/api/shift/deleteEventsBetweenTwoDates/"+this.state.startDate+'/'+this.state.endDate)
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
                {this.state.file && (
                    <Upload variant="info" onClick={this.onFileUpload}>
                      Update Existing Sheet
                    </Upload>
                )}
            
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