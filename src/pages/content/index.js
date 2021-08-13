import '../../assets/img/fedex.png';
import '../../assets/img/ups.png';
import '../../assets/img/usps.png';
import '../../assets/img/icon-small.png';
import '../../assets/img/icon-large.png';
import creds from '../../credentials.json';
import './modules/inboxsdk';
import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import createLoadingElement from './modules/createLoadingElement';

// chrome.storage.local.clear();

const loadingElement = createLoadingElement();
const manifest = chrome.runtime.getManifest();

export const APP_NAME = manifest.name;
export const APP_DESCRIPTION = manifest.description;
export const API_URL = 'http://localhost:4000';
export const AMOUNT_OF_DAYS = 90;

InboxSDK.load(2, creds.INBOXSDK_KEY, {
    appName: 'Packages',
    appIconUrl: chrome.runtime.getURL('icon-small.png')
}).then(sdk => {
    const routeID = 'packages';

    const contentElement = document.createElement('div');
    contentElement.style.height = '100%';

    const user = sdk.User.getEmailAddress();

    sdk.NavMenu.addNavItem({
        name: 'Packages',
        iconUrl: chrome.runtime.getURL('icon-small.png'),
        routeID
    });

    sdk.Router.handleCustomRoute(routeID, customRouteView => {
        loadingElement.style.display = 'block';

        customRouteView.getElement().appendChild(contentElement);

        chrome.storage.local.get(
            [`${user}_tokens`, `${user}_packages`, `filters`, `ordering`],
            result => {
                loadingElement.style.display = 'none';

                render(
                    <App
                        user={user}
                        isSignedIn={!!result[`${user}_tokens`]}
                        tokens={result[`${user}_tokens`]}
                        packages={result[`${user}_packages`]}
                        filters={result.filters}
                        ordering={result.ordering}
                    />,
                    contentElement
                );
            }
        );
    });
});
