require("dotenv").config();
const express = require("express")
const app = express()
const cors = require("cors")
const DBconnection = require("./db")
const userRoutes = require("./routes/user")
const authenticateRoutes = require("./routes/auth")


DBconnection()

app.use(express.json());
app.use(cors());

//routes
app.use("/api/users",userRoutes)
app.use("/api/authenticate",authenticateRoutes)



const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`[+] Listing on port ${port}`);
})