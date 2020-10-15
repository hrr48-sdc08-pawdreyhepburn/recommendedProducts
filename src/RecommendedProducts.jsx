import React, { useState, useEffect } from 'react';
import List from './List.jsx';
import Dot from './Dot.jsx';
import axios from 'axios';
import {GlobalStyle, CenterTextBox, ItemsBox} from './Styles.jsx';

const RecommendedProducts = ({totalItems, itemsShown, heading}) => {

  let offset = 0;
  // don't reuse products between 'more to consider' and 'similar items':
  if (heading === 'Similar items') {
    offset = 24;
  }

  // parse information from window pathname
  let productId = window.location.pathname.slice(1) || 1;

  const [selectedDot, setSelectedDot] = useState(0);
  const [numItems, setNumItems] = useState(totalItems || 24);
  const [allItems, setAllItems] = useState([]);
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

  useEffect(() => {
    if (Number.isInteger(parseInt(productId))) {
      axios.get(`http://localhost:3003/products/id/${productId}`)
        .then(results => {
          setAllItems(results.data.slice(offset, offset + numItems));
          console.log(results.data.slice(offset, offset + numItems))
        });
    }
  }, []);

  return (
    <div>
      <GlobalStyle />
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
