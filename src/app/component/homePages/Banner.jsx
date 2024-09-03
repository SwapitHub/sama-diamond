"use client";
import Link from "next/link";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Slider from "react-slick";

export const Banner = ({homeContext}) => {
  
console.log(homeContext);


  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };
  return (
    <>
      <section className="banner-section">
        <div className="container">
          <div className="common-row banner">
            <Slider {...settings}>
              {
               
               homeContext.map((item)=>{
                return(
                  <>
                  
                  <div className="banner-img-slider">
                  <div className="banner-ring-text-btn">
                  <h1>{item?.title}</h1>
                    <span>
                     {item?.subtitle}
                    </span>
                    <div className="banner-Rings">
                      <Link href="#"  className="button">
                      {item?.btn_name}
                      </Link>
                      
                    </div>
                  </div>
                  <LazyLoadImage src={item?.banner} alt={item?.btn_name}  width="auto"  height="auto"  />
                </div>
                  </>
                )        
              
                
              })
                
              }
             

              
            </Slider>
            
          </div>
        </div>
      </section>
    </>
  );
};
