const user = {
    username: 'admin',
    password: 'password123'
}

let loggedInUser = null;
let cart = [];
let cartList = document.getElementById('cart-items');
let liElement = document.createElement('li');
let totalElement = document.getElementById('total');
let total = 0;
let discountMessage = document.getElementById('discount');
let promoCodeElement = document.getElementById("promo");
promoCodeElement.value = "";
let promoCode = "";



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
    printCart();
}



function printCart(){
    clearCartView();
    let itemTotal = 0;
    total = 0;
    for (let i in cart){
        itemTotal = cart[i].price * cart[i].quantity;
        total += itemTotal;
        liElement.innerHTML = `Item: ${cart[i].item} <br>
        Quantity: ${cart[i].quantity}
        <button onclick = "decrementItem('${cart[i].item}')" id= "decrement">-</button>
        <button onclick = "incrementItem('${cart[i].item}')" id ="increment">+</button>
        <button onclick = "removeItem('${cart[i].item}')" id ="remove">Remove</button>
        <br>
        Price: $${itemTotal.toFixed(2)} `;

        if (cart[i].quantity > 0){
            cartList.appendChild(liElement.cloneNode(true));
        }
    }
    if (promoCodeElement.value != ""){
        promoCode = promoCodeElement.value;
    }
    promoCodeElement.value = "";
    totalElement.innerText = getTotalWithDiscount(promoCode);
}



function clearCartView(){
    cartList.innerHTML = '';
    return
}



function clearCart(){
    cart = [];
    printCart();
}



function decrementItem(item) {
    for (let i in cart){
        if (cart[i].item == item){
            if (cart[i].quantity > 0){
                cart[i].quantity--;
            }else{
                break;
            }
        }
    }
    printCart();
}



function incrementItem(item) {
    for (let i in cart){
        if (cart[i].item == item){
            cart[i].quantity++;
        }
    }
    printCart();
}



function removeItem(item){
    for (let i in cart){
        if (cart[i].item == item){
            cart.splice(i,1);
        }
    }
    printCart();
}



function getTotalWithDiscount(promoCode = ""){
    let discountValue = 0;
    switch (promoCode){
        case "test5":
            discountValue = 5;
            break;
        case "test10":
            discountValue = 10;
            break;
        case "test15":
            discountValue = 15;
            break;
        default:
            discountMessage.innerText = "";
            break;
    }

    if (discountValue > 0){
        if (total >= discountValue){
            total -= discountValue;
            discountMessage.innerText = `You used code ${promoCode} for $${discountValue} off`
        } else {
            total = 0;
            discountMessage.innerText = `You used code ${promoCode} for $${discountValue} off`
        }
    }
    return total.toFixed(2);
}




