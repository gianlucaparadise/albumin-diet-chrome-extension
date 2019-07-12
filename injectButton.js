const buttonsContainerSelector = ".buyButtons";
const spotifyButtonSelector = `${buttonsContainerSelector} > a[title='Spotify']`;
const spotifyButttonTestContainerSelector = ".albumButton.spotify";

let btn = $(spotifyButtonSelector).clone();
const link = btn.attr("href");
if (link) {
	const linkSegments = link.split("/");
	const albumId = linkSegments[linkSegments.length - 1];
	const albumUri = `spotify:album:${albumId}`;
	btn.attr('href', albumUri);

	btn.addClass("albuminDiet");
	btn.find(spotifyButttonTestContainerSelector).append("<span class='spotifyButtonText'>Open in App</span>");
	btn.appendTo(buttonsContainerSelector);
}