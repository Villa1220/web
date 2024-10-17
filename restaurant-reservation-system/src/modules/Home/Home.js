import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Navigation, EffectCoverflow, Pagination, Autoplay } from 'swiper/modules'; 
import './Home.css';
import image1 from '../../images/image1.png';
import image2 from '../../images/image2.png';
import image3 from '../../images/image3.png';
import image4 from '../../images/image4.png';
import image5 from '../../images/image5.png';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Bienvenido a la Ruta del Sabor</h1>
      <p className="home-description">
        Descubre nuestra variedad de platos y realiza tu reserva de manera sencilla.
      </p>

      <Swiper
        effect="coverflow"
        grabCursor={true}
        centeredSlides={true}
        slidesPerView="auto"
        coverflowEffect={{
          rotate: 0,
          stretch: 0,
          depth: 200,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: true }}
        navigation={true}
        autoplay={{
          delay: 3000, 
          disableOnInteraction: false, 
        }}
        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]} 
        className="swiper-container"
      >
        <SwiperSlide>
          <img src={image1} alt="Plato 1" className="carousel-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image2} alt="Plato 2" className="carousel-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image3} alt="Plato 3" className="carousel-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image4} alt="Plato 4" className="carousel-image" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={image5} alt="Plato 5" className="carousel-image" />
        </SwiperSlide>
      </Swiper>
    </div>
  );
};

export default Home;
