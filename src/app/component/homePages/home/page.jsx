"use client"; 
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import  {Banner}  from "../Banner";
import { ShopDiamondShape } from "../ShopDiamondShape";
import { SeeProducts } from "../SeeProducts";
import { ShopDiamondCotegory } from "../ShopDiamondCotegory";
import { BridalJewellery } from "../BridalJewellery";
import { AnniversaryRings } from "../AnniversaryRings";
import { CelebarteLove } from "../CelebarteLove";
import { WeddingCollection } from "../WeddingCollection";
import { EngagementBridal } from "../EngagementBridal";
import LoveBrilliance from "../LoveBrilliance";
import { AnniversaryRingFeatured } from "../AnniversaryRingFeatured";

export const HomePage = () => {
  const [shapeData, setShapeData] = useState([]);
  const [shopStyle, setShopStyle] = useState([]);
  const [homeContext, setHomeContext] = useState([]);
  const[homeAllSections, setHomeAllSections] = useState([])

  useMemo(() => {
    axios
      .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/diamondshape`)
      .then((res) => {
        setShapeData(res.data.data);
      })
      .catch(() => {
        console.log("API error");
      });
  }, []);


  useMemo(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/product-style`);
        setShopStyle(response.data.data);
      } catch (error) {
        console.log("shop style api error:", error);
      }
    };

    fetchData();
  }, []);

  useMemo(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/banners`
        );
        const data = response.data.data;

        setHomeContext(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useMemo(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/homecontent`
        );
        const data = response.data.data;

        setHomeAllSections(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // ============see products and wedding collection api start
  const [anniversaryRings, setAnniversaryRings] = useState();
  const [diamondPendants, setDiamondPendants] = useState()
  const [tennisBracelets, setTennisBracelets] = useState()
  const [diamondStuds, setDiamondStuds] = useState()
  useMemo(() => {
     axios
       .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/widget/Trellis Rings`)
       .then((res) => {
         setAnniversaryRings(res.data.data);
       })
       .catch((error) => {
         console.log(error);
       });
   }, []);
 
   useMemo(() => {
     axios
       .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/widget/Vintage Rings`)
       .then((res) => {
         setDiamondPendants(res.data.data);
       })
       .catch((error) => {
         console.log(error);
       });
   }, []);
 
   useMemo(() => {
     axios
       .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/widget/Eternity Rings`)
       .then((res) => {
         setTennisBracelets(res.data.data);
       })
       .catch((error) => {
         console.log(error);
       });
   }, []);
 
   useMemo(() => {
     axios
       .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/widget/Nature Inspired Rings`)
       .then((res) => {
         setDiamondStuds(res.data.data);
       })
       .catch((error) => {
         console.log(error);
       });
   }, []);


  const [engagementRings, setEngagementRings]= useState()
  const[weddingJewelry,setWeddingJewelry] = useState()
  const[weddingCollection, setWeddingCollection] =useState()
  useMemo(() => {
    axios
      .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/widget/Natural diamonds`)
      .then((res) => {
        setEngagementRings(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useMemo(() => {
    axios
      .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/widget/Gemstones`)
      .then((res) => {
        setWeddingJewelry(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useMemo(() => {
    axios
      .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/widget/Lab Grown Diamonds`)
      .then((res) => {
        setWeddingCollection(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);



  // ============see products and wedding collection api end
  const[siteInfo,setSiteInfo]= useState()
  useMemo(() => {
    axios
      .get(`http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1/siteinfo`)
      .then((res) => {
        setSiteInfo(res.data.data);
      })
      .catch(() => {
        console.log("profile API is not working");
      });
  }, []);

  
  return (
    <>
      <div className="home-page">
        <Banner homeContext={homeContext}/>
        <ShopDiamondShape shapeData={shapeData} />
        <SeeProducts anniversaryRings={anniversaryRings} diamondPendants={diamondPendants} tennisBracelets={tennisBracelets} diamondStuds={diamondStuds}/>
        <ShopDiamondCotegory shopStyle={shopStyle}/>
        <BridalJewellery home={homeAllSections}/>
        <AnniversaryRings/>
        <CelebarteLove home={homeAllSections}/>
        <WeddingCollection engagementRings={engagementRings} weddingJewelry={weddingJewelry} weddingCollection={weddingCollection}/>

        <EngagementBridal home={homeAllSections}/>

        <LoveBrilliance home={homeAllSections}/>
        
        <AnniversaryRingFeatured home={homeAllSections}/>
      </div>
    </>
  );
};
