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
var cast = [];
var title = "";
var id = 0;
var response = "";
var year;
var userSearch = "";
var movieId = 0;
//activeactiveNum is used to append answer to appropriate player
var activeactiveNum = "";
// 0 = actor 1 = movie
var actOrMove = 0;

// 0 ez; 1 md; 2 hd
var difficulty = 0;
//search movie by random number return movie title
function getRandomMovie(){
  id =  Math.floor(Math.random() * 1000);
  var idStr = id.toString();
  url = baseId + idStr + key + lang;
  $.getJSON(url, function(data){
    title = data.title;
    id = data.id;
    year = data.release_date.slice(0,4);
  })
  .error(function(){
      //try again
      initiateGame();
  })
  // get cast
  url = baseId + idStr + "/credits" + key + lang;
  $.getJSON(url, function(data){
    cast = [];
    for (var x in data.cast){
      cast.push(data.cast[x].name);
    }
    // Pick a random actor or movie
    actOrMove = Math.floor(Math.random() * 2)
    if (actOrMove === 1){
      var yearStr = year.toString();
      // append to trail
      response = title;
      // setting up the next trailID
      trailId = "movie";
      $("#p" + activeNum + " > h5:nth-child(4)").html("(" + yearStr + ")");
    }
    else if (actOrMove === 0){
      response = cast[0];
      trailId = "actor";
    }
    $("#p" + activeNum + " > h4:nth-child(3)").html(response);
    trail.push(response);
    activePlayer += 1;
    console.log(trailId);
    console.log(response);
    console.log(cast);
    initiateGame();
  })
}
//search movie by id return cast
function getRobotResponse(){
  // if last response = movie return unique actor
  if (trailId === "movie"){
    // return an actor
    for (var p in cast){
      // make sure it's unique
      var actorRepeat = false;
      for (var x in trail){
        if (cast[p].toUpperCase === trail[x].toUpperCase){
          actorRepeat = true;
        }
      }
      if (actorRepeat === false){
        console.log("actor repeat: " + actorRepeat);
        break;
      }
    }
    response = cast[p];
    trail.push(response);
    trailId = "movie";
    $("#p" + activeNum + " > h4:nth-child(3)").html(response);
    activePlayer += 1;
    initiateGame();
  }
  else if (trailId === "actor"){
    // search for a movie with this actor
    url = baseQ + "person" + key + lang + "&query=" + response;
    console.log(url);
    $.getJSON(url, function(data){
      // make sure the selection is unique
      var movieRepeat = false;
      console.log(data.results[0].known_for);
      // search through trail to make sure this is a
      // new response
      for (var i in data.results[0].known_for){
        for (var q in trail){
          if (data.results[0].known_for[i].toUpperCase === trail[q].toUpperCase){
            movieRepeat = true;
            console.log("Repeat :" + movieRepeat);
          }
        }
        if (movieRepeat === false){
          break;
        }
      }
      title = data.results[0].known_for[i].title;
      id = data.results[0].known_for[i].id;
      year = data.results[0].known_for[i].release_date.slice(0,4);
      // get the credits for the next round
      var idStr = id.toString();
      url = baseId + idStr + "/credits" + key + lang;
      $.getJSON(url, function(data){
        cast = [];
        for (var x in data.cast){
            cast.push(data.cast[x].name);
          }
          console.log("cast after search" + cast)
          response = title;
          trail.push(response);
          trailId = "movie";
          $("#p" + activeNum + " > h4:nth-child(3)").html(response);
          activePlayer += 1;
          initiateGame();
        });
      });
    }
  }

function searchMovie(searchTerm){
  url = baseQ + "movie" + key + lang + "&query=" + searchTerm;
  E = $.getJSON(url, function(data){
    title = data.results[0].title;
    movieId = data.results[0].id;
    year = data.results[0].release_date.slice(0,4);
  }, "jsonp");
}
function getCast(){
  cast = [];
    var idStr = movieId.toString()
    url = baseId + idStr + "/credits" + key + lang;
    F = $.getJSON(url, function(data){
      for (var x in data.cast){
          cast.push(data.cast[x].name);
      }
    }, "jsonp");
  }

function initiateGame(){
  if (activePlayer >= players.length){
    activePlayer = activePlayer%(players.length);
    turn += 1;
  }
  var q = activePlayer + 1;
  console.log("active player: " + activePlayer);
  activeNum = q.toString();
  if (players[activePlayer] === "robot"){
    if (trail.length === 0){
      // get random movie
      getRandomMovie();
    }
    else{
      getRobotResponse();
    }
  }
  else if (players[activePlayer] === "human"){
    if (trail.length === 0){
      // give prompt
      $("#p" + activeNum + " > h3:nth-child(2)").html("Enter a movie or an actor");
      $("#active-players").on("click", "#submit" + activeNum, function(){
        userSearch = $("#searchTerm" + activeNum).val();
        searchMovie(userSearch);
        $.when(E).done(function(){
          getCast();
          $.when(F).done(function(){
            console.log(cast);
            actOrMove = 1;
            if (actOrMove === 1){
              var yearStr = year.toString();
              // append to trail
              response = title;
              trailId = "movie";
              $("#p" + activeNum + " > h5:nth-child(4)").html("(" + yearStr + ")");
            }
            else if (actOrMove === 0){
              response = cast[0];
              trailId = "actor";
            }
            $("#p" + activeNum + " > h4:nth-child(3)").html(response);
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
        $("#p" + activeNum + " > h3:nth-child(2)").html('Enter the name of an actor in "' + response +'"');
        $("#searchTerm" + activeNum).val("");
        $("#searchTerm" + activeNum).attr("placeholder", "Actor...");
        // listen for response
        $("#active-players").on("click", "#submit" + activeNum, function(){
          userSearch = $("#searchTerm" + activeNum).val();
          // check if it's in the cast list
          var correctAnswer = false;
          for (var i = 0; i < cast.length; i++){
            if (userSearch.toUpperCase() === cast[i].toUpperCase()){
              // The user has submitted a correct answer
              correctAnswer = true;
              console.log("Correct!");
              //consider using proper case (first letter of each name)

              response = userSearch;
              trail.push(response);
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
        $("#p" + activeNum + " > h3:nth-child(2)").html('Enter the name of a movie with "' + response +'"');
        $("#searchTerm" + activeNum).val("");
        $("#searchTerm" + activeNum).attr("placeholder", "Movie...");
        // listen for response
        $("#active-players").on("click", "#submit" + activeNum, function(){
          userSearch = $("#searchTerm" + activeNum).val();
          searchMovie(userSearch);
          $.when(E).done(function(){
            getCast();
            $.when(F).done(function(){
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
      var activeNum = j.toString();
      if (players[i] === "robot"){
        // Append main viewer
        $("#active-players").append("<div class='avatar'id='p" + activeNum +"'>" +
                                    "<h2>Player " + activeNum + "</h2><div class='name'>" +
                                    "<h3>Robot</h3></div><h4></h4><h5></h5>");
        // document.getElementById("active-players").appendChild("div");/
      }
      if (players[i] === "human"){
        // Append main viewer
        console.log("Human appended");
        $("#active-players").append("<div class='avatar'id='p" + activeNum +
                            "'><h2>Player " + activeNum + "</h2>" +
                            "<h3></h3><div class='input'>" +
                            "<input id='searchTerm" + activeNum +
                            "' type='text' placeholder=" +
                            "'Movie or Actor...' /><i id='submit" + activeNum +
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
