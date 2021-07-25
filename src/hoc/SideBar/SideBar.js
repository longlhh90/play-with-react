import React from 'react';
import { IconButton, Drawer, List, Divider, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import DirectionsCarIcon from '@material-ui/icons/DirectionsCar';

export default function SideBar() {
    const [leftSideBarOpen, setleftSideBarOpen] = React.useState(false)

    const toggleDrawer = (isOpen) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setleftSideBarOpen(isOpen);
    };

    const list = () => (
        <div
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem button >
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText primary="Home" />
                </ListItem>
                <ListItem button >
                    <ListItemIcon><DirectionsCarIcon /></ListItemIcon>
                    <ListItemText primary="Vehicle" />
                </ListItem>

            </List>
            <Divider />
            <List>
                {['Action 1', 'Action 2', 'Action 3'].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    return (
        <React.Fragment>
            <IconButton onClick={toggleDrawer(true)}><MenuIcon /></IconButton>
            <Drawer anchor="left" open={leftSideBarOpen} onClose={toggleDrawer(false)}>
                {list()}
            </Drawer>
        </React.Fragment>
    );
}