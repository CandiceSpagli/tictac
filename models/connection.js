var mongoose = require('mongoose')

var options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
}

mongoose.connect('mongodb+srv://User:userz@cluster0.he0wy.mongodb.net/tictac?retryWrites=true&w=majority',
options,
function (err){
    if(err) {
        console.log('----ERR', err)
    } else {
        console.log('CONNEXION REUSSIE')

    }
}

);

