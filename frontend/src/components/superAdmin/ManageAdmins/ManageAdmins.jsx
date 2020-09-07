import React, { useState, useEffect } from "react";
import MaterialTable from "material-table";
import axios from "axios";
// import { EditTwoTone, DeleteTwoTone } from "@ant-design/icons";
import { Modal, Table, Popconfirm } from "antd";

import Register from "./Register";

const ManageAdmins = () => {
  const [result, setResult] = useState("");
  const [targetAdmin, setTargetAdmin] = useState("");
  const [visible, setVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [delVisible, setDelVisible] = useState(false);

  const getRequiredValues = (data) => {
    let temp = [];
    for (var i = 0; i < data.length; i++) {
      temp.push({
        key: data[i]._id,
        username: data[i].username,
        email: data[i].email,
        regDate: data[i].regDate,
        action: (
          <div>
            <i
              className="fa fa-edit"
              id={data[i]._id}
              onClick={(e) => {
                setEditVisible(true);
                setTargetAdmin(e.target.id);
              }}
              style={{ fontSize: "18px", cursor: "pointer" }}
            ></i>
            &nbsp;&nbsp;
            <i
              className="fa fa-trash-o"
              id={data[i]._id}
              onClick={(e) => {
                setDelVisible(true);
                setTargetAdmin(e.target.id);
              }}
              style={{ fontSize: "18px", cursor: "pointer", color: "red" }}
            ></i>
          </div>
        ),
      });
    }
    return temp;
  };

  useEffect(() => {
    axios.get("http://localhost:4000/api/admin/getadmins").then((response) => {
      setResult(getRequiredValues(response.data));
    });
  }, [visible, editVisible, delVisible]);

  const requestBody = {
    whatEver: "to-send",
  };

  var config = {};
  config.data = requestBody;

  const deleteAdmin = () => {
    axios
      .delete("http://localhost:4000/api/admin/deleteadmin", {
        params: { id: targetAdmin },
      })
      .then((response) => {
        console.log(response.data);
      });
    setDelVisible(false);
  };

  // const editAdmin=()=>{

  // }

  const columns = [
    {
      title: "UserName",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Reg Date",
      dataIndex: "regDate",
      key: "regDate",
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
  ];

  return (
    <div className="container pt-5">
      <button
        className="btn btn-outline-primary"
        onClick={() => setVisible(true)}
      >
        + Add New Admin
      </button>
      <br />
      <Table dataSource={result} columns={columns} />;{/* Register New Admin */}
      <Modal
        title="Basic Modal"
        maskClosable={true}
        onCancel={() => setVisible(false)}
        visible={visible}
        footer={false}
      >
        <Register setVisible={(val) => setVisible(val)} isEdit={false} id={0} />
      </Modal>
      {/* Edit Admin */}
      <Modal
        title="Basic Modal"
        maskClosable={true}
        onCancel={() => setEditVisible(false)}
        visible={editVisible}
        footer={false}
      >
        <Register
          setEditVisible={(val) => setEditVisible(val)}
          isEdit={true}
          id={targetAdmin}
        />
      </Modal>
      {/* Delete Admin */}
      <Modal
        title="Warning"
        maskClosable={true}
        onCancel={() => setDelVisible(false)}
        onOk={deleteAdmin}
        visible={delVisible}
      >
        <p>Are you sure delete this admin?</p>
      </Modal>
    </div>
  );
};

export default ManageAdmins;
