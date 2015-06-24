var userName = "";

GetUserName();

function PopulatePage()
{
	var goToTraktButton = document.getElementById('goToTrakt');
		
		var profileSet = false;
		
		if (userName != "")
			profileSet = true;
			
		var goToProfileButton = document.getElementById('goToTraktProfile');
		var goToProgressPageButton = document.getElementById('goToTraktProgress');
		var goToWatchlistButton = document.getElementById('goToTraktWatchlist');
		
		var btnOptions = document.getElementById('btnOptions');
		
		//Enable or disable buttons depending on users logged in status.
		goToProfileButton.disabled = !profileSet;
		goToProgressPageButton.disabled = !profileSet;
		goToWatchlistButton.disabled = !profileSet;
		
		goToTraktButton.addEventListener('click', function()
		{
				NavigateToTrakt();
		}, false);
		
		goToProfileButton.addEventListener('click', function()
		{
				NavigateToProfile();
		}, false);
		
		goToProgressPageButton.addEventListener('click', function()
		{
				NavigateToProgressList();
		}, false);
		
		goToWatchlistButton.addEventListener('click', function()
		{
				NavigateToWatchList();
		}, false);
		
		btnOptions.addEventListener('click', function()
		{
				NavigateToOptions();
		}, false);
		
		var welcomeMessage = document.getElementById('welcomeMessage');
		
		if (userName != "")
			welcomeMessage.innerHTML = "Welcome " + userName;
			
		var frmSearch = document.getElementById('frmSearch').onsubmit = SearchTrakt;
}

function NavigateToTrakt()
{
	window.open("http://trakt.tv/");
}

function NavigateToProfile()
{
	window.open("http://trakt.tv/users/" + userName);
}

function NavigateToProgressList()
{
	window.open("http://trakt.tv/users/" + userName + "/progress");
}

function NavigateToWatchList()
{
	window.open("http://trakt.tv/users/" + userName + "/watchlist");
}

function NavigateToOptions()
{
	chrome.tabs.create({'url': "/options.html" } );
}

function SearchTrakt()
{
console.log('meow');
	var txtSearch = document.getElementById('txtSearch');
	window.open("http://trakt.tv/search?utf8=%E2%9C%93&query=" + txtSearch.value);
}

function GetUserName()
{
	chrome.storage.sync.get(
	{
		userName: ""
	}, function(items)
	{
		userName = items.userName;
		
		//Tell page to finish building.
		PopulatePage();
  });
}