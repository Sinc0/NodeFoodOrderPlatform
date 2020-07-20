function cartTotalPrice()
{
    var cartItems = localStorage.getItem("restaurantName");
    cartItems = JSON.parse(cartItems);
    var cartItem = cartItems.items;
    var totalPrice = null;

    for(let c = 0; c < cartItems.items.length; c++)
    {
        totalPrice += (cartItem[c].quantity * cartItem[c].price);
    }
    
    return totalPrice;
}

function cartItemPlus(item)
{
    let itemsArray = [];

    console.log("inside cart item plus");

    cart = JSON.parse(localStorage.getItem("restaurantName"));
        
        //populate itemsArray with items from cart
        for(let c = 0; c < cart.items.length; c++)
        {
            itemsArray.push(cart.items[c]);
        }
        
        //check if item already exists in cart
        for(let c = 0; c < itemsArray.length; c++)
        {
            if(itemsArray[c].id === item)
            {
                //console.log(":)");

                duplicateCheck = true;
                let itemQuantity = itemsArray[c].quantity;
                console.log(itemQuantity);
                itemsArray[c].quantity = ++itemQuantity;
            }
        }

        if(duplicateCheck)
        {
            localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
            console.log(itemsArray);
        }

        loadSideCart();
}

function cartItemMinus(item)
{
    console.log("inside cart item minus");

    let itemsArray = [];

    cart = JSON.parse(localStorage.getItem("restaurantName"));
        
        //populate itemsArray with items from cart
        for(let c = 0; c < cart.items.length; c++)
        {
            itemsArray.push(cart.items[c]);
        }
        
        //check if item already exists in cart
        for(let c = 0; c < itemsArray.length; c++)
        {
            if(itemsArray[c].id === item)
            {
                //console.log(":)");

                duplicateCheck = true;
                let itemQuantity = itemsArray[c].quantity;
                console.log(itemQuantity);
                itemsArray[c].quantity = --itemQuantity;
            }

            if(itemsArray[c].quantity == 0)
            {
                console.log("item 0 quantity");
                document.getElementById("cart-item-" + itemsArray[c].id).remove();
                itemsArray.splice(c, 1);
            }
        }

        if(duplicateCheck)
        {
            localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
            console.log(itemsArray);
        }

        loadSideCart();
}

function loadSideCart()
{
    var cartItems = localStorage.getItem("restaurantName");
    cartItems = JSON.parse(cartItems);
    
    if(cartItems.items == 0 || cartItems == null)
    {
        document.getElementById("side-cart").style.visibility = "hidden";
    }

    else
    {
        var cartItems = localStorage.getItem("restaurantName");
        cartItems = JSON.parse(cartItems);
        var cartItem = cartItems.items;
        
        console.log(cartItems.items.length);
    
        var cartItemsDiv = document.getElementById("cart-items").innerHTML = "";
    
        for(let c = 0; c < cartItems.items.length; c++)
        {
            //divs
            var cartItemHolderDiv = document.createElement("div");
            cartItemHolderDiv.id ="cart-item-" + cartItem[c].id;
            cartItemHolderDiv.className = "cart-item";
            
            var cartItemX = document.createElement("div");
            cartItemX.id = "cart-item";
            cartItemX.innerHTML = "(" + cartItem[c].quantity + ") " + cartItem[c].name + " - " + "$" + (cartItem[c].quantity * cartItem[c].price);
            
            //buttons
            var buttonAdd = document.createElement("button");
            buttonAdd.id = "cart-item-add-one-button";
            buttonAdd.value = cartItem[c].id;
            buttonAdd.onclick = function(){cartItemPlus(cartItem[c].id)};
            buttonAdd.innerHTML = " + ";
            
            var buttonRemove = document.createElement("button");
            buttonRemove.id = "cart-item-remove-one-button";
            buttonRemove.value = cartItem[c].id;
            buttonRemove.onclick = function(){cartItemMinus(cartItem[c].id)};
            buttonRemove.innerHTML = " - ";
            
            //prepends
            document.getElementById("cart-items").prepend(cartItemHolderDiv);
            document.getElementById("cart-item-" + cartItem[c].id).prepend(buttonAdd);
            document.getElementById("cart-item-" + cartItem[c].id).prepend(cartItemX);
            document.getElementById("cart-item-" + cartItem[c].id).prepend(buttonRemove);
        }
        
        var totalPrice = document.getElementById("total-price").innerHTML = "Total: " + "$" + cartTotalPrice();
        var sideCartVisibility = document.getElementById("side-cart").style.visibility = "visible";
    }
}

function updateCart(buttonNumber, itemName, itemPrice)
{
    let itemsArray = [];
    let duplicateCheck = false;

    let cart = localStorage.getItem("restaurantName");
    console.log(cart);
            
    if(cart == null)
    {
        itemsArray.push({id: buttonNumber, name: itemName, price: itemPrice, quantity: 1});
        localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
    }

    else
    {
        cart = JSON.parse(localStorage.getItem("restaurantName"));
        
        //populate itemsArray with items from cart
        for(let c = 0; c < cart.items.length; c++)
        {
            itemsArray.push(cart.items[c]);
        }
        
        //check if item already exists in cart
        for(let c = 0; c < itemsArray.length; c++)
        {
            if(itemsArray[c].id === buttonNumber)
            {
                //console.log(":)");

                duplicateCheck = true;
                let itemQuantity = itemsArray[c].quantity;
                console.log(itemQuantity);
                itemsArray[c].quantity = ++itemQuantity;
            }
        }

        //itemsArray.filter(item => item.id === buttonNumber).length > 0
        if(duplicateCheck)
        {
            localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
            console.log(itemsArray);
        }

        else
        {
            itemsArray.push({id: buttonNumber, name: itemName, price: itemPrice, quantity: 1});
            localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
        }
        
    }

    loadSideCart();

}