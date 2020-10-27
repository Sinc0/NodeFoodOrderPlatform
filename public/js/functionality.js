function goBack()
{
   window.history.back();
}

function clearCart()
{
    localStorage.removeItem("restaurantName");
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
    //cartItems = JSON.parse(cartItems);
    //console.log(cartItems);
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
        var d = document.getElementById("side-cart");

        if(d != undefined ||d != null)
        {
            d.style.visibility = "hidden";
        }
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

function orderProcessOrderDeclined(estimatedTime, delivery, pickUp)
{
    document.getElementById("orderProcessImgLoadingGif").remove();
    document.getElementById("orderProcessImgDeclineCrossPng").hidden = false;
    document.getElementById("orderProcessInfoText").innerHTML = "<p> order declined by restaurant </p> <p> money will be refunded within a week </p>";
    document.getElementById("OrderProcessWhenConfirmedStartLink").hidden = false;
}

function customerDeliverySelector()
{
    var text = document.querySelector('input[name="customerDelivery"]:checked').value;
    document.getElementById("customerDelivery").value = text;
    var paymentSelector = document.getElementById('paymentSelect');
    paymentSelector.disabled = "";
}

/* function editProfileCredentials()
{
    var profileCredentials = document.getElementById("profileCredentials");
    var editProfileCredentials = document.getElementById("editProfileCredentials");

    if(profileCredentials.style.display == "block" || editProfileCredentials == "none")
    {
        profileCredentials.style.display = "none";  
        editProfileCredentials.style.display = "block";  
    }

    else
    {
        profileCredentials.style.display = "block";
        editProfileCredentials.style.display = "none";
    }
} */

function registerCustomer()
{
    var customerForm = document.getElementById("registerCustomer");
    var restaurantForm = document.getElementById("registerRestaurant");
    var customerBtn = document.getElementById("registerCustomerBtn");
    var restaurantBtn = document.getElementById("registerRestaurantBtn");

    customerForm.style.display = "block";
    restaurantForm.style.display = "none";
    customerBtn.style.borderColor = "black";
    restaurantBtn.style.borderColor = "gray";
}

function registerRestaurant()
{
    var customerForm = document.getElementById("registerCustomer");
    var restaurantForm = document.getElementById("registerRestaurant");
    var customerBtn = document.getElementById("registerCustomerBtn");
    var restaurantBtn = document.getElementById("registerRestaurantBtn");
    
    customerForm.style.display = "none";
    restaurantForm.style.display = "block";
    customerBtn.style.borderColor = "gray";
    restaurantBtn.style.borderColor = "black";
}

function checkPassRestaurant()
{
    var password = document.getElementById("passwordRestaurant");
    var confirmPassword = document.getElementById("confirmPasswordRestaurant");
    var submitFormButton = document.getElementById("submitFormBtnRegisterRestaurant");

    if(confirmPassword.value == "")
    {
        
    }   

    else if(password.value != confirmPassword.value)
    {
        password.style.color = "red";
        confirmPassword.style.color = "red"
        submitFormButton.disabled = true;
    }

    else if(password.value == confirmPassword.value)
    {
        password.style.color = "lightgreen";
        confirmPassword.style.color = "lightgreen";
        submitFormButton.disabled = false;
    }
}

function checkPassCustomer()
{
    var password = document.getElementById("passwordCustomer");
    var confirmPassword = document.getElementById("confirmPasswordCustomer");
    var submitFormButton = document.getElementById("submitFormBtnRegisterCustomer");
    
    if(confirmPassword.value == "")
    {

    }

    else if(password.value != confirmPassword.value)
    {
        password.style.color = "red";
        confirmPassword.style.color = "red";
        submitFormButton.disabled = true;
    }

    else if(password.value == confirmPassword.value)
    {
        password.style.color = "lightgreen";
        confirmPassword.style.color = "lightgreen";
        submitFormButton.disabled = false;
    }
}

function InformAnonOpen()
{
    var modalBox = document.getElementById("informAnonModal");

    modalBox.style.display = "block";
}

function InformAnonClose()
{
    var modalBox = document.getElementById("informAnonModal");

    modalBox.style.display = "none";
}

async function httpTest()
{
    //fetch('http://example.com/movies.json')
    //.then(response => response.json())
    //.then(data => console.log(data));

    //https://jsonplaceholder.typicode.com/posts
    
    const Http = new XMLHttpRequest();
    const url='https://www.reddit.com/r/funny/comments/itt9r2/catch_me_if_you_can.json';
    Http.open("GET", url);
    //Http.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    //Http.setRequestHeader("Access-Control-Allow-Origin", "*");
    //Http.setRequestHeader("Access-Control-Allow-Headers", "*");
    Http.send();

    Http.onreadystatechange = function(){
        if(this.readyState == 4)
        {
            var data = Http.responseText;
            var json = JSON.parse(data);
    
            console.log(data);
            //console.log(json);
        }
    }
}

function GoogleMapsAdressAutocomplete() 
{
    var map = new google.maps.Map(document.getElementById('map'), {
        //center: {lat: -33.8688, lng: 151.2195},
        //zoom: 13
    });
    
    var input = document.getElementById('searchInput');
    var autocomplete = new google.maps.places.Autocomplete(input);
    var infowindow = new google.maps.InfoWindow();

    autocomplete.addListener('place_changed', function() 
    {
        infowindow.close();
        var place = autocomplete.getPlace();
        
        if (!place.geometry) 
        {
            return window.alert("Address not found");
        }
    
        var address = '';
        
        if (place.address_components) 
        {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }
    
        infowindow.setContent('<div><strong>' + place.name + '</strong><br>' + address);
            
        //location details
        for (var i = 0; i < place.address_components.length; i++) 
        {
            if(place.address_components[i].types[0] == 'country')
            {
                if(place.address_components[i].long_name == "Sweden")
                {
                    //document.getElementById('country').innerHTML = place.address_components[i].long_name;
                    //document.getElementById('location').innerHTML = place.formatted_address;
                    var userAddress = document.getElementById('userAddress')
                    var customerAdress = document.getElementById('customerAddress')

                    if(userAddress != null)
                    {
                        userAddress.value = place.formatted_address;
                    }

                    if(customerAdress != null)
                    {
                        customerAdress.value = place.formatted_address;
                    }

                    /*if(place.address_components[6] != undefined)
                    {
                        document.getElementById('postal_code').innerHTML = place.address_components[6].long_name;
                        //console.log(place.address_components[6].long_name);
                    }*/

                }

                if(place.address_components[i].long_name != "Sweden")
                {
                    alert("Location restricted to Sweden only");
                }
                
                //document.getElementById('country').innerHTML = place.address_components[i].long_name;
            }
        }
    
    });
}

function searchBoxRestaurants(totalMenuItems)
{
    var searchBoxInput = document.getElementById("searchBoxInput").value
    var searchString = String(searchBoxInput).toLowerCase();

    for(var c = 1; c <= totalMenuItems; c++)
    {
        var menuItem = document.getElementById("restaurantMenuItem#" + c)
        var menuItemSearchText = document.getElementById("restaurantMenuItemSearchText#" + c)

        if(menuItemSearchText.innerHTML.toLowerCase().includes(searchString))
        {
            menuItem.style.opacity = "100%";
            menuItem.style.display = "block";
        }

        else
        {
            menuItem.style.opacity = ".25";
        }

    }

}

function searchBoxRestaurantMenu(totalMenuItems)
{
    var searchBoxInput = document.getElementById("searchBoxInput").value
    var searchString = String(searchBoxInput).toLowerCase();
    var menuItemCategories = [];
    //console.log(searchString);

    for(var c = 1; c <= totalMenuItems; c++)
    {
        var menuItem = document.getElementById("menu-item#" + c)
        var menuItemCategory = document.getElementById("menu-item#" + c + "-category")
        //console.log(menuItem);
        //console.log(menuItem.parentNode);
        //console.log(menuItemCategory);
        
        if(menuItem.innerHTML.toLowerCase().includes(searchString))
        {
            menuItemCategories.push(menuItemCategory.innerHTML.toLowerCase());
            menuItem.style.opacity = "100%";
            menuItem.style.display = "block";
            menuItem.parentNode.style.display = "block";
        }

        else
        {
            menuItem.style.opacity = "25%";
            menuItem.style.display = "none";
            menuItem.parentNode.style.display = "none";
        }

    }

    //console.log(menuItemCategories.length);
    for(var c = 0; c < menuItemCategories.length; c++)
    {
        //console.log(menuItemCategories[c]);
        var menuCategory = menuItemCategories[c];
        //console.log(menuCategory);
        var category = document.getElementById("menu-category-" + menuCategory)
        category.style.display = "block";      
    }

}

function searchBoxOrders(totalOrders)
{
    var searchBoxInput = document.getElementById("searchBoxInput").value
    var searchString = String(searchBoxInput).toLowerCase();

    for(var c = 1; c <= totalOrders; c++)
    {
        var orderItem = document.getElementById("order-item#" + c)
        //var menuItemSearchText = document.getElementById("restaurantMenuItemSearchText#" + c)

        if(orderItem.innerHTML.toLowerCase().includes(searchString))
        {
            //orderItem.style.opacity = "100%";
            orderItem.style.display = "block";
        }

        else
        {
            //orderItem.style.opacity = ".25";
            orderItem.style.display = "none";
        }

    }

}
