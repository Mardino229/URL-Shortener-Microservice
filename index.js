require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const shortId = require('shortid');
const Url = require('./shortUrl')
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(r =>{
      console.log("Connected to the database");
    }).catch(err =>{
  console.log("Error connecting to the database");
})

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get("/api/shorturl/:urlCode", function(req, res) {
  Url.findOne({urlCode: req.params.urlCode})
      .then(url => res.redirect(url.longUrl))
      .catch(error => res.status(400).json({ error }));
})

app.post('/api/shorturl', function(req, res) {
  const regex = /^(https?:\/\/)?([\da-z\.-]+)(:\d+)?(\/[^\s]*)?$/;
  const original_url = req.body.url;
  console.log(original_url)
  if (regex.test(original_url)){
    const urlCode = shortId.generate();
    const shortUrl = `${req.baseUrl}/${urlCode}`;
    const newUrl = new Url({ longUrl: original_url, shortUrl:shortUrl, urlCode:urlCode });
    newUrl.save()
        .then((url)=>{
          res.json({original_url : original_url, short_url : urlCode});
        })
        .catch((err) => {
          res.json({error: err}).status(404);
        });
  } else  {
    res.json({ error: 'invalid url' })
  }
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
