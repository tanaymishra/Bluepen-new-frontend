import React, { useEffect, useState } from "react";
import Image from "next/image";
import css from "@/styles/admin/dashboard.module.scss";
import { Shayaris } from "@/staticDatas/shayaris";

interface WeatherData {
  name?: string;
  main?: {
    temp: number;
    temp_max: number;
    temp_min: number;
    humidity: number;
  };
  weather?: [
    {
      main: string;
    }
  ];
  rain?: {
    "1h": number;
  };
}

interface CarouselCardProps {
  user: {
    firstname: string;
    lastname: string;
  };
  dashboard: {
    freelancerOfTheMonth?: {
      name: string;
      assignments: number;
    };
    pmOfTheMonth?: {
      name: string;
      associated: number;
    };
  };
}

const CarouselCard: React.FC<CarouselCardProps> = ({ user, dashboard }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const getRandomShayari = () => {
    const randomIndex = Math.floor(Math.random() * Shayaris.length);
    return Shayaris[randomIndex];
  };

  const [currentShayari, setCurrentShayari] = useState(getRandomShayari());

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = "4ac8b37a65a58c023b84ca558f00b590";
        const lat = 19.07609;
        const lon = 72.877426;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError("Failed to fetch weather data");
        console.error(err);
      }
    };

    fetchWeather();
  }, []);

  const slides = [
    {
      background: css.background1,
      image: "/assets/admin/dashboard/carousel/cloud.svg",
      cardContent: (
        <div className={css.card}>
          <div className={css.weatherDet}>
            <div className={css.place}>
              {/* {weatherData?.name} */}
              Bhandup
              <Image
                src="/assets/admin/dashboard/carousel/location.svg"
                alt="Weather"
                width={24}
                height={24}
              />
            </div>
            <div className={css.temp}>
              {weatherData?.main?.temp !== undefined &&
              !isNaN(weatherData.main.temp)
                ? `${Math.round(weatherData.main.temp)}°`
                : ""}
            </div>
          </div>

          <div className={css.weatherDet}>
            <Image
              src="/assets/admin/dashboard/carousel/sunSmall.svg"
              alt="Weather"
              width={24}
              height={24}
            />
            <div className={css.titCont}>
              {" "}
              {weatherData?.weather?.[0]?.main}
            </div>
            <div className={css.valCont}>
              {`H:${Math.round(
                weatherData?.main?.temp_max ?? 0
              )}° L:${Math.round(weatherData?.main?.temp_min ?? 0)}°`}
            </div>
          </div>

          <div className={css.weatherDet}>
            <Image
              src="/assets/admin/dashboard/carousel/humidity.svg"
              alt="Weather"
              width={24}
              height={24}
            />
            <div className={css.titCont}>{`Humidity`}</div>
            <div
              className={css.valCont}
            >{`${weatherData?.main?.humidity}%`}</div>
          </div>

          <div className={css.weatherDet}>
            <Image
              src="/assets/admin/dashboard/carousel/cloudRain.svg"
              alt="Weather"
              width={24}
              height={24}
            />
            <div className={css.titCont}>{`Precipitation`}</div>
            <div className={css.valCont}>
              {weatherData?.rain ? `${weatherData?.rain["1h"]} mm` : `0 mm`}
            </div>{" "}
          </div>
        </div>
      ),
    },
    {
      background: css.background2,
      image: "/assets/admin/dashboard/carousel/trophy.svg",
      cardContent: (
        <div className={css.card}>
          <div className={css.writerDet}>
            <div className={css.writerTitle}>{`Writer of the month`}</div>
            <div className={css.writerName}>
              {dashboard.freelancerOfTheMonth?.name}
            </div>
          </div>
          <div className={css.noOfAssign}>
            {dashboard.freelancerOfTheMonth?.assignments + ` Assignments`}
          </div>
        </div>
      ),
    },
    {
      background: css.background3,
      image: "/assets/admin/dashboard/carousel/pmMedal.svg",
      cardContent: (
        <div className={css.card}>
          <div className={css.pmDet}>
            <div className={css.pmTitle}>{`PM of the month`}</div>
            <div className={css.pmName}>{dashboard.pmOfTheMonth?.name}</div>
          </div>
          <div className={css.noOfConv}>
            {dashboard.pmOfTheMonth?.associated + ` Conversions`}
          </div>
        </div>
      ),
    },
    {
      background: css.background4,
      image: "/assets/admin/dashboard/carousel/shayari.svg",
      cardContent: (
        <div className={css.card}>
          <div className={css.shayariBox}>
            <div className={css.arz}>{`arz kiya hai`}</div>
            <div className={css.shayari}>{`"${currentShayari.quote}"`}</div>
            <div className={css.writerShayari}>{currentShayari.author}</div>
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const interval = setInterval(
      () => {
        setTransitioning(true);
        setTimeout(() => {
          setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
          setTransitioning(false);
        }, 500);
      },
      currentSlide === slides.length - 1 ? 10000 : 5000
    );

    return () => clearInterval(interval);
  }, [currentSlide, slides.length]);

  const handleDotClick = (index: number) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setTransitioning(false);
    }, 500);
  };

  return (
    <div className={css.carouselBox}>
      <div
        className={`${css.carouselContainer} ${slides[currentSlide].background}`}
      >
        <div className={css.welcomeBox}>
          <div className={css.head}>
            <div className={css.welcome}>{`Welcome,`}</div>
            <div className={css.userName}>
              {user?.firstname} {user?.lastname}
            </div>
          </div>
          <div className={css.imgSlide}>
            <Image
              src={slides[currentSlide].image}
              alt="Slide"
              width={24}
              height={24}
            />
          </div>
        </div>
        <div
          className={`${css.cards} ${
            transitioning ? css.slideOut : css.slideIn
          }`}
        >
          {slides[currentSlide].cardContent}
        </div>
      </div>
      <div className={css.carouselSlider}>
        {slides.map((_, index) => (
          <div
            key={index}
            className={`${css.dotLine} ${
              currentSlide === index ? css.fullWidth : ""
            }`}
            onClick={() => handleDotClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default CarouselCard;
