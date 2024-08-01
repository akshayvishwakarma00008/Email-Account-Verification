const mongoose = require("mongoose")

module.exports = () =>{
    mongoose.connect(process.env.DB_CONNECTION).then(()=>{
        console.log("[+] connected to mongoDb");
    }).catch((err) =>{
        console.log("[+] Could not connect to DB");
        console.log(err);
    })
}