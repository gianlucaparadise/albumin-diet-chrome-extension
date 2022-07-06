// Listview example: https://www.albumoftheyear.org/ratings/
// Gridview example: https://www.albumoftheyear.org/must-hear/

var debug = true;

log(() => "🥚 Albumin Diet 🎧 running");

const albumCoverLinkGridClass = 'image';
const albumCoverLinkListClass = 'albumListCover';
const albumCoverLinkDetailClass = 'albumTopBox';

const albumCoverLinksSelectorGrid = `.albumBlock .${albumCoverLinkGridClass}`;
const albumCoverLinksSelectorList = `.${albumCoverLinkListClass}`;
const albumCoverLinksSelectorDetail = `.${albumCoverLinkDetailClass}.cover`;

const selectedClass = 'selected';
const unselectedClass = 'unselected';
const eggClass = 'albuminEgg';
const albumClass = 'albuminAlbum';

// Here I collect all the album covers
const elements = [];

const albumsInGrid = $(albumCoverLinksSelectorGrid);
log(() => `Found ${albumsInGrid.length} elements in a Grid`);
elements.push(...albumsInGrid)

const albumsInList = $(albumCoverLinksSelectorList);
log(() => `Found ${albumsInList.length} elements in a List`);
elements.push(...albumsInList);

// Injection in album detail is different from injection in list/grid
const albumsInDetail = $(albumCoverLinksSelectorDetail);
log(() => `Found ${albumsInDetail.length} elements in a Detail`);
elements.push(...albumsInDetail);

// For each album cover, I add the buttons
$(elements).each((index, element) => {
    const albumlink = extractAlbumLink(element);
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

        const albumName = extractAlbumName(element);
        log(() => `${albumName}`);
        toggleButton.data('albumName', albumName);
        toggleButton.data('albumHref', albumlink);

        // ToggleButton div has position absolute. I need the parent to have position relative  
        $(element).css('position', 'relative');
        $(element).prepend(toggleButton);
    });
});

function extractAlbumLink(element) {
    const linkElement = $(element).find('a');
    if (linkElement && linkElement.length > 0) {
        return linkElement.attr('href');
    }

    // If this element doesn't contain a link, I'm in the detail page and I use current page's link as album link
    return window.location.pathname;
}

function extractAlbumName(element) {
    const $element = $(element);

    const isGrid = $element.hasClass(albumCoverLinkGridClass);
    if (isGrid) {
        const $parent = $element.parent();
        const albumTitle = $parent.find('.albumTitle').text();
        let artistTitle = $parent.find('.artistTitle').text();
        if (!artistTitle) {
            log(() => 'artist not found, trying to extract it from detail');
            artistTitle = $('.artist span[itemprop="name"]').text();
        }

        return `${artistTitle} - ${albumTitle}`;
    }

    const isList = $element.hasClass(albumCoverLinkListClass);
    if (isList) {
        const artistAlbumTitle = $element.siblings('.albumListTitle').find('a').text();

        return artistAlbumTitle;
    }

    const isDetail = $element.hasClass(albumCoverLinkDetailClass);
    if (isDetail) {
        const $parent = $element.parent();
        const albumTitle = $parent.find('.albumTitle span[itemprop="name"]').text();
        const artistTitle = $parent.find('.artist span[itemprop="name"]').text();

        return `${artistTitle} - ${albumTitle}`;
    }

    return '';
}

function onToggleSaveAlbumClick(event) {
    const $this = $(this);
    const $target = $(event.target);

    const isSelected = $target.hasClass(selectedClass);

    const albumName = $this.data('albumName');
    const albumlink = $this.data('albumHref');
    const id = btoa(albumlink); // encoding in base64 to make sure I don't have strange characters

    const albumDescriptor = {
        albumName,
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
        $target.siblings(`.${selectedClass}`).toggleClass(`${selectedClass} ${unselectedClass}`);
    });
}

function log(obj) {
    if (debug) {
        console.log(obj());
    }
}