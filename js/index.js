
var api = "https://fcc-weather-api.glitch.me/api/current?lat="


$("document").ready(function(){
	var d = new Date();
	
	
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(function(location){
	
			var UI = {
				answerElt: $("#answer"),
				mainIconElt: $("#main-icon"),
				locationElt: $("#location"),
				windDirectionElt: $("#wind-direction"),
				beaufortElt: $("#beaufort"),
				temperatureElt: $("#temperature"),
				pressureElt: $("#pressure"),
				humidityElt: $("#humidity"),
				weatherBox: $(".weather-box"),
				divs: [$("#wind-div"), $("#temp-div"), $("#pressure-div"), $("#humidity-div")],
				iconsBox: $(".icons-box"),
				tempConversionBtn: $(".conversion")
			}
			
			var callURL = api + location.coords.latitude + "&lon=" + location.coords.longitude;

			$.getJSON(callURL, function(data){
				
				UI.weatherBox.fadeIn(2000);
				
				UI.answerElt.text(data.weather[0].description);
				UI.locationElt.text(" " + data.name + ", " + data.sys.country);
				if(d.getHours() < 18 && d.getHours() > 6){
					UI.mainIconElt.addClass(iconDayClass[data.weather[0].main.toLowerCase()]);
				}else{
					UI.mainIconElt.addClass(iconNightClass[data.weather[0].main.toLowerCase()]);
				}
				
				
				UI.windDirectionElt.addClass("towards-" + rotateWindDirection(data.wind.deg) + "-deg");
				UI.beaufortElt.addClass("wi-wind-beaufort-" + speedToBeaufort(data.wind.speed));
				UI.temperatureElt.text(" " + Math.floor(data.main.temp));
				UI.pressureElt.text(" " + Math.floor(data.main.pressure));
				UI.humidityElt.text(" " + Math.floor(data.main.humidity));
				
				var toggle = "c";
				UI.tempConversionBtn.click(function(e){
					e.preventDefault();
					var temp;
					if(toggle === "c"){
						toggle="f";
						temp = data.main.temp;
						UI.tempConversionBtn.addClass("wi-celsius");
						UI.tempConversionBtn.removeClass("wi-fahrenheit");
					}else{
						toggle="c";
						temp = celcius2fahrenheit(data.main.temp);
						UI.tempConversionBtn.addClass("wi-fahrenheit");
						UI.tempConversionBtn.removeClass("wi-celsius");
					}
					UI.temperatureElt.text(" " + Math.floor(temp));
				});
				
				setTimeout(function(){
					UI.answerElt.fadeIn(1000);
					setTimeout(function(){
						UI.mainIconElt.fadeIn(1000);
					}, 1000);

					setTimeout(function(){
						UI.iconsBox.fadeIn(1000);
					}, 2000);

					var i = 3;
					UI.divs.forEach(function(elt){
						setTimeout(function(){
							elt.fadeIn(1000);
						}, i*1000);
						i++;
					});
				},2000);
			});
			
		});
	}
});

var iconDayClass = {
	"drizzle": "wi-day-sprinkle",
	"clouds": "wi-day-cloudy",
	"rain": "wi-day-rain",
	"snow": "wi-day-snow",
	"clear": "wi-day-sunny",
	"thunderstom": "wi-day-thunderstorm"
}

var iconNightClass = {
	"drizzle": "wi-night-sprinkle",
	"clouds": "wi-night-cloudy",
	"rain": "wi-night-rain",
	"snow": "wi-night-snow",
	"clear": "wi-night-clear",
	"thunderstom": "wi-night-thunderstorm"
}

function speedToBeaufort(speed){
	if(speed < 0.45) return 0;
	if(speed < 1.55) return 1;
	if(speed < 3.35) return 2;
	if(speed < 5.60) return 3;
	if(speed < 8.25) return 4;
	if(speed < 10.95) return 5;
	if(speed < 14.10) return 6;
	if(speed < 17.20) return 7;
	if(speed < 20.80) return 8;
	if(speed < 24.35) return 9;
	if(speed < 28.40) return 10;
	if(speed < 32.40) return 11;
	return 12;
}

function rotateWindDirection(direction){
	if(direction <= 180) return direction + 180;
	return direction - 180;
}

function celcius2fahrenheit(celcius){
	return 1.8*celcius + 32;
}

function fahrenheit2celcius(fahrenheit){
	return (fahrenheit - 32)/1.8;
}

