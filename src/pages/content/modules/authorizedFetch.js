import { API_URL } from '..';

const getTokens = user =>
    new Promise(resolve => {
        chrome.storage.local.get(`${user}_tokens`, resolve);
    });

const setTokens = (user, tokens) =>
    new Promise(resolve => {
        chrome.storage.local.set({ [`${user}_tokens`]: tokens }, resolve);
    });

const authorizedFetch = async (user, path, options = {}) => {
    const tokens = (await getTokens(user))[`${user}_tokens`];
    if (!tokens) throw new Error('Tokens not found');
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

    if (res.ok) return json;

    if (json.message !== 'Unauthorized') throw new Error(json.message);

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

    if (!tokenRes.ok) throw new Error('Failed token refresh');

    const tokenJson = await tokenRes.json();
    await setTokens(user, {
        token: tokenJson.jwtToken,
        refreshToken: tokenJson.refreshToken
    });

    return authorizedFetch(user, path, options);
};

export default authorizedFetch;
