module.exports = (err, req, res, next) => {
    console.error('[error]', err);
    res.status(err.status || 500).json({ error: err.message || 'Server error' });
};