const formidable = require("formidable");
const AWS = require("aws-sdk");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

exports.uploadImage = (req, res) => {
  const { image } = req.body;
  //   console.log("BODY :  ", req.body);
  //   const image = req.body;
  //   console.log(image);
  // image data

  const base64Data = new Buffer.from(
    image.toString().replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );
  //   res.send({ message: "Images heat Route" });
  //   console.log(base64Data);
  const type = image.toString().split(";")[0].split("/")[1];

  const params = {
    Bucket: "immo-togo",
    Key: `articles/${uuidv4()}.${type}`,
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64",
    ContentType: `image/${type}`,
  };
  let data = {};

  s3.upload(params, (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).json({ error: "Image refuse" });
    }
    data.url = result.Location;
    data.key = result.Key;
    // console.log("DATA: ", data);
    res.status(200).send(data);
  });
};

// exports.uploadImage = (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Image could not upload",
//       });
//     }
//     const { image } = files;
//     //   console.log(image)
//     if (image.size > 2000000) {
//       return res.status(400).json({
//         error: "Image should be less than 2mb",
//       });
//     }
//     // upload image to s3
//     const params = {
//       Bucket: "immo-togo",
//       Key: `articles/${uuidv4()}`,
//       Body: fs.readFileSync(image.path, { width: 200, height: 200 }),
//       ACL: "public-read",
//       ContentType: `image/jpg`,
//     };
//     // Initiating a customised response data
//     let data = {};

// s3.upload(params, (err, result) => {
//   if (err) {
//     console.log(err);
//     res.status(400).json({ error: "Image refuse" });
//   }
//   data.url = result.Location;
//   data.key = result.Key;
//   // console.log("DATA: ",data)
//   res.status(200).send(data);
// });
//   });
// };
