const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    console.log('made it to "/"');
    res.send('Hello, world!');
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});