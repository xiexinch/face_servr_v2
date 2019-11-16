var express = require('express');
var router = express.Router();
const axios = require('axios')
const fs = require('fs')

const mongoose = require('mongoose')
//const FaceSchema = require('models/faceModel.js')
let FaceSchema = {uuid: String, user_info: String, url: String}
let Face = mongoose.model('face', FaceSchema)

var multer = require('multer')
let posts = multer({dest: 'posts/'})

let config = {}
fs.readFile('routes/config.json', 'utf8',function(err, data) {
    if (err) throw err
    config = JSON.parse(data)
    console.log('**configuration loaded**')
})

// const FACE_SEARCH_URL = config['face_search_url']
// const FACE_ADD_URL = config['face_add_url']
// const TOKEN = config['token']
// const IMG_PATH = config['image_path']
// const FILE_PATH = 'public/images/'
// const IMAGE_TYPE = config['image_type']
// const GROUP_ID = config['group_id']

router.get('/', function(req, res, next) {
  res.setHeader('Content-Type', 'text/html')
  res.sendfile('webview/faces.html')
});

router.get('/hello', function(req, res, next) {
    res.render('hello_face', {message: 'hello'})
})



// 人脸搜索api
router.post('/search_face', posts.single('search_face'),function(req, res, next) {
  console.log(req.ip)

  let imgData = req.body.image
  let base64Data = imgData.toString().replace(/^data:image\/\w+;base64,/, "");

  axios.post(config['face_search_url'] + config['token'], {
      "image": base64Data,
      "image_type": config['image_type'],
      "group_id_list": config['group_id'],
      "max_face_num": 5
  }).then(function(response) {
      console.log(response.data)
      if (response.data.error_code == 0) {
        console.log('success')
        let face_list = response.data.result.face_list
        res.json(face_list)
      } else {
        console.log("fail")
        res.send(response.data.error_msg)
      }
      
  }).catch(function(error) {
      res.json(error)
      console.log(error)
  })
})

const IMAGE_FILE_PATH="public/images/"

// 服务器端存储人脸图像
router.post('/add_face', posts.single('user_face'), function(req, res, next) {
    //req.body是普通表单域
    //req.file是文件域
    let msg={
      body:req.body,
      file:req.file
  }
  let user_id = req.body.userid
  let user_info = req.body.userinfo

  console.log(user_id)
  console.log(user_info)
  
  //将临时文件上传到/public/images中
  let image_url = IMAGE_FILE_PATH + req.file.originalname
  let image_access_url = 'images/' + req.file.originalname
  let output=fs.createWriteStream(image_url)
  let input=fs.createReadStream(req.file.path)
  input.pipe(output)
  Face.create({uuid: user_id, user_info: user_info, url: image_access_url}, err => {
    if (err) {
      res.json(err)
      throw err
    }
    console.log("added " + user_id)
  })
  Face.find({}, (err, data) => {
    if (err) {
      res.json(err)
      throw err
    }
    console.log(data)
    res.json(data)
  })
})

router.get('/get_faces_info', function(req, res, next) {
  Face.find({}, (err, faceList) => {
    if (err) {
      res.json(err)
      throw err
    }
    let info_list = []
    faceList.forEach(face => {
      info_list.push({userinfo: face.user_info, userid: face.uuid, url: face.url})
    });
    res.json(info_list)
  })
})

router.get('/get_face_image', function(req, res, next) {
  let userid = req.body.userid
  Face.find({uuid: userid}, (err, face) => {
    if (err) {
      res.json(err)
      throw err
    }
    res.json(face.url) 
  })
})


module.exports = router;
