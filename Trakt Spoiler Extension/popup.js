var userName = "";
var lastCheckedInItem = "";

var settings;

GetSettings();

function PopulatePage()
{
	var goToTraktButton = document.getElementById('goToTrakt');
		
	var profileSet = false;
	
	if (userName != "")
		profileSet = true;
		
	var goToCalendarButton = document.getElementById('goToCalendar');
	var goToProfileButton = document.getElementById('goToTraktProfile');
	var goToProgressPageButton = document.getElementById('goToTraktProgress');
	var goToWatchlistButton = document.getElementById('goToTraktWatchlist');
	
	var goToLastCheckInButton = document.getElementById('goToLastCheckIn');
	
	var btnOptions = document.getElementById('btnOptions');
	
	//Enable or disable buttons depending on users logged in status.
	goToCalendarButton.disabled = !profileSet;
	goToProfileButton.disabled = !profileSet;
	goToProgressPageButton.disabled = !profileSet;
	goToWatchlistButton.disabled = !profileSet;
	
	//Change button text to represent logged in status.
	if (!profileSet)
		goToTraktButton.getElementsByClassName("buttonText").innerHTML = "Go To Trakt.tv";
	
	goToTraktButton.addEventListener('click', function()
	{
			NavigateToTrakt();
	}, false);
	
	goToCalendarButton.addEventListener('click', function()
	{
			NavigateToCalendar();
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
	
	if (lastCheckedInItem != "")
	{
		goToLastCheckInButton.addEventListener('click', function()
		{
			NavigateToLastCheckIn();
		}, false);
		
		goToLastCheckInButton.style.display = 'inherit';
	}

	btnOptions.addEventListener('click', function()
	{
			NavigateToOptions();
	}, false);

	var welcomeMessage = document.getElementById('welcomeMessage');
	
	if (userName != "")
		welcomeMessage.innerHTML = "Welcome " + userName;
		
	var frmSearch = document.getElementById('frmSearch').onsubmit = SearchTrakt;
	
	EnableOrDisableButtonsBasedOnUserOptions();
}

function NavigateToTrakt()
{
	window.open("http://trakt.tv/");
}

function NavigateToCalendar()
{
	window.open("http://trakt.tv/calendars/my/shows");
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

function NavigateToLastCheckIn()
{
	window.open(lastCheckedInItem);
}

function NavigateToOptions()
{
	chrome.tabs.create({'url': "/options.html" } );
}

function SearchTrakt()
{
	var txtSearch = document.getElementById('txtSearch');
	window.open("http://trakt.tv/search?utf8=%E2%9C%93&query=" + txtSearch.value);
}

function EnableOrDisableButtonsBasedOnUserOptions()
{
	var popGoToDashboard = document.getElementById("goToTrakt");
	var popGoToCalendar = document.getElementById("goToCalendar");
	var popGoToProfilePage = document.getElementById("goToTraktProfile");
	var popGoToProgressPage = document.getElementById("goToTraktProgress");
	var popGoToWatchlist = document.getElementById("goToTraktWatchlist");
	var popGoToLastCheckIn = document.getElementById("goToLastCheckIn");
	
	if (!settings.popGoToDashboard)
		popGoToDashboard.style.display = 'none';
		
	if (!settings.popGoToCalendar)
		popGoToCalendar.style.display = 'none';
		
	if (!settings.popGoToProfilePage)
		popGoToProfilePage.style.display = 'none';
		
	if (!settings.popGoToProgressPage)
		popGoToProgressPage.style.display = 'none';
		
	if (!settings.popGoToWatchlist)
		popGoToWatchlist.style.display = 'none';
		
	if (!settings.popGoToLastCheckIn)
		popGoToLastCheckIn.style.display = 'none';
}

function GetSettings()
{
	chrome.storage.sync.get(
	{
		userName: "",
		dataLastCheckedInItem: "",
		
		popGoToDashboard: true,
		popGoToCalendar: true,
		popGoToProfilePage: true,
		popGoToProgressPage: true,
		popGoToWatchlist: true,
		popGoToLastCheckIn: true
	}, function(items)
	{
		userName = items.userName;
		lastCheckedInItem = items.dataLastCheckedInItem;
		settings = items;
		
		//Tell page to finish building.
		PopulatePage();
  });
}