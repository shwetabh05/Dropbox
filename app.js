const fs = require("fs");
const express = require("express");
const expressFileUpload = require("express-fileupload");
const path = require ("path");
const { application } = require("express");
// const e = require("express");

const app = express();
app.use(expressFileUpload());
// app.use(express.urlencoded ({extended:false}));


const port = 3000;
const uploaded = __dirname + "/uploaded";
const uploadDirectory = __dirname + "/uploaded";
let memory = {};


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/index.html"));
})

app.post("/form", (req,res) => {
    if (req.files){
        const file = req.files.file;
        const fileName = file.name;
        const size = file.data.length;
        const extension = path.extname(fileName)
        const allowedExt = /png|jpeg|jpg|gif/;
        if(extension != allowedExt) {
            throw "Unsupported Extension";
        }
        if(size > 5000000) {
            throw "File must be less than 5 mb"
        }

        fs.writeFileSync(uploadDirectory + "/" + fileName, file.data)
        memory[file.name] = fs.readFileSync(uploadDirectory + "/" + file.name);
        console.log(file);
        console.log(memory);
        res.send("File uploaded successfully. To downloadthe file go to http://localhost:3000/uploaded/${file.name}");
    }else {
        res.redirect("/");
    }
    })

// app.post("/form", (req,res) => {
//     if (req.files){
//         const file = req.files.file;
//         fs.writeFileSync(uploadDirectory + "/" + file.name, file.data)
//         memory[file.name] = fs.readFileSync(uploadDirectory + "/" + file.name);
//         console.log(req.files.file);
//         console.log(memory);
//         res.send("to download, go to http://localhost:3000/uploaded/${file.name}");
//     }else {
//         res.redirect("/");
//     }
//     })

app.get("/uploaded/:filename", (req,res) => {
    let params = req.params,filename;
    if(memory[params]) {
        res.send(memory[params]);
    }else if (fs.existsSync(uploadedDirectory + "/" + params)) {
        memory[params] = fs.readFileSync(uploadedDirectory + "/" + params);
        res.send(memory[params]);
    }else {
        res.redirect("/");
    }
})

app.listen(3000, () => {
    console.log("listening to port : 3000");
});