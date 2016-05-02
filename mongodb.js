var mongoose =  require('./mongoose');
var crypto =    require('crypto');
var Schema =    mongoose.Schema;
var models =    {};
//var salt =      crypto.randomBytes(128).toString('base64');
var salt =      'supersecretpasswordsaltshaker';

//create user schema
var userSchema = new Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    user_name: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    email_addr: String,
    admin: {type: Boolean, default: false},
    images: [
        {type: Schema.Types.ObjectId, ref: 'Img', unique: true}
    ],
    meta: [{
        age: String
    }],
    creation_date: {type: Date, default: Date()},
    modification_date: Date

});

//Create one way hashed password
//Convert to update somehow
userSchema.pre('save', function(next) {
    //Cache user
    var user = this;

    //One way hash password
    crypto.pbkdf2(user.password, salt, 10000, 512, function(err, derivedKey) {
        user.password = derivedKey.toString('base64');
        next();
    });
});

//Validate password against stored hash value
userSchema.methods.validatePassword = function(user_name, password, callback){
    //Get password
    this.model('User').findOne({'user_name': user_name}, function(err, user){
        if(!err){
            //One way hash password
            crypto.pbkdf2(password, salt, 10000, 512, function(err, derivedKey) {
                console.log("password: ", user.password, " ,\nEncrypted: ", derivedKey.toString('base64'));
                console.log(user.password == derivedKey.toString('base64'));
                return callback(user.password == derivedKey.toString('base64'));
            });
        }
    });
};

//create image schema
var imagesSchema = new Schema({
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    file_name: {type: String, required: true},
    type: {type: String, required: true},
    creation_date: {type: Date, default: Date()},
    modification_date: Date
});

//create model to use userSchema
models.User = mongoose.model('User', userSchema);
//create model to use image schema
models.Img = mongoose.model('Img', imagesSchema);

module.exports = models;