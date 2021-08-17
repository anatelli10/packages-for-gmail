import { API_URL } from '..';

const authorizedFetch = async (user, path, options, callback) => {
    chrome.storage.local.get(`${user}_tokens`, async result => {
        const tokens = result[`${user}_tokens`];
        if (!tokens) return callback({ error: 'Tokens not found' });
        const { token, refreshToken } = tokens;

        const res = await fetch(API_URL + path, {
            headers: {
                Authorization: 'Bearer ' + token,
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            ...options
        });
        const json = await res.json();

        if (res.ok) return callback(json);

        if (json.message !== 'Unauthorized') return callback({error: json.message});
        
        // Unauthorized, attempt to refresh the tokens
        const tokenRes = await fetch(API_URL + '/accounts/refresh-token', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                refreshToken
            })
        });

        if (!tokenRes.ok) return callback({ error: 'Failed token refresh' });

        const tokenJson = await tokenRes.json();
        chrome.storage.local.set(
            {
                [`${user}_tokens`]: {
                    token: tokenJson.jwtToken,
                    refreshToken: tokenJson.refreshToken
                }
            },
            // Retry
            () => authorizedFetch(path, options, callback)
        );
    });
};

export default authorizedFetch;
