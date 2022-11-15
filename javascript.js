const open_cart = document.querySelector(".icons_nav.cart");
const close_cart = document.querySelector(".close-cart");
const cart_overlay = document.querySelector(".cart-overlay");
const cart = document.querySelector(".products_cart");
const elementAppend = document.querySelector(".cart_content");
const clear_Cart = document.querySelector(".clear-cart");
const grand_total = document.querySelector(".cart-total");
const items_count = document.querySelector(".cart_items");
const products_DOM = document.querySelector(".items_center");

let cartArray = [];
let buttonDOM = [];

const element_list = [
  {
    id: 1,
    info: {
      url: "./images/content1.jpg",
      name: "First Product",
      price: "$23",
    },
  },
  {
    id: 2,
    info: {
      url: "./images/content2.jpg",
      name: "Second Product",
      price: "$28",
    },
  },
  {
    id: 3,
    info: {
      url: "./images/content3.jpg",
      name: "Third Product",
      price: "$21",
    },
  },
  {
    id: 4,
    info: {
      url: "./images/content4.jpg",
      name: "Fourth Product",
      price: "$25",
    },
  },
  {
    id: 5,
    info: {
      url: "./images/content5.jpg",
      name: "Fifth Product",
      price: "$20",
    },
  },
  {
    id: 6,
    info: {
      url: "./images/content6.jpg",
      name: "Sixth Product",
      price: "$12",
    },
  },
];
document.addEventListener("DOMContentLoaded", () => {
  setUpApp();

  let result = "";
  element_list.forEach((element) => {
    result += `<div class="products">
    <div class="img_container">
      <img src="${element.info.url}" alt="">
      <button class="btn_products" data-id = "${element.id}">
        <i class="fa fa-shopping-cart"></i>Add to Cart
      </button>
    </div>
    <div class="info">
      <h3>${element.info.name}</h3>
      <h4>${element.info.price}</h4>
    </div>
  </div>`;
  });
  products_DOM.innerHTML = result;

  localStorage.setItem("products", JSON.stringify(element_list));

  getbagbtns();

  clear_Cart.addEventListener("click", () => {
    clearcart();
  });
  elementAppend.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-item")) {
      const removeele = event.target;
      console.log(removeele);
      let id = removeele.dataset.id;
      console.log(removeele);
      elementAppend.removeChild(removeele.parentElement.parentElement);
      removeItem(id);
    } else if (event.target.classList.contains("fa-chevron-up")) {
      const amountUp = event.target;
      let id = amountUp.dataset.id;

      cart_Item = cartArray.find((item) => item.id == id);
      cart_Item.quantity = cart_Item.quantity + 1;
      localStorage.setItem("cart", JSON.stringify(cartArray));

      amountUp.nextElementSibling.innerText = cart_Item.quantity;
      // console.log(amountUp);
    } else if (event.target.classList.contains("fa-chevron-down")) {
      const amountDown = event.target;
      let id = amountDown.dataset.id;

      cart_Item = cartArray.find((item) => item.id == id);
      cart_Item.quantity = cart_Item.quantity - 1;
      if (cart_Item.quantity > 0) {
        setCartValues(cartArray);
        localStorage.setItem("cart", JSON.stringify(cartArray));
        amountDown.previousElementSibling.innerText = cart_Item.quantity;
      } else {
        elementAppend.removeChild(amountDown.parentElement.parentElement);
        removeItem(id);
      }
    }
  });
});

const getbagbtns = () => {
  //converting the node list in to an array
  const buttons = [...document.querySelectorAll(".btn_products")];
  buttonDOM = buttons;
  buttons.forEach((button) => {
    let id = button.dataset.id;
    let Incart = cartArray.find((item) => {
      if (item.id == id) {
        return true;
      } else {
        return false;
      }
    });

    if (Incart) {
      button.innerText = "In Cart";
      button.disabled = true;
    }
    button.addEventListener("click", (event) => {
      event.target.innerText = "In Bag";
      button.disabled = true;
      //get item from local storage
      let cartItem = { ...getItems(id), quantity: 1 };

      //saving elements to cart
      cartArray = [...cartArray, cartItem];

      localStorage.setItem("cart", JSON.stringify(cartArray));
      //set cart values

      setCartValues(cartArray);
      //display iftems in the cart
      displayitems(cartItem);
      //display the cart
      showCart();
    });
  });
};

// localStorage.setItem('products',JSON.stringify(element_list));

function clearcart() {
  let cartItems = cartArray.map((item) => item.id);
  cartItems.forEach((id) => removeItem(id));
  let i = 0;
  console.log(elementAppend);
  console.log(elementAppend.children);

  while (elementAppend.children.length > 0) {
    elementAppend.children[0].remove();
  }
  showCart();
}

function removeItem(id) {
  cartArray = cartArray.filter((item) => item.id != id);

  setCartValues(cartArray);
  localStorage.setItem("cart", JSON.stringify(cartArray));

  button = getSingleBtn(id);
  button.disabled = false;
  button.innerHTML = `<i class="fa fa-shopping-cart"></i>Add to Cart`;
}

function getSingleBtn(id) {
  return buttonDOM.find((btn) => btn.dataset.id == id);
}
function getItems(id) {
  const items = JSON.parse(localStorage.getItem("products"));

  return items.find((item) => {
    if (item.id == id) {
      return item;
    }
  });
}
function setCartValues(arr_cart) {
  let priceTotal = 0;
  let itemsTotal = 0;

  arr_cart.map((item) => {
    const price = parseInt(
      item.info.price.split("$").filter((a) => a != "")[0]
    );

    priceTotal += price * item.quantity;

    itemsTotal += item.quantity;
  });
  grand_total.innerText = `${priceTotal}`;
  items_count.innerText = itemsTotal;
}
function displayitems(cartItems) {
  const div = document.createElement("div");
  div.classList.add("cart_inner");
  div.innerHTML = `<img src=${cartItems.info.url} alt="">
  <div class="product_info">
  <h4>${cartItems.info.name}</h4>
  <h5>${cartItems.info.price}</h5>
  <span class="remove-item" data-id=${cartItems.id}>remove</span>
  </div>
  <div class="quantity">
  <i class="fa fa-chevron-up" data-id =${cartItems.id}></i>
  <p class="item-quantity">${cartItems.quantity}</p>
  <i class="fa fa-chevron-down" data-id = ${cartItems.id}></i>
  </div>`;

  elementAppend.append(div);
}
function showCart() {
  cart_overlay.classList.toggle("showoverlay");
  cart.classList.toggle("cart_display");
}
function getCart() {
  return localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [];
}
function setUpApp() {
  cartArray = getCart();
  setCartValues(cartArray);
  populatingCart(cartArray);
  open_cart.addEventListener("click", showCart);
  close_cart.addEventListener("click", showCart);
}
function populatingCart(cart) {
  cart.forEach((item) => displayitems(item));
}
