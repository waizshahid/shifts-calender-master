import React, { Component } from "react";
import { Button } from "antd";
import axios from "axios";

class uploadfile extends Component {
  state = { 
    file: null 
  };
  componentDidMount() {}
  onFileChange = (event) => {
    this.setState({ file: event.target.files[0] });
    console.log('File UPLOADED');
    console.log(event.target.files[0]);
  };

  onFileUpload = () => {
    const formData = new FormData();
    formData.append("file", this.state.file);

    axios
      .post("http://localhost:4000/api/shift/excelFile/uploadFile", formData)
      .then((response) => {
        console.log("response", response);
      })
      .catch((err) => console.log("err", err));
  };

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
                    <Button variant="info" onClick={this.onFileUpload}>
                      Upload Selected file
                    </Button>
                )}
            
              <br />
              <br />
              <Button className="mb-3" variant="info">
                Download File
              </Button>
            
            </div> 
    );
  }
}
export default uploadfile;