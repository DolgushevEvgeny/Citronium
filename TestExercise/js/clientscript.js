var api_params = {
  a: 1,
  b: 2
};

var params = {
  url: "http://localhost:8888/test",
  type: "GET",
  dataType: "json",
  data: api_params,
  success: onSuccess,
  error: onError
};

function send() {
  $.ajax(params);
}

function onSuccess(response) {
  for (var i = 0; i < response.length; ++i) {
    var item = response[i];
    console.log(item);
  }
  console.log("Success");
}

function onError(response) {
  var item = response[0];
  console.log("Error");
}

$('#submitBtn').on("click",function() {
  console.log("submit click");
});