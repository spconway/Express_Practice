var express =       require('express');
var formidable =    require('formidable');
var util =          require('util');
var fs =            require('fs-extra');
var dbActions =     require('../dbActions');
var requireLogin =  require('../requireLogin');
var router =        express.Router();

/* GET home page. */
router.get('/', requireLogin, function(req, res) {
    //Make call to get users images
    dbActions.getAllImgsForUser(req.session.user.user_name,function(err, images){
        console.log("images: ", images);
        res.render('myImages', {
            title: 'My Images',
            message: 'Your images will be display below',
            images: images
        });
    });
});

/* POST */
//uploading images
router.post('/', function(req, res){

    var form = new formidable.IncomingForm();

    form.parse(req)
        .on('progress', function(received, expected){
            //console.log("Received: ", received, " \nExpected: ", expected);
        })
        .on('end', function() {
            /* Temporary location of our uploaded file */
            //Temp path is required because fs.copy
            var temp_path = this.openedFiles[0].path;
            /* The file name of the uploaded file */
            var file_name = this.openedFiles[0].name;
            /* The image type */
            var type = this.openedFiles[0].type;

            var img = {
                creator: null,
                file_name: file_name,
                type: type
            };

            dbActions.addImgToUser(req.session.user.user_name, img, temp_path);
    });
    console.log("test test");
    // redirect user back to current page
    res.redirect('/myImages');

});

module.exports = router;
