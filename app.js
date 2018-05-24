const express = require('express');



const app = express();

//basic routes
//index route
app.get('/', (req,res) => {
    res.send('what the hack man');
});


//basic webServer
const port = 5000;
app.listen(port, ( )=> {
    console.log(`server started on port ${port}`);
});