import Link from "next/link";
import React, { useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const LoveBrilliance = ({home}) => {
  return (
    <section className="love-bri-section">
      <div className="container">
        <div
          className="loves-inner"
          style={{ backgroundImage: `url(https://assets.rocksama.com/frontend/images/love-ring-back.png)` }}
        >
          <div className="love-left-image desktop">
            <LazyLoadImage src={home.section5?.image_desktop} alt="brilliance" effect="blur" width="auto"  height="auto"  />
          </div>
          <div className="love-left-image mobile"
          style={{ backgroundImage: `url(https://assets.rocksama.com/frontend/images/love-ring-back.png)` }}
          >
            <LazyLoadImage src={home.section5?.image_desktop} alt="brilliance" effect="blur" width="auto"  height="auto"  />
          </div>

          <div className="love-right-content">
            <h4>{home.section5?.subheading}</h4>
            <h3>{home.section5?.heading}</h3>
            <p>
            {home.section5?.description}
            </p>

            <Link class="btn explore" href={`${home.section5?.link}`}>
            {home.section5?.btn_name}
            </Link>
          </div>
        </div>


        
      </div>
    </section>
  );
};

export default LoveBrilliance;
