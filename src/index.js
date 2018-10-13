
document.addEventListener('DOMContentLoaded', () => {
	var d = new Date();
	if(navigator.geolocation){
		navigator.geolocation.getCurrentPosition(location => {
			console.log(location);
		});
	}
});

