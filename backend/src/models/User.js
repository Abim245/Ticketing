const mongose = require('mongoose');

const userSchema = new mongose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true,
        unique:true
    },
    Id : {
        type: String,
    }
})

export default mongose.model("User", userSchema);