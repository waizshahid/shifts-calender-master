import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min";
import "antd/dist/antd.min.css";
import "../node_modules/antd/dist/antd.min.js";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Login from "./components/Login";
import PageNotFound from "./components/PageNotFound";
import SuperAdmin from "./components/superAdmin/SuperAdmin";
import Admin from "./components/admin/Admin";
import User from "./components/user/User";
import SuperAdminRoute from "./components/superAdmin/routing/SuperAdminRoute";
import AdminRoute from "./components/admin/routing/AdminRoute";
import UserRoute from "./components/user/routing/UserRoute";
import axios from 'axios'



function App() {
    axios.defaults.baseURL = "http://3.138.147.2:3000/api/";
    // axios.defaults.baseURL = "http://localhost:4000/api/";
    return ( 
        <Router >
        <Switch >
        <Route exact path = "/" component = { Login }/> { /* <Route path="/register" component={Register} /> */ } 
        <SuperAdminRoute path = "/superadmin" component = { SuperAdmin }/> 
        <AdminRoute path = "/admin" component = { Admin }/> 
        <UserRoute path = "/user" component = { User }/> 
        <Route component = { PageNotFound }
        /> </Switch> </Router>
    );
}

export default App;
