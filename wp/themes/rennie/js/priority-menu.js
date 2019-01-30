(function() {
  document.getElementById("navToggle").addEventListener('click', function(e) {
    if (document.getElementById('menu-main') ) {
      document.getElementById('menu-main').classList.toggle('is-open');
      if(document.getElementById('masthead') && document.getElementById('menu-main').classList.contains('has-shadow')){
        document.getElementById('masthead').classList.remove('has-shadow');
      } else if (document.getElementById('masthead') && window.scrollY > 5) {
        document.getElementById('masthead').classList.add('has-shadow');
      }
    }
  });
})();

(function() {
  window.addEventListener('scroll', function(e) {
    if (document.getElementById('masthead') && window.scrollY > 5) {
      document.getElementById('masthead').classList.add('has-shadow');
    } else if (document.getElementById('masthead')) {
      document.getElementById('masthead').classList.remove('has-shadow'); //only remove the shadow and go back to full icon at large screen widths
    }
  });
})();

(function() {
  function resizeGridItem(item){
    grid = document.getElementById('main');
    rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    if(item.querySelector('.content-card')){
      rowSpan = Math.ceil((item.querySelector('.content-card').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
      item.style.gridRowEnd = "span " + rowSpan;
    }
  }

  function resizeAllGridItems(){
    const elms = document.getElementsByClassName("entry");
    for(x = 0; x < elms.length; x++){
      resizeGridItem(elms[x]);
    }
  }

  function resizeInstance(instance){
    resizeGridItem(instance.elements[0]);
  }

  window.onload = resizeAllGridItems();
  window.addEventListener("resize", resizeAllGridItems);

  const allItems = document.getElementsByClassName("entry")
  for(x = 0; x < allItems.length; x++){
    imagesLoaded( allItems[x], resizeInstance);
  }
})();

