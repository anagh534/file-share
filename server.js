const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const file = require('./model/file')
const app = express()
require('dotenv').config()

app.set("view engine", "ejs")
app.use(express.static('images'))
app.use(express.urlencoded({ extended: true }))
const upload = multer({ dest: 'uploads' })

mongoose.connect(process.env.dbURL,{ useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>console.log("DB CONNECTED"))

app.get('/', (req, res) => {
    res.render("index")
})
app.post('/upload', upload.single("file"), async (req, res) => {
    const fileData = {
        path: req.file.path,
        originalName: req.file.originalname
    }
    if (req.body.password != null && req.body.password !== "") {
        fileData.password = await bcrypt.hash(req.body.password, 10)
    }
    const File = await file.create(fileData)
    res.render("index", { fileLink: `${req.headers.origin}/file/${File.id}` })
})
app.route("/file/:id").get(handleDownload).post(handleDownload)

async function handleDownload(req, res) {
    const File = await file.findById(req.params.id)

    if (File.password != null) {
        if (req.body.password == null) {
            res.render("password",{error: false,count: File.downloadCount})
            return
        }
        if (!await bcrypt.compare(req.body.password, File.password)) {
            res.render("password", { error: true ,count: File.downloadCount})
            return
        }
    }

    File.downloadCount++
    await File.save()
    res.download(File.path, File.originalName)
}

app.listen(3000)