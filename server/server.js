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
    {name:"save20p", type:"percent", amount:"20"}
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
    console.log("Made it to '/getDiscount'", req.body);
    const discount = req.body;
    let total = 0;
    let codeInArray = false;
    let discountAmount = 0;
    let discountType = "";

    for (let i = 0; i < discountCodes.length; i++){
        if (discount.promoCode == discountCodes[i].name){
            discountAmount = discountCodes[i].amount;
            discountType = discountCodes[i].type;
            codeInArray = true;
        }
    }

    if(codeInArray == false){
        res.json({
            total:discount.currTotal,
            message: "Invalid discount code"
        });
    }


    if (discountType == "percent"){
        if (discount.currTotal == 0){
            res.json({total:0});
        }else {
            total = discount.currTotal - (discount.currTotal * (discountAmount/100));
            total.toFixed(2);
            res.json({
                total:total,
                message: `You saved ${discountAmount} percent!`
            })
        }
    }

    if (discountType == "dollar"){
        if (discount.currTotal - discountAmount <= 0){
            res.json({total:0})
        }else{
            total = discount.currTotal - discountAmount;
            res.json({
                total:total,
                message: `You saved ${discountAmount} dollars`
            });
        }
    }
});


app.post('/login', (req,res) => {
    console.log("Made it to '/login'", req.body)

    const {username, password} = req.body;

    if (username != user.username || password != user.password){
        res.status(401).json({message: "Incorrect Username or Password"})
    }else{
        res.status(200).json({message: `Welcome ${username}`})
    }
});


const orderArray = []
app.post('/checkout', (req,res) => {
    console.log("Made it to '/checkout'", req.body)

    if(!req.body || req.body < 1){
        res.status(400).json({message: "Order is empty"})
    }

    const order = req.body;
    orderArray.push(order);
    res.status(200).json({message: "Order Confirmed"})

});


const comments = []
app.post('/comment', (req,res) => {
    console.log("Made it to '/comment'", req.body)

    if(!req.body || req.body.length < 1){
        res.status(400).json({message: "Error handling order form"})
    }

    const comment = req.body;
    comments.push(comment);
    res.status(200).json({message: "Comment received!"})
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});