const express = require('express');
const passport = require('passport');
const router = express.Router();
const groupController = require('../controllers/groups_controller');
router.get('/creategroup',passport.checkAuthentication, groupController.creategroup);
router.get('/mygroups', passport.checkAuthentication,groupController.mygroups);
router.post('/submit',passport.checkAuthentication, groupController.submit);
router.get('/:id', passport.checkAuthentication,groupController.checkgroup,groupController.gotogroup);
router.get('/:id/delete', passport.checkAuthentication,groupController.checkgroup,groupController.deletegroup);

router.get('/:id/addnewuser',passport.checkAuthentication,groupController.checkgroup, groupController.addnewuser);
router.post('/:id/createuser',passport.checkAuthentication,groupController.checkgroup, groupController.createuser);
router.get('/:id/removeuser',passport.checkAuthentication,groupController.checkgroup, groupController.toremoveuser);
router.get('/:id/removeuser/remove',passport.checkAuthentication,groupController.checkgroup, groupController.removeuser);

router.get('/:id/usersingroup', passport.checkAuthentication,groupController.checkgroup,groupController.usersingroup);
router.get('/:id/myusersingroup', passport.checkAuthentication,groupController.checkgroup,groupController.myusersingroup);
router.get('/:id/assigntask/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.checkuser,groupController.assigntask);
router.post('/:id/submit/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.checkuser,groupController.assigntasksubmit);
router.get('/:id/histask/:id3', passport.checkAuthentication,groupController.checkgroup,groupController.histask);
router.get('/:id/hisgiventask/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.checkuser,groupController.hisgiventask);
router.get('/:id/hisongoingtask/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.checkuser,groupController.hisongoingtask);
router.get('/:id/hiscompletedtask/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.checkuser,groupController.hiscompletedtask);

router.get('/:id/groupchat', passport.checkAuthentication,groupController.checkgroup,groupController.groupchat);
router.post('/:id/groupsubmit',passport.checkAuthentication,groupController.checkgroup, groupController.groupsubmit);
router.get('/:id/groupchat/deleteforme/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.deleteforme);
router.get('/:id/groupchat/deleteforeveryone/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.deleteforeveryone);
router.get('/:id/groupchat/alldelete', passport.checkAuthentication,groupController.checkgroup,groupController.alldelete);

router.get('/:id/allprojects', passport.checkAuthentication,groupController.checkgroup,groupController.allprojects);
router.get('/:id/addproject', passport.checkAuthentication,groupController.checkgroup,groupController.addproject);
router.post('/:id/submitproject', passport.checkAuthentication,groupController.checkgroup,groupController.submitproject);
router.get('/:id/allprojects/download/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.download);
router.get('/:id/allprojects/delete/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.deleteproject);
router.get('/:id/allprojects/edit/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.editproject);
router.get('/:id/allprojects/markascompleted/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.markascompleted);
router.post('/:id/allprojects/updateproject/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.updateproject);
router.get('/:id/allprojects/:id2', passport.checkAuthentication,groupController.checkgroup,groupController.showproject);
module.exports = router;