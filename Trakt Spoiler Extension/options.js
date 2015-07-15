document.addEventListener('DOMContentLoaded', SetupPage);

// Saves options to chrome.storage
function save_options()
{
	chrome.storage.sync.set(
	{
		genShowOnHover: document.getElementById('genShowOnHover').checked,
		genReplaceTitlesWithText: document.getElementById('genReplaceTitlesWithText').checked,
		genShowDescriptionsOnHover: document.getElementById('genShowDescriptionsOnHover').checked,
		genReplaceDescriptionsWithText: document.getElementById('genReplaceDescriptionsWithText').checked,
		genCommentsShowOnHover: document.getElementById('genCommentsShowOnHover').checked,
		genReplaceCommentText: document.getElementById('genReplaceCommentText').checked,
		
		dashboardHideShowNames: document.getElementById('dashboardHideShowNames').checked,
		
		showPageHideDescription: document.getElementById('showPageHideDescription').checked,
		showPageEpisodeName: document.getElementById('showPageEpisodeName').checked,
		showPageHideEpisodeScreenshot: document.getElementById('showPageHideEpisodeScreenshot').checked,
		
		episodePageHideShowName: document.getElementById('episodePageHideShowName').checked,
		episodePageHideShowDescription: document.getElementById('episodePageHideShowDescription').checked,
		episodePageHideShowScreenshot: document.getElementById('episodePageHideShowScreenshot').checked,
		
		seasonPageHideSeasonDescription: document.getElementById('seasonPageHideSeasonDescription').checked,
		seasonPageHideEpisodeName: document.getElementById('seasonPageHideEpisodeName').checked,
		seasonPageHideEpsiodeDescription: document.getElementById('seasonPageHideEpsiodeDescription').checked,
		seasonPageHideEpisodeScreenshot: document.getElementById('seasonPageHideEpisodeScreenshot').checked,
		
		calendarHideEpisodeName: document.getElementById('calendarHideEpisodeName').checked,
		
		progressPageHideEpisodeName: document.getElementById('progressPageHideEpisodeName').checked,
		progressPageHideEpisodeScreenshot: document.getElementById('progressPageHideEpisodeScreenshot').checked,
		
		moviePageHideTagline: document.getElementById('moviePageHideTagline').checked,
		moviePageHideDescription: document.getElementById('moviePageHideDescription').checked
		
	}, function()
	{
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved. Please refresh any open Trakt.tv pages for chanegs to take effect.';
		setTimeout(function() {
		status.textContent = '';
    }, 2000);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options()
{
	chrome.storage.sync.get(
	{
		genShowOnHover: true,
		genReplaceTitlesWithText: false,
		genShowDescriptionsOnHover: true,
		genReplaceDescriptionsWithText: false,
		genCommentsShowOnHover: true,
		genReplaceCommentText: false,
		
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
		moviePageHideDescription: false
	}, function(items)
	{
		document.getElementById('genShowOnHover').checked = items.genShowOnHover;
		document.getElementById('genReplaceTitlesWithText').checked = items.genReplaceTitlesWithText;
		document.getElementById('genShowDescriptionsOnHover').checked = items.genShowDescriptionsOnHover;
		document.getElementById('genReplaceDescriptionsWithText').checked = items.genReplaceDescriptionsWithText;
		document.getElementById('genCommentsShowOnHover').checked = items.genCommentsShowOnHover;
		document.getElementById('genReplaceCommentText').checked = items.genReplaceCommentText;
		
		document.getElementById('dashboardHideShowNames').checked = items.dashboardHideShowNames;
		
		document.getElementById('showPageHideDescription').checked = items.showPageHideDescription;
		document.getElementById('showPageEpisodeName').checked = items.showPageEpisodeName;
		document.getElementById('showPageHideEpisodeScreenshot').checked = items.showPageHideEpisodeScreenshot;
		
		document.getElementById('episodePageHideShowName').checked = items.episodePageHideShowName;
		document.getElementById('episodePageHideShowDescription').checked = items.episodePageHideShowDescription;
		document.getElementById('episodePageHideShowScreenshot').checked = items.episodePageHideShowScreenshot;
		
		document.getElementById('seasonPageHideSeasonDescription').checked = items.seasonPageHideSeasonDescription;
		document.getElementById('seasonPageHideEpisodeName').checked = items.seasonPageHideEpisodeName;
		document.getElementById('seasonPageHideEpsiodeDescription').checked = items.seasonPageHideEpsiodeDescription;
		document.getElementById('seasonPageHideEpisodeScreenshot').checked = items.seasonPageHideEpisodeScreenshot;
		
		document.getElementById('calendarHideEpisodeName').checked = items.calendarHideEpisodeName;
		
		document.getElementById('progressPageHideEpisodeName').checked = items.progressPageHideEpisodeName;
		document.getElementById('progressPageHideEpisodeScreenshot').checked = items.progressPageHideEpisodeScreenshot;
		
		document.getElementById('moviePageHideTagline').checked = items.moviePageHideTagline;
		document.getElementById('moviePageHideDescription').checked = items.moviePageHideDescription;
  });
}

function ResetOptions()
{
chrome.storage.sync.set(
	{
		genShowOnHover: true,
		genReplaceTitlesWithText: false,
		genShowDescriptionsOnHover: true,
		genReplaceDescriptionsWithText: false,
		genCommentsShowOnHover: true,
		genReplaceCommentText: false,
		
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
		moviePageHideDescription: false
		
	}, function()
	{
		restore_options();
		
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved. Please refresh any open Trakt.tv pages for chanegs to take effect.';
		setTimeout(function() {
		status.textContent = '';
    }, 2000);
  });
}

function SetupPage()
{
	restore_options();
	document.getElementById("save").addEventListener('click', save_options);
	document.getElementById("reset").addEventListener('click', ResetOptions);
	SetOnChangeFunctions();
}

function ToggleClassSettings(className, checked)
{
	var elements = document.getElementsByClassName(className);
	
	for (i = 0; i < elements.length; i++)
	{
		try
		{
			elements[i].checked = checked;
		}
		catch (e) { }
	}
}

function ToggleGeneralSettings()
{
	var generalAll = document.getElementById("generalAll");
	
	ToggleClassSettings("generalSettingMain", generalAll.checked);
}

function ToggleDashboardSettings()
{
	var dashboardAll = document.getElementById("dashboardAll");
	
	ToggleClassSettings("dashboardSetting", dashboardAll.checked);
}

function ToggleShowPageSettings()
{
	var showPageAll = document.getElementById("showPageAll");
	
	ToggleClassSettings("showPageSetting", showPageAll.checked);
}

function ToggleEpisodePageSettings()
{
	var episodePageAll = document.getElementById("episodePageAll");
	
	ToggleClassSettings("episodePageSetting", episodePageAll.checked);
}

function ToggleSeasonPageSettings()
{
	var seasonPageAll = document.getElementById("seasonPageAll");
	
	ToggleClassSettings("seasonPageSetting", seasonPageAll.checked);
}

function ToggleCalendarSettings()
{
	var calendarAll = document.getElementById("calendarAll");
	
	ToggleClassSettings("calendarSetting", calendarAll.checked);
}

function ToggleProgressPageSettings()
{
	var progressPageAll = document.getElementById("progressPageAll");
	
	ToggleClassSettings("progressPageSetting", progressPageAll.checked);
}

function ToggleMovieSettings()
{
	var movieAll = document.getElementById("movieAll");
	
	ToggleClassSettings("movieSetting", movieAll.checked);
}

function ReplaceNameClicked()
{
	document.getElementById("genShowOnHover").checked = false;
}

function HoverNamesClicked()
{
	document.getElementById("genReplaceTitlesWithText").checked = false;
}

function ReplaceDescriptionClicked()
{
	document.getElementById("genShowDescriptionsOnHover").checked = false;
}

function HoverDescriptionsClicked()
{
	document.getElementById("genReplaceDescriptionsWithText").checked = false;
}

function ReplaceCommentClicked()
{
	document.getElementById("genCommentsShowOnHover").checked = false;
}

function HoverCommentsClicked()
{
	document.getElementById("genReplaceCommentText").checked = false;
}

function SetOnChangeFunctions()
{
	//Change all settings
	var general = document.getElementById("generalAll");
	general.addEventListener("change", ToggleGeneralSettings);
	
	var dashboard = document.getElementById("dashboardAll");
	dashboard.addEventListener("change", ToggleDashboardSettings);
	
	var showPage = document.getElementById("showPageAll");
	showPage.addEventListener("change", ToggleShowPageSettings);
	
	var episodePage = document.getElementById("episodePageAll");
	episodePage.addEventListener("change", ToggleEpisodePageSettings);
	
	var seasonPage = document.getElementById("seasonPageAll");
	seasonPage.addEventListener("change", ToggleSeasonPageSettings);
	
	var calendar = document.getElementById("calendarAll");
	calendar.addEventListener("change", ToggleCalendarSettings);
	
	var progressPage = document.getElementById("progressPageAll");
	progressPage.addEventListener("change", ToggleProgressPageSettings);
	
	var movie = document.getElementById("movieAll");
	movie.addEventListener("change", ToggleMovieSettings);
	
	//Individual
	var genReplaceTitlesWithText = document.getElementById("genReplaceTitlesWithText");
	genReplaceTitlesWithText.addEventListener("click", ReplaceNameClicked);
	
	var genShowOnHover = document.getElementById("genShowOnHover");
	genShowOnHover.addEventListener("click", HoverNamesClicked);
	
	var genReplaceDescriptionsWithText = document.getElementById("genReplaceDescriptionsWithText");
	genReplaceDescriptionsWithText.addEventListener("click", ReplaceDescriptionClicked);
	
	var genShowDescriptionsOnHover = document.getElementById("genShowDescriptionsOnHover");
	genShowDescriptionsOnHover.addEventListener("click", HoverDescriptionsClicked);
	
	var genReplaceCommentText = document.getElementById("genReplaceCommentText");
	genReplaceCommentText.addEventListener("click", ReplaceCommentClicked);
	
	var genCommentsShowOnHover = document.getElementById("genCommentsShowOnHover");
	genCommentsShowOnHover.addEventListener("click", HoverCommentsClicked);
}