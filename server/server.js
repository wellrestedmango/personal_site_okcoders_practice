const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./db')
const app = express();
const port = 3000;

app.use(cors()); //for aprsing cross origin request 
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded




const discountCodes = [
    {name:"save10d", type:"dollar", amount:"10"},
    {name:"save10p", type:"percent", amount:"10"},
    {name:"save20d", type:"dollar", amount:"20"},
    {name:"save20p", type:"percent", amount:"20"}
]


app.get('/', (req, res) => {
    console.log('made it to "/"');
    res.send('Hello, world!');
});


app.get('/getMenu', async (req, res) => {
    console.log("Made it '/getMenu'");

    //get data back and call it menu. select from menu column
    const {data: menu, error} = await supabase
    .from('menu')
    .select()

    if (error){
        return res.status(500).json({error: error.message});
    }

    res.json(menu)
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


app.post('/login', async (req,res) => {
    console.log("Made it to '/login'", req.body)

    const {username, password} = req.body;

    const {data, error} = await supabase.auth.signInWithPassword({
        email: username,
        password: password
    });
    
    if (error){
        return res.status(401).json({message:"Invalid Credentials"});
    }

    res.status(200).json({message:`Welcome ${username}!`});
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



app.post('/comment', async (req,res) => {
    console.log("Made it to '/comment'", req.body)

    if(!req.body || req.body.length < 1){
        res.status(400).json({message: "Error handling order form"})
    }

    const comment = req.body;

    const {data, error} = await supabase
    .from('contact_form_messages')
    .insert([
        {
            first_name: comment.first_name,
            last_name: comment.last_name,
            email: comment.email,
            comment: comment.message
        }
    ])

    if (error){
        res.status(500).json({message: "Error saving comment. Please try again later"})
    }

    res.status(200).json({message: "Comment saved successfully."})
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});