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
var trail = [];
var trailId = "";
var players = [];
var gameOn = true;
var cast = [];
var title = "";
var id = 0;
// 0 ez; 1 md; 2 hd
var difficulty = 0;
function printResult(title, year, id){
  console.log("Print result");
  console.log(title);
  console.log(id);
  $("#p1 > h4:nth-child(3)").append(title);
}
function getRandomMovie(){
  id =  Math.floor(Math.random() * 1000);
  var idStr = id.toString();
  url = baseId + idStr + key + lang;
  $.getJSON(url, function(data){
    title = data.title;
    id = data.id;
    var year = data.release_date.slice(0,4);
    printResult(title, year, id);
  }, "jsonp");
}

function initiateGame(){
  while (gameOn === true){
    var i = 0;
    if (i >= players.length){
      i = i%players.length;
    }
    if (players[i] === "robot"){
      if (trail.length === 0){
        // Pick a random actor or movie
        var actOrMove = Math.floor(Math.random() * 2)
          // get random movie
          getRandomMovie();

          // get the cast list

          if (actOrMove === 1){
            // append to trail
            trail.push(title);
            trailId = "movie";
            console.log(trailId);
          }
          else if (actOrMove === 0){
            trail.push(cast[0]);
            trailId = "actor";
            console.log(trailId)
          }
        }
      else{}
      // display answer

        // element.html(trail[-1]
    }
    else if (players[i] === "human" && trail.length === 0){
      if (trail.length === 0){

      }
      else{}
    }
    gameOn = false;
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
    $(".player").slideUp(300);
    $("#start").slideUp(300);
    players.push($('input[name="player1-type"]:checked').val());
    players.push($('input[name="player2-type"]:checked').val());
    players.push($('input[name="player3-type"]:checked').val());
    players.push($('input[name="player4-type"]:checked').val());
    console.log(players);
    // create the players
    for (var i = 0; i < players.length; i++){
      var j = i + 1
      var num = j.toString();
      if (players[i] === "robot"){
        // Append main viewer
        $("#active-players").append("<div class='avatar'id='p" + num +"'>" +
                                    "<h2>Player " + num + "</h2><div class='name'>" +
                                    "<h3>Robot</h3></div><h4></h4>");
        // document.getElementById("active-players").appendChild("div");/
      }
      if (players[i] === "human"){
        // Append main viewer
        console.log("Human appended");
        $("#active-players").append("<div class='avatar'id='p" + num +
                            "'><h2>Player " + num + "</h2><div class='prompt'><h3>" +
                            "Enter a movie or an actor</h3></div><div class='input'>" +
                            "<input id='searchTerm' type='text' placeholder=" +
                            "'Movie or Actor...' /><i id='submit' class='fa fa-arrow-right'" +
                            "aria-hidden='true'></i></div>");
      }
      if (players[i] === undefined){
        continue;
      }
    }

    setTimeout(function(){
      $("#players-container").css("display", "none");
      $("#main-game").slideDown(2000, function(){
        $("#main-game").css("display", "flex");
      });
    }, 2500);

    initiateGame();
  });

  // User input
  $('#active-players').on('click', '#submit', function() {
    var searchTerm = $("#searchTerm").val();
    url = baseQ + key + lang + "&query=" + searchTerm;
    $.getJSON(url, searchMovie, "jsonp");
    console.log("Loading");
  });

});
