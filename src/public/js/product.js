const Photo = document.querySelectorAll(".productPhoto");
Photo.forEach((el) => {
  el.addEventListener("change", async (event) => {
    let formdata = new FormData();
    formdata.append("photo", event.target.files[0]);
    let response = await fetch(`product/photo/${event.target.id}`, {
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
