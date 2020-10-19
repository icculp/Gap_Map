#/usr/bin/node
/*
* Task 6
*/
const $ = window.$;
const jQuery = window.jQuery;
const a = {};
const c = {};
const s = {};
const d = { amenities: a, cities: c, states: s };
$(document).ready(function () {
  const ur = 'http://localhost:5001/api/v1/status/';
  $.getJSON(ur, function (data) {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });

  $(".locations div.popover ul li [type='checkbox']#city").click(function () {
    if ($(this).is(':checked')) {
      $('.locations h4').empty();
      c[$(this).attr('data-id')] = ($(this).attr('data-name'));
      $('.locations h4').append(Object.values(c).join(', '));
    } else {
      delete c[$(this).attr('data-id')];
      $('.locations h4').empty();
      if (jQuery.isEmptyObject(c)) {
        $('.locations h4').empty();
        $('.locations h4').append('&nbsp;');
      } else {
        $('.locations h4').empty();
        $('.locations h4').append(Object.values(c).join(', '));
      }
    }
  });

  $(".locations div.popover ul li [type='checkbox']#state").click(function () {
    if ($(this).is(':checked')) {
      $('.locations h4').empty();
      s[$(this).attr('data-id')] = ($(this).attr('data-name'));
      $('.locations h4').append(Object.values(s).join(', '));
    } else {
      delete s[$(this).attr('data-id')];
      $('.locations h4').empty();
      if (jQuery.isEmptyObject(s)) {
        $('.locations h4').empty();
        $('.locations h4').append('&nbsp;');
      } else {
        $('.locations h4').empty();
        $('.locations h4').append(Object.values(s).join(', '));
      }
    }
  });

  $(".amenities div.popover ul li [type='checkbox']#amenity").click(function () {
    if ($(this).is(':checked')) {
      $('.amenities h4').empty();
      a[$(this).attr('data-id')] = ($(this).attr('data-name'));
      $('.amenities h4').append(Object.values(a).join(', '));
    } else {
      delete a[$(this).attr('data-id')];
      $('.amenities h4').empty();
      if (jQuery.isEmptyObject(a)) {
        $('.amenities h4').empty();
        $('.amenities h4').append('&nbsp;');
      } else {
        $('.amenities h4').empty();
        $('.amenities h4').append(Object.values(a).join(', '));
      }
    }
  });

  $(':button').click(function (e) {
    e.preventDefault();
    d.amenities = Object.keys(a);
    d.cities = Object.keys(c);
    d.states = Object.keys(s);
    $.ajax({
      type: 'POST',
      url: 'http://localhost:5001/api/v1/places_search/',
      data: (Object.keys(d).length === 0) ? '{}' : JSON.stringify(d),
      success: function (data) {
        $('section.places').empty();
        $(data).each(function () {
          $('section.places').append('<article><div class="title_box"><h2>' + `${this.name}` + '</h2><div class="price_by_night">$' + `${this.price_by_night}` + '</div></div><div class="information"><div class="max_guest">' + `${this.max_guest}` + '</div><div class="number_rooms">' + `${this.number_rooms}` + '</div><div class="number_bathrooms">' + `${this.number_bathrooms}` + '</div></div><div class="description">' + `${this.description}` + '</div></article>');
        });
      },
      contentType: 'application/json',
      dataType: 'json'
    });
  });

  $.ajax({
    type: 'POST',
    url: 'http://localhost:5001/api/v1/places_search/',
    data: (Object.keys(d).length === 0) ? '{}' : JSON.stringify(d),
    success: function (data) {
      $(data).each(function () {
        $('section.places').append('<article><div class="title_box"><h2>' + `${this.name}` + '</h2><div class="price_by_night">$' + `${this.price_by_night}` + '</div></div><div class="information"><div class="max_guest">' + `${this.max_guest}` + '</div><div class="number_rooms">' + `${this.number_rooms}` + '</div><div class="number_bathrooms">' + `${this.number_bathrooms}` + '</div></div><div class="description">' + `${this.description}` + '</div><div class=reviews><h2>' + `${this.reviews}` + ' Reviews</h2><ul><li><h3>From Kamie Nean the 6th September 2017</h3><p>I felt like a Queen during my stay!</p></li><li><h3>From Heman the 5th October 2017</h3><p>Beautiful Place.</p></li><li><h3>From Numa the 15th August 2017</h3><p>Great view and service!</p></li></ul></div></article>');
      });
    },
    contentType: 'application/json',
    dataType: 'json'
  });
});
