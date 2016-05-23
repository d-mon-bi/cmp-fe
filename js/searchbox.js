apiURL  = "http://52.40.59.4:3000/"
var markers = [];
function toggleSearchUI()
{
	isVisible = $("#clickbox").is(':visible');
	if (isVisible)
	{
		$("#clickbox").hide();
		$("#searchresults").hide();
		$("#breadcrumbs-box").hide();
		$("#searchUIToggle").text(">>")
		$("#search").width(25);
	}
	if (!isVisible)
	{
		$("#clickbox").show();
		$("#searchresults").show();
		$("#breadcrumbs-box").show();
		$("#searchUIToggle").text("<<")
		$("#search").width("55%");
	}
	
}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}

// Shows any markers currently in the array.
function showMarkers() {
  setMapOnAll(map);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}

function filterCategory(category)
{
	searchURL = apiURL + "professions/byParent/"+category
	$.ajax({
		dataType : "json",
		url : searchURL,
	})
	.done (
		function ( results) {
			
			$("#clickbox-list").empty();
			$.each(results, function(i, profession){
				$("#clickbox-list").append( '<li class="clickbox-item" id="cb-' + profession.name.replace(/\s+/g, '') + '" onClick="filterCategory(\''+profession.name+'\')"> <a>' +profession.name+'</a></li>')
			});
	})
	.fail (
		function(jqXHR, textStatus, errorThrown){
			
		}
	);
	searchProfession(category)
	addBreadcrumb(category)
}

function searchProfession(profession)
{
	searchURL = apiURL + "professionals/byProfession/"+profession
	$.ajax({
		dataType : "json",
		url : searchURL,
	})
	.done (function ( results) {
		var map = document.getElementById('map').gMap;
		clearMarkers();
		$("#searchresults-list").empty();
		$.each(results, function(i, professional){
			$("#searchresults-list").append( '<li class="search-item" id="sr-' + professional._id + '"> <a>' +professional.name + " " + professional.lastName+'</a></li>');
			$.each(professional.offices, function(j, office){
				
				var infowindow = new google.maps.InfoWindow({
					content: formatOffice(professional, office)
				});
				var pos = {lat:office.lat, lng: office.lon};
				var marker = new google.maps.Marker({
					position:pos,
					map: map,
					title: professional.name + " " + professional.lastName
				});
				marker.addListener('mouseover', function() {
					infowindow.open(map, marker);
				});
				marker.addListener('mouseout', function() {
					infowindow.close();
				});
				markers.push(marker);
			});
		});
	});
}

function formatOffice(professional, office)
{
	formattedOffice = '';
	formattedOffice = formattedOffice +  '<div class="markerInfoWindow"><h1>'+professional.name + " " + professional.lastName+'</h1><h2>'+office.name+'</h2><h3>'+office.phone+'</h3></div>';
	
	return formattedOffice;
}

function addBreadcrumb(category)
{
    
	$ ("#breadcrumb-list").append('<li class="breadcrum-item" id="bc-'+category.replace(/\s+/g, '')+'" onClick="returnTo(\''+category+'\')"><a>'+category+'</a></li>')
}

function returnTo(category)
{
	bclist = $("#breadcrumb-list");
	index = bclist.find("#bc-" + category.replace(/\s+/g, '')).index();
	i = bclist.find("li").length-1;
	while (i >= index)
	{
		bclist.find("li").eq(i--).remove();
	}
	filterCategory(category)
}

$(document).ready(function()
{
	filterCategory("Salud")
})