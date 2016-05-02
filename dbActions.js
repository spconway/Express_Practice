var models =        require('./mongodb');
var mongoose =      require('mongoose');
var fs =            require('fs-extra');
var db = {};

/**
 *
 * @param userName
 * @param callback
 */
db.getUser = function(userName, callback){
    var query = {};
    query['user_name'] = userName;
    models.User.findOne(query, function(err, user){
        if(err){
            console.log('getUserErr: ', err);
        }else{
            callback(err, user);
        }
    });
};

/**
 *
 * @param userName
 * @param callback
 */
db.getUserAndUpdateImage = function(userName, imgId, callback){
    var query = {'user_name': userName};
    models.User.findOneAndUpdate(query, {$push: {'images': imgId}}, function(err, doc){
        if(err){
            console.log("getuserandupdateimageerror: ", err);
        }else{
            console.log("doc: ", doc);
            callback(doc._id);
        }
    });
};

/**
 *
 * @param callback
 */
db.getAllUsers = function(callback){
    models.User.find({}, function(err, users){
        callback(users);
    });
};

/**
 * @param userName
 * @param imgObj
 * @param temp_path
 */
db.addImgToUser = function(userName, imgObj, temp_path){
    //Convert imgObj to new Img
    var img = new models.Img(imgObj);

    //Save _id from new Img
    var imgId = img._id;

    db.getUserAndUpdateImage(userName, imgId, function(creatorId){
        //Update imgObj with creator
        imgObj.creator = creatorId;

        //Save new image
        img.save(function(err, i){
            if(!err){
                //Log save image object
                console.log("temp path: ", temp_path, ", uploads/"+ img.file_name);
                //Move image to uploads directory
                //temp_path is where image is currently being copied from
                //Second parameter is new path with file name appended
                return fs.copy(temp_path, 'uploads/' + img.file_name, function(err) {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log("success! ", img.file_name, " has been uploaded.");
                    }
                });
            }

            //Log error
            console.log('image save error: ', err);
        });
    });
};

/**
 *
 * @param userObj
 * @param callback
 */
db.setUser = function(userObj, callback){
    var newUser = new models.User(userObj);
    newUser.save(function(err, user){
        callback(err, user);
    });
};

/**
 *
 * @param key
 * @param value
 * @param callback
 */
db.getImg = function(key, value, callback){
    models.Img.find({ key: value }, callback);
};

/**
 *
 * @param callback
 */
db.getAllImgs = function(callback){
    models.Img.find({}, callback);
};

/**
 *
 * @param userName
 * @param callback
 */
db.getAllImgsForUser = function(userName, callback){
    var query = {'user_name': userName};
    var imgUrls = [];
    models.User.findOne(query)
        .populate('images')
        .exec(function(err, image){
            var imgs = image.images;
            imgs.forEach(function(value, index){
                imgUrls.push(value.file_name);
            });
            return callback(err, imgUrls);
    });
};

/**
 *
 * @param imgObjs
 * @param callback
 */
db.setImg = function(imgObjs, callback){
    models.Img.save(imgObjs, callback);
};

/**
 *
 * @type {{}}
 */
module.exports = db;