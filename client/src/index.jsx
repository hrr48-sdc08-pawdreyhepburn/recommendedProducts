import RecommendedProducts from './RecommendedProducts.jsx';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
  <div>
    <RecommendedProducts heading={'More to Consider'}/>
    <RecommendedProducts heading={'Similar items'} totalItems={11}/>
  </div>,
document.getElementById('RecommendedProducts'));
