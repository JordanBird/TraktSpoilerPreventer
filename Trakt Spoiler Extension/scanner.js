// Settings
//General
var showOnHover = true;
var replaceWithSpoiler = true;
var hideComments = true;

//Dashboard
var hideShowNames = true;

var hoverColour = "white";
var normalColour = "#333333";

//Episode Page
var hideShowName = true;
var hideShowDescription = true;
var hideShowScreenshot = true;

//Season Page

//Calendar Page


var style = "";

//Regex Matches for Pages on Trakt.tv
var regDashboard = /trakt.tv\/dashboard/;
var regEpisodePage = /trakt.tv\/shows\/.+\/seasons\/\d+\/episodes\/\d+/;
var regShowPage = /trakt.tv\/shows\/.+/;
var regCalendar = /trakt.tv\/calendars/;
var regProgressPage = /trakt.tv\/users\/.+\/progress/;
var regSeasonPage = /trakt.tv\/shows\/.+\/seasons\/\d+/;

//CSS Rule for Screenshots
var backgroundCss = ".tspEpisodePageScreenshot{background-image: url(fanart) !important;}";
var currentBackgroundCSSRule;

//Get settings. //TODO: Put into method. Perhaps two by abstracting get?
chrome.storage.sync.get(
	{
		replaceName: false,
		hoverName: true,
		hideComments: true,
		hideShowNames: true,
		hideShowName: true,
		hideShowDescription: true,
		hideShowScreenshot: true
	}, function(items)
	{
		showOnHover = items.hoverName;
		replaceWithSpoiler = items.replaceName;
		hideComments = items.hideComments;
		hideShowNames = items.hideShowNames;
		hideShowName = items.hideShowName;
		hideShowDescription = items.hideShowDescription;
		hideShowScreenshot = items.hideShowScreenshot;
  });

//Start the scanner.
DOMModificationHandler();

//Get the users name if they're logged in for popup purposes.
GetAndSaveUserName();

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
	
	if (currentWebURL.match(regDashboard))
		PreventSpoilersDashboard();
	
	if (currentWebURL.match(regShowPage))
		PreventSpoilersShowPage();
	
	if (currentWebURL.match(regEpisodePage))
		PreventSpoilersEpisodePage();
	
	if (currentWebURL.match(regSeasonPage))
		PreventSpoilersSeasonPage();
	
	if (currentWebURL.match(regCalendar))
		PreventSpoilersCalendar();
}

function PreventSpoilersDashboard()
{
	//Check if user would like to spoiler prevent or not on Dashboard.
	if (!hideShowNames)
		return;
	
	//For development and user observation purposes.
	console.log("Attempting to spoiler prevent Dashboard.");
	
	try
	{
		GetHeaderAndApplyCustomDiv("h5", "Dashboard");
	}
	catch (e)
	{
		console.log(e.message + " Line: " + e.lineNumber);
	}
}

function PreventSpoilersShowPage()
{
	//For development and user observation purposes.
	console.log("Attempting to spoiler prevent Show Page.");

	SpoilerPreventDescription();
	
	//Next Episode Images
	var recentEpisodes = document.getElementsByClassName("recent-episodes");
	
	if (recentEpisodes.length == 0)
		return;
	
	var episodePanels = recentEpisodes[0].getElementsByClassName("grid-item");

	var showPageFanart = document.getElementById("summary-wrapper").style.backgroundImage.replace('url(', '').replace(')', '');
	
	for (i = 0; i < episodePanels.length; i++)
	{
		var watchSelected = episodePanels[i].getElementsByClassName("watch selected");

		if (watchSelected.length > 0)
			continue;
			
		var realImage = episodePanels[i].getElementsByClassName("real");
		
		if (realImage.length > 0)
		{
			realImage[0].src = showPageFanart;
		}
	}
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
			if (hideShowName)
			{
				GetHeaderAndApplyCustomDiv("h1", "EpisodePageh1");
			}
			
			//If the user wants to hide the show description, hide it. //TODO: Abstract this into a method for readability and modularity.
			if (hideShowDescription)
			{
				SpoilerPreventDescription();
			}
			
			//If the user wants to hide the show screenshots, hide it. //TODO: Abstract this into a method for readability and modularity.
			if (hideShowScreenshot)
			{
				//Prevent spoilers from images on main page.			
				var wrapper = document.getElementById("summary-wrapper");
				var fanart = document.getElementsByClassName('col-md-4 action-buttons')[0].getElementsByClassName('btn')[0].getAttribute("data-fanart");
				
				//If we've made a pass before, delete the previous one ready for our next rule. //TODO: Check if we can just overwrite.
				if (currentBackgroundCSSRule != null)
					currentBackgroundCSSRule.remove();
					
				//Check if fanart exists, if not use a placeholder.
				if (fanart == "")
					fanart = "http://trakt.tv/assets/placeholders/medium/fanart-0bb68bf682289cd3c69f3b81e9b7378b.png";
				
				//Create the style and add it to the head.
				currentBackgroundCSSRule = $('<style>.tspEpisodePageScreenshot{background-image: url(' + fanart + ') !important;}</style>');
				$('head').append(currentBackgroundCSSRule);
				
				//Set the wrappers class name to the TSP one.
				wrapper.className = "tspEpisodePageScreenshot";
			}
			
			// Sign in box spoiler prevention.
			//Get check in box.
			var signin = document.getElementById("checkin-modal");
			
			if (hideShowScreenshot)
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
			
			if (hideShowName)
			{
				GetHeaderAndApplyCustomDiv("h2", "EpisodePageh2");
				GetHeaderAndApplyCustomDiv("h3", "EpisodePageh3");
				
				//Check in box message
				document.getElementById("checkin-message").style.color = "white";
				//document.querySelector(".form-control").style.backgroundColor = document.querySelector(".form-control").style.color;
			}
		}
		
		//Hide any comments if user has set them to be hidden.
		if (hideComments)
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
	
		var panels = document.getElementsByClassName("row fanarts");
		
		for (i = 0; i < panels.length; i++)
		{
			var watchSelected = panels[i].getElementsByClassName("watch selected");
			
			if (watchSelected.length > 0)
				continue;
			
			//Hide the text.
			var headerObjects = panels[i].getElementsByTagName("h3");
			
			if (headerObjects.length == 0)
				return;
			
			var titles = headerObjects[1].getElementsByClassName("main-title-sxe");
			
			//Get and hide the description
			var overviewObject = panels[i].getElementsByClassName('overview');

			if (overviewObject.length > 0)
			{
				overviewObject[0].innerHTML = "Description may contain spoilers.";
				
				overviewObject[0].className = "tspDescriptionHoverSeasonPage";
			}
			
			if (titles.length == 0)
				return;
			
			ReplaceEpisodeTitleWithCustomDiv(headerObjects[1], "SeasonPage");
			
			//Hide the image.
			var realImage = panels[i].getElementsByClassName("real");
					
			if (realImage.length > 0)
			{
				realImage[0].remove();
			}
		}
		
		//Hide any comments if user has set them to be hidden.
		if (hideComments)
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
		
		if (span.innerHTML.indexOf("<span class=\"tspNameHover") > -1)
		{
			episodename = span.innerHTML.split("<span class=\"tspNameHover\">")[1].split("</span>")[0];
		}

		//Cleanup the episode name.
		span.innerHTML = "<span class=\"main-title-sxe\">" + episodeAndSeason + "</span>";
		
		//Create new element for episode name. This is so we can add the hover effect more easily.
		var newName = document.createElement("span");

		//If user wishes for episode name to be changed to Spoiler, change it here.
		if (replaceWithSpoiler)
		{
			newName.innerHTML = "Spoiler";
		}
		else
		{
			newName.innerHTML = episodename;
		}
		
		//If user wishes to only see the name on hover, change it here.
		if (showOnHover)
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
		if (headerElements[i].getElementsByClassName("main-title-sxe").length > 0)
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
		if (paragraphs[i].id == "overview")
		{
			paragraphs[i].innerHTML = "Description may contain spoilers."; //TODO: Check if want name change.
			paragraphs[i].className = "tspDescriptionHoverEpisodePage"; //TODO: Check if want only on hover.
		}
	}
}

function SpoilerPreventComments()
{
	//Find all comments on the page.
	var comments = document.getElementsByClassName('comment');
	
	for (i = 0; i < comments.length; i++)
	{
		if (true) //Block word
		{
			comments[i].childNodes[0].innerHTML = "Comment may contain spoilers.";
		}
		
		if (true) //Hover only
		{
			comments[i].className = "tspCommentHover";
		}
	}
}