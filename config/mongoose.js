//required the library
const mongoose = require('mongoose');
//connect to the database
mongoose.connect('mongodb://localhost/url_Shortener_Db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
//acquire the connection (to check if it succeful)
const db=mongoose.connection;

//error
db.on('error', console.error.bind(console, "error connecting to db"));

//up and running then print the message
db.once('open',()=>{
    console.log("successfully connected to the database ");
});