"use strict";
// avoid warnings on using fetch and Promise --
/* global fetch, Promise */
// use port 80, i.e., apache server for webservice execution
const baseUrl = "http://localhost/cs637/janwesh/pizza2_server/api";
//const baseUrl = "http://topcat.cs.umb.edu/cs637/janwesh/pizza2_server/api";

// globals representing state of data and UI
let selectedUser = 'none';
let sizes = [];
let toppings = [];
let users = [];
let orders = [];
let main = function () {//(sizes, toppings, users, orders) {
    setupTabs();  // for home/order pizza and meat/meatless
    // for home tab--
    displaySizesToppingsOnHomeTab();
    setupUserForm();
    setupRefreshOrderListForm();
    setupAcknowledgeForm();
    displayOrders();
    // for order tab--
    setupOrderForm();
    displaySizesToppingsOnOrderForm();
};

function displaySizesToppingsOnHomeTab() {
  for (var i = 0; i < sizes.length; i++) {
    var size = sizes[i].size;
    var ul = document.getElementById("sizes");
    var li = document.createElement('li.horizontal');
    li.appendChild(document.createTextNode(size));
    ul.appendChild(li);
    ul.appendChild(document.createTextNode('      '));
  }

  for (var i = 0; i < toppings.length; i++) {
    var topping = toppings[i].topping;
      var ul = document.getElementById("toppings");
      var li = document.createElement('li.horizontal');
      li.appendChild(document.createTextNode(topping));
      ul.appendChild(li);
      ul.appendChild(document.createTextNode('      '));
    }
}
    // find right elements to build lists in the HTML
    // loop through sizes, creating <li>s for them
    // with class=horizontal to get them to go across horizontally
    // similarly with toppings


// function setupUserForm() {
//     // find the element with id userselect
//     // create <option> elements with value = username, for
//     // each user with the current user selected,
//     // plus one for user "none".
//     // Add a click listener that finds out which user was
//     // selected, make it the "selectedUser", and fill it in the
//     //  "username-fillin" spots in the HTML.
//     //  Also change the visibility of the order-area
//     // and redisplay the orders
//     var select = document.getElementById("userselect");
//     for(var index =0; index<users.length; index++) {
//       select.options[index] = new Option(users[index].username,
//         users[index].username);
//     }

//     let button = document.querySelector("#userform input");
//     button.addEventListener("click", function (event) {
//       //console.log("hello");
//       selectedUser = document.getElementById("userselect").value;
//       document.getElementById("username-fillin1").innerHTML = selectedUser;

//     });



// }

function setupUserForm() {


  var sel = document.getElementById("userselect");

 // opt.text = "Hello";
 // sel.add(opt);
 var opt = document.createElement("option");
 opt.text = "none";
 opt.value = "none";
 sel.add(opt);
  for (var i = 0; i < users.length; i++)
  {
      var opt = document.createElement("option");
      opt.text = users[i].username;
      opt.value = users[i].username;
      sel.add(opt);
  }


  let button = document.querySelector("#userform input");
  button.addEventListener("click", function (event) {
      event.preventDefault();
      selectedUser = document.getElementById("userselect").value;
      document.getElementById("username-fillin1").innerHTML = selectedUser;
      document.getElementById("username-fillin2").innerHTML = selectedUser;
      document.getElementById("order-area").classList.add("active");
      displayOrders();
      // document.getElementById("order-area").style.display = "block";
  });

  // find the element with id userselect
  // create <option> elements with value = username, for
  // each user with the current user selected,
  // plus one for user "none".
  // Add a click listener that finds out which user was
  // selected, make it the "selectedUser", and fill it in the
  //  "username-fillin" spots in the HTML.
  //  Also change the visibility of the order-area
  // and redisplay the orders
}

 function setupAcknowledgeForm() {
    console.log("setupAckForm...");
    document.querySelector("#ackform input").addEventListener("click", function () {
        // $("#ackform input").on("click", function () {
        console.log("ack by user = " + selectedUser);
        var userDetail = users.filter(user=>user.username==selectedUser);
        var selectedID = userDetail[0].id;
                orders.forEach(function (order) {
            if (order.user_id === selectedID && order.status === 'Baked') {
                console.log("Found baked order for user " + order.username);
                order.status = 'Finished';
                updateOrder(order);
                //alert("here");// post update to server
                event.preventDefault();

            }
        });
        //getOrders();
        displayOrders();
        return false;
    });
 }

function setupRefreshOrderListForm() {
    console.log("setupRefreshForm...");
    document.querySelector("#refreshbutton input").addEventListener("click", function () {
        //  $("#refreshbutton input").on("click", function () {
        console.log("refresh orders by user = " + selectedUser);
        getOrders();
        return false;
    });
}



function displayOrders() {
    console.log("displayOrders");

    // remove class "active" from the order-area
    // if selectedUser is "none", just return--nothing to do
    // empty the ordertable, i.e., remove its content: we'll rebuild it
    // add class active to order-area
    // find the user_id of selectedUser via the users array
    // find the in-progress orders for the user by filtering array
    // orders on user_id and status
    // if there are no orders for user, make ordermessage be "none yet"
    //  and remove active from element id'd order-info
    // Otherwise, add class active to element order-info, make
    //   ordermessage be "", and rebuild the order table
    // Finally, if there are Baked orders here, make sure that
    // ackform is active, else not active
    // if (selectedUser == 'none') {
    //   console.log("hello");
    // }

    document.getElementById("order-area").classList.remove("active");

    if (selectedUser != 'none') {
      document.getElementById("order-area").classList.add("active");

      var userDetail = users.filter(user=>user.username==selectedUser);
      var selectedID = userDetail[0].id;

      var baked_orders = orders.filter(order=>order.status=="Baked" &&
      order.user_id == selectedID)
      var preparing_orders = orders.filter(order=>order.status=="Preparing" &&
      order.user_id == selectedID)
      var total_user_order = baked_orders.length + preparing_orders.length

      if (total_user_order > 0) {
        document.getElementById("order-info").classList.add("active");
        document.getElementById("ordermessage").innerHTML = "";
        var table = document.getElementById("ordertable");
        table.style.width = '30%';
        while (table.hasChildNodes())
          table.removeChild(table.firstChild);

        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        cell1.innerHTML = "<b> ORDER ID </b>";
        cell2.innerHTML = "<b> USERNAME </b>";
        cell3.innerHTML = "<b> Toppings </b> ";
        cell4.innerHTML = "<b> STATUS </b> ";
        for (var i = 0; i < baked_orders.length; i++) {
          var row = table.insertRow(-1);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          cell1.innerHTML = baked_orders[i].id;
          cell2.innerHTML = selectedUser;//order_to_print[i].user_id;
          if ("toppings" in baked_orders[i]) {
          for (var j = 0; j < baked_orders[i].topping.length; j++)
            cell3.innerHTML += baked_orders[i].toppings[j]+" ";//order_to_print[i].user_id;
          }
          cell4.innerHTML = baked_orders[i].status;
        }
        for (var i = 0; i < preparing_orders.length; i++) {
          var row = table.insertRow(-1);
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);
          cell1.innerHTML = preparing_orders[i].id;
          cell2.innerHTML = selectedUser;//order_to_print[i].user_id;
          cell4.innerHTML = preparing_orders[i].status;
          if ("toppings" in preparing_orders[i]) {
            for (var j = 0; j < preparing_orders[i].toppings.length; j++)
              cell3.innerHTML += preparing_orders[i].toppings[j]+" ";;//order_to_prin
            }
          }
        if (baked_orders.length > 0)
          document.getElementById("ackform").classList.add("active");
        else
        document.getElementById("ackform").classList.remove("active");

      }
      else {
        document.getElementById("ordermessage").innerHTML = "<br>none yet";
        document.getElementById("order-info").classList.remove("active");
        document.getElementById("ackform").classList.remove("active");

      }

  }

}

// Let user click on one of two tabs, show its related contents
// Contents for both tabs are in the HTML after initial setup,
// but one part is not displayed because of display:none in its CSS
// This implementation works for multiple two-tab setups because
// it works from the clicked-on element and finds the related
// content nearby. The related content needs to be a sibling of
// the clicked-on element's grandparent.
function setupTabs() {
    console.log("starting setupTabs");

   // document.getElementById("firstSection").classList.remove("active");

    document.getElementById("secondSection").classList.remove("active");
    document.querySelectorAll(".tabs a span ").forEach(function (element)
    {
      element.addEventListener("click", function()
      {
          event.preventDefault();
          document.querySelectorAll(".tabs a span ").forEach(function (element)
          {
            element.classList.remove("active");
          });
          element.classList.add("active");

          if (element.parentElement.matches(":nth-child(1)"))
          {
            //element.classList.add("active");
            //alert("you clicked with meat");
            //var k = document.getElementById("meatlesses").innerText;
            document.getElementById("secondSection").classList.remove("active");
            document.getElementById("firstSection").classList.add("active");
            // document.getElementById("meatlesses").classList.remove("active");

            //container2.classList.add("active");

          }
          else if (element.parentElement.matches(":nth-child(2)"))
          {
            selectedUser = document.getElementById("userselect").value;

            document.getElementById("secondSection").classList.add("active");
            document.getElementById("firstSection").classList.remove("active");
            // document.getElementById("meats").classList.remove("active");

            // document.getElementById("meatlesses").classList.add("active");
            //document.querySelector(".tabContent").classList.add("active");

            //document.getElementById("meats").innerHTML= "";
            //alert("you clicked without meat");

          }


      });


    });

    // Do this last. You may have a better approach, but here's one
    // way to do it. Also edit the html for better initial settings
    // of class active on these elements.
    // Find <span> elements inside <a>'s inside elements with class tabs
    // and process them as follows:  (there are four of them)
    // add a click listener to the element. When a click happens,
    // add class "active" to that element, and figure out this element's
    // parent's (the parent is an <a>) position among its siblings. If it
    // is the first child, the other <a> is its next sibling, and the other
    // <span> is the first child of that <a>. Similarly in the other case.
    // Remove class active from that other tab.
    // Now find the related tabContent element. It's the <span>'s
    // grandparent's next sibling, or sibling after that. Add class active
    // to the newly active one and remove it from the other one.

}

function displaySizesToppingsOnOrderForm() {
    console.log("displaySizesToppingsOnOrderForm");

    // find the element with id order-sizes, and loop through sizes,
    // setting up <input> elements for radio buttons for each size
    // and labels for them too
    // Then find the spot for meat toppings, and meatless ones
    // and for each create an <input> element for a checkbox
    // and a <label> for each

    //document.getElementById("orderform");

//     for (var i = 0; i < sizes.length; i++) {
//       var size = sizes[i].size;
//       var ul = document.getElementById("order-sizes");
//       // var li = document.createElement('li.horizontal');
//       var x = document.createElement("order-sizes");
//       ul.setAttribute("type", "radio")
//       ul.appendChild(document.createTextNode(size));
//       ul.appendChild(x);
//       ul.appendChild(document.createTextNode('        '));
//
// }
    //var label = document.getElementById("orderform");
    // label = document.getElementById("orderform");
    var label = document.getElementById("order-sizes");

    for (var i = 0; i < sizes.length; i++) {
      var radio = document.createElement("INPUT");
      var size_id = sizes[i]['id'];
      //console.log(size_id);
      var size = sizes[i].size;
      radio.type = "radio";
      radio.name = 'size';
      radio.value = size ;
      label.appendChild(radio);
      label.appendChild(document.createTextNode(size));

    //label.appendChild(label2);
    }

    var with_meat = toppings.filter(topping=>topping.is_meat==1);
    var not_with_meat = toppings.filter(topping=>topping.is_meat==0);




    var container = document.getElementById("meats");

    for (var j = 0; j < with_meat.length; j++) {
      var label = document.createElement('label')
      //label.htmlFor = "id";
      label.appendChild(document.createTextNode(with_meat[j].topping));
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = "topping";//with_meat[j].topping;
      checkbox.value = with_meat[j].topping;
      //checkbox.id = "id";

      container.appendChild(checkbox);
      container.appendChild(label);
    }

    var container2 = document.getElementById("meatlesses");

    for (var j = 0; j < not_with_meat.length; j++) {
      var label = document.createElement('label')
      //label.htmlFor = "id";
      label.appendChild(document.createTextNode(not_with_meat[j].topping));
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.name = "topping";//not_with_meat[j].topping;
      checkbox.value = not_with_meat[j].topping;
      //checkbox.id = "id";

      container2.appendChild(checkbox);
      container2.appendChild(label);
    }
    document.getElementById("meats").classList.remove("active");
    document.getElementById("meatlesses").classList.remove("active");
    document.querySelectorAll(".tabs.meat-meatless a span").forEach(function (element)
    {
      element.addEventListener("click", function()
      {
          event.preventDefault();
          document.querySelectorAll(".tabs.meat-meatless a span").forEach(function (element)
          {
            element.classList.remove("active");
          });
          element.classList.add("active");

          if (element.parentElement.matches(":nth-child(1)"))
          {
            //element.classList.add("active");
            //alert("you clicked with meat");
            //var k = document.getElementById("meatlesses").innerText;
            //document.getElementById("meats").classList.remove("active");
            document.getElementById("meats").classList.add("active");
            document.getElementById("meatlesses").classList.remove("active");
            document.getElementById("firstSection").classList.remove("active");
            document.getElementById("secondSection").classList.add("active");

            //container2.classList.add("active");

          }
          else if (element.parentElement.matches(":nth-child(2)"))
          {
            document.getElementById("meats").classList.remove("active");

            document.getElementById("meatlesses").classList.add("active");
            //document.querySelector(".tabContent").classList.add("active");

            //document.getElementById("meats").innerHTML= "";
            //alert("you clicked without meat");

          }


      });


    });

    // var k = document.querySelectorAll(".tabs.meat-meatless a span");
    // for (var index = 0 ; index< k.length; index++) {

    // }

    // var labelofwithmeat = document.getElementById("withMeat");
    // for (var k = 0; k < meat.length; k++) {
    //   // var radio = document.createElement("INPUT");
    //   // var topping_name = meat[k].topping;
    //   // var val = meat[k].topping;
    //   // radio.type = "radio";
    //   // radio.name = 'topping_name';
    //   // radio.value = val;
    //   // labelofwithmeat.appendChild(radio);
    //   // labelofwithmeat.appendChild(document.createTextNode(topping_name));
    //
    //      var checkbox = document.createElement('input');
    //      checkbox.type = "checkbox";
    //      checkbox.name = meat[k].topping;
    //      checkbox.id = meat;
    //      var label = document.createElement('label');
    //      var tn = document.createTextNode("Not A RoBot");
    //      label.htmlFor="cbid";
    //      label.appendChild(tn);
    //      hold.appendChild(label);
    //      hold.appendChild(checkbox);
    // //label.appendChild(label2);
    // }

    // var labelwithoutfwithmeat = document.getElementById("withoutMeat");
    // for (var k = 0; k < not_meat.length; k++) {
    //   var radio = document.createElement("INPUT");
    //   var topping_name = not_meat[k].topping;
    //   var val = not_meat[k].topping;
    //   radio.type = "radio";
    //   radio.name = 'topping_name';
    //   radio.value = val;
    //   labelwithoutfwithmeat.appendChild(radio);
    //   labelwithoutfwithmeat.appendChild(document.createTextNode(topping_name));
    //
    // //label.appendChild(label2);
    // }

    //console.log(not_meat);



// var label2 = document.getElementById("meats");
//
// for (var i = 0; i < toppings.length; i++) {
//   var radio = document.createElement("INPUT");
//   var topping_id = toppings[i].id;
//   //console.log(size_id);
//   var topping = toppings[i].topping;
//   radio.type = "radio";
//   radio.name = 'topping';
//   radio.value = topping_id ;
//   label2.appendChild(radio);
//   label2.appendChild(document.createTextNode(topping));

//label.appendChild(label2);

}
// var size_chosen = document.querySelector('input[name="size"]:checked').value;
// if (size_chosen == null) {
//   console.log("notchosen");
// }
// else {
//   console.log(size_chosen);
// }
    //   var size = sizes[i].size;
      // var ul = document.getElementById("sizes");
      // var li = document.createElement('li.horizontal');
      // li.appendChild(document.createTextNode(size));
      // ul.appendChild(li);
      // ul.appendChild(document.createTextNode('   '));

    //}
    // for (var i = 0; i < toppings.length; i++) {
    //   var topping = toppings[i].topping;
    //     var ul = document.getElementById("toppings");
    //     var li = document.createElement('li.horizontal');
    //     li.appendChild(document.createTextNode(topping));
    //     ul.appendChild(li);
    //     ul.appendChild(document.createTextNode('   '));
    //
    //   }



function setupOrderForm() {
    console.log("setupOrderForm...");

    // find the orderform's submitbutton and put an event listener on it
    // When the click event comes in, figure out the sizeName from
    // the radio button and the toppings from the checkboxes
    // Complain if these are not specified, using order-message
    // Else, figure out the user_id of the selectedUser, and
    // compose an order, and post it. On success, report the
    // new order number to the user using order-message
    let button = document.querySelector(".submitbutton ");
    button.addEventListener("click", function (event) {
      var size_chosen = document.querySelector('input[name="size"]:checked').value;
      var checkedBoxes = document.querySelectorAll('input[name=topping]:checked');
      var toppings_chosen = Array.prototype.slice.call(checkedBoxes).map(cb=>cb.value);
      var userDetail = users.filter(user=>user.username==selectedUser);
      var selectedID = userDetail[0].id;
      var order = {}
      order.user_id=selectedID;
      order.size = size_chosen;
      order.status = "Preparing";
      order.day = "1";
      order.toppings = toppings_chosen;
      postOrder(order);
      event.preventDefault();
      document.getElementById("secondSection").classList.remove("active");
      document.getElementById("firstSection").classList.add("active");
      var ele = document.getElementsByName("size");
      for(var i=0;i<ele.length;i++)
        ele[i].checked = false;
      var top = document.getElementsByName("topping");
      for(var i=0;i<top.length;i++)
          top[i].checked = false;
      displayOrders();
      return false;
    });
      //alert(toppings_chosen);


}

// Plain modern JS: use fetch, which returns a "promise"
// that we can combine with other promises and wait for all to finish
function getSizes() {
    let promise = fetch(
            baseUrl + "/sizes",
            {method: 'GET'}
    )
            .then(response => response.json())  // successful fetch
            .then(json => {
                console.log("back from fetch: %O", json);
                sizes = json;
            })
            .catch(error => console.error('error in getSizes:', error));
    return promise;
}
// JQuery/Ajax: for use with $.when: return $.ajax object
// function getSizes0() {
//     return $.ajax({
//         url: baseUrl + "/sizes",
//         type: "GET",
//         dataType: "json",
//         //  headers: {"Content-type":"application/json"}, // needed
//         success: function (result) {
//             console.log("We did GET to /sizes");
//             console.log(result);
//             sizes = result;
//         }
//     });
// }

function getToppings() {
    let promise = fetch(
            baseUrl + "/toppings",
            {method: 'GET'}
    )
            .then(response => response.json())
            .then(json => {
                console.log("back from fetch: %O", json);
                toppings = json;
            })
            .catch(error => console.error('error in getToppings:', error));
    return promise;
}

// function getToppings0() {
//     return $.ajax({
//         url: baseUrl + "/toppings",
//         type: "GET",
//         dataType: "json",
//         //  headers: {"Content-type":"application/json"}, // needed
//         success: function (result) {
//             console.log("We did GET to /toppings");
//             console.log(result);
//             toppings = result;
//         }
//     });
// }

function getUsers() {
  let promise = fetch(
          baseUrl + "/users",
          {method: 'GET'}
  )
          .then(response => response.json())
          .then(json => {
              console.log("back from fetch: %O", json);
              users = json;
          })
          .catch(error => console.error('error in getUsers:', error));
  return promise;

}

function getOrders() {
  let promise = fetch(
          baseUrl + "/orders",
          {method: 'GET'}
  )
          .then(response => response.json())
          .then(json => {
              console.log("back from fetch: %O", json);
              orders = json;
          })
          .catch(error => console.error('error in getOrders:', error));
  return promise;

}
function updateOrder(order) {
  console.log(order);
  // var userDetail = users.filter(user=>user.username==selectedUser);
  // var selectedID = userDetail[0].id;

  let promise =  fetch(baseUrl + "/orders/"+order.id,
    {method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(order)
  })
  .then(response => response.json())
  .then(json => {
      console.log("back from fetch: %O", json);
    })
    //alert("hi");
.catch(error => console.error('error in putOrder:', error));
}



function postOrder(order) {
  console.log(order);
  var new_order = [];
  var goon = false;
  let promise = fetch(baseUrl + "/orders", {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: JSON.stringify(order)
  })
  .then(response => response.json())

  .then(json => {
      console.log("back from fetch: %O", json);
      orders.push(json);
      //console.log(new_order);
    })
    .catch(error => console.error('error in postOrder:', error));

  //alert("here");
  // let promise =  fetch(baseUrl + "/orders",
  //   {method: 'POST',
  //   body: JSON.stringify(order)
  // })
  // .catch(error => console.error('error in postOrders:', error));
  //return promise;


}


function refreshData(thenFn) {
    // wait until all promises from fetches "resolve", i.e., finish fetching
    Promise.all([getSizes(), getToppings(), getUsers(), getOrders()]).then(thenFn);
    // JQuery way: wait for all these Ajax requests to finish
    // $.when(getSizes(), getToppings(), getUsers(), getOrders()).done(function (a1, a2, a3, a4) {
    //     thenFn();
    //});
}

console.log("starting...");
refreshData(main);



// var o = []
// o.status = "Preparing"
// o.day=1
// o.size = "Small"
// o.toppings = ["Onions"]
// o.
