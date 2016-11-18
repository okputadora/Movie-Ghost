// Global variables
// Query parameters
var baseQ = "https://api.themoviedb.org/3/search/";
var baseId = "https://api.themoviedb.org/3/movie/";
var key = "?api_key=2d60d8d7b8dd8bdbaf50624f2bd2caf2";
var lang = "&language=en-US";
var url = "";

// Tracking variables
var turn = 0;
var round = 0;
var strikes = 0;
var trail = [];
// movie or actor -- TrailId references the last response of trail
// if trailId = movie the next response should be an actor
var trailId = "";
var players = [];
var activePlayer = 0;
var gameOn = true;
var cast = [];
var title = "";
var id = 0;
var response = "";
var year;
var userSearch = "";
var movieId = 0;
// 0 = actor 1 = movie
var actOrMove = 0;

// Event listener
var A;
var B;
var C;
var D;
// 0 ez; 1 md; 2 hd
var difficulty = 0;

function getRandomMovie(){
  id =  Math.floor(Math.random() * 1000);
  var idStr = id.toString();
  url = baseId + idStr + key + lang;
  A = $.getJSON(url, function(data){
    title = data.title;
    id = data.id;
    year = data.release_date.slice(0,4);
  }, "jsonp");
  url = baseId + idStr + "/credits" + key + lang;
  B = $.getJSON(url, function(data){
    for (var x in data.cast){
      cast.push(data.cast[x].name);
    }
  });
}

function getMovie(){
  url = baseQ + "person" + key + lang + "&query=" + response;
  C = $.getJSON(url, function(data){
    title = data.results[0].title;
    console.log(title);
    id = data.results[0].title;
    year = data.results[0].release_date.slice(0,4);
    // search through trail to make sure this is a
    // new response
  }, "jsonp");
  var idStr = id.toString();
  url = baseId + idStr + "/credits" + key + lang;
  D = $.getJSON(url, function(data){
    cast = [];
    for (var x in data.cast){
        cast.push(data.cast[x].name);
      }
  }, "jsonp");
}

function searchMovie(searchTerm){
  url = baseQ + "movie" + key + lang + "&query=" + searchTerm;
  A = $.getJSON(url, function(data){
    title = data.results[0].title;
    movieId = data.results[0].id;
    year = data.results[0].release_date.slice(0,4);
  }, "jsonp");
}
function getCast(){
    var idStr = movieId.toString()
    url = baseId + idStr + "/credits" + key + lang;
    B = $.getJSON(url, function(data){
      for (var x in data.cast){
          cast.push(data.cast[x].name);
      }
    }, "jsonp");
  }

function initiateGame(){
  console.log("New round started");
  console.log("trail: " + trail);
  console.log("trailId: " + trailId);
  var q = activePlayer + 1;
  var num = q.toString();
  console.log("active player: " + activePlayer);
  if (activePlayer >= players.length){
    activePlayer = activePlayer%players.length;
    turn += 1;
  }
  if (players[activePlayer] === "robot"){
    if (trail.length === 0){
      // Pick a random actor or movie
      actOrMove = Math.floor(Math.random() * 2)
      // get random movie
      getRandomMovie();
      $.when(A,B).done(function(){
        if (actOrMove === 1){
          var yearStr = year.toString();
          // append to trail
          response = title;
          // setting up the next trailID
          trailId = "movie";
          $("#p" + num + " > h5:nth-child(4)").append("(" + yearStr + ")");
        }
        else if (actOrMove === 0){
          response = cast[0];
          trailId = "actor";
        }
        $("#p" + num + " > h4:nth-child(3)").append(response);
        trail.push(response);
        activePlayer += 1;
        initiateGame();
      });
    }

    else{
      if (trailId === "actor"){
        console.log("robot getting movie from actor");
        getMovie();
        $.when(C,D).done(function(){
          console.log("in here");
          response = title;
          console.log(response);
          trail.push(response);
          trailId = "movie";
          $("#p" + num + " > h4:nth-child(3)").append(response);
        });
      }
      else if (trailId === "movie"){
        // return an actor
        // make sure it's unique
        var actorRepeat = false;
        for (var p in cast){
          for (var x in trail){
            if (cast[p] === trail[x]){
              actorRepeat = true;
          }
          if (actorRepeat = false){
            break;
          }
          }
        }
        response = cast[p];
        trail.push(response);
        $("#p" + num + " > h4:nth-child(3)").append(response);
        trailId = "actor";
        console.log("ID: " + trailId);
      }
      activePlayer += 1;
      initiateGame();
    }
  }
  else if (players[activePlayer] === "human"){
    if (trail.length === 0){
      // give prompt
      $("#p" + num + " > h3:nth-child(2)").append("Enter a movie or an actor");
      $("#active-players").on("click", "#submit" + num, function(){
        userSearch = $("#searchTerm" + num).val();
        searchMovie(userSearch);
        $.when(A).done(function(){
          getCast();
          $.when(B).done(function(){
            console.log(cast);
            actOrMove = 1;
            if (actOrMove === 1){
              var yearStr = year.toString();
              // append to trail
              response = title;
              trailId = "movie";
              $("#p" + num + " > h5:nth-child(4)").append("(" + yearStr + ")");
            }
            else if (actOrMove === 0){
              response = cast[0];
              trailId = "actor";
            }
            $("#p" + num + " > h4:nth-child(3)").append(response);
            trail.push(response);
            activePlayer += 1;
            initiateGame();
          });
        });

      });
    }
    else{
      if (trailId === "movie"){
        // prompt the user to enter an actor
        $("#p" + num + " > h3:nth-child(2)").append('Enter the name of an actor in "' + response +'"');
        $("#searchTerm" + num).attr("placeholder", "Actor...");
        // listen for response
        $("#active-players").on("click", "#submit" + num, function(){
          userSearch = $("#searchTerm" + num).val();
          // check if it's in the cast list
          var correctAnswer = false;
          for (var i = 0; i < cast.length; i++){
            if (userSearch.toUpperCase() === cast[i].toUpperCase()){
              // The user has submitted a correct answer
              correctAnswer = true;
              console.log("Correct!");
              //consider using proper case (first letter of each name)
              trail.push(userSearch);
              response = userSearch;
              // toggle trailId
              trailId = "actor";
              break;
            }
          }
          if (correctAnswer = false){
            console.log("Incorrect!")
            // give the user a letter
            // set turn to 0

          }
          activePlayer += 1;
          initiateGame();
        });
      }
      else if (trailId === "actor"){
        $("#p" + num + " > h3:nth-child(2)").append('Enter the name of a movie with "' + response +'"');
        $("#searchTerm" + num).attr("placeholder", "Movie...");
        // listen for response
        $("#active-players").on("click", "#submit" + num, function(){
          userSearch = $("#searchTerm" + num).val();
          searchMovie(userSearch);
          $.when(A).done(function(){
            getCast();
            $.when(B).done(function(){
              for (var i in cast){
                if (userSearch.toUpperCase === cast[i].toUpperCase){
                  console.log("Correct!")
                  trailId = "movie";
                  trail.push(userSearch);
                  break;
                }
              }
              activePlayer += 1;
              initiateGame();
            });
          });
        });
      }
    }
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

    // remove undefined players
    for (var x = players.length; x--;){
      if (players[x] === undefined){
        players.splice(x, 1);
      }

    }
    console.log("players: " + players);
    // create the players
    var length = players.length;
    for (var i = 0; i < length; i++){
      var j = i + 1
      var num = j.toString();
      if (players[i] === "robot"){
        // Append main viewer
        $("#active-players").append("<div class='avatar'id='p" + num +"'>" +
                                    "<h2>Player " + num + "</h2><div class='name'>" +
                                    "<h3>Robot</h3></div><h4></h4><h5></h5>");
        // document.getElementById("active-players").appendChild("div");/
      }
      if (players[i] === "human"){
        // Append main viewer
        console.log("Human appended");
        $("#active-players").append("<div class='avatar'id='p" + num +
                            "'><h2>Player " + num + "</h2>" +
                            "<h3></h3><div class='input'>" +
                            "<input id='searchTerm" + num +
                            "' type='text' placeholder=" +
                            "'Movie or Actor...' /><i id='submit" + num +
                            "' class='fa fa-arrow-right'" +
                            "aria-hidden='true'></i></div>");
      }
    }
    console.log(players);
    $("#players-container").css("display", "none");
    $("#main-game").css("display", "flex");

    initiateGame();
  });

});
