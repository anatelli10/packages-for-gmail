import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import Button from '@material-ui/core/Button';
import RestoreFromTrash from '@material-ui/icons/RestoreFromTrash';
import Restore from '@material-ui/icons/Restore';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import LanguageIcon from '@material-ui/icons/Language';
import SimpleDialog from '../table/SimpleDialog';
import { AMOUNT_OF_DAYS } from '../..';

const useStyles = makeStyles(theme => ({
    button: {
        textTransform: 'capitalize',
        margin: theme.spacing(1)
    }
}));

const UtilitiesButton = props => {
    const classes = useStyles();
    const { handleRestorePackages, handleResetPackages, handleSignOut } = props;
    const [mainOpen, setMainOpen] = useState(false);
    const [signOutOpen, setSignOutOpen] = useState(false);
    const [resetOpen, setResetOpen] = useState(false);

    return (
        <React.Fragment>
            {/* Gear icon */}
            <Tooltip title="Utilities">
                <IconButton
                    aria-label="utilities"
                    onClick={() => setMainOpen(true)}
                >
                    <SettingsIcon />
                </IconButton>
            </Tooltip>

            {/* Main dialog */}
            <SimpleDialog
                open={mainOpen}
                handleClose={() => setMainOpen(false)}
                title="Utilities"
                content={
                    <Box
                        display="flex"
                        alignItems="stretch"
                        flexDirection="column"
                    >
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<RestoreFromTrash />}
                            onClick={() => {
                                setMainOpen(false);
                                handleRestorePackages();
                            }}
                        >
                            Restore Deleted Packages
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<Restore />}
                            onClick={() => setResetOpen(true)}
                        >
                            Reset Packages
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<ExitToAppIcon />}
                            onClick={() => setSignOutOpen(true)}
                        >
                            Sign Out
                        </Button>

                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            startIcon={<LanguageIcon />}
                            href="http://packagesforgmail.com"
                        >
                            Website
                        </Button>
                    </Box>
                }
            />

            {/* Sign out overlay dialog */}
            <SimpleDialog
                open={signOutOpen}
                handleClose={() => setSignOutOpen(false)}
                title="Sign out"
                description="You will not be able to access your packages unless you sign back in. Are you sure?"
                confirmAction={handleSignOut}
            />

            {/* Reset packages overlay dialog */}
            <SimpleDialog
                open={resetOpen}
                handleClose={() => setResetOpen(false)}
                title="Reset packages"
                description={`This will delete all packages. Then the
          last ${AMOUNT_OF_DAYS} days of packages will be added again as if you had reinstalled the extension. Manually added packages will be lost forever! Are you sure?`}
                confirmAction={() => {
                    handleResetPackages();
                    setMainOpen(false);
                }}
            />
        </React.Fragment>
    );
};

export default UtilitiesButton;
