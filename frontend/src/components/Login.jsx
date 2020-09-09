import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Radio } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import jwt_decode from "jwt-decode";

import "antd/dist/antd.css";
import "../css/Login.css";

const Login = (props) => {
  const [error, setError] = React.useState(" ");

  const onFinish = (values) => {
    const { email, pass } = values;
    setError(" ");

    //if person is a SuperAdmin i-e- SuperAdmin radio is selected
    // if (person === "0") {
    axios
      .post("http://localhost:4000/api/superadminauth/login", {
        email,
        pass,
      })
      .then((res) => {
        window.localStorage.clear();
        // const stdid = jwt_decode(res.data.token).student.StdID;
        if (res.data.type === "superadmin") {
          localStorage.setItem("superadmintoken", res.data.token);
          props.history.push("/superadmin/shifts-calender");
        }

        if (res.data.type === "admin") {
          localStorage.setItem("admintoken", res.data.token);
          props.history.push("/admin");
        }

        if (res.data.type === "user") {
          localStorage.setItem("usertoken", res.data.token);
          props.history.push("/user/shifts-calender");
        }
      })
      .catch((err) => {
        setError(err);
      });

    // } else {
    // 	if (person === "1") {
    // 		//when admin is logged in
    // 		axios
    // 			.post("http://localhost:4000/api/adminauth/login", {
    // 				email,
    // 				pass,
    // 			})
    // 			.then((res) => {
    // 				window.localStorage.clear();
    // 				localStorage.setItem("admintoken", res.data.token);

    // 				props.history.push("/admin");
    // 			})
    // 			.catch((err) => {
    // 				setError(err.response.data.errors[0]);
    // 			});
    // 	} else {
    // 		//when User is logged in
    // 		axios
    // 			.post("http://localhost:4000/api/userauth/login", {
    // 				email,
    // 				pass,
    // 			})
    // 			.then((res) => {
    // 				window.localStorage.clear();
    // 				localStorage.setItem("usertoken", res.data.token);

    // 				props.history.push("/user");
    // 			})
    // 			.catch((err) => {
    // 				setError(err.response.data.errors[0]);
    // 			});
    // 	}
    // }
  };

  return (
    <div className="outer d-flex align-items-center justify-content-center">
      <br />
      <Form
        name="normal_login"
        className="login-form shadow-lg p-4 bg-white border border-dark rounded"
        initialValues={{}}
        onFinish={onFinish}
      >
        <h5 className="d-flex justify-content-center">
          Sign In to ShiftsCalender
        </h5>
        <br />
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: "Please input your Email!",
            },
          ]}
        >
          <Input
            id="email"
            prefix={
              <UserOutlined
                className="site-form-item-icon"
                style={{ color: "rgba(0,0,0,.25)" }}
              />
            }
            placeholder="Email"
          />
        </Form.Item>
        <Form.Item
          name="pass"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            prefix={
              <LockOutlined
                className="site-form-item-icon"
                style={{ color: "rgba(0,0,0,.25)" }}
              />
            }
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        {/* <Form.Item
					name="person"
					rules={[
						{
							required: true,
							message: "Please select one!",
						},
					]}
				>
					<Radio.Group>
						<Radio value="0">SuperAdmin</Radio>
						<Radio value="1">Admin</Radio>
						<Radio value="2">User</Radio>
					</Radio.Group>
				</Form.Item> */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Log in
          </Button>
          <br /> <br />
          {/* Or <Link to="/register">register now!</Link> */}
          <label className="text-danger d-block">{error.msg}</label>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
