import React from "react";
import { Route, Redirect } from "react-router-dom";
import axios from "axios";

const AdminRoute = ({ component: Component, render, ...rest }) => {
	const [isAdmin, setIsAdmin] = React.useState(true);
	const [loading, setLoading] = React.useState(true);
	const [admin, setAdmin] = React.useState([]);

	React.useEffect(() => {
		axios.defaults.headers.common["x-auth-admin"] = localStorage.getItem("admintoken");
		axios
			.get("http://localhost:4000/api/admin")
			.then((res) => {
				console.log(res.data)
				setAdmin(res.data);
				setIsAdmin(true);
				setLoading(false);
			})
			.catch((err) => {
				console.log(err);
				setIsAdmin(false);
				setLoading(false);
			});
	}, []);

	return (
		<Route
			{...rest}
			render={(props) => {
				if (isAdmin === false && loading === false) return <Redirect to="/" />;
				if (isAdmin === true && loading === false) {
					return Component ? <Component {...props} admin={admin} /> : render(props);
				}
			}}
		/>
	);
};

export default AdminRoute;
