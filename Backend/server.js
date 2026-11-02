const app = require('./app.js');
const startCron = require('./corn/jobCron.js');

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
    startCron();
});