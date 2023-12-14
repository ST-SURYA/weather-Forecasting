let locationCredentials, states, citiesNames;
$(document).ready(function () {
  fetch(
    "https://raw.githubusercontent.com/nshntarora/Indian-Cities-JSON/master/cities.json"
  )
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      locationCredentials = response;
      console.log(response);
      states = [...new Set(response.map((city) => city.state))];
      console.log("state", states);
      $("#state").autocomplete({
        source: states,
      });
    });
});
$(document).on("keyup", "#state", function () {
  $("#city").val("");
});
$(document).on("change", "#state", function () {
  const value = $(this).val();
  console.log(value);
  citiesNames = locationCredentials
    .filter((city) => city.state.toLowerCase().includes(value.toLowerCase()))
    .map((city) => city.name);
  console.log(citiesNames);
  $("#city").autocomplete({
    source: citiesNames,
  });
});
$(document).on("submit", "#weather", function (e) {
  e.preventDefault();
  $(".error").addClass("loader");
  $("#loader").removeClass("loader");
  const cityName = $("#city").val();
  $(".weatherDetails").addClass("loader");
  if (!citiesNames.includes(cityName)) {
    $(".error").removeClass("loader");
    $("#loader").addClass("loader");
    $(".error").text("Please Enter the valid credentials");
    return;
  }
  fetch(
    `https://api.api-ninjas.com/v1/geocoding?city=${cityName}&country=india`,
    {
      method: "GET",
      headers: {
        "X-Api-Key": "8DbA/KRdsJFu8IDkD6iwUA==nQ0UTdpFl3jv71Wf",
        "Content-Type": "application/json",
      },
    }
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((result) => {
      console.log(result);
      return fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${result[0].latitude}&longitude=${result[0].longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,weathercode&daily=sunrise,sunset&current_weather=true&timeformat=unixtime&timezone=auto&forecast_days=1`
      );
    })
    .then((response) => response.json())
    .then((res) => {
      console.log(res);
      $("#loader").addClass("loader");
      $(".weatherDetails").removeClass("loader");
      const humidity =
        res.hourly.relativehumidity_2m.reduce((acc, val) => acc + val, 0) /
        res.hourly.relativehumidity_2m.length;
      const dewpoint =
        res.hourly.dewpoint_2m.reduce((acc, val) => acc + val, 0) /
        res.hourly.dewpoint_2m.length;
      $("div .weatherValue").text("");
      $("#temperature").text(`${res.current_weather.temperature}°C`);
      $("#humidity").text(`${parseFloat(humidity).toFixed(2)}°C`);
      $("#dewPoint").text(`${parseFloat(dewpoint).toFixed(2)}%`);
      $("#wind").text(`${res.current_weather.windspeed} Km/h`);
      $("#timeZone").text(res.timezone);
      $("img").removeClass("loader");
      if (res.current_weather.weathercode < 30) {
        $("#description").prev().attr("src", "Assests/icon/sunny.png");
        $("#description").text("Sunny");
      }
      if (
        res.current_weather.weathercode >= 30 &&
        res.current_weather.weathercode < 60
      ) {
        $("#description").prev().attr("src", "Assests/icon/clouds.png");
        $("#description").text("Cloudy");
      }
      if (res.current_weather.weathercode >= 60) {
        $("#description").prev().attr("src", "Assests/icon/rainny.png");
        $("#description").text("Rainny");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      $(".error").removeClass("loader");
      $("#loader").addClass("loader");
      $(".error").text("Please Enter the valid credentials");
    });
});
//   $.ajax({
//     method: "GET",
//     url: `https://api.api-ninjas.com/v1/geocoding?city= + ${cityName}&country= india`,
//     headers: { "X-Api-Key": "8DbA/KRdsJFu8IDkD6iwUA==nQ0UTdpFl3jv71Wf" },
//     contentType: "application/json",
//     success: async function (result) {
//       console.log(result);
//       await fetch(
//         `https://api.open-meteo.com/v1/forecast?latitude=${result[0].latitude}&longitude=${result[0].longitude}&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,weathercode&daily=sunrise,sunset&current_weather=true&timeformat=unixtime&timezone=auto`
//       )
//         .then((res) => {
//           return res.json();
//         })
//         .then((res) => {
//           console.log(res);
//         });
//     },
//     error: function ajaxError(jqXHR) {
//       console.error("Error: ", jqXHR.responseText);
//     },
//   });
