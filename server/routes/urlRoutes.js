const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController')


router.post('/shorten', urlController.createUrl);
router.get('/shorten/:shortCode', urlController.getUrl);
router.put('/shorten/:shortCode', urlController.updateUrl);
router.delete('/shorten/:shortCode', urlController.deleteUrl);
router.get('/stats/:shortCode', urlController.statsOfUrl);

module.exports = router;