import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RecommendedProducts from './RecommendedProducts.jsx';


const App = (props) => {

  let productId = window.location.pathname.slice(10) || 1;


  const [allItems, setAllItems] = useState([]);


  useEffect(() => {
    if (Number.isInteger(parseInt(productId))) {
      axios.get(`/api/products/${productId}`)
        .then(results => {
          setAllItems(results.data);
        });
    }
  }, []);

  return (
    <div>
    <RecommendedProducts allItems={allItems.slice(0, 24)} heading={'More to Consider'}/>
    <RecommendedProducts allItems={allItems.slice(24, 35)} heading={'Similar items'} totalItems={11}/>
    </div>
  );
}

export default App;