// Settings
var settings;

// Regex Matches for Pages on Trakt.tv
var regDashboard = /trakt.tv\/dashboard$/;
var regEpisodePage = /trakt.tv\/shows\/.+\/seasons\/\d+\/episodes\/\d+$/;
var regShowPage = /trakt.tv\/shows\/([^/]|\\")*$/;
var regCalendar = /trakt.tv\/calendars/;
var regProgressPage = /trakt.tv\/users\/.+\/progress/;
var regSeasonPage = /trakt.tv\/shows\/.+\/seasons\/\d+$/;

var regMoviePage = /trakt.tv\/movies\/.+/;

var regUserProfile = /trakt.tv\/users\/.+$/;
var regUserHistory = /trakt.tv\/users\/.+\/history/;

// CSS Rule for Screenshots
var currentBackgroundCSSRule;

//Pull in stored settings.
GetSettings();

//Get the users name if they're logged in for popup purposes.
GetAndSaveUserName();

function GetSettings()
{
	chrome.storage.sync.get(
	{
		genShowOnHover: true,
		genReplaceTitlesWithText: true,
		genShowDescriptionsOnHover: true,
		genReplaceDescriptionsWithText: true,
		genCommentsShowOnHover: true,
		genReplaceCommentText: true,
		
		dashboardHideShowNames: true,
		
		showPageHideDescription: false,
		showPageEpisodeName: true,
		showPageHideEpisodeScreenshot: true,
		
		episodePageHideShowName: true,
		episodePageHideShowDescription: true,
		episodePageHideShowScreenshot: true,
		
		seasonPageHideSeasonDescription: true,
		seasonPageHideEpisodeName: true,
		seasonPageHideEpsiodeDescription: true,
		seasonPageHideEpisodeScreenshot: true,
		
		calendarHideEpisodeName: true,
		
		progressPageHideEpisodeName: true,
		progressPageHideEpisodeScreenshot: true,
		
		moviePageHideTagline: false,
		moviePageHideDescription: false,
		
		profileHideEpisodeName: true,
		profileHideEpisodeScreenshot: true,
		
		profileHistoryHideEpisodeName: true,
		
		userName: ""
	}, function(items)
	{
		settings = items;
		
		//Start the scanner.
		DOMModificationHandler(); //TODO: Put this in a proper method so a chain is established. This is a execution null fix.
	});
}

function GetAndSaveUserName()
{
	var userName = "";
	
	try
	{
		userName = document.body.innerHTML.split('/users/')[1].split('"')[0];
	}
	catch (e) {}

	chrome.storage.sync.set(
	{
		userName: userName
	});
}

//Function is recursive. It will continually subscribe and unsubscribe from the document change event so that it does not get stuck in a loop.
function DOMModificationHandler()
{
	//Remove previous event.
    document.removeEventListener('DOMSubtreeModified', DOMModificationHandler);
	
	//After timeout prevent spoilers and add this function back to the event handlers in case of change.
    setTimeout(function()
	{
		SpoilerPrevent();
        document.addEventListener('DOMSubtreeModified', DOMModificationHandler);
    },50);
}

function SpoilerPrevent()
{
	//Get the current URL for the page ready to compare to the regex defined above so that certain methods are only called on certain pages.
	var currentWebURL = window.location.href;
	
	//Spoiler prevent TV pages if currently active.
	if (currentWebURL.match(regDashboard))
		PreventSpoilersDashboard();
	
	if (currentWebURL.match(regShowPage))
		PreventSpoilersShowPage();
	
	if (currentWebURL.match(regEpisodePage))
	{
		PreventSpoilersEpisodePage();
		SetupCheckEventClickForLastCheckItem();
	}
	
	if (currentWebURL.match(regSeasonPage))
		PreventSpoilersSeasonPage();
	
	if (currentWebURL.match(regCalendar))
		PreventSpoilersCalendar();
		
	if (currentWebURL.match(regProgressPage))
		PreventSpoilersProgressPage();
	
	//Spoiler prevent movie if currently active.
	if (currentWebURL.match(regMoviePage))
	{
		PreventSpoilersMoviePage();
		SetupCheckEventClickForLastCheckItem();
	}
	
	//Spoiler prevent other user profiles history if currently active.
	if (currentWebURL.match(regUserProfile))
		SpoilerPreventUserProfile();
	
	//Spoiler prevent other user profiles history if currently active.
	if (currentWebURL.match(regUserHistory))
		SpoilerPreventUserHistory();
	
	//Prevent any toast message name spoilers if present.
	SpoilerPreventToastMessage();
	
	SpolierPreventWatchingNow();
}

function PreventSpoilersDashboard()
{
	//Check if user would like to spoiler prevent or not on Dashboard.
	if (!settings.dashboardHideShowNames)
		return;
	
	//For development and user observation purposes.
	console.log("Attempting to spoiler prevent Dashboard.");
	
	try
	{
		//Spoiler prevent the on deck to watch section. Added 17/07/2015.
		//GetHeaderAndApplyCustomDiv("h3", "Dashboard");
		
		var onDeck = document.getElementById("ondeck-wrapper");
		var onDeckHeaders = onDeck.getElementsByTagName("h3");
		
		for (var i = 0; i < onDeckHeaders.length; i++)
		{
			ReplaceEpisodeTitleWithCustomDiv(onDeckHeaders[i], "Dashboard");
		}

		//Spoiler prevent the upcoming schedule.
		GetHeaderAndApplyCustomDiv("h5", "Dashboard");
	}
	catch (e)
	{
		console.log(e.message + " Line: " + e.lineNumber);
	}
	
	SpoilerPreventNetworkActivity();
}

function PreventSpoilersShowPage()
{
	//For development and user observation purposes.
	console.log("Attempting to spoiler prevent Show Page.");

	//If the user wants to hide the description on the show page, hide it.
	if (settings.showPageHideDescription)
		SpoilerPreventDescription();
	
	//Next Episode Images
	var recentEpisodes = document.getElementsByClassName("recent-episodes");
	
	if (recentEpisodes.length == 0)
		return;
	
	var episodePanels = recentEpisodes[0].getElementsByClassName("grid-item");

	var showPageFanart = document.getElementById("summary-wrapper").style.backgroundImage.replace('url(', '').replace(')', '');
	
	for (i = 0; i < episodePanels.length; i++)
	{
		//Check if episode has been watched.
		var watchSelected = episodePanels[i].getElementsByClassName("watch selected");

		if (watchSelected.length > 0)
			continue;
		
		//If the user wants to hide recent episode screenshots, hide this one.
		if (settings.showPageHideEpisodeScreenshot)
		{
			//Image
			var realImage = episodePanels[i].getElementsByClassName("real");
	
			if (realImage.length > 0)
			{
				realImage[0].src = showPageFanart;
			}
		}
		
		//If the user wants to hide recent episode titles, hide this one.
		if (settings.showPageEpisodeName)
		{
			//Episode Name
			var span = episodePanels[i].getElementsByTagName("h3")[0];
			ReplaceEpisodeTitleWithCustomDiv(span, "ShowPage");
		}
	}
	
	SpoilerPreventComments();
}

function PreventSpoilersEpisodePage()
{
	try
	{
		//If a check in box doesn't exist then the episode page is not currently present. Cancel spoiler prevention.
		if (CheckIfPageIsEpisodePage())
			return;
		
		//For development and user observation purposes.
		console.log("Attempting to spoiler prevent an Episode Page.");
		
		//Change the title of the page to remove episode title. //TODO: Add do you want to check.
		var parts = document.title.split('"');
		
		//Check if title has been removed previously, if so do not try to remove again.
		if (parts.length >= 3)
		{
			document.title = parts[0] + parts[2];
		}
		
		//If the third value is undefined then the user has never checked into this media piece before, so we spoiler prevent.
		var firstValue = document.getElementsByClassName("btn btn-block btn-summary btn-watch")[0];
		var secondValue = firstValue.getElementsByClassName("under-info")[0];
		var thirdValue = secondValue.getElementsByClassName("format-date")[0];
			
		//Episode page spoiler prevention.
		if (thirdValue === undefined)
		{
			//If the user wants to hide the show name, hide it. //TODO: Abstract this into a method for readability and modularity.
			if (settings.episodePageHideShowName)
			{
				GetHeaderAndApplyCustomDiv("h1", "EpisodePageh1");
			}
			
			//If the user wants to hide the show description, hide it. //TODO: Abstract this into a method for readability and modularity.
			if (settings.episodePageHideShowDescription)
				SpoilerPreventDescription();
			
			//If the user wants to hide the show screenshots, hide it. //TODO: Abstract this into a method for readability and modularity.
			if (settings.episodePageHideShowScreenshot)
			{
				//Prevent spoilers from images on main page.			
				var wrapper = document.getElementById("summary-wrapper");
				var fanart = "http://trakt.tv/assets/placeholders/medium/fanart-c817bbe32ebad36ffb460f7feb920de1.png";
				
				try
				{
					fanart = wrapper.style.backgroundImage.replace("url(", "").replace(")", "");
				} catch(e) { }

				//If we've made a pass before, delete the previous one ready for our next rule. //TODO: Check if we can just overwrite.
				if (currentBackgroundCSSRule != null)
					currentBackgroundCSSRule.remove();
					
				//Check if fanart exists, if not use a placeholder.
				if (fanart == "")
					fanart = "http://trakt.tv/assets/placeholders/medium/fanart-c817bbe32ebad36ffb460f7feb920de1.png";
				
				//Create the style and add it to the head.
				currentBackgroundCSSRule = $('<style>.tspEpisodePageScreenshot{background-image: url(' + fanart + ') !important;}</style>');
				$('head').append(currentBackgroundCSSRule);
				
				//Set the wrappers class name to the TSP one.
				wrapper.className = "tspEpisodePageScreenshot";
				
				//Get and set full-screenshot div.
				var fullScreenshotDivs = wrapper.getElementsByClassName("full-screenshot");
				
				if (fullScreenshotDivs.length > 0)
				{
					fullScreenshotDivs[0].className = "tspEpisodePageScreenshot";
				}
			}
			
			// Sign in box spoiler prevention.
			//Get check in box.
			var signin = document.getElementById("checkin-modal");
			
			if (settings.episodePageHideShowScreenshot)
			{
				//Get the image in the check in box.
				var images = signin.getElementsByClassName("real");
				
				if (images.length > 0)
				{
					for (i = 0; i < images.length; i++)
					{
						//Set the check in box image as the fanart.
						images[i].src = fanart;
					}
				}
			}
			
			if (settings.episodePageHideShowName)
			{
				GetHeaderAndApplyCustomDiv("h2", "EpisodePageh2");
				GetHeaderAndApplyCustomDiv("h3", "EpisodePageh3");
				
				//Obscure check in box message.
				document.getElementById("checkin-message").style.color = "white";
			}
		}
		
		SpoilerPreventComments();
	}
	catch (e)
	{
		console.log(e.message + " Line: " + e.lineNumber);
	}
}

function PreventSpoilersSeasonPage()
{
	try
	{
		//For development and user observation purposes.
		console.log("Attempting to spoiler prevent a Season Page.");
	
		//If the user wants the description of the season hidden, hide it.
		if (settings.seasonPageHideSeasonDescription)
			SpoilerPreventDescription();
		
		var panels = document.getElementsByClassName("row fanarts");
		
		for (i = 0; i < panels.length; i++)
		{
			var watchSelected = panels[i].getElementsByClassName("watch selected");
			
			if (watchSelected.length > 0)
				continue;
			
			//If the user wants to hide the epsiode name, hide it.
			if (settings.seasonPageHideEpisodeName)
			{
				var headerObjects = panels[i].getElementsByTagName("h3");
				
				if (headerObjects.length == 0)
					return;
				
				var titles = headerObjects[1].getElementsByClassName("main-title-sxe");
	
				if (titles.length == 0)
					return;
				
				ReplaceEpisodeTitleWithCustomDiv(headerObjects[1], "SeasonPage");
			}
			
			//If the user wants to hide the epsiode description, hide it.
			if (settings.seasonPageHideEpsiodeDescription)
			{
				//Get and hide the description
				var overviewObject = panels[i].getElementsByClassName('overview');
	
				if (overviewObject.length > 0)
				{
					overviewObject[0].innerHTML = "Description may contain spoilers.";
					
					overviewObject[0].className = "tspDescriptionHoverSeasonPage";
				}
			}
			
			//If the user wants to hide the epsiode screenshot, hide it.
			if (settings.seasonPageHideEpisodeScreenshot)
			{
				var realImage = panels[i].getElementsByClassName("real");
					
				if (realImage.length > 0)
				{
					realImage[0].remove();
				}
			}
		}
		
		SpoilerPreventComments();
	}
	catch (e)
	{
		console.log(e.message + " Line: " + e.lineNumber);
	}
}

function PreventSpoilersCalendar()
{
	try
	{
		//For development and user observation purposes.
		console.log("Attempting to spoiler prevent a Calendar.");
		
		//If the user has opted to not hide episode names no other spoiler prevention can be made so return.
		if (!settings.calendarHideEpisodeName)
			return;
		
		var titleObjects = document.getElementsByClassName("grid-item");
		
		for (i = 0; i < titleObjects.length; i++)
		{
			if (titleObjects[i].getElementsByClassName("base").length == 0)
				continue;
			
			var watchSelected = titleObjects[i].getElementsByClassName("watch selected");
			
			if (watchSelected.length > 0)
				continue;
			
			var headerObject = titleObjects[i].getElementsByTagName("h3")[0];
				
			if (headerObject.getElementsByClassName("main-title-sxe").length > 0)
			{
				ReplaceEpisodeTitleWithCustomDiv(headerObject, "Calendar");
			}
		}
	}
	catch (e)
	{
		console.log(e.message + " Line: " + e.lineNumber);
	}
}

function PreventSpoilersProgressPage()
{
	try
	{
		//For development and user observation purposes.
		console.log("Attempting to spoiler prevent Progress Page.");
	
		var panels = document.getElementsByClassName("row fanarts");
		
		for (i = 0; i < panels.length; i++)
		{
			//Find out if the last episode has been watched.
			var watchSelected = panels[i].getElementsByClassName("watch selected");
			
			//If the last episode ahs been watched move to the next row.
			if (watchSelected.length > 0)
				continue;
			
			//Hide the episode name if the user wants to.
			if (settings.progressPageHideEpisodeName)
			{
				var headerObjects = panels[i].getElementsByTagName("h3");
				
				if (headerObjects.length == 0)
					return;
				
				var titles = headerObjects[1].getElementsByClassName("main-title-sxe");
				
				if (titles.length == 0)
					return;
				
				ReplaceEpisodeTitleWithCustomDiv(headerObjects[1], "ShowPage");
			}
			
			//Hide the episode screenshot if the user wants to.
			if (settings.progressPageHideEpisodeScreenshot)
			{
				var fanarts = document.getElementsByClassName("fanart");
				
				for (var f = 0; f < fanarts.length; f++)
				{
					var reals = fanarts[f].getElementsByClassName("real");
					
					if (reals.length > 0)
					{
						reals[0].remove();
					}
				}
			}
		}
	}
	catch (e)
	{
		console.log(e.message + " Line: " + e.lineNumber);
	}
}

function PreventSpoilersMoviePage()
{
	console.log("Attempting to spoiler prevent Movie Page.");
	
	if (settings.moviePageHideTagline)
		SpoilerPreventTagline();
	
	if (settings.moviePageHideDescription)
		SpoilerPreventDescription();
	
	SpoilerPreventComments();
}

function SpoilerPreventUserProfile()
{
	console.log("Attempting to spoiler prevent User Profile.");
	
	if (window.location.href.split("trakt.tv/users/")[1].toUpperCase() == settings.userName.toUpperCase())
		return;
	
	if (settings.profileHideEpisodeName)
	{
		GetHeaderAndApplyCustomDiv("h3", "Dashboard");
		GetHeaderAndApplyCustomDiv("h4", "Dashboard");
	}
	
	if (settings.profileHideEpisodeScreenshot)
	{
		var showScreens = document.getElementsByClassName("poster screenshot");
		
		for (var i = 0; i < showScreens.length; i++)
		{
			var reals = showScreens[i].getElementsByClassName("real");
			
			for (var j = 0; j < reals.length; j++)
			{
				reals[j].remove();
			}
		}
	}
}

function SpoilerPreventUserHistory()
{
	console.log("Attempting to spoiler prevent User History.");
	
	if (!settings.profileHistoryHideEpisodeName)
		return;
	
	if (window.location.href.split("trakt.tv/users/")[1].split("/")[0].toUpperCase() == settings.userName.toUpperCase())
		return;
	
	if (settings.userHistoryHideEpisodeName)
	{
		GetHeaderAndApplyCustomDiv("h3", "Dashboard");
	}
}

function CheckIfPageIsEpisodePage()
{
	return document.getElementsByClassName("btn btn-block btn-summary btn-watch").length == 0;
}

function ReplaceEpisodeTitleWithCustomDiv(span, page)
{
	try
	{
		var episodeAndSeason = span.getElementsByClassName("main-title-sxe")[0].innerHTML;

		var episodename = span.innerHTML.split("</span> ")[1];
		
		//Either an error occurred or we have already spoiler prevented the page.
		if (episodename === undefined)
			return;
		
		if (span.innerHTML.indexOf("<span class=\"tspNameHover") > -1)
		{
			episodename = span.innerHTML.split("<span class=\"tspNameHover\">")[1].split("</span>")[0];
		}

		//Cleanup the episode name.
		span.innerHTML = "<span class=\"main-title-sxe\">" + episodeAndSeason + "</span>";
		
		//Create new element for episode name. This is so we can add the hover effect more easily.
		var newName = document.createElement("span");

		//If user wishes for episode name to be changed to Spoiler, change it here.
		if (settings.genReplaceTitlesWithText)
		{
			newName.innerHTML = " Spoiler";
		}
		else
		{
			newName.innerHTML = " " + episodename;
		}
		
		//If user wishes to only see the name on hover, change it here.
		if (settings.genShowOnHover)
		{
			newName.className = "tspNameHover" + page;
		}
		else
		{
			newName.className = "tspNameNoHover" + page;
		}
		
		//Finally append the new object.
		span.appendChild(newName);
	}
	catch (e) { }
}

function GetHeaderAndApplyCustomDiv(headerLevel, page)
{
	var headerElements = document.getElementsByTagName(headerLevel);
	
	for (i = 0; i < headerElements.length; i++)
	{
		if (headerElements[i].getElementsByClassName("main-title-sxe").length > 0 && headerElements[i].getElementsByClassName("tspNameNoHoverDashboard").length == 0)
		{
			ReplaceEpisodeTitleWithCustomDiv(headerElements[i], page);
		}
	}
}

function SpoilerPreventDescription()
{
	//Prevent spoilers in the description.
	var paragraphs = document.getElementsByTagName("p");
	
	for (i = 0; i < paragraphs.length; i++)
	{
		//Site uses the overview ID multiple times on one page so we must loop through all occurences of p to find them.
		if (paragraphs[i].id != "overview")
			continue;
		
		//If the user wishes for description to show on hover change the class name to the one with hover functionality.
		if (settings.genShowDescriptionsOnHover)
			paragraphs[i].className = "tspDescriptionHoverEpisodePage";
		
		//If the user wisehs for description text to be removed remove it.
		if (settings.genReplaceDescriptionsWithText)
			paragraphs[i].innerHTML = "Description may contain spoilers.";
	}
}

function SpoilerPreventTagline()
{
	//Prevent spoilers in the description.
	var paragraphs = document.getElementsByTagName("p");
	
	for (i = 0; i < paragraphs.length; i++)
	{
		if (paragraphs[i].id == "tagline")
		{
			paragraphs[i].innerHTML = "Tagline may contain spoilers."; //TODO: Check if want name change.
			paragraphs[i].className = "tspDescriptionHoverEpisodePage"; //TODO: Check if want only on hover.
		}
	}
}

function SpoilerPreventToastMessage()
{
	var toastMessageRegex = /.+ \d+x\d+ ".+"/;
	var removalRegex = / "([^"]|\\")*"$/m;
	
	//Check if the container is actually present in the page. If not, return as no further action can be taken.
	if (document.getElementById("toast-container") === undefined)
		return;
	
	var toastMessages = document.getElementsByClassName("toast-message");
	
	//If no messages found return as no action can be taken.
	if (toastMessages.length == 0)
		return;
	
	//Loop through all found toast messages.
	for (i = 0; i < toastMessages.length; i++)
	{
		var strongElements = toastMessages[i].getElementsByTagName("strong");
		
		//If no strong tags found return as no action can be taken.
		if (strongElements.length == 0)
			return;
		
		//Loop through all found 'strong' elements.
		for (j = 0; j < strongElements.length; j++)
		{
			if (strongElements[j].innerHTML.match(toastMessageRegex))
				strongElements[j].innerHTML = strongElements[j].innerHTML.replace(removalRegex, "");
		}
	}
}

function SpolierPreventWatchingNow()
{
	var episodeTitleInHTMLRegex = /<\/span> ".+"<\/a>/;
	
	var watchingNowWrapper = document.getElementById("watching-now-wrapper");
	
	//If element was not found it does not exist on the page so abort spoiler prevention.
	if (watchingNowWrapper === undefined || watchingNowWrapper === null)
		return;
	
	//watchingNowWrapper.innerHTML = watchingNowWrapper.innerHTML.replace(episodeTitleInHTMLRegex, "</span></a>");
	
	var header = watchingNowWrapper.getElementsByTagName("h3")[0];
	var aElement = header.getElementsByTagName("a")[0];
	
	$(aElement).css('color', 'transparent');
	
	for (var i = 0; i < aElement.childNodes.length; i++)
	{
		$(aElement.childNodes[i]).css('color', 'white');
	}
}

function SpoilerPreventNetworkActivity()
{
	var removalRegex = / "([^"]|\\")*"$/m;
	var posterUnders = document.getElementsByClassName("poster-under");
	
	for (i = 0; i < posterUnders.length; i++)
	{
		if (posterUnders[i].childNodes.length < 3)
			continue;
		
		posterUnders[i].childNodes[3].innerHTML = posterUnders[i].childNodes[3].innerHTML.replace(removalRegex, "");
	}
}

function SpoilerPreventComments()
{
	//Find all comments on the page.
	var comments = document.getElementsByClassName('comment');
	
	for (i = 0; i < comments.length; i++)
	{
		if (settings.genReplaceCommentText) //Block word
		{
			comments[i].innerHTML = "Comment may contain spoilers.";
		}
		
		if (settings.genCommentsShowOnHover) //Hover only
		{
			comments[i].className = "tspCommentHover";
		}
	}
}

function SetupCheckEventClickForLastCheckItem()
{
	var button = document.getElementById("checkin-submit");
	
	if (button === null || button === undefined)
		return;
	
	button.addEventListener('click', function() { SetLastCheckedInItem(document.URL); });
}

function SetLastCheckedInItem(url)
{
	chrome.storage.sync.set(
	{
		dataLastCheckedInItem: url
	}, function()
	{});
	
	FindNextEpisode(url);
}

function FindNextEpisode(lastCheckedInItem)
{
	var season = parseInt(lastCheckedInItem.split("/seasons/")[1].split("/")[0]);
	var episode = parseInt(lastCheckedInItem.split("/episodes/")[1]);
	
	var newURL = lastCheckedInItem.split('/seasons/')[0] + '/seasons/' + season + '/episodes/' + (episode + 1);
	
	$.ajax({ url: newURL, success: function(data) { FindEpisodeSuccess(newURL); }, error: function(data) { FindEpisodeFailure(lastCheckedInItem.split('/seasons/')[0], season, episode); } });
}

function FindEpisodeSuccess(url)
{
	chrome.storage.sync.set(
	{
		dataNextEpisodeItem: url
	}, function()
	{});
}

function FindEpisodeFailure(showURLPart, season, episode)
{
	var newURL = showURLPart  + '/seasons/' + (season + 1) + '/episodes/' + 1;
	
	$.ajax({ url: newURL, success: function(data) { FindEpisodeSuccess(newURL); } });
}