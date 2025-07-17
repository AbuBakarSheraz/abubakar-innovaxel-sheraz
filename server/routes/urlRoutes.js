const express = require('express');
const router = express.Router();
const urlController = require('../controllers/urlController')


router.post('/shorten', urlController.createUrl);
router.get('/shorten/:shortcode', urlController.getUrl);
router.put('/editUrl', urlController.editUrl);
router.delete('/deleteUrl', urlController.deleteUrl);
router.stats('/stats', urlController.statsOfUrl);

module.exports = router;