import React, { useState, useEffect } from "react";

const Admin = ({ admin }) => {
	useEffect(() => {
		console.log(admin);
	}, []);

	return (
		<div>
			{/* <FullPageLoader /> */}
			<h1>Admin</h1>
			<h1>{admin.email}</h1>
		</div>
	);
};

export default Admin;
