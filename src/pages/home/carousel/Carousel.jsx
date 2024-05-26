import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import exampleCarousel1 from '../../../assets/images/carousel-images-examples-1.jpg';
import exampleCarousel2 from '../../../assets/images/carousel-images-examples-2.jpg';
import exampleCarousel3 from '../../../assets/images/carousel-images-examples-3.jpg';
import { Container } from 'react-bootstrap';

function ControlledCarousel() {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  return (
    <div className='position-relative z-1 div-carousel-container-home' style={{overflow: 'hidden' }}>
      <Container fluid className='carousel-container-home'>
        <Carousel activeIndex={index} onSelect={handleSelect} >
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={exampleCarousel1}
              alt="First slide"
              style={{ height: 'auto' }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={exampleCarousel2}
              alt="Second slide"
              style={{ height: 'auto' }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src={exampleCarousel3}
              alt="Third slide"
              style={{ height: 'auto' }}
            />
          </Carousel.Item>
        </Carousel>
        <div className='gradiant position-absolute'></div>
      </Container>
    </div>
  );
}

export default ControlledCarousel;
