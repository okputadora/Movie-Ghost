// Global variables
// Query parameters
var baseQ = "https://api.themoviedb.org/3/search/movie";
var baseId = "https://api.themoviedb.org/3/movie/";
var key = "?api_key=2d60d8d7b8dd8bdbaf50624f2bd2caf2";
var lang = "&language=en-US";
var url = "";

// Tracking variables
var turn = 0;
var round = 0;
var strikes = 0;
var moviesUsed = [];
var actorsUsed = [];
// 0 ez; 1 md; 2 hd
var difficulty = 0;

function searchMovie(data){
  var id = data.results[0].id;
  // get the cast list
  var url = baseId + id + "/credits" + key + lang;
  $.getJSON(url, getMovie, "jsonp");
}

function getMovie(data){
  $(".answer").html(data.cast[0].name);
  $("#searchTerm").val("");
  for (var i in data.cast){
    console.log(data.cast[i].name);
  }
}

$(document).ready(function(){

  // choose dificulty
  $(".dif-but").click(function(){
    $("h2").slideUp(300);
    $(".dif-but").slideUp(700);
    setTimeout(function(){
      $("#welcome").css("display", "none");
      $("#players-container").css("display", "flex");
      $(".player").slideDown(500);
      $("#start").slideDown(300);

    }, 1000);


  });

  // Select players
  $("#start").click(function(){
    var players = [];
    players.push($('input[name="player1-type"]:checked').val());
    players.push($('input[name="player2-type"]:checked').val());
    players.push($('input[name="player3-type"]:checked').val());
    players.push($('input[name="player4-type"]:checked').val());

    // create the players
    for (var i = 0; i < players.length; i++){
      var j = i + 1
      var num = j.toString();
      if (players[i] === "robot"){
        // Append main viewer
        $("#active-players").append("<div class='avatar'id='p" + num +"'>" +
                                    "<h2>Player " + num + "</h2><div class='name'>" +
                                    "<h3>Robot</h3></div>");
        // document.getElementById("active-players").appendChild("div");
      }
      if (players[i] === "human"){
        // Append main viewer
        console.log("Human appended");
        $("#active-players").append("<div class='avatar'id='p" + num +
                            "'<h2>Player 1</h2><div class='prompt'><h3>" +
                            "Enter a movie or an actor</h3></div><div class='input'>" +
                            "<input id='searchTerm' type='text' placeholder=" +
                            "'Movie or Actor...' /><i id='submit' class='fa fa-arrow-right'" +
                            "aria-hidden='true'></i></div>");
      }
      if (players[i] === undefined){
        continue;
      }
    }
    $("#players-container").css("display", "none");
    $("#main-game").css("display", "flex");
  });


  // User input
  $('#active-players').on('click', '#submit', function() {
    var searchTerm = $("#searchTerm").val();
    url = baseQ + key + lang + "&query=" + searchTerm;
    $.getJSON(url, searchMovie, "jsonp");
    console.log("Loading");
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
