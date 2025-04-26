
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

    let message = await response.json();
    
    let welcomeMessage = document.getElementById('welcome-message');

    if (!response.ok){
        alert("Incorrect Username or Password")
        welcomeMessage.innerText = "";
        usernameElement.value = "";
        passwordElement.value = "";
    }else{
        welcomeMessage.innerText = message.message;
        usernameElement.value = "";
        passwordElement.value = "";
    }
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

    let discountedTotal = getDiscountFromServer(total);
    console.log(discountedTotal);
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

async function getDiscountFromServer(oldTotal = 50){
    promoCode = promoCodeElement.value


    const response = await fetch('http://127.0.0.1:3000/getDiscount', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            promoCode: promoCode,
            currTotal: oldTotal
        })
    });

    let newTotal = await response.json();

    console.log(newTotal.total);
    
    return newTotal.total;
}



async function getMenuFromServer(){
    const response = await fetch("http://127.0.0.1:3000/getMenu");
    
    if (!response.ok){
        console.error("invalid response ");
        return
    }

    let data = await response.json();
    createMenu(data);
}

async function checkout(){
    if (cart.length === 0){
        alert('Your cart is empty!');
        return;
    }
    //post the cart array to server to be stored in orderArray
    const response = await fetch('http://127.0.0.1:3000/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(cart)
    });

    let responseMessage = await response.json();

    if (!response.ok){
        alert(responseMessage.message);
        return; 
    }

    alert(`${responseMessage.message} Thank you!`)


    cart.length = 0;
    printCart();
}


async function contact(event){
    event.preventDefault();

    const nameElement = document.getElementById("name");
    const name = nameElement.value;

    const emailElement = document.getElementById("email");
    const email = emailElement.value;

    const phoneElement = document.getElementById("phone");
    const phone = phoneElement.value;

    const commentElement = document.getElementById("form-notes");
    const comment = commentElement.value;
    
    const response = await fetch('http://127.0.0.1:3000/comment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            phone: phone,
            comment: comment
        })
    });

    let responseMessage = await response.json();

    if (!response.ok){
        alert(responseMessage.message);
        return; 
    }

    alert(`${responseMessage.message} Thank you!`);

    nameElement.value = "";
    emailElement.value = "";
    phoneElement.value = "";
    commentElement.value = "";
}


document.addEventListener("DOMContentLoaded", function(){
    getMenuFromServer();
    createMenu();
});



