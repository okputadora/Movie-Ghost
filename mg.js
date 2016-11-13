function getMovie(data){
  console.log(data.title);
  console.log(data.release_date.slice(0,4));
}

$(document).ready(function(){
  $(".dif-but").click(function(){
    $("#welcome").css("display", "none");
    $("form").css("display", "flex");
  });

  // AI FOR GAME
  // Start by randomly choosing actor or movie
  var actOrMov = Math.floor(Math.random() * 2);
  var movieId = 0;
  var base = "https://api.themoviedb.org/3/movie/";
  var key = "?api_key=2d60d8d7b8dd8bdbaf50624f2bd2caf2";
  var lang = "&language=en-US";
  var url = "";
  // 0 for movie 1 for actor
  if (actOrMov === 0){
    //generate random movie id
    movieId = Math.floor(Math.random() * 1000);
    console.log(movieId);
    var id = movieId.toString();
    url = base + id + key + lang;
    $.getJSON(url, getMovie, "jsonp");
  }
  // MOVIE DATABASE API CALLS
});
