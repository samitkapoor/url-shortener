function copyLink() {
  const link = document.getElementById("link");

  navigator.clipboard.writeText(link.innerText);
}
