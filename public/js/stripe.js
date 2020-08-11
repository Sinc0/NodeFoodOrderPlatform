var stripe = Stripe("pk_test_51HEENaLFUjzCbJftRFS2Rr6IZZ9YD1a5sHHyD7oSfUgoMfLsDoy4pPMpWxxAo1m6CKhABHbnGfjFyoLrKv5bUpNH00AMoEbBAO");

// Set up Stripe.js and Elements to use in checkout 
var elements = stripe.elements();

//document.querySelector("button").disabled = true;

var style = {
  base: {
    color: "#32325d",
    fontFamily: 'Arial, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#32325d"
    }
  },
  invalid: {
    fontFamily: 'Arial, sans-serif',
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};

var card = elements.create("card", { style: style });
card.mount("#card-element");

card.on('change', function(event) {
  var displayError = document.getElementById('card-errors');
  
  if (event.error) {
    displayError.textContent = event.error.message;
  } else {
    displayError.textContent = '';
  }

  document.querySelector("button").disabled = event.empty;
});

var form = document.getElementById('payment-form');

form.addEventListener('submit', function(ev) {
  loading(true);
  ev.preventDefault();
  
  var cs = document.getElementById('submit');
  var clientSecret = cs.dataset.secret;
  //console.log(secret.dataset.secret);
  
  stripe.confirmCardPayment(clientSecret, {
      payment_method: 
      {
        card: card,
        billing_details: {
          name: 'Jenny Rosen'
      }
    }
  }).then(function(result) {
    if (result.error) {
      // Show error to your customer (e.g., insufficient funds)
      showError(result.error.message);
      console.log(result.error.message);
    } else {
      // The payment has been processed!
      if (result.paymentIntent.status === 'succeeded') {
        // Show a success message to your customer
        orderComplete(result.paymentIntent.id);
        console.log(result.paymentIntent);
        console.log("payment successful");
        
        
        
        window.location.href = "/order-process";
        //windows.location.replace = "/";
        // There's a risk of the customer closing the window before callback
        // execution. Set up a webhook or plugin to listen for the
        // payment_intent.succeeded event that handles any business critical
        // post-payment actions.
      }
    }
  });
});

/* ------- UI helpers ------- */

// Shows a success message when the payment is complete
var orderComplete = function(paymentIntentId) {
  loading(false);
};

// Show the customer the error from Stripe if their card fails to charge
var showError = function(errorMsgText) {
  loading(false);
  var errorMsg = document.querySelector("#card-errors");
  errorMsg.textContent = errorMsgText;
  setTimeout(function() {
    errorMsg.textContent = "";
  }, 4000);
};

// Show a spinner on payment submission
var loading = function(isLoading) {
  if (isLoading) 
  {
    // Disable the button and show a spinner
    document.querySelector("button").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("button").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
};