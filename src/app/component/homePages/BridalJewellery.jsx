import Link from "next/link";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const BridalJewellery = ({home}) => {
  return (
    <>
      <div className="menRings Bridal-Jewellery">
        <div className=" container">
          <div className="flex menRings-main">
            <div className="menRings-text">
              <h2>{home.section1?.heading}</h2>
              <p>
                {home.section1?.description}
              </p>
              <div>
                <Link
                  className="button"
                  href={`${home.section1?.link}`}
                >
                {home.section1?.btn_name}
                </Link>
              </div>
            </div>
            <div className="menRings-img">
              <LazyLoadImage
                src={home.section1?.image}
                alt="bridal"
              
              width="auto"  height="auto"  
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
