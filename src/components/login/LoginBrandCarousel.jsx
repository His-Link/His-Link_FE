import { useEffect, useState } from "react";

const SLIDES = [
  {
    id: "projects",
    title: "Welcome!",
    description:
      "한동 개발자들의 프로젝트를 한곳에서 발견하고, 서로의 작업을 공유하세요.",
    illustration: (
      <svg viewBox="0 0 200 200" className="brand-illustration" aria-hidden="true">
        <rect x="48" y="40" width="104" height="120" rx="12" fill="rgba(255,255,255,0.2)" />
        <rect x="60" y="58" width="72" height="10" rx="5" fill="#ffffff" />
        <rect x="60" y="78" width="56" height="8" rx="4" fill="rgba(255,255,255,0.7)" />
        <rect x="60" y="94" width="64" height="8" rx="4" fill="rgba(255,255,255,0.7)" />
        <circle cx="68" cy="120" r="6" fill="#48c6ef" />
        <rect x="80" y="114" width="48" height="8" rx="4" fill="rgba(255,255,255,0.85)" />
        <path d="M130 150 L150 130 L162 142 L142 162 Z" fill="rgba(255,255,255,0.35)" />
      </svg>
    )
  },
  {
    id: "feedback",
    title: "Welcome!",
    description:
      "User Testing Lab에서 구조화된 피드백을 받고 프로젝트를 개선하세요.",
    illustration: (
      <svg viewBox="0 0 200 200" className="brand-illustration" aria-hidden="true">
        <circle cx="100" cy="100" r="52" fill="rgba(255,255,255,0.18)" />
        <circle cx="100" cy="100" r="36" fill="rgba(255,255,255,0.25)" />
        <circle cx="100" cy="100" r="20" fill="#ffffff" />
        <path d="M100 88 L100 104 M100 112 L100 114" stroke="#5d87ff" strokeWidth="4" strokeLinecap="round" />
        <rect x="36" y="36" width="28" height="8" rx="4" fill="rgba(255,255,255,0.4)" />
        <rect x="148" y="52" width="20" height="20" rx="4" fill="rgba(72,198,239,0.6)" />
        <text x="154" y="66" fill="#fff" fontSize="14" fontWeight="700">
          +
        </text>
      </svg>
    )
  },
  {
    id: "team",
    title: "Welcome!",
    description:
      "역할과 기술 스택 기반으로 팀원을 모집하고 함께 프로젝트를 만들어 보세요.",
    illustration: (
      <svg viewBox="0 0 200 200" className="brand-illustration" aria-hidden="true">
        <circle cx="72" cy="88" r="22" fill="rgba(255,255,255,0.85)" />
        <circle cx="128" cy="88" r="22" fill="rgba(255,255,255,0.7)" />
        <path d="M40 148 Q72 120 104 148 T168 148" fill="rgba(255,255,255,0.25)" />
        <rect x="78" y="52" width="44" height="44" rx="10" fill="rgba(72,198,239,0.5)" />
        <path
          d="M88 72 L98 82 L112 64"
          stroke="#fff"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }
];

const SLIDE_INTERVAL_MS = 4500;
const FADE_DURATION_MS = 700;

function LoginBrandCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    let fadeTimeoutId;

    const intervalId = setInterval(() => {
      setIsVisible(false);
      fadeTimeoutId = setTimeout(() => {
        setActiveIndex((prev) => (prev + 1) % SLIDES.length);
        setIsVisible(true);
      }, FADE_DURATION_MS);
    }, SLIDE_INTERVAL_MS);

    return () => {
      clearInterval(intervalId);
      if (fadeTimeoutId) {
        clearTimeout(fadeTimeoutId);
      }
    };
  }, []);

  const activeSlide = SLIDES[activeIndex];

  return (
    <div className="login-brand-carousel">
      <div className="login-brand-carousel__top">
        <div className="login-brand-carousel__logo">
          <span className="login-brand-carousel__logo-icon">H</span>
          <span>HIS-Link</span>
        </div>
      </div>

      <div className="login-brand-carousel__stage">
          <div
          className={`login-brand-carousel__illustration ${isVisible ? "is-visible" : "is-hidden"}`}
          key={activeSlide.id}
        >
          {activeSlide.illustration}
        </div>
        <div className="login-brand-carousel__float login-brand-carousel__float--1" />
        <div className="login-brand-carousel__float login-brand-carousel__float--2" />
      </div>

      <div className={`login-brand-carousel__bottom ${isVisible ? "is-visible" : "is-hidden"}`}>
        <h2 className="login-brand-carousel__title">{activeSlide.title}</h2>
        <p className="login-brand-carousel__description">{activeSlide.description}</p>
        <div className="login-brand-carousel__dots" role="tablist" aria-label="소개 슬라이드">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`${index + 1}번째 슬라이드`}
              className={`login-brand-carousel__dot ${index === activeIndex ? "is-active" : ""}`}
              onClick={() => {
                setIsVisible(false);
                setTimeout(() => {
                  setActiveIndex(index);
                  setIsVisible(true);
                }, FADE_DURATION_MS);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoginBrandCarousel;
