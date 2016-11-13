function searchMovie(data){
  var id = data.results[0].id);
  // get the cast list
  url = baseId + id + key + lang;
  $.getJSON(url, getMovie, "jsonp");
}

function getMovie(data){
  
}

$(document).ready(function(){
  // Query parameters
  var baseQ = "https://api.themoviedb.org/3/search/movie";
  var baseId = "https://api.themoviedb.org/3/movie";
  var key = "?api_key=2d60d8d7b8dd8bdbaf50624f2bd2caf2";
  var lang = "&language=en-US";
  var url = "";

  // Start game
  $(".dif-but").click(function(){
    $("#welcome").css("display", "none");
    $("#players-container").css("display", "flex");
  });
  $("#start").click(function(){
    $("#players-container").css("display", "none");
    $("#main-game").css("display", "flex");
  });

  // User input
  $("#submit").click(function(){
    var searchTerm = $("#searchTerm").val();
    url = baseQ + key + lang + "&query=" + searchTerm;
    $.getJSON(url, searchMovie, "jsonp");
  });

  // AI FOR GAME
  // Start by randomly choosing actor or movie
  var actOrMov = Math.floor(Math.random() * 2);
  var movieId = 0;

  // 0 for movie 1 for actor
  // if (actOrMov === 0){
  //   //generate random movie id
  //   movieId = Math.floor(Math.random() * 1000);
  //   console.log(movieId);
  //   var id = movieId.toString();
  //   url = base + id + key + lang;
  //   $.getJSON(url, getMovie, "jsonp");
  // }
  // MOVIE DATABASE API CALLS
});
