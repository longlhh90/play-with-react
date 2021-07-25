import React from 'react';
import SideBar from '../SideBar/SideBar';
import { Container } from '@material-ui/core';

const Layout = (props) => {
    return (
        <React.Fragment>
            <SideBar />
            <Container>
                {props.children}
            </Container>
        </React.Fragment>
    )
}

export default Layout;