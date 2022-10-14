## Backend API response_Solution

```
var express = require("express");
var router = express.Router();
require("dotenv").config();
// import aws-sdk
const AWS = require("aws-sdk");

router.post("/classify", function (req, res, next) {

  //AWS api
  const config = new AWS.Config({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION, // ap-southeast-1
  });

  const client = new AWS.Rekognition();
  const params = {
    Image: {
      Bytes: req.files.file.data,
    },
  };

  // console.log(req.files.file); // req object structure realize

  //Detecting Lables
  client.detectLabels(params, function (err, response) {
    //Error Handling
    if (err) {
      console.log("The ERROR", err.message);
      return res.status(404).json({
        // not found status code
        error: "Unable to process the request",
      });
    }
    // with No Errors
   // console.log(response); // returns an object array {labels: [{}{}{}...]}

    let imageLabelNames = [];

    response.Labels.forEach((label) => {
      imageLabelNames.push(
        `${label.Name} : ${label.Confidence.toString().split(".")[0]} %`
      );
    });

    console.log(imageLabelNames);
    return res.json({
      labels: imageLabelNames,
    });
  });

  // Your code ends here //


});

module.exports = router;


```

## Sample

![Sample](public/images/node-vision-sample.gif)
