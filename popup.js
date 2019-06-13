console.log('hello popup');

chrome.storage.sync.get(null, function (result) {
	console.log(result);
	const list = document.getElementById('listened');

	Object.getOwnPropertyNames(result).forEach((key) => {
		const albumLink = atob(key);
		const albumDescriptor = result[key];
		if (albumDescriptor.listened) {
			const li = document.createElement('li');
			li.textContent = `${albumLink}`;

			list.appendChild(li);
		}
	});
}); 