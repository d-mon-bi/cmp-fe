apiURL  = "http://52.40.59.4:3000/"

function toggleSearchUI()
{
	isVisible = $("#clickbox").is(':visible');
	if (isVisible)
	{
		$("#clickbox").hide();
		$("#searchresults").hide();
		$("#breadcrumbs-box").hide();
		$("#searchUIToggle").text(">>")
	}
	if (!isVisible)
	{
		$("#clickbox").show();
		$("#searchresults").show();
		$("#breadcrumbs-box").show();
		$("#searchUIToggle").text("<<")
	}
	
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
	});
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
	.done (
		function ( results) {
			$("#searchresults-list").empty();
			$.each(results, function(i, professional){
				$("#searchresults-list").append( '<li class="search-item" id="sr-' + professional._id + '"> <a>' +professional.name + " " + professional.lastName+'</a></li>')
			});
	});
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