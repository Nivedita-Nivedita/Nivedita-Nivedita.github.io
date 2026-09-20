document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      links.classList.toggle("open");
    });
  }

  var current = document.body.getAttribute("data-page");
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    if (a.getAttribute("data-page") === current) {
      a.classList.add("active");
    }
  });

  var contactDialog = document.getElementById("contact-dialog");
  if (contactDialog) {
    document.querySelectorAll("[data-open-contact]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        contactDialog.showModal();
      });
    });
  }
});
