let express = require('express')
let app = express()
let MongoClient = require("mongodb").MongoClient;
let ObjectID = require("mongodb").ObjectID;
let sha1 = require("sha1");
let multer = require("multer");
let upload = multer({ dest: __dirname + "/upload/" });
let reloadMagic = require('./reload-magic.js')
let cookieParser = require("cookie-parser");
reloadMagic(app)
let dbo = undefined;
let url = "mongodb+srv://ahmed:ahmed@cluster0-fy9rs.mongodb.net/test?retryWrites=true&w=majority";
MongoClient.connect(url, { useNewUrlParser: true }, (err, db) => {
    dbo = db.db("Healthy_Choice");
});
let sessions = {};
app.use(cookieParser());
app.use("/upload", express.static(__dirname + "/upload"));
app.use('/', express.static('build')); // Needed for the HTML and JS files
app.use('/', express.static('public')); // Needed for local assets

app.post("/signup", upload.none(), (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (username !== "" && password !== "") {
        dbo.collection("user").findOne({ username }, (err, user) => {
            if (err) {
                console.log(err, "signup err");
                res.send(JSON.stringify({ succes: false }));
                return;
            }
            if (user !== null) {
                console.log("same username");
                res.send(JSON.stringify({ success: "same username" }));
                return;
            } else {

                dbo
                    .collection("user")
                    .insertOne({ username, password: sha1(password), liked: [] });
                res.send({ success: true });
                return;
            }
        })
    }
    res.send(JSON.stringify({ succes: false }));
    return;
});

app.post("/login", upload.none(), (req, res) => {
    let username = req.body.username
    let password = req.body.password
    let hashedPwd = sha1(password);
    dbo.collection("user").findOne({ username }, (err, user) => {
        if (err) {
            console.log(err, "signup err");
            res.send(JSON.stringify({ succes: false }));
            return;
        }
        if (user === null) {
            console.log("username doesn't exist");
            res.send(JSON.stringify({ success: "username doesn't exist" }));
            return;
        }
        if (user.password === hashedPwd) {
            let sid = Math.floor(Math.random() * 10000000);
            sessions[sid] = username;
            res.cookie("sid", sid);
            res.send({ success: true, username: username, sid: sid });
            return;
        } else {
            res.send(JSON.stringify({ success: "wrong password" }))
        }
    })
});

app.post("/liked", upload.none(), (req, res) => {
    let username = req.body.username
    let recipe = JSON.parse(req.body.recipe)
    dbo.collection("user").findOne({ username }, (err, user) => {
        if (err) {
            console.log(err, "signup err");
            res.send(JSON.stringify({ succes: false }));
            return;
        }
        if (user.username === username) {
            let arr = user.liked
            let newArr = arr.push(recipe)
            dbo.collection("user").updateOne({ username }, { $set: { liked: arr } });
            res.send({ success: true });
            return;
        }
    })
});

app.post("/logout", upload.none(), (req, res) => {
    let sessionId = req.cookies.sid;
    delete sessions[sessionId];
    res.send({ success: true });
});

app.post("/saved", upload.none(), (req, res) => {
    let username = req.body.username
    dbo.collection("user").findOne({ username }, (err, user) => {
        if (err) {
            console.log(err, "saved err");
            res.send(JSON.stringify({ succes: false }));
            return;
        }
        if (user.username === username) {
            res.send({ success: true, recipe: user.liked });
            return;
        }
    })
});

app.post("/delete", upload.none(), (req, res) => {
    let username = req.body.username
    let recipes = JSON.parse(req.body.recipe)
    dbo.collection("user").findOne({ username }, (err, user) => {
        if (err) {
            console.log(err, "saved err");
            res.send(JSON.stringify({ succes: false }));
            return;
        }
        if (user.username === username) {
            let arr = user.liked
            let newArr = arr.filter(recipe => {
                return recipe.uri !== recipes.uri
            })
            dbo.collection("user").updateOne({ username }, { $set: { liked: newArr } });
            res.send({ success: true, recipe: newArr });
            return;
        }
    })
});

app.all('/*', (req, res, next) => {
    res.sendFile(__dirname + '/build/index.html');
})


app.listen(4000, '0.0.0.0', () => { console.log("Server running on port 4000") })
