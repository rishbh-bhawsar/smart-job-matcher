const router = require('express').Router();
const wrap = require('../utils/asyncHandler');
const job = require('../controllers/jobController');
const notification = require('../controllers/notificationController');
const profile = require('../controllers/profileController');
const sync = require('../controllers/syncController');

router.get('/jobs', wrap(job.list));
router.patch('/jobs/:id/status', wrap(job.updateStatus));

router.get('/notifications', wrap(notification.list));
router.patch('/notifications/:id/read', wrap(notification.read));

router.get('/profile', wrap(profile.get));
router.put('/profile', wrap(profile.update));

router.post('/sync/run', wrap(sync.run));

module.exports = router;