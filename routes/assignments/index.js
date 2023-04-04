const express = require('express');
const router = express.Router();
const createRouter = require('./create.js');
const deleteRouter = require('./delete.js');
const updateRouter = require('./update.js');

router.use('/create', createRouter);
router.use('/update', updateRouter);
router.use('/delete', deleteRouter);

module.exports = router