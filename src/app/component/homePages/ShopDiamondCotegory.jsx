import Link from "next/link";
import React, { useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import SlickSlider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export const ShopDiamondCotegory = ({shopStyle}) => {
  
  const ShopStyleSliderOuter = {
    dots: false,
    infinite: true,
    speed: 700,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 2000,
  };
  return (
    <>
      <div className="ShopCategory ShopDiamondCotegory">
        <div className="container">
          <h3>Shop Engagement Ring Settings</h3>
          <div className="slider-flex-category desktop">
            <SlickSlider
              {...ShopStyleSliderOuter}
              responsive={[
                {
                  breakpoint: 991,
                  settings: {
                    slidesToShow: 5,
                    slidesToScroll: 3,
                    infinite: true,
                  },
                },
               

                
              ]}
            >
              {shopStyle.map((item) => {
                return (
                  <div class="column-width" key={item?.id}>
                    <Link href={`/engagement-rings/style/${item.slug}`}>
                      <div className="ShopCategory-img">
                        <LazyLoadImage src={item.image} alt={item.name}  width="auto"  height="auto"  />
                      </div>
                      <h4>{item.name}</h4>
                    </Link>
                  </div>
                );
              })}
            </SlickSlider>

            
          </div>
          <div className="slider-flex-category mobile">
          
           
              {shopStyle.map((item) => {
                return (
                  <div class="column-width" key={item?.id}>
                    <Link href={`/engagement-rings/start-with-a-setting?style=${item.slug}`}>
                      <div className="ShopCategory-img">
                        <LazyLoadImage src={item.image} alt={item.name}  width="auto"  height="auto"  />
                      </div>
                      <h4>{item.name}</h4>
                    </Link>
                  </div>
                );
              })}
            

            
          </div>
        </div>
      </div>
    </>
  );
};
