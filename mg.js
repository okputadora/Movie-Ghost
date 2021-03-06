// Movieghost from scratch
// Global variables -- instead of constantly passing arguments to functions
// i just made all of the variables global because all functions need access to them
// and the changes they make to them should be perminent and accessible
// by all other functions

// Query parameters
var baseQ = "https://api.themoviedb.org/3/search/";
var baseId = "https://api.themoviedb.org/3/movie/";
var key = "?api_key=2d60d8d7b8dd8bdbaf50624f2bd2caf2";
var lang = "&language=en-US";
var url;

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
var yearStr;
var userSearch = "";
var movieId = 0;

// 0 = actor 1 = movie
var actOrMove;

// 0 ez; 1 md; 2 hd
var difficulty = 0;

function postResponse(){
  // post response
  $("#p" + activeNum + " > h4:nth-child(3)").html(response);
  $("#p" + activeNum + " > h5:nth-child(4)").html("");
  if (trailId === "actor" || (actOrMove === 1 && trail.length === 0)){
    // post the year
    $("#p" + activeNum + " > h5:nth-child(4)").html("(" + yearStr + ")");
    trailId = 'movie';
  }
  else{trailId = 'actor';}
  trail.push(response);
  $("#trail").html(trail + " -> ");
  activePlayer += 1;
  // delay a bit for better UI
  console.log("Response: " + response);
  console.log("trail: " + trail);
  setTimeout(initiateGame, 2000);
}

function checkActorUnique(){
  for (var p in cast){
    // make sure it's unique
    var actorRepeat = false;
    for (var x in trail){
      if (cast[p].toUpperCase() === trail[x].toUpperCase()){
        actorRepeat = true;
      }
    }
    if (actorRepeat === false){
      break;
    }
  }
  response = cast[p];
  console.log("Act unique: " + response);
  postResponse();
}

function getCast(){
  url = baseId + idStr + "/credits" + key + lang;
  $.getJSON(url, function(data){
    cast = [];
    for (var x in data.cast){
      cast.push(data.cast[x].name);
    }
    // if we're trying to get an acotr overwrite response of movie
    if ((actOrMove === 0 && trail.length === 0) || trailId === 'movie'){
      checkActorUnique();
    }
    else{postResponse();}
  });
}

function movieFromId(){
  $.getJSON(url, function(data){
    title = data.title;
    id = data.id;
    idStr = id.toString();
    year = data.release_date.slice(0,4);
    yearStr = year.toString();
    idStr = id.toString();
    response = title;
    console.log("Movie from ID title: " + response);
    getCast();
  })
  .error(function(){
      //try again
      initiateGame();
  });
}

function getMovieFromActor(){
  // response here is the last actor in the trail
  url = baseQ + "person" + key + lang + "&query=" + response;
  $.getJSON(url, function(data){
    // make sure the selection is unique
    var movieRepeat = false;
    // search through trail to make sure this is a
    // new response
    console.log(url);
    for (var i in data.results[0].known_for){
      for (var q in trail){
        if (data.results[0].known_for[i].title.toUpperCase() === trail[q].toUpperCase()){
          console.log("repeat = true")
          movieRepeat = true;
        }
      }
      if (movieRepeat === false){
        break;
      }
    }
    title = data.results[0].known_for[i].title;
    id = data.results[0].known_for[i].id;
    idStr = id.toString()
    year = data.results[0].known_for[i].release_date.slice(0,4);
    yearStr = year.toString();
    response = title;
    console.log("TITLE: " + title);
    getCast();
  })
}

function getRandomMovie(){
  id =  Math.floor(Math.random() * 10000);
  var idStr = id.toString();
  url = baseId + idStr + key + lang;
  // Pick a random actor or movie 0-actor 1-movie
  actOrMove = Math.floor(Math.random() * 2)
  console.log("actOrMove: " + actOrMove);
  movieFromId();
}

function getRobotResponse(){
  // if previouse trailID was movie just pull a unique cast member
  if (trailId === "movie"){
    // extract this out as it's own function (we perform a similar check in getCast)
    checkActorUnique();
  }
  else if (trailId === "actor"){
    // search for a movie by actor
    getMovieFromActor();
  }
}

function searchPerson(){
  url = baseQ + "person" + key + lang + "&query=" + searchTerm;
  $.getJSON(url, function(data){
    if (data.total_results === 0){
      console.log("you entered an incorrect response");
    }
    else{
      response = searchTerm;
      postResponse();
    }
  })
}

function searchMovie(){
  url = baseQ + "movie" + key + lang + "&query=" + searchTerm;
  $.getJSON(url, function(data){
    if (data.total_results === 0){
      movieFound = false;
    }
    else{
      movieFound = true;
    }
    if (movieFound === true){
      title = data.results[0].title;
      movieId = data.results[0].id;
      year = data.results[0].release_date.slice(0,4);
      yearStr = year.toString();
      idStr = movieId.toString();
      response = title;
      // equivalent to if the last id was an actor (ie. this id is a movie)
      trailId = "actor";
      getCast();
    }
    else{
      searchPerson();
    }
  })
}

function getHumanResponse(){
  if (trail.length === 0){
    searchMovie();
  }
  else if (trailId === "actor"){
    // get movie
    searchMovie();
  }
  else if (trailId === "movie"){
    console.log(cast);
    var actorFound = false;
    for (var i in cast){
      if (searchTerm.toUpperCase() === cast[i].toUpperCase()){
        actorFound = true;
        break;
      }
    }
    if (actorFound === true){
      response = searchTerm;
      postResponse();
    }
    else{console.log("Incorrect");}
  }
}



function initiateGame(){
  console.log("game initiated");
  // increment turn if a new round has been started
  if (activePlayer >= players.length){
    activePlayer = activePlayer%(players.length);
    turn += 1;
  }
  // get the active player in string format to append appropriate divs
  activeNum = (activePlayer + 1).toString();
  console.log(activePlayer);
  console.log(activeNum);
  //
  if (players[activePlayer] === "robot"){
    if (trail.length === 0){
      // get random movie if this is the first round
      getRandomMovie();
    }
    else{
      getRobotResponse();
    }
  }
  else if (players[activePlayer] === "human"){
    // give prompt based on previous trailID
    if(trail.length === 0){
      $("#p" + activeNum + " > h3:nth-child(2)").html("Enter a movie or an actor");
    }
    else if (trailId === "actor"){
      $("#p" + activeNum + " > h3:nth-child(2)").html('Enter the name of a movie with "' + response +'"');
      $("#searchTerm" + activeNum).val("");
      $("#searchTerm" + activeNum).attr("placeholder", "Movie...");
    }
    else if (trailId === "movie"){
      $("#searchTerm" + activeNum).val("");
      $("#searchTerm" + activeNum).attr("placeholder", "Actor...");
      $("#p" + activeNum + " > h3:nth-child(2)").html('Enter the name of an actor in "' + response +'"');
    }
    console.log("waiting for searchTerm");
    $("#active-players").on("click", "#submit" + activeNum, function(){
      searchTerm = $("#searchTerm" + activeNum).val();
      getHumanResponse();
    });
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
