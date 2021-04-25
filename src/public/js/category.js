// const inputFile = document.querySelector("#categoryPic");
// const submitBtn = document.querySelector("#submitBtn");
// const inputName = document.querySelector("#categoryName");

// let formdata = new FormData();

// inputFile.addEventListener("change", (e) => {
//   formdata.append("photo", e.target.files[0]);
// });

// submitBtn.addEventListener("click", async (e) => {
//   let response = await fetch("category/photo", {
//     method: "POST",
//     body: formdata,
//   });
//   response = await response.json();
//   if (response.ok) {
//     window.location.reload();
//   } else {
//     alert("Xato!");
//   }
// });

const Photo = document.querySelectorAll(".categoryPhoto");
Photo.forEach((el) => {
  el.addEventListener("change", async (event) => {
    console.log(event.target);
    let formdata = new FormData();
    formdata.append("photo", event.target.files[0]);
    let response = await fetch(`category/photo/${event.target.id}`, {
      method: "POST",
      body: formdata,
    });
    response = await response.json();
    if (response.ok) {
      window.location.reload();
    } else {
      alert("Xato");
    }
  });
});
