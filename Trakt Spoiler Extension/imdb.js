var imdbTitleRegex = /imdb.com\/title\/.+\//;

$(document).ready(function()
{
	CheckIfPageExistsOnTrakt();
});

function CheckIfPageExistsOnTrakt()
{
	if (document.URL.match(imdbTitleRegex))
	{
		var IMDBID = document.URL.split('imdb.com/title/')[1].split('/')[0];
		$.ajax({ url: 'http://trakt.tv/shows/' + IMDBID, success: function(data) { TraktCheckSuccess(data, 'shows/' + IMDBID); } });
		$.ajax({ url: 'http://trakt.tv/movies/' + IMDBID, success: function(data) { TraktCheckSuccess(data, 'movies/' + IMDBID); } });
	}
}

function TraktCheckSuccess(data, traktEndURL)
{
	PlaceTraktIconOnIMDBPage('http://trakt.tv/' + traktEndURL);
}

function PlaceTraktIconOnIMDBPage(traktUrl)
{
	var bottom = document.getElementById("overview-bottom");
	
	var nodeA = document.createElement("a");
	var nodeImg = document.createElement("img");
	
	nodeA.href = traktUrl;
	nodeImg.src = chrome.extension.getURL("icon32.png");
	
	nodeA.appendChild(nodeImg);
	bottom.appendChild(nodeA);
}