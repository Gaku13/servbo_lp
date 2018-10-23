/* main.babel.js */

// if hasClass
function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
var scroll = new SmoothScroll('a.anchor[href*="#"]', {
	offset: '50px'
});
var scroll = new SmoothScroll('a.anchor-mobile[href*="#"]', {
	offset: '0'
});

// onload
;(function(global) {

  // navigation
  /*
  var mobileNav = document.querySelector('.mobile-nav'),
      mobileNavOpen = document.querySelector('.hamburger'),
      mobileNavLink = document.getElementsByClassName('anchor-mobile'),
      mobileNavClose = document.querySelector('.mobile-nav-close');
  mobileNavOpen.addEventListener('click', event => {
    mobileNav.classList.add('in');
  });
  mobileNavClose.addEventListener('click', event => {
    mobileNav.classList.remove('in');
    event.preventDefault();
  });
  for(var z = 0; z < mobileNavLink.length; z++) {
    var elem = mobileNavLink[z];
    elem.onclick = function() {
      mobileNav.classList.remove('in');
    };
  }

  // headroom.js
  var headroom;
  headroom = new Headroom(document.querySelector('header'), {
    'offset': 200,
    'tolerance': {
        down: 0,
        up: 20
    }
  });
  headroom.init();*/

})(typeof global !== 'undefined' ? global : window);
