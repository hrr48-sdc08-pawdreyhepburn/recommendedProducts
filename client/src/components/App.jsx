import React from 'react';
import RecommendedProducts from './RecommendedProducts.jsx';


const App = (props) => {
  return (
    <div>
    <RecommendedProducts heading={'More to Consider'}/>
    <RecommendedProducts heading={'Similar items'} totalItems={11}/>
    </div>
  );
}
