
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const jobs= require('./jobs');

const port = 3000

const YTDlpWrap = require('yt-dlp-wrap').default;
const ytDlpWrap = new YTDlpWrap('dlp.exe');

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('public'))
app.use(express.static(__dirname + '/downloads'));

jobs.initScheduledJobs()

app.post('/api', async (req, res) => {

    const options = {
        root: path.join(__dirname + '/downloads')
    };
    const fileName = (Math.random() + 1).toString(36).substring(7);
    let data = req.body;

    if (!data.link || !data.mode) {
        res.status(500).send("Invalid request, missing link or mode");
        return;
    }
    let filepath;
    switch (data.mode) {
        case "sc":
             filepath = `${fileName}.mp3`
            break;
        default:
             filepath = `${fileName}.mp4`
            break;
    }
    // TODO: handle soundcloud and twitter links (probably extract the handler func and make soundcloud download mp3)
    let result = await ytDlpWrap.execPromise([
        data.link,
        '-f',
        'best',
        '-o',
        `/downloads/${filepath}`,
    ]);
   
    res.download(filepath,options)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
