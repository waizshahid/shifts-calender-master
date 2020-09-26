import React, { Component } from 'react'
import { Button } from "antd";
import axios from "axios";
import {ExcelRenderer} from 'react-excel-renderer';


export default class uploadUsersSheet extends Component {

    Process = (event) => {
        console.log("running")
        axios.delete("http://localhost:4000/api/user/deleteAndUpdateUsers").then((res) => {
				console.log(res)
				
        });
        

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
                : obj.partner = "no"

                if(row[4]==="admin")
                finalArrAdmin.push(obj)
                if(row[4]==="user")
                finalArrUser.push(obj)
            })
            this.setState({finalArrayUsers: finalArrUser, finalArrayAdmin: finalArrAdmin}, () => {
              console.log("Admin = ", this.state.finalArrayAdmin)
              console.log("Users = ", this.state.finalArrayUsers)
                
            })
            
           
          }
        });
    }

    updateUsersWithExcel = () => {
        axios.delete("http://localhost:4000/api/user/deleteAndUpdateUsers").then((res) => {
             console.log('All users deleted'+res);
         })
         axios.post("http://localhost:4000/api/user/createUserFromExcel",this.state.finalArrayUsers).then((response2) => {
             console.log('Users Created'+response2);
         })
         axios.post("http://localhost:4000/api/user/createAdminFromExcel",this.state.finalArrayAdmin).then((response1) => {
            console.log('Admins Created'+response1);
        })
        
    }
    render() {
        return (
            <div>
                <h3>Users excel sheet</h3>
                <input
                    className="mb-2"
                    type="file"
                    onChange={this.Process}
                  />
                  <br/>
                  <Button type="primary" onClick={this.updateUsersWithExcel}>
                      Upload Now
                  </Button>
            </div>
        )
    }
}
