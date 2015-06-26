document.addEventListener('DOMContentLoaded', SetupPage);
console.log(chrome.storage);
// Saves options to chrome.storage
function save_options()
{
	chrome.storage.sync.set(
	{
		genShowOnHover: document.getElementById('genShowOnHover').checked,
		genReplaceTitlesWithText: document.getElementById('genReplaceTitlesWithText').checked,
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
	console.log(chrome.storage);
	chrome.storage.sync.get(
	{
		genShowOnHover: true,
		genReplaceTitlesWithText: true,
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
		moviePageHideDescription: false
	}, function(items)
	{
		console.log("Here");
		document.getElementById('genShowOnHover').checked = items.genShowOnHover;
		document.getElementById('genReplaceTitlesWithText').checked = items.genReplaceTitlesWithText;
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

function SetupPage()
{
	restore_options();
	document.getElementById("save").addEventListener('click', save_options);
}