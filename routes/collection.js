const express = require("express");
const router = express.Router();
const path = require('path');



router.get('/', (req, res) => {

    res.sendFile(path.join(__dirname, '..', 'views', 'moiveCollection.html'));
    console.log(path.join(__dirname, '..', 'views', 'moiveCollection.html'))
})


module.exports = router;