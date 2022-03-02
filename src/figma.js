export const apiRequest = async function (endpoint) {
	return await fetch('https://api.figma.com/v1' + endpoint, {
		method: 'GET',
		headers: { 'x-figma-token': '334391-0f3a8f2f-76ae-44f8-bf53-96a2128e29a5' },
	})
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			return { err: error };
		});
};
