import axios from "axios";
import Link from "next/link";
import React, {  useEffect, useMemo, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";

export const AnniversaryRings = () => {
  const [homeAllSections, setHomeAllSections] = useState([]);
  useMemo(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/homecontent`);
        const data = response.data.data;

        setHomeAllSections(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  return (
    <>
      <div className="ShopCategory ShopDiamondCotegory Anniversary Rings">
        <div className="container">
          <h3>Shop by Style</h3>

          <div className="flex-container">
            <div className="flex">
              {homeAllSections?.shopbycategory?.map((item,i) => {
                return (
                 
                    <div className="column-width" key={i}>
                      <Link href={item.link}>
                        <div className="ShopCategory-img">
                          <LazyLoadImage
                            src={item?.image}
                            alt={item?.title}
                            width="auto"  height="auto"  
                          />
                        </div>
                        <h4>{item?.title}</h4>
                      </Link>
                    </div>
                
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
