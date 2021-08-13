import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import GoogleButton from 'react-google-button';
import { API_URL, APP_DESCRIPTION, APP_NAME } from '..';

let windowObjectReference = null;

const useStyles = makeStyles(theme => ({
    paper: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
        width: 'fit-content'
    },
    logo: {
        margin: theme.spacing(2, 'auto'),
        display: 'block'
    },
    title: {
        margin: theme.spacing(0, 2),
        padding: theme.spacing(1, 0, 0),
        textAlign: 'center',
        fontSize: '2rem'
    },
    subtitle: {
        padding: theme.spacing(0, 0, 1),
        textAlign: 'center',
        color: '#616161',
        letterSpacing: '.25px',
        fontWeight: 500,
        fontSize: '.875rem'
    },
    googleButton: {
        margin: theme.spacing(3, 'auto'),
        fontWeight: 500
    }
}));

export default function SignInCard(props) {
    const classes = useStyles();
    const { user, setSignedIn } = props;
    const [disabled, setDisabled] = useState(false);

    const receiveMessage = event => {
        if (event.origin !== API_URL) return;

        windowObjectReference.close();
        const { loginResponse } = event.data;
        if (!loginResponse) return;

        const tokens = {
            token: loginResponse.jwtToken,
            refreshToken: loginResponse.refreshToken
        };

        chrome.storage.local.set({ [`${user}_tokens`]: tokens }, () =>
            setSignedIn(true)
        );
    };

    // https://dev.to/dinkydani21/how-we-use-a-popup-for-google-and-outlook-oauth-oci
    const openSignInWindow = (url, name, user) => {
        window.removeEventListener('message', receiveMessage);

        const w = 600;
        const h = 700;
        const y = window.top.outerHeight / 2 + window.top.screenY - h / 2;
        const x = window.top.outerWidth / 2 + window.top.screenX - w / 2;

        const features = `toolbar=no, menubar=no, resizable=no, width=${w}, height=${h}, top=${y}, left=${x}`;

        if (windowObjectReference === null || windowObjectReference.closed) {
            windowObjectReference = window.open(url, name, features);
        } else {
            windowObjectReference.focus();
        }

        window.addEventListener(
            'message',
            event => receiveMessage(event, user),
            false
        );
    };

    return (
        <Paper className={classes.paper}>
            <a href="http://gmailpackages.com/">
                <img
                    className={classes.logo}
                    src={chrome.runtime.getURL('icon-large.png')}
                    width="128px"
                    height="128px"
                />
            </a>
            <Typography className={classes.title} component="h2" variant="h6">
                {APP_NAME}
            </Typography>
            <Typography
                className={classes.subtitle}
                component="h3"
                variant="h6"
            >
                {APP_DESCRIPTION}
            </Typography>
            <GoogleButton
                className={classes.googleButton}
                type="light"
                onClick={() => {
                    const url = `${API_URL}/accounts/auth/start?email=${encodeURIComponent(
                        user
                    )}`;
                    openSignInWindow(url, 'auth', user);
                }}
                disabled={disabled}
            />
        </Paper>
    );
}
