var fs = require('fs');
var path = require('path');
var express = require('express');
var app = express();
var port = 8080;

var mongoose = require('mongoose');

var db = mongoose.connection;

db.on('error', console.error);
db.once('open', function() {
    console.log('Connected DB!');
});
var commentSchema = new mongoose.Schema({
    commentText: String,
    path: String
}, {
    collection: 'comments'
});
var Comment = mongoose.model('Comment', commentSchema);

mongoose.connect('mongodb://127.0.0.1:27017/mydb');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var dirTree = {};

function readDir(dirName, dirObject) {
    var name = path.basename(dirName);
    dirObject[name] = {
        type: 'directory',
        content: {}
    };

    var curDirContent = fs.readdirSync(dirName);
    for (var i = 0; i < curDirContent.length; i++){
        var curPath = path.join(dirName, curDirContent[i]);

        if (fs.statSync(curPath).isDirectory()){
            readDir(curPath, dirObject[name].content);
        } else {
            dirObject[name].content[path.basename(curPath)] = {type: 'file'};
        }
    }
}

var pathTORead = path.join(__dirname, '..');
readDir(pathTORead, dirTree);

app.use(function(req, res, next) {
    console.log('Server got ' + req.method + ' request on URL:' + req.url);
    next();
});
app.use(express.static('public'));
app.get('/comments', function(req, res) {
    Comment.find({ path: req.query.path }, function (err, comments) {
        if (err) {
            console.error(err);
            res.status(404).end();
        } else {
            //console.log(comments);
            res.send(comments);
        }
    });
});
app.post('/comment', function(req, res) {
    var comment = new Comment({
        commentText: req.body.commentText,
        path: req.query.path
    });

    comment.save(function(err, comment){
        if (err) {
            console.error(err);
            res.status(404).end();
        } else {
            res.send('Comment added.');
        }
    });
});
app.get('/dir_manager', function(req, res) {
    res.send(dirTree);
});

app.listen(port, function() {
    console.log('Server listens to localhost:' + port);
});
