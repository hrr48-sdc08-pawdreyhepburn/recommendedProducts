import React from 'react';
import {RecListItem, RecItemImage, RecItemPrice, RecItemTitle, RecItemAnchor} from './Styles.jsx';

const ListItem = ({item, visible}) => {

  let handleClick = (event) => {
    console.log(`item ${item.title} was clicked!`);
    // I'm planning to use this to redirect page on click
  };

  if (visible) {
    return (
      <RecListItem key={`${item.id}-item`} onClick={(e) => {handleClick(e)}}>
        <RecItemAnchor key={`${item.id}-anchor`} href={item.productUrl}>
          <RecItemImage key={`${item.id}-image`} src={item.imageUrl} ></RecItemImage>
          <RecItemPrice key={`${item.id}-price`}>${item.price}</RecItemPrice>
        </RecItemAnchor>
      </RecListItem>
    );
  } else {
    return <div key={`${item.id}-item`}></div>
  }
};

export default ListItem;
