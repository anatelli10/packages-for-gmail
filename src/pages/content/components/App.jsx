import React, { useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import SignInCard from './SignInCard';
import Packages from './Packages';
import Zoom from '@material-ui/core/Zoom';

const theme = createMuiTheme({
    /**
     * Palette
     */
    palette: {
        primary: {
            main: '#d93025'
        },
        secondary: {
            main: '#2a7cfa'
        }
    },
    /**
     * Props
     */
    props: {
        MuiTooltip: {
            enterDelay: 400,
            TransitionProps: { timeout: 150 }
        }
    },
    /**
     * Overrides
     */
    overrides: {
        MuiDivider: {
            root: {
                backgroundColor: '#eceff1'
            }
        },
        MuiIconButton: {
            root: {
                padding: '9px'
            }
        },
        MuiTableRow: {
            root: {
                '&.Mui-selected, &.Mui-selected:hover': {
                    backgroundColor: '#c2dbff'
                }
            }
        },
        MuiTableCell: {
            root: {
                whiteSpace: 'nowrap',
                borderBottom: '1px solid #10101010'
            },
            head: {
                padding: '0 16px'
            }
        },
        MuiTableHead: {
            root: {
                height: 56
            }
        },
        MuiTableSortLabel: {
            root: {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                '-webkit-font-smoothing': 'antialiased',
                fontFamily:
                    "'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif",
                fontSize: '.875rem',
                letterSpacing: '.25px',
                color: '#5f6368',
                fontWeight: 500
            },
            active: {
                color: '#202124'
            }
        },
        MuiTooltip: {
            tooltip: {
                backgroundColor: 'rgba(60,64,67,0.90)',
                '-webkit-border-radius': '4px',
                borderRadius: '4px',
                padding: '4px 8px',
                '-webkit-font-smoothing': 'auto',
                fontFamily: 'Roboto, RobotoDraft, Helvetica, Arial, sans-serif',
                fontSize: '.75rem',
                letterSpacing: '.3px',
                '-webkit-font-smoothing': 'antialiased',
                fontWeight: 500,
                lineHeight: '16px'
            }
        },
        MuiTypography: {
            h6: {
                fontFamily:
                    "'Google Sans', Roboto, RobotoDraft, Helvetica, Arial, sans-serif",
                fontSize: '1.375rem',
                color: '#202124',
                fontWeight: 'normal',
                textShadow: 'none',
                letterSpacing: '.25px',
                '-webkit-font-smoothing': 'antialiased'
            }
        },
        MuiSvgIcon: {
            colorSecondary: { color: 'rgba(0, 0, 0, 0.87)' }
        }
    }
});

const App = props => {
    const [isSignedIn, setSignedIn] = useState(props.isSignedIn);

    return (
        <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            autoHideDuration={3000}
            transitionDuration={{ enter: 150, exit: 150 }}
            TransitionComponent={Zoom}
        >
            <ThemeProvider theme={theme}>
                {isSignedIn ? (
                    <Packages {...props} />
                ) : (
                    <SignInCard user={props.user} setSignedIn={setSignedIn} />
                )}
            </ThemeProvider>
        </SnackbarProvider>
    );
};

export default App;
