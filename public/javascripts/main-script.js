/* */

document.addEventListener('DOMContentLoaded', () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add('is-active');
    }
  
    function closeModal($el) {
      $el.classList.remove('is-active');
    }
  
    function closeAllModals() {
      (document.querySelectorAll('.modal') || []).forEach(($modal) => {
        closeModal($modal);
      });
    }
  
    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
      const modal = $trigger.dataset.target;
      const $target = document.getElementById(modal);
  
      $trigger.addEventListener('click', () => {
        openModal($target);
      });
    });
  
    // Add a click event on various child elements to close the parent modal
    (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
      const $target = $close.closest('.modal');
  
      $close.addEventListener('click', () => {
        closeModal($target);
      });
    });
  
    // Add a keyboard event to close all modals
    document.addEventListener('keydown', (event) => {
      const e = event || window.event;
  
      if (e.keyCode === 27) { // Escape key
        closeAllModals();
      }
    });
  });

  document.addEventListener('DOMContentLoaded', () => {

    // Get all "navbar-burger" elements
    const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
    // Add a click event on each of them
    $navbarBurgers.forEach( el => {
      el.addEventListener('click', () => {
  
        // Get the target from the "data-target" attribute
        const target = el.dataset.target;
        const $target = document.getElementById(target);
  
        // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
        el.classList.toggle('is-active');
        $target.classList.toggle('is-active');
  
      });
    });
  
  });

  //rating click event
  



  $('.star-rating').on('change', function(e){
      let val = $(this).val();

      //clear all star colors
      for(let i=0; i < 5; i++){
        $(`#star-${i+1}`).attr('src', '../images/star-img0.jpeg');
      }

      //set the appropriate star colors
      for(let i=0; i < val; i++){
        $(`#star-${i+1}`).attr('src', '../images/star-img1.jpeg');
      }
      console.log(`current value of stars: ${val}`);

  });


  $('.file-input').on('change', function() {
      let filename = $(this)[0].files[0].name;
      console.log(`this is files: ${filename}`);
      $('.file-name').html(filename);
  });

  $('#cancel-review').on('click', function() {
      $('#review-form').trigger('reset');
      $('.file-name').html("");
      
      //clear all star colors
      for(let i=0; i < 5; i++){
        $(`#star-${i+1}`).attr('src', '../images/star-img0.jpeg');
      }

    
      //$('.star-rating').prop('checked', false);
  });

  //logout
  $('#logout-btn').on('click', function() {
    $('#logout-form').submit();
  });

  //stars 

  //review card go back button
  $('.go-back-btn').on('click', function() {
    history.back();
  });
  

