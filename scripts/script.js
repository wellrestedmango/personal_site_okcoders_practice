
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



async function handleLogin(event) {
    event.preventDefault();
    const usernameElement = document.getElementById('username');
    const passedName = usernameElement.value;
    const passwordElement = document.getElementById('password');
    const passedPass = passwordElement.value;


    const response = await fetch('http://127.0.0.1:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: passedName,
            password: passedPass
        })
    });

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



function createMenu(menu){
    let ulElement = document.getElementById("menu");
    ulElement.style.listStyleType = 'none';
    if(menu && menu.length > 0){
        for (let i = 0; i < menu.length; i++) {
            const liElement = document.createElement('li')
            liElement.innerHTML = `
            <div class="menu-item">
            <span id="${menu[i].name}">${menu[i].name}</span>
            <button onclick="addToCart('${menu[i].name}', '${menu[i].price}')">Add To Cart ($${menu[i].price})</button>
            </div>
         `;
         ulElement.appendChild(liElement);
        }
    }
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


//right now the discount stuff is broken
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
    // if (promoCodeElement.value != ""){
    //     promoCode = promoCodeElement.value;
    // }
    // promoCodeElement.value = "";
    // totalElement.innerText = getTotalWithDiscount(promoCode);
    totalElement.innerText = total;
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

//this is totally broken - find out why you are getting an object back OR move all of it to server side
// async function getTotalWithDiscount(providedCode = ""){

//     if(providedCode == ""){
//         return total.toFixed(2);
//     }

//     const response = await fetch("http://127.0.0.1:3000/getDiscount")
//     if (!response.ok){
//         console.error("invalid response ");
//         return
//     }
//     let activeCodes = await response.json();
 
//     let discountValue = 0;
//     let pOrD = "";
//     let activeCodeNames = [];

//     for (let i = 0; i < activeCodes.length; i++){
//         activeCodeNames.push(activeCodes[i].name);
//     }

//     if (activeCodeNames.includes(providedCode)){
//         for (let y=0; y < activeCodes.length; y++){
//             if(activeCodes[y].name == providedCode){
//                 discountValue = activeCodes[y].amount;
//                 pOrD = activeCodes[y].type;
//             }
//         }
//     }

//     console.log(pOrD);
//     console.log(discountValue);

    
//     if (pOrD == 'percent'){
//         discountMessage.innerText - `You used code ${providedCode} for ${discountValue}% off`
//         discountValue = discountValue/100;
//         discountValue.toFixed(2);
//     }
//     if (total >= discountValue){
//         total -= discountValue;
//         discountMessage.innerText = `You used code ${providedCode} for ${discountValue} off`
//     } else {
//         total = 0;
//         discountMessage.innerText = `You used code ${providedCode} for ${discountValue} off`
//     }

//     return total.toFixed(2);
// }



async function getMenuFromServer(){
    const response = await fetch("http://127.0.0.1:3000/getMenu");
    
    if (!response.ok){
        console.error("invalid response ");
        return
    }

    let data = await response.json();
    createMenu(data);
}



document.addEventListener("DOMContentLoaded", function(){
    getMenuFromServer();
    createMenu();
});



