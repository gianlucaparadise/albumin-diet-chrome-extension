// Listview example: https://www.albumoftheyear.org/ratings/
// Gridview example: https://www.albumoftheyear.org/must-hear/

var debug = true;

log(() => "🥚 Albumin Diet 🎧 running");

const albumCoverLinksSelectorGrid = '.albumBlock .image > a';
const albumCoverLinksSelectorList = '.albumListCover > a';
const selectedClass = 'selected';
const unselectedClass = 'unselected';

// First I need to understand if I'm parsing a list or a grid of albums
const isInList = $('div.albumListRow:nth(1)').length > 0;
const albumCoverLinksSelector = isInList ? albumCoverLinksSelectorList : albumCoverLinksSelectorGrid;

$(albumCoverLinksSelector).each((index, element) => {
    const albumlink = $(element).attr('href');
    const id = btoa(albumlink); // encoding in base64 to make sure I don't have strange characters
    chrome.storage.sync.get([id], function (result) {
        const isListened = result && result[id] && result[id].listened;
        if (isListened) log(() => `Album: ${albumlink} - IsInStorage: ${isListened}`);

        const isSelectedClass = isListened ? selectedClass : unselectedClass;
        const toggleButton = $(`<div class="albuminContainer ${isSelectedClass}"><i class="albuminIcon fas fa-compact-disc"></i></div>`); // fa-egg
        // const toggleButton = $(`<div class="albuminContainer ${isSelectedClass}"><i class="albuminIcon fas fa-compact-disc"></i><i class="albuminIcon fa-egg fas"></i></div>`);

        toggleButton.click(onToggleSaveAlbumClick);

        toggleButton.data('albumHref', albumlink);

        $(element).before(toggleButton);
    });
});

function onToggleSaveAlbumClick() {
    const $this = $(this);
    const isSelected = $this.hasClass(selectedClass);

    const albumlink = $this.data('albumHref');
    const id = btoa(albumlink); // encoding in base64 to make sure I don't have strange characters

    const albumDescriptor = {};
    albumDescriptor[id] = {
        listened: !isSelected,
        lastModified: new Date().toISOString(),
        provider: 'aoty',
    };

    chrome.storage.sync.set(albumDescriptor, function () {
        log(() => `albumDescriptor saved`);
        log(() => albumDescriptor);

        $this.toggleClass(`${selectedClass} ${unselectedClass}`);
    });
}

function log(obj) {
    if (debug) {
        console.log(obj());
    }
}