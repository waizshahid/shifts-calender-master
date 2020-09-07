import React, { useState, useEffect } from "react";
import Side from "./sidebar";

const User = ({ user }) => {
  useEffect(() => {
    console.log(user);
  }, []);

  return (
    <div>
      <Side user={user} />
      {/* <FullPageLoader />
			<h1>User</h1>
			<h1>{user.email}</h1> */}
    </div>
  );
};

export default User;
