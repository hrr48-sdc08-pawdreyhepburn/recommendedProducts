import React, { useState, useEffect } from 'react';
import List from './List.jsx';
import Dot from './Dot.jsx';
import axios from 'axios';
import {GlobalStyle, CenterTextBox, ItemsBox} from './Styles.jsx';

const RecommendedProducts = ({totalItems, itemsShown, heading, allItems}) => {
  // parse information from window pathname

  const [selectedDot, setSelectedDot] = useState(0);
  const [numItems, setNumItems] = useState(totalItems || 24);
  const [numVisible, setNumVisible] = useState(itemsShown || 7);
  const [numDots, setNumDots] = useState(Math.ceil(numItems / numVisible));

  let dotsArray = [];
  while (dotsArray.length < numDots) {
    if (selectedDot === dotsArray.length) {
      dotsArray.push(1);
    } else {
      dotsArray.push(0);
    }
  }



  return (
    <div>
      <ItemsBox>
        <CenterTextBox><h4>{heading}</h4></CenterTextBox>
        <div id="recommended-items">
          <List
            listItems={allItems}
            numVisible={numVisible}
            selectedDot={selectedDot}
            numDots={numDots}
            handleClick={(d) => setSelectedDot(selectedDot + d)}/>
        </div>
        <CenterTextBox>
          {dotsArray.map((selected, i) =>
            <Dot selected={selected} key={i} handleClick={() => setSelectedDot(i)}/>
          )}
        </CenterTextBox>
      </ItemsBox>
    </div>
  );
}

export default RecommendedProducts;
