const models = require('../models');

const { Twiddle } = models;

const makerPage = async (req, res) => res.render('app');

const makeTwiddle = async (req, res) => {
  if (!req.body.text || !req.body.image) {
    return res.status(400).json({ error: 'Both text and image are required!' });
  }

  const twiddleData = {
    username: req.session.account.username,
    text: req.body.text,
    image: req.body.image,
    owner: req.session.account._id,
  };

  try {
    const newTwiddle = new Twiddle(twiddleData);
    await newTwiddle.save();
    return res.status(201).json({ text: newTwiddle.text, image: newTwiddle.image });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Twiddle already exists!' });
    }
    return res.status(500).json({ error: 'An error occured making twiddle!' });
  }
};

const getTwiddles = async (req, res) => {
  try {
    const query = { /* owner: req.session.account._id */ };
    const docs = await Twiddle.find(query).select('text image').lean().exec();

    return res.json({ twiddles: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving twiddles!' });
  }
};

module.exports = {
  makerPage,
  makeTwiddle,
  getTwiddles,
};
