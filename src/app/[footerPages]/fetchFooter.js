"use client";
import axios from "axios";
import DOMPurify from "dompurify";
import $ from "jquery";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Footer } from "../_componentStatic/Footer";
import Header from "../_componentStatic/Header";
import LoaderSpinner from "../_componentStatic/LoaderSpinner";
import Head from "next/head";

const ContactUs = ({ posts }) => {
  const [FooterData, setFooterData] = useState([]);
  const [loader, setLoader] = useState(false);
  const metaDescriptionLimit = 160;

  let router = useRouter();
  useEffect(() => {
    setFooterData(posts.data);
  }, [posts]);
  $(document).ready(function () {
    // Hide all accordion item bodies initially
    $(".accordion-item-body").hide();

    // Trigger a click event on the first accordion item header to open it by default
    $(".accordion-item-header:first")
      .addClass("active")
      .next(".accordion-item-body")
      .slideDown();

    // Toggle accordion item on click
    $(".accordion-item-header").click(function () {
      $(this).toggleClass("active");
      $(this).next(".accordion-item-body").slideToggle();
    });
  });

  const truncateMetaDescription = (description) => {
    if (description.length > metaDescriptionLimit) {
      return description.substring(0, metaDescriptionLimit) + "...";
    }
    return description;
  };
  const currentUrl = window.location.href;

  useEffect(() => {
    setTimeout(() => {
      const script = document.createElement("script");
      script.src = "//js.hsforms.net/forms/shell.js";
      document.body.appendChild(script);

      script.onload = () => {
        if (window.hbspt) {
          window.hbspt.forms.create({
            portalId: "45427602",
            formId: "7a5a4450-ae5b-494d-904a-6c9c111d96e5",
            target: "#request-ring-sizer",
          });
        }
      };
    }, 1000);
  }, [location.pathname]);
  return (
    <>
      <Header />
      <div className="container">
        <div className="footer-all-pages-display">
          {loader ? (
            <LoaderSpinner />
          ) : (
            FooterData.map((item) => {
              return (
                <>
                  {item.pages.map((innerItem) => {
                    return (
                      <>
                        {console.log(location.pathname)}
                        {location.pathname == "/" + innerItem.slug ? (
                          <>
                            <div
                              className={
                                item.name === "BRAND" ? innerItem?.slug : ""
                              }
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(innerItem.content),
                              }}
                            ></div>
                            {/* <Head>
                              <title>
                                {innerItem.title
                                  ? innerItem.title
                                  : innerItem.name}
                              </title>
                              <meta
                                name="description"
                                content={
                                  innerItem.meta_description
                                    ? truncateMetaDescription(
                                        innerItem.meta_description
                                      )
                                    : truncateMetaDescription(
                                        innerItem.description
                                      )
                                }
                              />
                              <meta
                                name="keywords"
                                content={
                                  innerItem.meta_keyword
                                    ? innerItem.meta_keyword
                                    : innerItem.keyword
                                }
                              />
                            </Head> */}
                          </>
                        ) : null}
                      </>
                    );
                  })}
                </>
              );
            })
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;
