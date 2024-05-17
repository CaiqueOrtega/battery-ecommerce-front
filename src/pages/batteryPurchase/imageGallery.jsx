import React, { useState, useEffect, useRef } from 'react';
import { Carousel } from 'react-bootstrap';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { ZoomInIcon, ZoomOutIcon, ResetZoomIcon } from '../../assets/icons/IconsSet';

function ImageGallery() {
    const images = [
        {
            original: 'https://placehold.co/600x400/EEE/31343C',
            thumbnail: 'https://placehold.co/600x400/EEE/31343C',
        },
        {
            original: 'https://placehold.co/600x400/EEE/31343C',
            thumbnail: 'https://placehold.co/600x400/EEE/31343C',
        },
        {
            original: 'https://placehold.co/600x400/EEE/31343C',
            thumbnail: 'https://placehold.co/600x400/EEE/31343C',
        },
    ];

    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);


    const handleSlideChange = (selectedIndex) => {
        setSelectedImageIndex(selectedIndex);
    };

    const handleImageClick = () => {
        setShowFullscreen(true);
    };


    useEffect(() => {
        if (!showFullscreen) {
            setZoomLevel(1);
        } else {
            const wrapperDiv = document.querySelector('.react-transform-wrapper.transform-component-module_wrapper__SPB86');
            if (wrapperDiv) {
                const handleDoubleClick = () => {
                    setZoomLevel(prevZoom => Math.min(prevZoom + 2, 6));
                };

                const handleWheel = (event) => {
                    if (event.deltaY > 0) {
                        // Rola para baixo, diminui o zoom
                        console.log('Rolou para baixo');
                        setZoomLevel(prevZoom => Math.max(prevZoom - 0.0857143, 1));
                    } else {
                        // Rola para cima, aumenta o zoom
                        console.log('Rolou para cima');
                        setZoomLevel(prevZoom => Math.min(prevZoom + 0.0857143, 6));
                    }
                };

                wrapperDiv.addEventListener('dblclick', handleDoubleClick);
                wrapperDiv.addEventListener('wheel', handleWheel);

                return () => {
                    wrapperDiv.removeEventListener('dblclick', handleDoubleClick);
                    wrapperDiv.removeEventListener('wheel', handleWheel);
                };
            }
        }
    }, [showFullscreen]);




    return (
        <>
            <div className="d-flex flex-column me-2">
                {images.map((image, index) => (
                    <img
                        key={index}
                        src={image.thumbnail}
                        alt={`Thumbnail ${index}`}
                        className={`img-thumbnail mb-2 ${selectedImageIndex === index ? 'border border-warning' : ''}`}
                        onClick={() => setSelectedImageIndex(index)}
                        style={{ cursor: 'pointer', width: '50px', height: '50px' }}
                    />
                ))}
            </div>

            <div style={{ maxWidth: '400px', maxHeight: '500px' }}>
                <Carousel activeIndex={selectedImageIndex} onSelect={handleSlideChange} indicators={false} interval={null}>
                    {images.map((image, index) => (
                        <Carousel.Item key={index}>
                            <img
                                src={image.original}
                                alt={`Imagem ${index}`}
                                className="d-block w-100"
                                style={{ maxWidth: '400px', maxHeight: '500px', cursor: 'pointer' }}
                                onClick={handleImageClick}
                            />
                        </Carousel.Item>
                    ))}
                </Carousel>
            </div>

            {showFullscreen && (
                <div className="fullscreen-backdrop p-5" >

                    <div className="position-absolute top-0 start-0 mt-3 ms-3 text-white" style={{ zIndex: 2 }}>
                        {selectedImageIndex + 1} / {images.length}
                    </div>

                    <button className='btn-close btn-close-white position-absolute top-0 end-0 mt-3 me-3' onClick={() => setShowFullscreen(false)} style={{ zIndex: 2 }} />

                    <TransformWrapper>
                        {({ zoomIn, zoomOut, resetTransform }) => (
                            <>
                                <div className="tools  position-absolute top-0 end-0 mt-2 me-5" style={{ zIndex: 2 }}>
                                    <a type='button' className="fs-4 me-2" onClick={() => { zoomIn(); setZoomLevel(prevZoom => Math.min(prevZoom + 1, 6)); }}><ZoomInIcon color={zoomLevel === 6 ? 'rgba(255, 255, 255, 0.5)' : '#fff'} /></a>
                                    <a type='button' className="fs-4 me-2" onClick={() => { zoomOut(); setZoomLevel(prevZoom => Math.max(prevZoom - 1, 1)); }}><ZoomOutIcon color={zoomLevel === 1 ? 'rgba(255, 255, 255, 0.5)' : '#fff'} /></a>
                                    <a type='button' className='fs-4 me-5' onClick={() => { resetTransform(); setZoomLevel(1); }}><ResetZoomIcon color={zoomLevel === 1 ? 'rgba(255, 255, 255, 0.5)' : '#fff'} /></a>
                                </div>

                                <TransformComponent>
                                    <img
                                        src={images[selectedImageIndex].original}
                                        alt={`Imagem ${selectedImageIndex}`}
                                        className="fullscreen-image"
                                        onClick={() => setShowFullscreen(false)}
                                        style={{ cursor: 'pointer', maxWidth: '100%', maxHeight: '100%' }}

                                    />
                                </TransformComponent>
                            </>
                        )}
                    </TransformWrapper>

                    <button className="carousel-control-prev" onClick={() => handleSlideChange((selectedImageIndex - 1 + images.length) % images.length)}>
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    </button>
                    <button className="carousel-control-next" onClick={() => handleSlideChange((selectedImageIndex + 1) % images.length)}>
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    </button>
                </div >
            )
            }
        </>
    );
}

export default ImageGallery;
