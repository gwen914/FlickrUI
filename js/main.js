// run getRecent API call on page load
$(document).ready(function() {
	flickr();
})

// click function of "more fields"
$(document).delegate("#more", "click", function() {
	$("#moreFields").toggle("slow", function() {
		if ($("#more").text() == "More Fields") {
			$("#more").text("Fewer Fields");
		}
		else {
			$("#more").text("More Fields");
		}
	});
});

// click function of "search"
$(document).delegate("#searchBtn", "click", function() {
	$("#images ul").remove();
	flickr();
	reset();
});

function reset() {
	document.getElementById("usernameInput").value = "";
	document.getElementById("textArg").value = "";
	document.getElementById("minDate").value = "";
	document.getElementById("maxDate").value = "";
}

function flickr() {

	var searchOptions = {page: 1, per_page: 10};
	var imgList = "";

	var flickr = new Flickr({
	  	api_key: "17132f434648f004c8fed14af680815f",
		secret: "9683d8fbc2320e95",
	});

	function setUser(json) {
		searchOptions.user_id = json.user.nsid;
	}
	
	if (document.getElementById("textArg").value.length != 0) {
		searchOptions.text = document.getElementById("textArg").value;
	}
	
	if (document.getElementById("minDate").value.length != 0) {
		searchOptions.min_upload_date = document.getElementById("minDate").value;
	}
	
	if (document.getElementById("maxDate").value.length != 0) {
		searchOptions.max_upload_date = document.getElementById("maxDate").value;
	}

	if (document.getElementById("usernameInput").value.length != 0) {
		flickr.people.findByUsername({username: document.getElementById("usernameInput").value}, 
		function(err, json) {
			if (err) {
				return console.error(err);
			}
			
			searchOptions.user_id = json.user.nsid;

			flickr.photos.search(searchOptions, function(err, json){
				getImages(err, json, imgList);
			})
		});
	}
	else {
		if (getLength(searchOptions) == 2) {
			flickr.photos.getRecent(searchOptions, function(err, json){
				getImages(err, json, imgList);
			})
		}
		else {
			flickr.photos.search(searchOptions, function(err, json) {
				getImages(err, json, imgList);
			})
		}
	}
}

function getImages(err, json, imgList) {
	if(err) {
		return console.error(err);
	}
	var src;
	var link;
	imgList += "<ul>";
	$.each(json.photos.photo, function(i, item) {
		src = "https://farm" + item.farm + ".static.flickr.com/" + item.server + "/" + item.id + "_" + item.secret + ".jpg";
		link = "https://www.flickr.com/photos/" + item.owner + "/" + item.id + "/";
		imgList += '<a href = "' + link + '"><li><img src = "' + src + '"></li></a>';
	});
	imgList+='</ul>'
	$('#images').append(imgList);
}

function getLength(literal) {
	var length = 0;
	for (var i in literal) {
		length++;
	}
	return length;
}









