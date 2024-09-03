import React from "react";
import DOMPurify from "dompurify";
import Link from "next/link";

export const WeddingCollection = ({engagementRings,weddingJewelry,weddingCollection}) => {
  
    
  return (
    <section className="own-engagment gemstone WeddingCollection">
      <div className="container">
        <div className="inner-own-eng">
          <div className="heading-sec"></div>
          <div className="ring-grid-sec">
            <div className="grid-wrapper-bar">
              <Link href={`${engagementRings?.url}`}>
                <div className="img-bar">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(engagementRings?.description),
                    }}
                  ></div>
                </div>
                <div className="contant-bar">
                  <h5>Natural diamonds</h5>
                </div>
              </Link>
            </div>
            <div className="grid-wrapper-bar">
              <Link href={`${weddingJewelry?.url}`}>
                <div className="img-bar">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(weddingJewelry?.description),
                    }}
                  ></div>
                </div>
                <div className="contant-bar">
                  <h5>Gemstones</h5>
                </div>
              </Link>
            </div>
            <div className="grid-wrapper-bar">
              <Link href={`${weddingCollection?.url}`}>
                <div className="img-bar">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: DOMPurify.sanitize(weddingCollection?.description),
                    }}
                  ></div>
                </div>
                <div className="contant-bar">
                  <h5>Lab Grown Diamonds</h5>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
