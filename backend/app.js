var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

var superAdminRouter = require("./routes/superadmin");
var superAdminAuthRouter = require("./routes/superadminauth");
var adminRouter = require("./routes/admin");
var adminAuthRouter = require("./routes/adminauth");
var userRouter = require("./routes/user");
var userAuthRouter = require("./routes/userauth");
var shiftRouter = require("./routes/shift");

var app = express();
app.use(cors());
app.use(express.json({limit: '50mb', extended: true}));
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.use("/api/superadmin", superAdminRouter);
app.use("/api/superadminauth", superAdminAuthRouter);
app.use("/api/admin", adminRouter);
app.use("/api/adminauth", adminAuthRouter);
app.use("/api/user", userRouter);
app.use("/api/userauth", userAuthRouter);
app.use("/api/shift", shiftRouter);
app.use('/public', express.static('public'));
//Server Config
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.clear();
  console.log(`server running on port ${port}`);
});

//DB Config
const conn = require("./config/db");
