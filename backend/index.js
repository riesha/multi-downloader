
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const port = 3000

const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('dlp.exe');

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.static(__dirname + '/downloads'));


app.post('/api', async (req, res) => {
    var options = {
        root: path.join(__dirname + '/downloads')
    };
    var fileName = (Math.random() + 1).toString(36).substring(7);
    let data = req.body;
    let result = await ytDlpWrap.execPromise([
        data.link,
        '-f',
        'best',
        '-o',
        `/downloads/${fileName}.mp4`,
    ]);
   
    res.download(`${fileName}.mp4`,options)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
