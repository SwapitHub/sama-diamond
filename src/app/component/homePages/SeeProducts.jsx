import DOMPurify from "dompurify";
import Link from "next/link";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

export const SeeProducts = ({anniversaryRings,diamondPendants,tennisBracelets,diamondStuds}) => {
 
  return (
    <section className="see-products-main">
      <div className="container">
        <div className="common-row see-products">
          <div className="see-products-img">
            <Link href={`${anniversaryRings?.url}`} className="See-Products">
              <span>Trellis Rings</span>
              <span> See Products <MdOutlineKeyboardArrowRight /> </span>
            </Link>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(anniversaryRings?.description),
              }}
            ></div>
          </div>
          <div className="see-products-img">
            <Link href={`${diamondPendants?.url}`} className="See-Products">
              <span>Vintage Rings</span>
              <span> See Products <MdOutlineKeyboardArrowRight /> </span>
            </Link>

            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(diamondPendants?.description),
              }}
            ></div>
          </div>
          <div className="see-products-img">
            <Link href={`${tennisBracelets?.url}`} className="See-Products">
              <span>
              Eternity Rings
              </span>
              <span> See Products <MdOutlineKeyboardArrowRight /> </span>
            </Link>

            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(tennisBracelets?.description),
              }}
            ></div>
          </div>
          <div className="see-products-img">
            <Link href={`${diamondStuds?.url}`} className="See-Products">
              <span>Nature Inspired Rings</span>
              <span> See Products <MdOutlineKeyboardArrowRight /> </span>
            </Link>

            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(diamondStuds?.description),
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};
