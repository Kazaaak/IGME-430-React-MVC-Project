const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

// Log out and go back to the login page
const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

// Log the user in, go to the home page
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/home' });
  });
};

// Create an account for the user, go to the home page
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/home' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// Change the user's password
// const changePassword = async (req, res) => {
//   const oldPass = `${req.body.oldPass}`;
//   const newPass1 = `${req.body.newPass1}`;
//   const newPass2 = `${req.body.newPass2}`;

//   if (!oldPass || !newPass1 || !newPass2) {
//     return res.status(400).json({ error: 'All fields required!' });
//   } if (newPass1 !== newPass2) {
//     return res.status(400).json({ error: 'New passwords do not match!' });
//   } if (oldPass === newPass1) {
//     return res.status(400).json({ error: 'New password cannot be the same as the old one!' });
//   }

//   Account.authenticate((req.session.account.username), pass, (err, account) => {
//     if (err || !account) {
//       return res.status(401).json({ error: 'Old password is not correct!' });
//     }
//   });

//   try {
//     const hash = await Account.generateHash(newPass1);
//     req.session.account.password = hash;
//     return res.status(204).json({ message: 'Successfully updated!' });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ error: 'An error occured!' });
//   }
// };

module.exports = {
  loginPage,
  login,
  logout,
  signup,
};
