import { useState } from "react";
import "styles/ImageCarousel.css";

function ImageCarousel({ images, altPrefix = "프로젝트" }) {
  const [index, setIndex] = useState(0);

  if (!images?.length) {
    return null;
  }

  const safeIndex = Math.min(index, images.length - 1);
  const current = images[safeIndex];

  const goPrev = () => {
    setIndex((prev) => (prev <= 0 ? images.length - 1 : prev - 1));
  };

  const goNext = () => {
    setIndex((prev) => (prev >= images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="image-carousel">
      <div className="image-carousel__viewport">
        <img
          src={current.url}
          alt={`${altPrefix} 이미지 ${safeIndex + 1}`}
          className="image-carousel__image"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              className="image-carousel__nav image-carousel__nav--prev"
              onClick={goPrev}
              aria-label="이전 이미지"
            >
              ‹
            </button>
            <button
              type="button"
              className="image-carousel__nav image-carousel__nav--next"
              onClick={goNext}
              aria-label="다음 이미지"
            >
              ›
            </button>
            <span className="image-carousel__counter">
              {safeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="image-carousel__dots" role="tablist" aria-label="이미지 선택">
          {images.map((image, dotIndex) => (
            <button
              key={image.id ?? image.url}
              type="button"
              role="tab"
              aria-selected={dotIndex === safeIndex}
              aria-label={`${dotIndex + 1}번째 이미지`}
              className={`image-carousel__dot${
                dotIndex === safeIndex ? " image-carousel__dot--active" : ""
              }`}
              onClick={() => setIndex(dotIndex)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;
