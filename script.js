let todayDate = moment().format('MMMM Do YYYY, h:mm:ss a');

let searchedCities = [];


$(document).ready(function () {
    $("#weatherImage").hide();

    //loads page with last searched city
    let cityName = localStorage.getItem('userCity');
    searchCities(cityName)

    $("#submitCity").on("click", function (e) {
        e.preventDefault();

        //takes user input
        cityName = $("#userCity").val()
        //stores input to local storage and runs search
        localStorage.setItem('userCity', cityName)
        searchCities(cityName);
        console.log(cityName);
        searchedCities.push(cityName);
    })

    function searchCities(cityName) {

        let queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=f9b50ef2bff87e9c4f3539720b45c8b3";

        $.ajax({
            url: queryURL,
            method: "GET"
        })

            .then(function (response) {

                //confiugre query
                let latitude = response.coord.lat;
                let longitude = response.coord.lon;

                let queryURL2 = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&exclude=minutely&appid=f9b50ef2bff87e9c4f3539720b45c8b3";

                $.ajax({
                    url: queryURL2,
                    method: "GET"
                })
                    //single day forecast
                    .then(function (response) {
                        $("#5day").empty()
                        $("#uv").empty()

                        //configure icon
                        let imageData = response.current.weather[0].icon;
                        let imageIcon = "https://api.openweathermap.org/img/w/" + imageData + ".png";
                        //create elements
                        $("#weatherImage").attr("src", imageIcon);
                        $("#weatherImage").show();
                        $("#enteredCity").html(cityName + " - " + todayDate);
                        $("#temperature").text("Temperature: " + response.current.temp);
                        $("#humidity").text("Humidity: " + response.current.humidity);
                        $("#windspeed").text("Windspeed: " + response.current.wind_speed);
                        $(".card-header").text(cityName);

                        let uvIndex = response.current.uvi

                        //populate history
                        $("#history").append(" -" + cityName + "- ");

                        //uv switch
                        $("#uv").append(`UV Index: <span class="uvSpan"> ${uvIndex}</span>`);
                        if (uvIndex < 3) {
                            $(".uvSpan").addClass("good");
                        }
                        else if (uvIndex > 2 && uvIndex < 8) {
                            $(".uvSpan").addClass("medium");
                        }
                        else {
                            $(".uvSpan").addClass("bad");
                        }

                        //5 day forecast
                        for(let i=1; i<6; i++){

                            let day = i;

                            $("#5day").append(`Day: ${day} - Temp: ` + response.daily[day].temp.day + " ")
                            $("#5day").append(` - Humidity: ` + response.daily[day].humidity + " ")
                            $("#5day").append(` - Windspeed: ` + response.daily[day].wind_speed + " ")

                        }
                    });
            });
    }
});
