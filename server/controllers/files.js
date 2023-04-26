const File = require('../models/filestore.js');

// A simple handler for rendering the upload page
const uploadPage = (req, res) => {
  res.render('upload');
};

const uploadFile = async (req, res) => {
  if (!req.files || !req.files.sampleFile) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }

  const { sampleFile } = req.files;

  try {
    const newFile = new File(sampleFile);
    const doc = await newFile.save();
    return res.status(201).json({
      message: 'File stored successfully!',
      fileId: doc._id,
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Something went wrong uploading file!',
    });
  }
};

const retrieveFile = async (req, res) => {
  /* Ensure that the user gave us an _id. */
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let doc;
  try {
    // First we attempt to find the file by the _id sent by the user.
    doc = await File.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    // If we have an error contacting the database, let the user know something happened.
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving file!' });
  }

  // Below the catch, we know our request has been successful.

  // If the result is empty, send a 404.
  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }

  // Set headers for the file.
  res.set({
    // Content-Type tells the browser what type of file it is (png, mp3, zip, etc)
    'Content-Type': doc.mimetype,

    // Content-Length tells it how many bytes long it is.
    'Content-Length': doc.size,
    // Adding “attachment; will force file to download when retrieved rather than show
    // Doesn’t have an impact on things like img tags
    // 'Content-Disposition': `attachment; filename="${doc.name}"`

    /* Content-Disposition gives the browser some other information about the file.
       Below we can see that we are telling the browser the files name. If we don't
       do this, it will assume the name of the file is /retrieve (since that is the
       url it got it from).
       We can also add "attachment;" as shown in the comment below. By default
       the browser will simply attempt to display the result of the GET request
       to the user if it can. For example, if we send an image, it will redirect
       to a page that just shows the image. However, if we tell it the file should
       be treated as an attachment it will download the file and not redirect the user.
    */
    'Content-Disposition': `filename="${doc.name}"`, /* `attachment; filename="${doc.name}"` */
  });

  /* Finally once we have set the headers, we can write the actual image data to
     the response and send it back to the user. With the above headers set, the
     browser will know how to properly interpret the data (which is just binary).
  */
  return res.send(doc.data);
};

module.exports = {
  uploadPage,
  uploadFile,
  retrieveFile,
};