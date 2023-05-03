const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getTwiddles', mid.requiresLogin, controllers.Twiddle.getTwiddles);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/home', mid.requiresLogin, controllers.Twiddle.homePage);
  app.post('/home', mid.requiresLogin, controllers.Twiddle.makeTwiddle);

  app.post('/upload', mid.requiresLogin, controllers.File.uploadFile);
  app.get('/retrieve', mid.requiresLogin, controllers.File.retrieveFile);
  app.get('/uploadPage', controllers.File.uploadPage);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
