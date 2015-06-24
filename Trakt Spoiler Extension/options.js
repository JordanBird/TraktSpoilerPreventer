document.addEventListener('DOMContentLoaded', SetupPage);

// Saves options to chrome.storage
function save_options()
{
	var bReplaceName = document.getElementById('replaceName').checked;
	var bHoverName = document.getElementById('hoverName').checked;
	var bHideComments = document.getElementById('hideComments').checked;
	
	var bHideShowNames = document.getElementById('hideShowNames').checked;
	var bHideShowName = document.getElementById('hideShowName').checked;
	var bHideShowDescription = document.getElementById('hideShowDescription').checked;
	var bHideShowScreenshot = document.getElementById('hideShowScreenshot').checked;

	chrome.storage.sync.set(
	{
		replaceName: bReplaceName,
		hoverName: bHoverName,
		hideComments: bHideComments,
		hideShowNames: bHideShowNames,
		hideShowName: bHideShowName,
		hideShowDescription: bHideShowDescription,
		hideShowScreenshot: bHideShowScreenshot
	}, function()
	{
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
		status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options()
{
	// Use default value color = 'red' and likesColor = true.
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
		document.getElementById('replaceName').checked = items.replaceName;
		document.getElementById('hoverName').checked = items.hoverName;
		document.getElementById('hideComments').checked = items.hideComments;
		
		document.getElementById('hideShowNames').checked = items.hideShowNames;
		document.getElementById('hideShowName').checked = items.hideShowName;
		document.getElementById('hideShowDescription').checked = items.hideShowDescription;
		document.getElementById('hideShowScreenshot').checked = items.hideShowScreenshot;
  });
}

function SetupPage()
{
	restore_options();
	document.getElementById("save").addEventListener('click', save_options);
}