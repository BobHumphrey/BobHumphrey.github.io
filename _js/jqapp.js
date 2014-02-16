$(document).ready(function() {
  // tooltips
  //$('.standings th.wins').tooltip();
  
  // skills
	$('#skills img').mouseover(function() {
    var imageFile = $(this).attr('src');
    var imageFileLength = imageFile.length;
    var newImageFile = imageFile.substr(0, imageFileLength - 7).concat('.jpg');
    $(this).attr('src',newImageFile);
  });
  $('#skills img').mouseleave(function() {
    var imageFile = $(this).attr('src');
    var imageFileLength = imageFile.length;
    var newImageFile = imageFile.substr(0, imageFileLength - 4).concat('-bw.jpg');
    $(this).attr('src',newImageFile);
  });
  
  // logo
  $('img.logo').mouseover(function() {
    var imageFile = $(this).attr('src');
    var imageFileLength = imageFile.length;
    var newImageFile = imageFile.substr(0, imageFileLength - 4).concat('_hover.png');
    $(this).attr('src',newImageFile);
  });
  $('img.logo').mouseleave(function() {
    var imageFile = $(this).attr('src');
    var imageFileLength = imageFile.length;
    var newImageFile = imageFile.substr(0, imageFileLength - 10).concat('.png');
    $(this).attr('src',newImageFile);
  });
  
  // tumblr
  function setImageWidths($newWidth) {
    var tuFrame = $('#tumblr-container .thumbnail iframe');
    var thWidth = $(tuFrame).attr('width');
    var thHeight = $(tuFrame).attr('height');
    var thAdjust = $newWidth / thWidth;
    var thAdjHeight = thHeight * thAdjust;
    $(tuFrame).attr('width', $newWidth);
    $(tuFrame).attr('height', thAdjHeight);
    var tuImage = $('#tumblr-container .thumbnail img');
    var imWidth = $(tuImage).attr('width');
    var imHeight = $(tuImage).attr('height');
    var imAdjust = $newWidth / imWidth;
    var imAdjHeight = imHeight * imAdjust;
    $(tuImage).attr('width', $newWidth);
    $(tuImage).attr('height', imAdjHeight);
  }
  function adjustImages() {
    var wWidth = $(window).width();
    var wiWidth = parseInt(wWidth);
    if (wiWidth > 1200) {
      setImageWidths(720);
    }
    else if (wiWidth > 980) {
      setImageWidths(568);
    }
    else if (wiWidth > 768) {
      setImageWidths(424);
    }
    else if (wiWidth < 768) {
      setImageWidths(wiWidth - 151);
    }
  }
  $(window).resize(function() {
    adjustImages();
  });
  // set image widths when the page loads
  adjustImages();
  
}); // end ready







