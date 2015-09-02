var CheckInManager = require('../../managers/check-in');
var express = require('express');
var router = express.Router();

var checkInManager = new CheckInManager();

router.use(require('body-parser').json());
router.use(require('cors')());


router.post('/', function(req, res){
  console.log(req.body);
  console.log(CheckInManager);
  checkInManager.createCheckIn(req.body.latitude, req.body.longitude, req.body.activity, req.body.userId)
  .then(function(checkinRes){
    res.sendStatus(201);
  });

})

router.get('/', function(req, res){
  checkInManager.getCheckIns(req.query.latitude, req.query.longitude, req.query.distance)
  .then(function(body){
    res.send(body);
  });

})

module.exports = router;