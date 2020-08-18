function goBack()
{
   window.history.back();
}

function clearCart()
{
    localStorage.removeItem("restaurantName");
    document.getElementById("commentToRestaurant").value = "x";
}

function cartAllItems()
{
    var cartItems = localStorage.getItem("restaurantName");
    cartItems = JSON.parse(cartItems);
    var p = "";
    //console.log(cartItems);
    
    if(cartItems != null)
    {
        for(let c = cartItems.items.length - 1; c >= 0; c--)
        {
            p = "<p>" + "(" + cartItems.items[c].quantity + ") " + cartItems.items[c].name + " - " + "$" + (cartItems.items[c].quantity * cartItems.items[c].price); + "</p>"
            var text = document.createElement("div");
            text.innerHTML = p;
            document.getElementById("checkoutCartItems").append(text);  
        }

        fillCartFormData();
    }
    
    /*
    var select = document.createElement("select");
    var option_1 = document.createElement("option");
    var option_2 = document.createElement("option");
    var option_3 = document.createElement("option");
    option_1.text = "Payment Option 1";
    select.add(option_1);
    document.getElementById("checkoutCartItems").append(select);
    option_2.text = "Payment Option 2";
    select.add(option_2);
    option_3.text = "Payment Option 3";
    select.add(option_3);
    */
    
    //return cartItems;
}

function fillCartFormData()
{
    var cartItems = localStorage.getItem("restaurantName");
    var commentToRestaurant = localStorage.getItem("commentToRestaurant");
    //cartItems = JSON.parse(cartItems);
    //console.log(cartItems);
    document.getElementById("commentToRestaurant").value = commentToRestaurant;
    document.getElementById("cartAllItems").value = cartItems;

    var cartItems = localStorage.getItem("restaurantName");
    cartItems = JSON.parse(cartItems);
    var cartItem = cartItems.items;
    var totalPrice = null;
    //console.log(cartItems);

    for(let c = 0; c < cartItems.items.length; c++)
    {
        totalPrice += (cartItem[c].quantity * cartItem[c].price);
    }

    document.getElementById("cartTotalPrice").value = totalPrice;
}

function cartTotalPrice()
{
    var cartItems = localStorage.getItem("restaurantName");
    cartItems = JSON.parse(cartItems);
    var cartItem = cartItems.items;
    var totalPrice = null;
    //console.log(cartItems);

    for(let c = 0; c < cartItems.items.length; c++)
    {
        totalPrice += (cartItem[c].quantity * cartItem[c].price);
    }

    return totalPrice;
}

function cartItemPlus(item)
{
    let itemsArray = [];

    //console.log("inside cart item plus");

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
                //console.log(itemQuantity);
                itemsArray[c].quantity = ++itemQuantity;
            }
        }

        if(duplicateCheck)
        {
            localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
            //console.log(itemsArray);
        }

        loadSideCart();
}

function cartItemMinus(item)
{
    //console.log("inside cart item minus");

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
                //console.log(itemQuantity);
                itemsArray[c].quantity = --itemQuantity;
            }

            if(itemsArray[c].quantity == 0)
            {
                //console.log("item 0 quantity");
                document.getElementById("cart-item-" + itemsArray[c].id).remove();
                itemsArray.splice(c, 1);
            }
        }

        if(duplicateCheck)
        {
            localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
            //console.log(itemsArray);
        }

        loadSideCart();
}

function loadSideCart()
{
    var cartItems = localStorage.getItem("restaurantName");
    cartItems = JSON.parse(cartItems);
    
    if(cartItems == null || cartItems.items.length == 0)
    {
        document.getElementById("side-cart").style.visibility = "hidden";
    }

    else
    {
        var cartItems = localStorage.getItem("restaurantName");
        cartItems = JSON.parse(cartItems);
        var cartItem = cartItems.items;
        
        //console.log(cartItems.items.length);
    
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
            buttonAdd.className = "cart-item-add-one-button";
            buttonAdd.value = cartItem[c].id;
            buttonAdd.onclick = function(){cartItemPlus(cartItem[c].id)};
            buttonAdd.innerHTML = " + ";
            
            var buttonRemove = document.createElement("button");
            buttonRemove.className = "cart-item-remove-one-button";
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

        fillCartFormData();
    }
}

function updateCart(buttonNumber, itemName, itemPrice)
{
    let itemsArray = [];
    let duplicateCheck = false;

    let cart = localStorage.getItem("restaurantName");
    //console.log(cart);
            
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
                //console.log(itemQuantity);
                itemsArray[c].quantity = ++itemQuantity;
            }
        }

        //itemsArray.filter(item => item.id === buttonNumber).length > 0
        if(duplicateCheck)
        {
            localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
            //console.log(itemsArray);
        }

        else
        {
            itemsArray.push({id: buttonNumber, name: itemName, price: itemPrice, quantity: 1});
            localStorage.setItem("restaurantName", JSON.stringify({items: itemsArray}));
        }
        
    }

    loadSideCart();

}

function selectPaymentOption(value)
{
    console.log(value);

    if(value == 0)
    {
        document.getElementById("payment-option-stripe").style.display = "none";
    }

    if(value == 1)
    {
        document.getElementById("payment-option-stripe").style.display = "block";
    }
}

function commentToLocalStorage(comment)
{
    localStorage.setItem("commentToRestaurant", comment);
}

function postOrder()
{
    var form = document.getElementById("post-order-form");
    form.submit();
}

function orderProcessOrderConfirmed(estimatedTime, delivery, pickUp)
{
    document.getElementById("orderProcessImgLoadingGif").remove();
    document.getElementById("orderProcessImgCheckmarkPng").hidden = false;
    document.getElementById("OrderProcessWhenConfirmedDetailsLink").hidden = false;
    
    if(delivery == true)
    {
        document.getElementById("orderProcessEstimatedTime").innerHTML = "estimated " + estimatedTime + " mins for order to be delivered";
    }

    if(delivery == false)
    {
        document.getElementById("orderProcessEstimatedTime").innerHTML = "estimated " + estimatedTime + " mins for pick up to be ready";
    }
    
    document.getElementById("orderProcessEstimatedTime").hidden = false;
    document.getElementById("OrderProcessWhenConfirmedStartLink").hidden = false;
    document.getElementById("orderProcessInfoText").innerHTML = "order confirmed by restaurant";
}