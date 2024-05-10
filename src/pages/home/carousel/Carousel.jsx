import React from 'react';
import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import exampleCarousel1 from '../../../assets/images/exempleCarousel1.jpg';
import exampleCarousel2 from '../../../assets/images/exempleCarousel2.jpg';
import exampleCarousel3 from '../../../assets/images/exempleCarousel3.jpg';

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className='bg-yellow ' style={{ maxHeight: '20rem', overflow: 'hidden' }}>
      <Carousel activeIndex={index} onSelect={handleSelect}>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={exampleCarousel1}
            alt="First slide"
            style={{ maxHeight: '20rem', objectFit: 'contain' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={exampleCarousel2}
            alt="Second slide"
            style={{ maxHeight: '20rem', objectFit: 'contain' }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={exampleCarousel3}
            alt="Third slide"
            style={{ maxHeight: '20rem', objectFit: 'contain' }}
          />
        </Carousel.Item>
      </Carousel>
    </div>
  );
}

export default ControlledCarousel;
