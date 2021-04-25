// const subTotalAmount = document.querySelector(".subtotal-amount");
// // console.log(subTotalAmount.textContent);
// // subTotalAmount.textContent =
// //   document.querySelector(".unit-amount").textContent *
// //   document.querySelector(".product-amount").value;

// document.querySelector(".product-amount").addEventListener("change", (e) => {
//   subTotalAmount.textContent =
//     document.querySelector(".unit-amount").textContent * e.target.value;
// });

const productsAmount = document.querySelectorAll(".product-amount");
const subTotals = document.querySelectorAll(".subtotal-amount");
const plusBtns = document.querySelectorAll(".plus-btn");
const minusBtns = document.querySelectorAll(".minus-btn");
const totalPrice = document.querySelector(".total-price");
// function updataInput()
let total = 0;
window.addEventListener("load", (e) => {
  subTotals.forEach((el) => {
    total += el.textContent - 0;
    totalPrice.textContent = total;
  });
});

plusBtns.forEach((el, index) => {
  subTotals[index].textContent =
    (productsAmount[index].value - 0) *
    (document.querySelectorAll(".unit-amount")[index].textContent - 0);
  // totalPrice.textContent =
  el.addEventListener("click", (e) => {
    if (productsAmount[index].name === subTotals[index].getAttribute("name")) {
      subTotals[index].textContent =
        (productsAmount[index].value - 0 + 1) *
        (document.querySelectorAll(".unit-amount")[index].textContent - 0);
    } else {
      console.log("else");
    }
    total = 0;
    subTotals.forEach((el) => {
      total += el.textContent - 0;
      totalPrice.textContent = total;
    });
  });
});

minusBtns.forEach((el, index) => {
  el.addEventListener("click", (e) => {
    if (productsAmount[index].value - 0 > 0) {
      if (
        productsAmount[index].name === subTotals[index].getAttribute("name")
      ) {
        subTotals[index].textContent =
          (productsAmount[index].value - 0 - 1) *
          (document.querySelectorAll(".unit-amount")[index].textContent - 0);
      } else {
        console.log("else");
      }
      total = 0;
      subTotals.forEach((el) => {
        total += el.textContent - 0;
        totalPrice.textContent = total;
      });
    }
  });
});

let updateBtn = document.querySelector("#updateCart");
let orderBtn = document.querySelector(".checkout");

updateBtn.addEventListener("click", async (e) => {
  let cart = [];
  productsAmount.forEach((el, index) => {
    let product = {
      id: el.name,
      count: el.value,
    };
    cart.push(product);
  });
  let response = await fetch("/cart/update", {
    method: "POST",
    body: JSON.stringify(cart),
    headers: {
      "Content-Type": "application/json",
    },
  });
  response = await response.json();
  if (response.ok) {
    window.location.reload();
  } else {
    alert("error");
  }
  console.log(cart);
});

orderBtn.addEventListener("click", async (e) => {
  let order = [];
  productsAmount.forEach(async (el, index) => {
    let product = {
      id: el.name,
      count: el.value,
      fullName: document.querySelector("#fullName").value,
      price: subTotals[index].textContent - 0,
      city: document.querySelector("#city").value,
      zipPostal: document.querySelector("#zipPostal").value,
      paymentMethod: document.querySelector("#paymentMethod").value,
    };
    console.log(product);
    order.push(product);
  });
  console.log(order);
  let response = await fetch("/order", {
    method: "POST",
    body: JSON.stringify(order),
    headers: {
      "Content-Type": "application/json",
    },
  });
  response = await response.json();
  if (response.ok) {
    window.location.reload();
  } else {
    alert("Error");
  }
});
