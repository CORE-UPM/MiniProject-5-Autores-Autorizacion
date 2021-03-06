var express = require('express');
var router = express.Router();

const multer = require('multer');
const storage = multer.memoryStorage()
const upload = multer({
  storage: storage,
  limits: {fileSize: 20 * 1024 * 1024}});

const quizController = require('../controllers/quiz');
const sessionController = require('../controllers/session');
const userController = require("../controllers/user");

//-----------------------------------------------------------

// autologout
router.all('*',sessionController.deleteExpiredUserSession);

//-----------------------------------------------------------

// Routes for the resource /session
router.get('/login',    sessionController.new);     // login form
router.post('/login',   sessionController.create);  // create sesion
router.delete('/login', sessionController.destroy); // close sesion

//-----------------------------------------------------------

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Author page.
router.get('/author', (req, res, next) => {
  res.render('author');
});

// Autoload
router.param('quizId', quizController.load);
router.param('userId', userController.load);


// Routes for the resource /quizzes
router.get('/quizzes',
    quizController.index);
router.get('/quizzes/:quizId(\\d+)',
    quizController.adminOrAuthorRequired,
    quizController.show);
router.get('/quizzes/new',
    sessionController.loginRequired,
    quizController.new);
router.post('/quizzes',
    sessionController.loginRequired,
    upload.single('image'),
    quizController.create);
router.get('/quizzes/:quizId(\\d+)/edit',
    quizController.adminOrAuthorRequired,
    quizController.edit);
router.put('/quizzes/:quizId(\\d+)',
    quizController.adminOrAuthorRequired,
    upload.single('image'),
    quizController.update);
router.delete('/quizzes/:quizId(\\d+)',
    quizController.adminOrAuthorRequired,
    quizController.destroy);

router.get('/quizzes/:quizId(\\d+)/play',
    quizController.play);
router.get('/quizzes/:quizId(\\d+)/check',
    quizController.check);

// Route to quiz attachment
router.get('/quizzes/:quizId(\\d+)/attachment',
    quizController.attachment);


// Routes for the resource /users
router.get('/users',
    sessionController.loginRequired,
    userController.index);
router.get('/users/:userId(\\d+)',
    sessionController.loginRequired,
    userController.show);
router.get('/users/new',
    userController.new);
router.post('/users',
    userController.create);
router.get('/users/:userId(\\d+)/edit',
    sessionController.adminOrMyselfRequired,
    userController.edit);
router.put('/users/:userId(\\d+)',
    sessionController.adminOrMyselfRequired,
    userController.update);
router.delete('/users/:userId(\\d+)',
    sessionController.adminOrMyselfRequired,
    userController.destroy);


module.exports = router;
