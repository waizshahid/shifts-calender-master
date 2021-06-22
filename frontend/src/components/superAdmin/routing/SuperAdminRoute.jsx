import React from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";

const SuperAdminRoute = ({ component: Component, render, ...rest }) => {
	const [isSuperAdmin, setIsSuperAdmin] = React.useState(true);
	const [loading, setLoading] = React.useState(true);
	const [superAdmin, setSuperAdmin] = React.useState([]);

	React.useEffect(() => {
		axios.defaults.headers.common["x-auth-superadmin"] = localStorage.getItem("superadmintoken");
		axios
			.get("superadmin")
			.then((res) => {
				setSuperAdmin(res.data);
				setIsSuperAdmin(true);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsSuperAdmin(false);
				setLoading(false);
			});
	}, []);

	return (
		<Route
			{...rest}
			render={(props) => {
				if (isSuperAdmin === false && loading === false) return <Redirect to="/" />;
				if (isSuperAdmin === true && loading === false) {
					return Component ? <Component {...props} superAdmin={superAdmin} /> : render(props);
				}
			}}
		/>
	);
};

export default SuperAdminRoute;
