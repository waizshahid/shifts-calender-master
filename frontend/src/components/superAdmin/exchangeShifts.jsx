
import React, { useState, useEffect } from "react";
import axios from'axios'
import { Modal, Table, Popconfirm } from "antd";
const ExchangeShifts = () => {
    const [result, setResult] = useState();
    const [visible, setVisible] = useState(false);
    const [id1, setId1] = useState("");
    const [id2, setId2] = useState("");
    const [editVisible, setEditVisible] = useState(false);
    const [targetShift, setTargetShift] = useState("");
    const [data, setData] = useState([]);
    const handelId1 = (e) => {
        setId1(e.target.value);
    };
    const handelId2 = (e) => {
        setId2(e.target.value);
    };


    const getRequiredValues = (data) => {
        let temp = [];
		for (var i = 0; i < data.length; i++) {
			temp.push({
                key: data[i]._id,
                title: data[i].title,
                startdate: data[i].start,
                enddate: data[i].end,
                swapable: data[i].swapable,
                comment: data[i].comment

			});
		}
		return temp;
    };

    useEffect(() => {
		axios.get("http://localhost:4000/api/shift/currentShifts").then((res) => {
               setResult(getRequiredValues(res.data.shifts));
                
        });
    }, [visible,editVisible]);

    axios.get("http://localhost:4000/api/shift/currentShifts").then((res) => {
        var trueSwapableArray = [];
        for(let i = 0; i < res.data.shifts.length ; i++){
            if(res.data.shifts[i].swapable === 'true'){
                trueSwapableArray.push(res.data.shifts[i]);
            }
        }
        setData(trueSwapableArray);
      });

    const handleOk = (e) => {
        console.log('ID 1 HAI: '+id1);
        console.log('ID 2 HAI: '+id2);
        axios.get("http://localhost:4000/api/shift/swapShift/"+id1+'/'+id2).
        then((res) => {
            console.log(res.data);
          });
          window.location.reload();
    }
    const columns = [
		{
			title: "Shift title",
			dataIndex: "title",
			key: "title",
        },
        {
			title: "Start Date",
			dataIndex: "startdate",
			key: "startdate",
        },
        {
			title: "End Date",
			dataIndex: "enddate",
			key: "enddate",
        },
        {
			title: "Swapable",
			dataIndex: "swapable",
			key: "swapable",
        },
        {
			title: "Comments",
			dataIndex: "comment",
			key: "comment",
        }
    ];
    
    
    
    return (
        <div className="container">
            <h2 className="text-center">
                Super Admin Exchange Shifts
            </h2>
            <button className="btn btn-outline-primary" onClick={() => setVisible(true)}>
				 Swap Shifts
			</button>
            <br/>
            <br/>
                <Table dataSource={result} columns={columns} />
                <Modal
                    title="Update Shifts"
                    visible={visible}
                    maskClosable={true}
                    onCancel={() => setVisible(false)}
                    onOk={handleOk}
                >
                    <select
                        id="cars"
                        name="cars"
                        className="custom-select bg-light m-2 shadow-sm"
                        onChange={handelId1}
                        >
                        <option defaultValue="" id="assi">
                            Select Shift 1
                        </option>
                        {data.map((dat) => (
                            <option value={dat._id} key={dat._id}>
                            {dat.title}
                        </option>
                        ))}
                    </select>
                    <select
                        id="cars"
                        name="cars"
                        className="custom-select bg-light m-2 shadow-sm"
                        onChange={handelId2}
                        >
                        <option defaultValue="" id="assi">
                            Select Shift 2
                        </option>
                        {data.map((dat) => (
                            <option value={dat._id} key={dat._id}>
                            {dat.title}
                        </option>
                        ))}
                    </select>
                    <br/>
                    {/* <button className="btn btn-primary btn-sm" onSubmit={handleOk}>
                        Swap Shifts
                    </button> */}
                </Modal>
        </div>
    )
}
export default ExchangeShifts;