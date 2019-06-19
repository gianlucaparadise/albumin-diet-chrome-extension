// Listview example: https://www.albumoftheyear.org/ratings/
// Gridview example: https://www.albumoftheyear.org/must-hear/

var debug = true;

log(() => "🥚 Albumin Diet 🎧 running");

const albumCoverLinksSelectorGrid = '.albumBlock .image > a';
const albumCoverLinksSelectorList = '.albumListCover > a';
const selectedClass = 'selected';
const unselectedClass = 'unselected';
const eggClass = 'albuminEgg';
const albumClass = 'albuminAlbum';

// First I need to understand if I'm parsing a list or a grid of albums
const isInList = $('div.albumListRow:nth(1)').length > 0;
const albumCoverLinksSelector = isInList ? albumCoverLinksSelectorList : albumCoverLinksSelectorGrid;

$(albumCoverLinksSelector).each((index, element) => {
    const albumlink = $(element).attr('href');
    const id = btoa(albumlink); // encoding in base64 to make sure I don't have strange characters
    chrome.storage.sync.get([id], function (result) {

        const isListened = result && result[id] && result[id].listened;
        if (isListened) log(() => `Album: ${albumlink} - IsListened: ${isListened}`);
        const isListenedSelectedClass = isListened ? selectedClass : unselectedClass;

        const isEgged = result && result[id] && result[id].egged;
        if (isEgged) log(() => `Album: ${albumlink} - IsEgged: ${isEgged}`);
        const isEggedSelectedClass = isEgged ? selectedClass : unselectedClass;

        const toggleButton = $(`<div class="albuminContainer"><i class="albuminIcon ${albumClass} ${isListenedSelectedClass} fas fa-compact-disc"></i><i class="albuminIcon ${eggClass} ${isEggedSelectedClass} fa-egg fas"></i></div>`);

        toggleButton.click(onToggleSaveAlbumClick);

        toggleButton.data('albumHref', albumlink);

        $(element).before(toggleButton);
    });
});

function onToggleSaveAlbumClick(event) {
    const $this = $(this);
    const $target = $(event.target);

    const isSelected = $target.hasClass(selectedClass);

    const albumlink = $this.data('albumHref');
    const id = btoa(albumlink); // encoding in base64 to make sure I don't have strange characters

    const albumDescriptor = {
        lastModified: new Date().toISOString(),
        provider: 'aoty',
    };

    if ($target.hasClass(eggClass)) {
        log(() => 'Egg');
        albumDescriptor.egged = !isSelected;
    }
    else if ($target.hasClass(albumClass)) {
        log(() => 'Album');
        albumDescriptor.listened = !isSelected;
    }

    const albumDescriptors = {};
    albumDescriptors[id] = albumDescriptor;

    chrome.storage.sync.set(albumDescriptors, function () {
        log(() => `albumDescriptor saved`);
        log(() => albumDescriptors);

        $target.toggleClass(`${selectedClass} ${unselectedClass}`);
    });
}

function log(obj) {
    if (debug) {
        console.log(obj());
    }
}