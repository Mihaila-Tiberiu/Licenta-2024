import { useState, useEffect } from 'react';

const ImageCarousel = ({ locationImagesArray }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? locationImagesArray.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === locationImagesArray.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {

    const adjustContainerSize = () => {
      const imageContainer = document.getElementById('image-container');
      if (imageContainer) {
        const containerWidth = imageContainer.clientWidth;

        const containerHeight = containerWidth * (9 / 16);
        imageContainer.style.height = `${containerHeight}px`;
      }
    };


    adjustContainerSize();
    window.addEventListener('resize', adjustContainerSize); 

    return () => {
      window.removeEventListener('resize', adjustContainerSize);
    };
  }, [currentImageIndex]);

  if (locationImagesArray.length === 0) {

    return (
      <div className="relative w-full max-w-4xl mx-auto h-80 bg-gray-200 rounded-md"></div>
    );
  }


  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div
        id="image-container"
        className="relative overflow-hidden rounded-md"
        style={{ paddingBottom: '56.25%' }}
      >
        <img
          src={`http://localhost:4000/uploads/${locationImagesArray[currentImageIndex]}`}
          alt={`Location ${currentImageIndex + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex justify-between px-4 pb-4">
        <button
          className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 focus:outline-none"
          onClick={handlePrevClick}
        >
          &lt;
        </button>
        <button
          className="bg-gray-800 text-white px-3 py-1 rounded-md hover:bg-gray-700 focus:outline-none"
          onClick={handleNextClick}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default ImageCarousel;
