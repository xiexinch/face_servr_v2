const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/face', {useNewUrlParser: true, useUnifiedTopology: true}, err => {
    if (!err) {
        console.log('success')
    }
})

let FaceSchema = {uuid: String, user_info: String, urls: [String]}

mongoose.model('face', FaceSchema)

let Face = mongoose.model('face')

Face.find({}, (err, faces) => {
    if (!err) {
        console.log(faces)
    } else {
        console.log(err)
    }
})