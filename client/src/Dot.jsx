import React from 'react';
import {NavDotContainer, UnselectedDot, SelectedDot} from './Styles.jsx';

const Dot = ({selected, handleClick}) => (
    selected ?
    <SelectedDot></SelectedDot> :
    <NavDotContainer onClick={() => handleClick()}><UnselectedDot></UnselectedDot></NavDotContainer>
);


export default Dot;
