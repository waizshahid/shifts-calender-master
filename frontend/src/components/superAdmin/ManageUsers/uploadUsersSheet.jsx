import React, { Component } from 'react'
import { Button } from "antd";
import axios from "axios";
import {ExcelRenderer} from 'react-excel-renderer';
import { Modal } from "antd";
import UploadUserExcel from './uploadUsersSheet'


export default class uploadUsersSheet extends Component {
  state = { visible: false,visibleFail:false };
  Process = (event) => {
        // console.log("running")
        // axios.delete("user/deleteAndUpdateUsers").then((res) => {
				// console.log(res)
				
        // });
        

        this.setState({ file: event.target.files[0] });
        let fileObj = event.target.files[0];
    
        //just pass the fileObj as parameter
        ExcelRenderer(fileObj, (err, resp) => {
            let date = new Date()
            date = date.toISOString().slice(0,10)
          if(err){
            console.log(err);            
          }
          else{
            let newRows=[];
            resp.rows.map((rows, index) => {
              newRows.push(rows)
            })
            this.setState({
              cols: resp.cols,
              rows: newRows
            });

            console.log(newRows)
            let finalArrAdmin = []
            let finalArrUser = []
            let usersAndAdminsArray = []
            newRows.map((row,i) => {
                
                let obj = {
                    username: row[3],
					firstName: row[0],
					lastName: row[1],
					email: row[2],
					type: row[4],
					pass: "123456",
					avatar: '',
					regDate: date,
                }
                row[5] === "partner"? 
                obj.partener = "yes"
                : obj.partener = "no"

                usersAndAdminsArray.push(obj);
                if(row[4]==="admin")
                finalArrAdmin.push(obj)
                if(row[4]==="user")
                finalArrUser.push(obj)
            })
            this.setState({usersAndAdminsfinalArray: usersAndAdminsArray ,finalArrayUsers: finalArrUser, finalArrayAdmin: finalArrAdmin}, () => {
              console.log("Admin = ", this.state.finalArrayAdmin)
              console.log("Users = ", this.state.finalArrayUsers)
              console.log("Combined Array = ", this.state.usersAndAdminsfinalArray)
            })
           
          }
        });
    }


    updateUsersWithExcel = () => {
      // console.log(this.state.usersAndAdminsfinalArray)
      if(this.state.usersAndAdminsfinalArray !== undefined){
        axios.delete("user/deleteAndUpdateUsers")
          .then((res) => {
            // console.log('All users deleted');
              axios.delete("shift/deleteAllShifts")
              .then((res) => { 
                console.log('All users and their Shifts are deleted successfully')
                axios.post("user/createUserFromExcel",this.state.usersAndAdminsfinalArray).then((response2) => {
                console.log(response2.data);
                this.setState({
                  visible: true,
                });
                }).catch((err) => console.log(err)) 
                })
                .catch((err) => console.log(err))
              })
               .catch((err) => {
                this.setState({
                  visibleFail: true,
                });
               }) 
             }else{
              this.setState({
                visibleFail: true,
              });
             }
             
    }
    handleOk = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
      window.location.reload()
    };
  
    handleCancel = e => {
      console.log(e);
      this.setState({
        visible: false,
      });
    };
    handleFailCancel = e => {
      console.log(e);
      this.setState({
        visibleFail: false,
      });
    };
    render() {
        return (
            <div>
                {/* <div>
                  <h4 style={{
                    color: 'grey',
                    padding: '15px 15px',
                    }}>
                    Upload Users from Excel Sheet
                  </h4>
                </div> */}
                <div className="fileUser">
                <input
                    className="mb-2"
                    type="file"
                    onChange={this.Process}
                  />
                  <Button type="primary" onClick={this.updateUsersWithExcel}>
                  <div className="row">
                  <div className="col-1">
                  <i class="fa fa-file-excel-o" aria-hidden="true"></i>
                  </div>
                  <div className="col-8">
                  Upload User Excel      
                  </div>
                </div>
                  </Button>
                </div>
                  <Modal
                  title="Users added successfuly"
                  visible={this.state.visible}
                  onOk={this.handleOk}
                  onCancel={this.handleCancel}
                >
                  <p>User updated successfuly</p>
                  
                </Modal>

                <Modal
                  title="Users update failed"
                  onCancel={this.handleFailCancel}
                  visible={this.state.visibleFail}
                  footer={[
                    <Button key="1" onClick={this.handleFailCancel}>Cancel</Button>,
                    
                  ]}
                >
                  <p>Please choose a correct formatted excel file to add Users</p>
                  
                </Modal>
            </div>
        )
    }
}
