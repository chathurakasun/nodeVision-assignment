var express = require("express");
var router = express.Router();
require("dotenv").config();
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

  client.detectLabels(params, function (err, response) {
    //Error Handling
    if (err) {
      console.log("The ERROR", err.message);
      return res.status(404).json({
        // not found status code
        error: "Unable to process the request",
      });
    }
    let imageLabelNames = [];
    // get the labels array
    const labels = response.Labels;
    // label array sorting according the the "Confidence"
    const sortedLabels = labels.sort((b, a) => a.Confidence - b.Confidence);

    // store strings to imagelabelNames array
    sortedLabels.forEach((label) => {
      imageLabelNames.push(
        `${label.Name} : ${label.Confidence.toString().split(".")[0]} %`
      );
    });

    return res.json({
      labels: imageLabelNames,
    });
  });
});

module.exports = router;
