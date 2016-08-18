// this file contains scripts for client

// =========== prices =================

var cheese_cost = 2.0;
var myCart = [];

var pizzas = {
    'Small': {
        'Pepperoni': 8.99,
        'Vegetarian': 9.99,
        'Combo': 10.99
    },

    'Medium': {
        'Pepperoni': 9.99,
        'Vegetarian': 10.99,
        'Combo': 11.99
    },

    'Large': {
        'Pepperoni': 10.99,
        'Vegetarian': 11.99,
        'Combo': 12.99
    }
};

// =========== prices end =============

// this function validates a pizza order form

function btnAddToCartHandler() {
    // get size of the pizza
    var size = $('#size').val();
    // if size is not selected
    if (!size) {
        // show error message
        alert('Please, select pizza size!');
        return false;
    }

    // get kind of pizza
    var kind = $('#kind').val();
    // if kind is not selected
    if (!kind) {
        // show error message
        alert('Please, select pizza kind!');
        return false;
    }

    // get quantity of pizzas
    var quantity = parseInt($('#quantity').val());
    // if quantity is invalid number or 0
    if (!quantity) {
        // show error message
        alert('Please, enter a valid quantity!');
        return false;
    }

    var postData = {
        'size': size,
        'kind': kind,
        'quantity': quantity,
        'extra_cheese': $('#extra_cheese').prop("checked")
    };

    $.ajax({
        type: "post",
        url: "/add",
        dataType: "json",
        data: postData,
        success: function (response) {
            if (response.success) {
                alert('Your Pizza is ordered!');
                $("#orderForm")[0].reset();
                getNumberOfOrderedPizzas();
            }
        }
    });

    return false;
}

// this function calculates the price of the pizza
function btnCalculateHandler() {

    // get and validate all pizza parameters

    var size = $('#size').val();

    if (!size) {
        alert('Please, select pizza size!');
        return false;
    }

    var kind = $('#kind').val();
    if (!kind) {
        alert('Please, select pizza kind!');
    }

    var quantity = parseInt($('#quantity').val());
    if (!quantity) {
        alert('Please, enter a valid quantity!');
    }

    // get cost of selected pizza
    var cost = pizzas[size][kind];

    // if such pizza is not exists
    if (!cost) return false;      // exit from this function

    // get extra cheese flag
    var extra_cheese = $('#extra_cheese').prop("checked");

    // add extra cheese cost if needed
    if (extra_cheese) {
        cost += cheese_cost;
    }

    // show cost for current order
    $('#price').html(cost * quantity);

    // always return false
    return false;
}

// this function invokes when user clicks on the 'Go to cart' button

function btnGoToCart() {
    // change the location
    window.location.href = '/checkout';
    return false;
}

// this function validates checkout form
function btnCheckoutHandler() {
    // get first name
    var first_name = $('#first_name').val();
    // if first name not is valid
    if (first_name.length < 1 || first_name.length > 20) {
        // show error message
        //alert('First name must be between 1 and 20 characters');
        $('#first_name').next().text("This field is required.");
        return false;

    }
    
    // get last name
    var last_name = $('#last_name').val();
    // if last name is invalid
    if (last_name.length < 1 || last_name.length > 25) {
        // show error message
        //alert('Last name must be between 1 and 25 characters');
        $('#last_name').next().text("This field is required.");
        return false;
        
    }
    // get address
    var address = $('#address').val();
    // if address is not filled
    if (address.length == 0) {
        // show error message
        //alert('Address field should be filled');
        $('#address').next().text("This field is required.");
        return false;
       
    }

    // get phone number
    var phone = $('#phone').val();
    // if phone number is empty
    if (phone.length == 0) {
        // show error message
        //alert('Phone field should be filled');
        $('#phone').next().text("This field is required.");
        return false;
       
    } else {
        // in other case create regular expr. to check the format (123-123-1233 for example)
        var phoneValid = /(\d){3}-(\d){3}-(\d){4}/;
        // if phone has invalid format
        if (!phoneValid.test(phone)) {
            // show error message
            //alert('Invalid phone format');
            $('#phone').next().text("Invalid phone format.");
            return false;
        }
    }

    // get type of payment
    var stype = document.forms[0].stype.value;

    // if type is not selected
    if (!stype) {
        // show error message
        alert('Please, select payment type');
         
        return false;
        
    }

    // if type is credit card
    if (stype == 'credit') {
        // get type of credit cart
        var type = document.forms[0].crtype.value;
        var regex = '';

        // if type is not selected
        if (!type) {
            // show error message
            alert('Please, select credit card type');
            
            return false;
           
        } else {
            // in other case create regex to check the card number format
            // according to card type
            if (type == 'ax') {
                regex = /(\d){4}-(\d){6}-(\d){5}/;
            } else if (type == 'v') {
                regex = /(\d){4}-(\d){4}-(\d){4}-(\d){4}/;
            }
            // get card number
            var cardNumber = $('#txt_cr_number').val();
            // if card number is not entered
            if (!cardNumber) {
                // show error message
                //alert('Credit Card number is Required');
                 $('#txt_cr_number').next().text("Credit Card number is Required.");
                return false;
               
            } else {
                // in other case: check the format using reg. expr.
                // if not matches
                if (!regex.test(cardNumber)) {
                    // show error message
                    //alert('Invalid Credit Card Number Format');
                    $('#txt_cr_number').next().text("Invalid Credit Card Number Format.");
                    return false;
                }
            }
            // get card expr. date
            var crCardExpDate = $('#datepicker').val();
            // if date is not selected
            if (!crCardExpDate) {
                // show error message
                //alert('Please, enter Credit Card expiration Date');
                $('#datepicker').next().text("Please, enter Credit Card expiration Date.");
                return false;
               
            }

        }
    }

    window.location.href = '/confirmation';
    return false;
}

// this function invokes when user selects a credit card type
// it just sets the placeholder to text field
function crCardTypeClick(element) {
    if (element.value == 'ax') {
        $('#txt_cr_number').prop('placeholder', 'XXXX-XXXXXX-XXXXX');
    } else {
        $('#txt_cr_number').prop('placeholder', 'XXXX-XXXX-XXXX-XXXX');
    }
}

// this function invokes when user selects a payment type
function saleTypeClick(element) {
    // if selected type is 'cash'
    if (element.value == 'cash') {
        // hide all fields with credit card details
        $('#cr_t').css('display', 'none');
        $('#cr_number').css('display', 'none');
        $('#cr_ex_date').css('display', 'none');
    } else {
        // and show them in other case
        $('#cr_t').css('display', 'block');
        $('#cr_number').css('display', 'block');
        $('#cr_ex_date').css('display', 'block');
    }
}

function getMyOrders() {
    $.ajax({
        type: "get",
        url: "/getMyCart",
        dataType: "json",
        success: function (data) {
            renderCart(data);
        }
    });
}

// this function invokes when checkout page loaded
function renderCart(myCart) {

    var min = 1000, max = 10000;
    var totalCost = 0;
    // get container
    var div = document.getElementById('full_order');

    var id = Math.floor(Math.random() * (max - min + 1)) + min;

    div.innerHTML += '<p>Order #' + id + '</p>';

    // if cart contains pizzas
    if (myCart.length) {
        // for every pizza in the cart
        myCart.forEach(function (element) {
            // get it's cost
            var cost = pizzas[element.size][element.kind];
            // check for additional cheese
            if (element.extra_cheese) {
                cost += cheese_cost;
            }

            // show size and kind of the pizza
            var str = '<p>' + element.size + ' ' + element.kind;

            // show extra cheese option
            if (element.extra_cheese) {
                str += ' with extra cheese';
            }
            // calculate total price for pizza
            cost *= element.quantity;

            // show price
            str += ' x' + element.quantity + ' ($' + cost + ')';

            var pizza_id = element.size + '_' + element.kind;
            if (element.extra_cheese) {
                pizza_id += '_extra_cheese'
            }

            // show created string
            div.innerHTML += str + '<a href="./remove?pizza=' + pizza_id + '" style="display: block; float: right">Remove</a>';
            // calculate total cost
            totalCost += cost;
        });
        // show total for all pizzas in the cart
        div.innerHTML += '<hr/>' + '<p>Total: $' + totalCost + '</p>';
        $('#total_amount').val('$' + totalCost);
    } else {
        // if no pizzas exist in the cart
        // show message
        div.innerHTML = '<p>You have no pizza in your cart</p>';
        // and disable checkout button
        document.getElementById('btn_checkout').disabled = true;
    }
}

function getNumberOfOrderedPizzas() {
    $.ajax({
        type: "post",
        url: "/getNumberOfOrderedPizzas",
        dataType: "json",
        success: function (data) {
            $("#cartEntities").html('(' + data.number + ')');
        }
    });
}