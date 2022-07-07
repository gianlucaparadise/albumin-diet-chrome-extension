const aotyBasePath = 'https://www.albumoftheyear.org';

chrome.storage.sync.get(null, function (result) {
  // console.log(result);
  const list = document.getElementById('egged');

  Object.getOwnPropertyNames(result).forEach((key) => {
    const albumLink = atob(key);
    const albumDescriptor = result[key];
    if (albumDescriptor.egged) {
      const albumName = albumDescriptor.albumName;
      const link = document.createElement('a');
      link.href = `${aotyBasePath}${albumLink}`;
      link.textContent = `${albumName}`;
      link.onclick = function () {
        chrome.tabs.create({ active: true, url: link.href });
      };

      const removeBtn = document.createElement('a');
      removeBtn.innerText = '❌';
      removeBtn.title = 'Delete album';
      removeBtn.className = 'button';
      removeBtn.onclick = function () {
        // console.log('remove:', key, albumDescriptor);
        chrome.storage.sync.remove(key, () => {
          // console.log('removed:', key, albumDescriptor);
          list.removeChild(li);
        });
      };

      const li = document.createElement('li');
      li.appendChild(link);
      li.appendChild(removeBtn);

      list.appendChild(li);
    }
  });
});
