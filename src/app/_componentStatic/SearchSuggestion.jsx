import React, { useContext } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
// import { Link } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
// import { UserContext } from "../../App";

export const SearchSuggestion = ({ suggestionData, suggestion }) => {
  const {
    setSearching,
    setShowSuggestion,
    setShowSuggestionHeader,
    imgAssetsUrl,
  } = useContext(UserContext);

  return (
    <>
      <div className="search-result-main">
        <div className="container">
          <div className="search-inner">
            <div className="search-top-content">
              <h5>Search Suggestions</h5>

              <div className="ss__autocomplete__terms__options">
                <ul className="search-list">
                  {suggestionData.map((item) => {
                    return (
                      <>
                        <li>
                          <Link
                            href="/search"
                            onClick={() => {
                              setSearching(item?.name);
                              setShowSuggestion(false);
                              setShowSuggestionHeader &&
                                setShowSuggestionHeader(false);
                              secureLocalStorage.setItem(
                                "searchedItem",
                                JSON.stringify(item?.name)
                              );
                            }}
                          >
                            {item?.name}
                          </Link>
                        </li>
                      </>
                    );
                  })}
                </ul>
              </div>
              <div className="search-product-list-parent">
                <h5>Product Suggestions</h5>
                <div className="search-product-list-main">
                  {suggestionData.map((item) => {
                    return (
                      <>
                        <div className="search-product-list">
                          <div className="search-product-list-left-img">
                            <LazyLoadImage
                              width="auto"
                              height="auto"
                              effect="blur"
                              src={item?.default_image_url}
                              alt={item?.name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                              }}
                            />
                          </div>
                          <div className="search-product-list-right-description">
                            <div className="ss__result__details__title">
                              <Link
                                href={
                                  item.menu == "engagement-rings"
                                    ? `/engagement-ring/${item.slug}?color=18k-white-gold`
                                    : item.menu == "wedding-band"
                                    ? `/detail-wedding-band/${item.slug}?color=18k-white-gold`
                                    : "javascript:void(0);"
                                }
                                onClick={() => {
                                  setSearching(item?.name);
                                  setShowSuggestion(false);
                                  setShowSuggestionHeader &&
                                    setShowSuggestionHeader(false);
                                }}
                              >
                                {item?.name}
                              </Link>
                              <div className="caption-price usd">
                                <span className="ss__currency-symbol">$</span>
                                {Math.round(item?.white_gold_price)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  })}

                  <div className="ss__autocomplete__content__info">
                    <Link
                      href="/search"
                      onClick={() =>
                        secureLocalStorage.setItem(
                          "searchedItem",
                          JSON.stringify(suggestion)
                        )
                      }
                    >
                      See more results for "{suggestion}"
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
