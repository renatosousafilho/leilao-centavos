import React, { useState } from 'react';

import { Card, Button } from 'rbx';

import { io } from 'socket.io-client';

const socket = io('http://localhost:3001')

function ProductCard({ index, id, name, image, arremate, auction, winner }) {
  const [currentAuction, setCurrentAuction] = useState(auction);
  const [arrematado, setArrematado] = useState(false);

  useState(() => {
    if (currentAuction > arremate) setArrematado(true);

    socket.on('refreshCurrentAuction', (data) => {
      if (data._id === id) setCurrentAuction(data.currentAuction);
    })

     socket.on('arremate', (data) => {
       console.log(data);
      if (data._id === id) setArrematado(true);
    })
  });

  const handleClick = () => {
    socket.emit('updateCurrentAuction', { id });
  }

  return (
    <Card data-testid={winner ? 'participant-winner' : ''}>
      <Card.Header>
        <Card.Header.Title data-testid='participant-name'>{name}</Card.Header.Title>
      </Card.Header>
      <Card.Image>
        <img src={image} width='200' height='auto' alt='avatar' />
      </Card.Image>
      <Card.Footer style={{flexDirection: 'column'}}>
        <div>Valor de Arremate: {arremate}</div>
        <div>Lance Atual: <span data-testid={`current-votes-${index}`}>{currentAuction}</span></div>
        <div>
          {arrematado
            ? <span>Arrematado</span>
            : <Button onClick={handleClick} data-testid={`auction-product-${index}`}>Dar lance</Button>
          }
        </div>
      </Card.Footer>
    </Card>
  );
}

export default ProductCard;