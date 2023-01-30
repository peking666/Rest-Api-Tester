const express = require('express')
const { InstagramGet } = require('./Igdownload')
const { InstagramVideo } = require('./api')
const GetId = require('./api.js');
var cors = require('cors');
const app = express()
app.use(cors());
const port = 3300

app.get('/igdownload', (req, res) => {
    const url = req.query.url;
    console.log('Ini Urlnya bro', req.query.url)    
    InstagramGet(url, res);
})

app.get('/igvideo', (req, res) => {
  const url = req.query.url;
  console.log('Ini Urlnya video', req.query.url)    
  InstagramVideo(url, res);
})

// app.get('/ig', (req, res) => {    
//   GetId(res);
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
