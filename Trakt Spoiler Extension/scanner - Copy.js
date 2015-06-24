var showOnHover = true;
var replaceWithSpoiler = true;

//Get settings.
chrome.storage.sync.get(
	{
		replaceName: false,
		hoverName: true,
	}, function(items)
	{
		showOnHover = items.hoverName;
		replaceWithSpoiler = items.replaceName;
  });

DOMModificationHandler();

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
    },500);
}

function SpoilerPrevent()
{
	PreventSpoilersDashboard();
	PreventSpoilersEpisodePage();
	PreventSpoilersSeasonPage();
	PreventSpoilersCalendar();
	
	StyleTest();
}

function PreventSpoilersDashboard()
{
	try
	{
		var titleObjects = document.getElementsByTagName("h5");

		//Dashboard spoiler prevention.
		for (i = 0; i < titleObjects.length; i++)
		{
			if (titleObjects[i].getElementsByClassName("main-title-sxe").length > 0)
			{
				var episodeAndSeason = titleObjects[i].getElementsByClassName("main-title-sxe")[0].innerHTML;
				var episodename = titleObjects[i].innerHTML.split("</span> ")[1];
				
				//Cleanup the episode name.
				titleObjects[i].innerHTML = "<span class=\"main-title-sxe\">" + episodeAndSeason + "</span>";
				
				//Create new element for episode name. This is so we can add the hover effect mroe easily.
				var newName = document.createElement("div");

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
					
					newName.className = "tspNameHover";
				}
				else
				{
					newName.className = "tspNameNoHover";
				}
				
				//Finally append the new object.
				titleObjects[i].appendChild(newName);
			}
		}
	}
	catch (e)
	{
		console.log(e.message + " Line: " + e.lineNumber);
	}
}

function PreventSpoilersEpisodePage()
{
	try
	{
		//If a check in box doesn't exist then the episode page is not currently present. Cancel spoiler prevention.
		if (CheckIfPageIsEpisodePage())
			return;
		
		var firstValue = document.getElementsByClassName("btn btn-block btn-summary btn-watch")[0];

		var secondValue = firstValue.getElementsByClassName("under-info")[0];
		var thirdValue = secondValue.getElementsByClassName("format-date")[0];
			
		//Episode page spoiler prevention.
		if (thirdValue === undefined)
		{
			var mainTitleObjects = document.getElementsByTagName("h1");
			
			//Find the title and spoiler prevent.
			for (i = 0; i < mainTitleObjects.length; i++)
			{
				if (mainTitleObjects[i].getElementsByClassName("main-title-sxe").length > 0)
				{
					var episodeData = mainTitleObjects[i].getElementsByClassName("main-title-sxe")[0].innerHTML;
					mainTitleObjects[i].innerHTML = "<span class=\"main-title-sxe\">" + episodeData + "</span>" + " SPOILER";
				}
			}
			
			//Prevent spoilers in the description.
			var paragraphs = document.getElementsByTagName("p");
			
			for (i = 0; i < paragraphs.length; i++)
			{
				if (paragraphs[i].id == "overview")
				{
					paragraphs[i].innerHTML = "Description may contain spoilers.";
				}
			}
			
			//Prevent spoilers from images.
			var whatever = document.getElementsByTagName("section");
			
			document.getElementById("summary-wrapper").style.backgroundImage = "url('')";
			
			for (i = 0; i < whatever.length; i++)
			{
				whatever[i].setAttribute("data-screenshot", "");
			}

			//Get check in box.
			var signin = document.getElementById("checkin-modal");
			//var image = signin.getElementsByClassName("real")[0].src = "";
			
			var images = signin.getElementsByClassName("real");
			
			if (images.length > 0)
			{
				for (i = 0; i < images.length; i++)
				{
					images[i].remove();
				}
			}

			//window.alert("Here");
			
			//Check in box episode title (h2)
			var popupTitleObjects = document.getElementsByTagName("h2");
			
			for (i = 0; i < popupTitleObjects.length; i++)
			{
				if (popupTitleObjects[i].getElementsByClassName("main-title-sxe").length > 0)
				{
					var episodeData = popupTitleObjects[i].getElementsByClassName("main-title-sxe")[0].innerHTML;
					popupTitleObjects[i].innerHTML = "<span class=\"main-title-sxe\">" + episodeData + "</span>" + " SPOILER";
				}
			}
			
			//Check in box episode title (h3)
			var popupTitleObjects = document.getElementsByTagName("h3");
			
			for (i = 0; i < popupTitleObjects.length; i++)
			{
				if (popupTitleObjects[i].getElementsByClassName("main-title-sxe").length > 0)
				{
					var episodeData = popupTitleObjects[i].getElementsByClassName("main-title-sxe")[0].innerHTML;
					popupTitleObjects[i].innerHTML = "<span class=\"main-title-sxe\">" + episodeData + "</span>" + " SPOILER";
				}
			}
			
			//Check in box message
			document.getElementById("checkin-message").style.color = "white";
			//document.querySelector(".form-control").style.backgroundColor = document.querySelector(".form-control").style.color;
			
			//Next Episode Images
			var recentEpisodes = document.getElementsByClassName("recent-episodes");
			
			if (recentEpisodes.length == 0)
				return;
			
			var episodePanels = recentEpisodes[0].getElementsByClassName("grid-item");
			
			for (i = 0; i < episodePanels.length; i++)
			{
				var watchSelected = episodePanels[i].getElementsByClassName("watch selected");
		
				if (watchSelected.length > 0)
					continue;
					
				var realImage = episodePanels[i].getElementsByClassName("real");
				
				if (realImage.length > 0)
				{
					realImage[0].remove();
				}
			}
		}
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
			
			if (titles.length == 0)
				return;
			
			var episodeData = titles[0].innerHTML;
			headerObjects[1].innerHTML = "<span class=\"main-title-sxe\">" + episodeData + "</span>" + " SPOILER";
			//Hide the image.
			var realImage = panels[i].getElementsByClassName("real");
					
			if (realImage.length > 0)
			{
				realImage[0].remove();
			}
		}
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
				var episodeData = headerObject.getElementsByClassName("main-title-sxe")[0].innerHTML;
				headerObject.innerHTML = "<span class=\"main-title-sxe\">" + episodeData + "</span>" + " SPOILER";
			}
		}
	}
	catch (e)
	{
		console.log(e.message + " Line: " + e.lineNumber);
	}
}

function StyleTest()
{
	var css = '.tspNameHover:hover { background-color: white; }.tspNameHover { background-color: #333333; }';
	var head = document.head || document.getElementsByTagName('head')[0];
	var style = document.createElement('style');
	
	style.type = 'text/css';
	
	if (style.styleSheet)
	{
		style.styleSheet.cssText = css;
	}
	else
	{
		style.appendChild(document.createTextNode(css));
	}

	head.appendChild(style);
}

function CheckIfPageIsEpisodePage()
{
	return document.getElementsByClassName("btn btn-block btn-summary btn-watch").length == 0;
}