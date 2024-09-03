import Link from "next/link";
import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

export const AnniversaryRingFeatured = ({home}) => {
  return (
    <section className="AnniversaryRing-main own-engagment education p-t">
      <div className="container">
        <div className="inner-own-eng gemstone">
          <div className="heading-sec">
            <h3 className="heading-text" style={{ color: "#310F4C" }}>
            The SAMA Difference <span>Featured</span>
            </h3>
          </div>
          <div className="ring-grid-sec">
            <div className="grid-wrapper-bar">
              <div className="img-bar">
                <LazyLoadImage src={home.section6?.image1} alt={home.section6?.image1_alt} width="auto"  height="auto"  />
              </div>
              <div className="contant-bar">
                <h3>{home.section6?.heading1}</h3>
                <p>
                {home.section6?.description1}
                </p>
                <Link href={`${home.section6?.btn_link}`}>{home.section6?.btn_name}</Link>
              </div>
            </div>
            <div className="grid-wrapper-bar">
              <div className="img-bar">
                <LazyLoadImage src={home.section6?.image2} alt={home.section6?.image2_alt} width="auto"  height="auto"  />
              </div>
              <div className="contant-bar">
                <h3>{home.section6?.heading2}</h3>
                <p>
                {home.section6?.description2}

                </p>
                <Link href={`${home.section6?.btn_link2}`}>{home.section6?.btn_name}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
