import Link from "next/link";
import React from "react";

export const CelebarteLove = ({ home }) => {
  return (
    <>
      <section className="celebratre-love-sec">
        <div className="container">
          <div
            className="celebrate-inner"
            style={{
              backgroundImage: `url(${home.section2?.image})`,
            }}
          >
           <div className="celebrate-content mobile">
            <img src={home.section2?.image} alt="love" width="auto"  height="auto"  />
           </div>

              <div className="celebrate-content">
                <h3>{home.section2?.heading}</h3>
                <p>
                  {home.section2?.description}
                </p>
                <Link className="see-btn btn" href={`${home.section2?.link}`}>
                  {home.section2?.btn_name} {`>`}{" "}
                </Link>
              
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
