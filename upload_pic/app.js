var express	= require('express');
var multer	= require('multer');
var app		= express();
var fs		= require('fs');
var readChunk	= require('read-chunk');
var imageType	= require('image-type');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({
    storage: storage
}).single('file');

function check_extension(elem)
{
    if (elem.mimetype.indexOf("image") >= 0) {
	var buffer = readChunk.sync(__dirname + '/uploads/' + elem.originalname, 0, 12);
	if (imageType(buffer)) {
	    return (0);
	}
    }
    return (1);
}

app.get('/', function(req,res){
    res.sendFile(__dirname + "/index.html");
});

app.post('/api/photo',function(req,res) {
    upload(req, res, function(err) {
	if (err) {
	    console.log(err);
	}
	if (check_extension(req.file) != 0) {
	    fs.unlinkSync(__dirname + '/uploads/' + req.file.originalname);
	    res.send("mauvais format");
	} else {
	    res.send("fichier uploader");
	}
    });
});

app.listen(3000, function() {
    console.log("Working on port 3000");
});
