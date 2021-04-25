const userAvatar = document.querySelector("#userAvatar");

userAvatar.addEventListener("change", async (e) => {
  let formdata = new FormData();
  formdata.append("photo", e.target.files[0]);
  let response = await fetch("/profile", {
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
