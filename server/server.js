const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors()); //for aprsing cross origin request 
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


//cart
const menu = [
    {name: 'Americano', price: 2.5, type: 'hot'},
    {name: 'Latte', price: 3.0, type: 'hot'},
    {name: 'Cappuccino', price: 3.5, type: 'hot'},
    {name: 'Frozen Americano', price: 4.5, type: 'cold'},
    {name: 'Frozen Latte', price: 2.5, type: 'cold'},
    {name: 'Pup Cup', price: 0, type: 'cold'},
];

const discountCodes = [
    {name:"save10d", type:"dollar", amount:"10"},
    {name:"save10p", type:"percent", amount:"10"},
    {name:"save20d", type:"dollar", amount:"20"},
    {name:"save20p", tpye:"percent", amount:"20"}
]

const user = {username: 'admin', password: 'password123'}



app.get('/', (req, res) => {
    console.log('made it to "/"');
    res.send('Hello, world!');
});


app.get('/getMenu', (req, res) => {
    console.log("Made it '/getMenu'");
    res.json(menu);
});

app.post('/getDiscount', (req,res) => {
    console.log("Made it to '/getDiscount'");
    console.log(req.body);

    //take this tuple and get the code and current total value from it
    //compare those values to the promocodes here then return the discount
});

app.post('/login', (req,res) => {
    console.log("Made it to '/login'", req.body)
});



app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});