document.addEventListener("DOMContentLoaded", function() {
  var node = document.querySelector("#my-menu");
  if (!node) return;

  var menu = new MmenuLight(node);
  menu.enable("(max-width: 600px)");
  menu.offcanvas();

  var menuLink = document.querySelector('a[href="#my-menu"]');
  if (menuLink) {
    menuLink.addEventListener("click", function(evnt) {
      menu.open();
      evnt.preventDefault();
      evnt.stopPropagation();
    });
  }
});
