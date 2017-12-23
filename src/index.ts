import * as express from 'express';
import * as compression from 'compression';
import * as session from 'express-session';
import * as bodyParser from'body-parser';
import * as multer from 'multer'; // v1.0.5
import * as Sequelize from 'sequelize';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env' });
const upload = multer({ dest: 'dist/img/articles/' }); // for parsing multipart/form-data
import DBConfig from './config/dbconfig';

// load all Crls
import ArticlesCtrl from './app/controller/ArticlesCtrl';
import CategoriesCtrl from './app/controller/CategoriesCtrl';
import CommentsCtrl from './app/controller/CommentsCtrl';
import ImagesCtrl from './app/controller/ImagesCtrl';
import UsersCtrl from './app/controller/UsersCtrl';

//  instantiate all ctrls
const articles = new ArticlesCtrl();
const categories = new CategoriesCtrl();
const users = new UsersCtrl();
const images = new ImagesCtrl();
const comments = new CommentsCtrl();

// Create Express server
const app = express();

// Connect to MongoDB
const sequelize = new Sequelize(DBConfig.uri, DBConfig.options);
const SessionStore = require('express-session-sequelize')(session.Store);

sequelize.define('sessions', {
    session_id: { type: Sequelize.STRING, primaryKey: true },
    expires: { type: Sequelize.INTEGER },
    data: { type: Sequelize.TEXT, allowNull: true }
});

// Express configuration
app.set('port', process.env.PORT);

//  MiddleWare
app.use(session({
    secret: 'keep it secret, keep it safe.',
    store: new SessionStore({ db: sequelize }),
    resave: true,
    saveUninitialized: false
}));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-  With, Content-Type, Accept');
    res.header ('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/'));

// ------------------------ Users Ctrl Handler ----------------------------------------
app.post('/Users/passwordCheck/', (req, res) => users.passwordCheck(req, res));
app.post('/Users/login', (req, res) => users.login(req, res));
app.post('/Users/register', (req, res) => users.register(req, res));
app.post('/Users/tokenCheck', (req, res) => users.tokenCheck(req, res));
app.put('/Users/usernameChange', (req, res) => users.usernameChange(req, res));
app.put('/Users/passwordChange', (req, res) => users.passwordChange(req, res));
// ------------------------------------------------------------------------------------

// ------------------------ Articles Ctrl Handler -------------------------------------
app.get('/Articles/index', (req, res) => articles.index(req, res));
app.get('/Articles/show', (req, res) => articles.show(req, res));
app.get('/Articles/byCategorie', (req, res) => articles.byCategorie(req, res));
app.get('/Articles/search', (req, res) => articles.search(req, res));
app.delete('/Articles/delete', (req, res) => articles.delete(req, res));
app.put('/Articles/edit', upload.array('images'), (req, res) => articles.edit(req, res));
app.post('/Articles/insert', upload.array('images'), (req, res) => articles.add(req, res));
// --------------------------------------------------------------------------------------

// ------------------------ Categories Ctrl Handler --------------------------------------
app.get('/Categories/all', (req, res) => categories.all(req, res));
app.get('/Categories/index', (req, res) => categories.index(req, res));
app.post('/Categories/add', (req, res) => categories.add(req, res));
app.put('/Categories/edit', (req, res) => categories.edit(req, res));
app.delete('/Categories/delete', (req, res) => categories.delete(req, res));
// ---------------------------------------------------------------------------------------

// ------------------------ Comments Ctrl Handler --------------------------------------
app.get('/Comments/find', (req, res) => comments.find(req, res));
app.post('/Comments/add', (req, res) => comments.add(req, res));
app.delete('/Comments/delete', (req, res) => comments.delete(req, res));
// ---------------------------------------------------------------------------------------

// ------------------------ Images Ctrl Handler --------------------------------------
app.get('/Images/find', (req, res) => images.find(req, res));
app.delete('/Images/delete', (req, res) => images.delete(req, res));
// ---------------------------------------------------------------------------------------

module.exports = app;