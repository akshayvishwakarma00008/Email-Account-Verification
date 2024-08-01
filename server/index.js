require("dotenv").config();
const express = require("express")
const app = express()
const cors = require("cors")
const DBconnection = require("./db")
const userRoutes = require("./routes/user")


DBconnection()

app.use(express.json());
app.use(cors());

//routes
app.use("/api/users",userRoutes)



const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`[+] Listing on port ${port}`);
})