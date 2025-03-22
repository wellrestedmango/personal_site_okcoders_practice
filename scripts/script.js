const user = {
    username: 'admin',
    password: 'password123'
}

let loggedInUser = null;
let cart = [];
let cartList = document.getElementById('cart-items');
let liElement = document.createElement('li');
let totalElement = document.getElementById('total');


function handleLogin(event) {
    event.preventDefault();
    const usernameElement = document.getElementById('username');
    const passedName = usernameElement.value;
    const passwordElement = document.getElementById('password');
    const passedPass = passwordElement.value;


    if (passedName !== user.username || passedPass !== user.password){
        alert('Login is incorrect')
        loggedInUser = null;
        usernameElement.value = null;
        passwordElement.value = null;
        return
    }
    else{
        loggedInUser = user;
        usernameElement.value = null;
        passwordElement.value = null;
        //this only works because we just have the one user for this example
        //otherwise you would probably assign it to a user ID after checking
    }

    let welcomeMessage = document.getElementById('welcome-message');
    welcomeMessage.innerText = `Welcome ${loggedInUser.username}`;
}

function addToCart(item, price){
    if (cart.length === 0){
        const itemToInsert = {
            item: item,
            price: price,
            quantity: 1
        }
        cart.push(itemToInsert);
    }
    else{
       let inArray = false;
       for (let i in cart){
            if(cart[i].item === item){
                cart[i].quantity++;
                inArray = true;
            }
       }
       if(inArray === false){
           const itemToInsert = {
               item: item,
               price: price,
               quantity: 1
           }
           cart.push(itemToInsert);
       }
    }
    clearCartView();
    printCart();
}

function printCart(){
    let total = 0;
    let itemTotal = 0;

    for (let i in cart){
        itemTotal = cart[i].price * cart[i].quantity;
        total += itemTotal;
        liElement.innerHTML = `Item: ${cart[i].item} <br>
        Quantity: ${cart[i].quantity}
        <button onclick = "decrementItem('${cart[i].item}')" id= "decrement">-</button>
        <button onclick = "incrementItem('${cart[i].item}')" id ="increment">+</button>
        <br>
        Price: $${itemTotal.toFixed(2)} `;
        cartList.appendChild(liElement.cloneNode(true));
    }
    totalElement.innerText = total.toFixed(2);
}

function clearCartView(){
    cartList.innerHTML = '';
    return
}

function clearCart(){
    cart = [];
    clearCartView();
    printCart();
}

function decrementItem(item) {
    console.log("made it")
    for (let i in cart){
        if (cart[i].item == item){
            if (cart[i].quantity > 0){
                cart[i].quantity--;
            }else{
                break;
            }
        }
    }
    clearCartView();
    printCart();
}

function incrementItem(item) {
    console.log("made it")
    for (let i in cart){
        if (cart[i].item == item){
            cart[i].quantity++;
        }
    }
    clearCartView();
    printCart();
}