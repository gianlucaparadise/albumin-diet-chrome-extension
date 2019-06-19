console.log('hello popup');

const aotyBasePath = 'https://www.albumoftheyear.org';

chrome.storage.sync.get(null, function (result) {
	console.log(result);
	const list = document.getElementById('egged');

	Object.getOwnPropertyNames(result).forEach((key) => {
		const albumLink = atob(key);
		const albumDescriptor = result[key];
		if (albumDescriptor.egged) {
			const link = document.createElement('a');
			link.href = `${aotyBasePath}${albumLink}`;
			link.textContent = `${albumLink}`;
			link.onclick = function () {
				chrome.tabs.create({ active: true, url: link.href });
			};

			const li = document.createElement('li');
			li.appendChild(link);
			list.appendChild(li);
		}
	});
}); 