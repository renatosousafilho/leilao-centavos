import React, { useEffect, useState } from 'react';

import { Column } from 'rbx';

import ProductCard from '../components/ProductCard';

import { io } from 'socket.io-client';

const socket = io('http://localhost:3001')

function Home() {
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      });
  }, []);

  return (
    <>
      <h1>Participantes</h1>

      <Column.Group>
        {products.map(({_id, name, image, votes, arremate, currentAuction}, index) => (
          <Column key={_id}>
            <ProductCard data-test-id='participant'
              index={index}
              id={_id}
              name={name} 
              image={image}
              votes={votes}
              auction={currentAuction}
              arremate={arremate}
              winner={false} />
          </Column>
        ))}
      </Column.Group>
    </>
  );
}

export default Home;