import React from "react";
import Side from "./sidebar";

const User = ({ user }) => {
  localStorage.setItem("username", user.username);
  console.log(localStorage.getItem("username"));
  return (
    <div>
      <Side user={user} />
    </div>
  );
};

export default User;
