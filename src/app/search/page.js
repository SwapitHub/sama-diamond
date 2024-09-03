"use client";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import $ from "jquery";
import Select from "react-select";
import debounce from "lodash.debounce";
import { IoIosClose } from "react-icons/io";
import { LazyLoadImage } from "react-lazy-load-image-component";
import secureLocalStorage from "react-secure-storage";
import { UserContext } from "../context/UserContext";
import { SearchSuggestion } from "../_componentStatic/SearchSuggestion";
import LoaderSpinner from "../_componentStatic/LoaderSpinner";
import Link from "next/link";
import Header from "../_componentStatic/Header";
import { Footer } from "../_componentStatic/Footer";

const SearchPage = () => {
  const {
    searching,
    setSearching,
    showSuggestion,
    setShowSuggestion,
    setShowSuggestionHeader,
    imgAssetsUrl,
  } = useContext(UserContext);
  const [searchData, setSearchData] = useState([]);
  const [priceShorting, setPriceShorting] = useState();
  const [searchedProductCount, setSearchedProductCount] = useState();
  const [shapeFilter, setShapeFilter] = useState([]);
  const [firstApiCall, setFirstApiCall] = useState(false);

  const options = [
    { value: "best_seller", label: "Best Sellers" },
    { value: "low_to_high", label: "Price (Low to High)" },
    { value: "high_to_low", label: "Price (High to Low)" },
  ];
  const { baseUrl,imgBaseUrl } = useContext(UserContext);
  const handlePriceChange = (selectedOption) => {
    setPriceShorting(selectedOption.value);
  };

  // ===========metal three color rose yellow white  =============================
  const white = "18k-white-gold";

  const [metalColor, setMetalColor] = useState([]);
  const [changeName, setChangeName] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [activePage, setActivePage] = useState([]);
  const [activeColor, setActiveColor] = useState({});
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [shapeData, setShapeData] = useState([]);
  const [ShopByStyle, setShopStyle] = useState([]);
  const [selectedMetalIds, setSelectedMetalIds] = useState([]);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [metalId, setMetalId] = useState([]);
  const [metalColorName, setMetalColorName] = useState();

  useMemo(() => {
    axios
      .get(`${baseUrl}/metalcolor`)
      .then((res) => {
        setMetalColor(res.data.data);
      })
      .catch(() => {
        console.log("API error");
      });
  }, []);

  const onChangeName = (value, id, slug) => {
    setChangeName({ value, id });
    setIsActive(!isActive);
    setActivePage(id);
    const updatedActiveColor = { ...activeColor };

    if (updatedActiveColor[id]) {
      updatedActiveColor[id] = value;
    } else {
      updatedActiveColor[id] = value;
    }

    setActiveColor(updatedActiveColor);
  };


  function commonMetalColor(idMetal) {
    $(
      ".all-pages-data, .all-img1.common-img, .main-common-active.all-card-four-colors > div"
    ).removeClass("active");
    $(".main-common-active > div").removeClass("metal-value-active");
    $(".main-common-active > div").removeClass("price-active active");
    $("." + idMetal).addClass("active");
    $(".metal-name-item-name." + idMetal).addClass("metal-value-active");
    $(".resultdata > div.all-pages-data").each(function (i, sdiv) {
      if ($(sdiv).find(".all-img1.common-img").hasClass("active")) {
        $(sdiv).addClass("active");
      }
    });
  }

  $(".resultdata > div.all-pages-data").each(function (i, odiv) {
    $(".dropdown-content .ss__list > .filter-ss-column > input").on("click", function () {
      var idMetal = $(this).attr("id");
      commonMetalColor(idMetal);

    });

    

    // if(metalColorName){
    // commonMetalColor(metalColorName);
    // }
    // onclick four color circle

    $(odiv)
      .find(".main-common-active > div")
      .click(function () {
        var index = $(this).index();
        $(odiv)
          .find(".outerDiv > a > .main-common-active.product-main-img > div")
          .removeClass("active");
        $(odiv).addClass("active");

        $(odiv)
          .find(".main-common-active > div.defaultImg")
          .removeClass("active")
          .eq(index)
          .addClass("active");

        $(odiv)
          .find(".outerDiv > a > div.main-common-active > div")
          .removeClass("active");

        $(odiv)
          .find(".outerDiv > a > div.main-common-active > div")
          .eq(index)
          .addClass("active");

        $(this).addClass("active");

        // Add 'metal-value-active' class to the corresponding .metal-name-item-name
        $(odiv)
          .find(".main-common-active .metal-name-item-name")
          .removeClass("metal-value-active");

        var metalNameItem = $(odiv).find(".metal-name-item-name").eq(index);
        metalNameItem.addClass("metal-value-active");

        // 'price-active' class from all price elements
        $(odiv)
          .find(".main-common-active .product-price")
          .removeClass("price-active");

        var priceElement;
        switch (index) {
          case 0:
            priceElement = $(odiv).find(".all-img1.product-price.defaultImg");
            break;
          case 1:
            priceElement = $(odiv).find(".all-img1.product-price.img-1");
            break;
          case 2:
            priceElement = $(odiv).find(".all-img1.product-price.img-2");
            break;
          case 3:
            priceElement = $(odiv).find(".all-img1.product-price.img-3");
            break;
          default:
            break;
        }

        priceElement.addClass("price-active");
      });
  });

  // ================

  // ==================== hover effect
  $(document).ready(function () {
    $(".resultdata > div.all-pages-data").each(function (i, odiv) {
      $(odiv)
        .find(".outerDiv > a .main-common-active > .all-card-four-color")
        .on("mouseenter", function () {
          var index = $(this).index();

          // Add class on hover

          $(odiv).addClass("hover-active");
          $(odiv)
            .find(".main-common-active .metal-name-item-name")
            .eq(index)
            .addClass("metal-hover-active");
          $(odiv)
            .find(".main-common-active > .product-price")
            .eq(index)
            .addClass("price-hover-active");

          $(odiv)
            .find(".main-common-active > .common-img")
            .eq(index)
            .addClass("common-img-hover-active");
        })
        .on("mouseleave", function () {
          var index = $(this).index();

          // Remove class on hover out
          $(odiv).removeClass("hover-active");
          $(odiv)
            .find(".main-common-active .metal-name-item-name")
            .eq(index)
            .removeClass("metal-hover-active");
          $(odiv)
            .find(".main-common-active > .product-price")
            .eq(index)
            .removeClass("price-hover-active");

          $(odiv)
            .find(".main-common-active > .common-img")
            .eq(index)
            .removeClass("common-img-hover-active");
        });
    });
  });

  // ======================metal three color rose yellow white end =============================

  // suggestion Api
  const [suggestionData, setSuggestionData] = useState([]);
  const [suggestion, setSuggestion] = useState();
  const handleSuggestion = (value) => {
    setSuggestion(value);
  };
  useMemo(() => {
    const delayedSuggestion = debounce(() => {
      axios
        .get(`${baseUrl}/search-suggestion?q=${suggestion}`)
        .then((res) => {
          setSuggestionData(res.data.data);
        })
        .catch(() => {
          console.log("API error");
        });
    }, 500);

    delayedSuggestion(); // Initial call to avoid empty suggestion on component mount

    return delayedSuggestion.cancel;
  }, [suggestion]);

  //search api
  const [searchValue, setSearchValue] = useState("");
  function handleSearch(value) {
    setSearchValue(value);
    setSearching(value);
    if (value.length < 1) {
      setShowSuggestion(false);
    } else {
      setShowSuggestion(true);
    }
  }
  const handleCheckboxChange = (itemName, metal) => {
    
    if (itemName == metalColorName) {
      setMetalId();
      setMetalColorName();
      setSelectedMetalIds([])
      commonMetalColor('White')
    } else {
      setMetalId(metal);
      setMetalColorName(itemName);
      setSelectedMetalIds([metal]);
    }
    secureLocalStorage.setItem("searchMetal", JSON.stringify([metal]));
  };

  const handleCheckboxChangeForStyle = (slug) => {
    setSelectedStyles((prevSlug) => {
      if (prevSlug.includes(slug)) {
        return prevSlug.filter((presentSlug) => presentSlug !== slug);
      } else {
        return [...prevSlug, slug];
      }
    });
  };

  const handleRemoveStyle = (slug) => {
    setSelectedStyles((prevSelectedStyles) =>
      prevSelectedStyles.filter((selectedStyle) => selectedStyle !== slug)
    );
  };
  const handleRemoveShape = (shape) => {
    setShapeFilter((prevSelectedStyles) =>
      prevSelectedStyles.filter((selectedShape) => selectedShape !== shape)
    );
  };
  const handleRemoveColor = (color) => {
    commonMetalColor('White')
    setMetalColorName("")
    setSelectedMetalIds([]);
  };
  const handleResetAll = () => {
    commonMetalColor("White");
    setSelectedStyles([]);
    setShapeFilter([]);
    setSelectedMetalIds([]);
    setMetalId([]);
    setMetalColorName('')
    secureLocalStorage.removeItem("searchShape");
    secureLocalStorage.removeItem("searchStyle");
    secureLocalStorage.removeItem("searchMetal");
  };

  const handleItemClick = (shape) => {
    setShapeFilter((prevSelectedShapes) => {
      if (prevSelectedShapes.includes(shape)) {
        return prevSelectedShapes.filter(
          (selectedShape) => selectedShape !== shape
        );
      } else {
        return [...prevSelectedShapes, shape];
      }
    });
  };

  useMemo(() => {
    const delayedSearch = debounce(() => {
      setLoading(true);
      axios
        .get(
          `${baseUrl}/search?q=${searching}&page=${page}${
            shapeFilter.length > 0
              ? `&shape=${shapeFilter ? shapeFilter : ""}`
              : ""
          }${
            selectedStyles.length > 0
              ? `&ring_style=${selectedStyles ? selectedStyles : ""}`
              : ""
          }${
            priceShorting
              ? `&sortby=${priceShorting == undefined ? "" : priceShorting}`
              : ""
          }`
        )
        .then((res) => {
          setSearchedProductCount(res.data);

          if (page > 1) {
            setSearchData((prevData) => [...prevData, ...res.data.data]);
            setLoading(false);
          } else {
            setSearchData(res.data.data);
          }

          setLoading(false);
          setFirstApiCall(true);
        })
        .catch(() => {
          console.log("API error");
          setLoading(false);
        });
    }, 200);
    delayedSearch();

    const timeoutColor = setTimeout(() => {
      if (metalColorName) {
        commonMetalColor(metalColorName);
      }
    }, 1500);

    return delayedSearch.cancel;
  }, [searching, page, shapeFilter, selectedStyles, priceShorting]);

  useEffect(() => {
    setPage(1);
  }, [shapeFilter, selectedMetalIds, selectedStyles, metalColorName]);

  //  scroll pagination start============
  useEffect(() => {
    const handleInfiniteScroll = debounce(() => {
      try {
        const scrollHeight = document.documentElement.scrollHeight;
        const scrollTop =
          document.documentElement.scrollTop || document.body.scrollTop;
        const clientHeight = document.documentElement.clientHeight;

        const totalPagesNeeded = Math.ceil(
          searchedProductCount?.product_count / 30
        );

        if (
          scrollTop + clientHeight >= 0.7 * scrollHeight &&
          page < totalPagesNeeded
        ) {
          setLoading(true);
          setPage((prev) => prev + 1);
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
    }, 100);
    if (page * 30 < searchedProductCount?.product_count) {
      window.addEventListener("scroll", handleInfiniteScroll);
    }
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [firstApiCall,loading]);

  //  =====================scroll pagination end===================

  // =============== shop by shape start ==============
  useMemo(() => {
    axios
      .get(`${baseUrl}/diamondshape`)
      .then((res) => {
        setShapeData(res.data.data);
      })
      .catch(() => {
        console.log("API error");
      });
  }, []);

  useMemo(() => {
    axios
      .get(`${baseUrl}/product-style`)
      .then((res) => {
        setShopStyle(res.data.data);
        // setActiveStyleIds(menuShapeName)
      })
      .catch(() => {
        console.log("shop style api error");
      });
  }, []);

  //secureLocalStorage Filters

  useEffect(() => {
    const metalsName = JSON.parse(secureLocalStorage.getItem("searchMetal"));
    const stylesName = JSON.parse(secureLocalStorage.getItem("searchStyle"));
    const shapesName = JSON.parse(secureLocalStorage.getItem("searchShape"));
    const searchedItem = JSON.parse(secureLocalStorage.getItem("searchedItem"));

    if (metalsName) {
      setSelectedMetalIds(metalsName);
    }
    if (stylesName) {
      setSelectedStyles(stylesName);
    }
    if (shapesName) {
      setShapeFilter(shapesName);
    }
    if (searchedItem) {
      setSearching(searchedItem);
    }
  }, []);

  useEffect(() => {
    const debounceUpdatesecureLocalStorage = debounce(() => {
      secureLocalStorage.setItem("searchMetal", JSON.stringify(selectedMetalIds));
      secureLocalStorage.setItem("searchStyle", JSON.stringify(selectedStyles));
      secureLocalStorage.setItem("searchShape", JSON.stringify(shapeFilter));
      secureLocalStorage.setItem("searchedItem", JSON.stringify(searching));
    }, 500);
    debounceUpdatesecureLocalStorage();

    return debounceUpdatesecureLocalStorage.cancel;
  }, [selectedMetalIds, selectedStyles, shapeFilter, searching]);


    // ============ meta tag  =======================//

    // const currentUrl = window.location.href;
    // const location = useLocation()
    // const pathSegments = location.pathname
    //   .split("/")
    //   .filter((segment) => segment);
    // const mainCategory = pathSegments[0] || "";


    const handleError =(e)=>{
      e.target.onerror = null;
      e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
    }
  return (

    <>
    <Header/>
    {/* <MetaTagCategoryPage mainCategory={mainCategory}  currentUrl={currentUrl}/> */}

      <div className="search-filter-sort-parent">
        <div className="searching-bar-field container">
          <input
            type="search"
            placeholder="Search Product"
            onClick={() => {
              setShowSuggestionHeader(false);
            }}
            onChange={(e) => handleSearch(e.target.value)}
            onKeyUp={(e) => handleSuggestion(e.target.value)}
            value={searching}
          />

          <button type="search">search</button>
        </div>
      </div>

      <div className="container choose-setting-pages-main">
        <div className="main-content choose-setting-pages">
          <div className="search-sort-filter">
            

            <div className="search-sort-category">
              <div className="search-on-hover">
                Metal{" "}
                {selectedMetalIds.length !== 0
                  ? `(${selectedMetalIds.length})`
                  : null}
                <div className="dropdown-content ss__options">
                  {metalColor.map((item) => {
                    return (
                      <div className="ss__list filter-groups">
                        <div className="filter-ss-column"  id={item.name}>
                          <input
                            type="checkbox"
                            id={item.name}
                            checked={selectedMetalIds.includes(item.id)}
                            onChange={() => handleCheckboxChange(item.name, item.id)}
                          />
                          <label htmlFor={item.name}>{item.name}</label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="search-sort-category">
              <div className="search-on-hover">
                Styles{" "}
                {selectedStyles.length !== 0
                  ? `(${selectedStyles.length})`
                  : null}
                <div className="dropdown-content ss__options">
                  {ShopByStyle.map((item) => {
                    return (
                      <div className="ss__list filter-groups">
                        <div className="filter-ss-column">
                          <input
                            type="checkbox"
                            id={`style-checkbox-${item.id}`}
                            checked={selectedStyles.includes(item.slug)}
                            onChange={() =>
                              handleCheckboxChangeForStyle(item.slug)
                            }
                          />
                          <label htmlFor={`style-checkbox-${item.id}`}>
                            {item.name}
                          </label>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            

            <div className="search-sort-category">
              <div className="search-on-hover">
                Shape{" "}
                {shapeFilter.length !== 0 ? `(${shapeFilter.length})` : null}
                <div className="dropdown-content ss__options">
                  {shapeData.map((item) => {
                    return (
                      <div className="ss__list filter-groups">
                        <div
                          className={`filter-ss-column ${
                            shapeFilter.includes(item.shape) ? "selected" : ""
                          }`}
                          onClick={() => handleItemClick(item.shape)}
                        >
                          <LazyLoadImage width="auto"  height="auto"    src={item.icon} alt={item.shape} onError={handleError}/>
                          <span >{item.shape}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            
          </div>
          <div className="best-seller-main">
            <span>{searchedProductCount?.product_count} Results</span>

            <div className="best-seller">
              <form>
                <label for="#">Sort : </label>
                <Select
                  placeholder="Best Seller"
                  onChange={handlePriceChange}
                  options={options}
                  isSearchable={false}
                />
              </form>
            </div>
          </div>

          <div
            className="show-suggestion-page"
            onMouseLeave={() => setShowSuggestion(false)}
          >
            {showSuggestion && (
              <SearchSuggestion
                suggestionData={suggestionData}
                suggestion={suggestion}
              />
            )}
          </div>
          <div className="bredCramStyleFilter">
            {selectedStyles.map((item) => (
              <div className="breadCram" key={item}>
                <Link href="#" onClick={() => handleRemoveStyle(item)}>
                  {item}{" "}
                  <span>
                    <IoIosClose />
                  </span>
                </Link>
              </div>
            ))}
            {shapeFilter.map((item) => (
              <div className="breadCram" key={item}>
                <Link href="#" onClick={() => handleRemoveShape(item)}>
                  {item}{" "}
                  <span>
                    <IoIosClose />
                  </span>
                </Link>
              </div>
            ))}
            {metalColorName &&
              <div className="breadCram" >
                <Link href="#" onClick={() => handleRemoveColor(metalColorName)}>
                  {metalColorName}{" "}
                  <span>
                    <IoIosClose />
                  </span>
                </Link>
              </div>
            }
            {(selectedStyles.length > 0 ||
              shapeFilter.length > 0 ||
              metalColorName) && (
              <div className="breadCram">
                <Link href="#" onClick={handleResetAll}>
                  Reset All{" "}
                  <span>
                    <IoIosClose />
                  </span>
                </Link>
              </div>
            )}
          </div>

          <div className="resultdata setings-Page-img">
            {searchData.length > 0 ? (
              searchData.map((item) => {
                

                return (
                  <div className="resultdata all-pages-data" key={item.id}>
                    <div className="outerDiv">
                      <Link
                        href={item.menu == "engagement-rings"
                          ? `/engagement-ring/${item.slug}?color=${activeColor[item?.id] || white}`
                          : item.menu == "wedding-band"
                          ? `/detail-wedding-band/${item.slug}?color=${activeColor[item?.id] || white}`
                          : "javascript:void(0);"}
                      >
                        <div className="main-common-active product-main-img">
                          <div className="all-img1 common-img defaultImg White">
                            <span className="common-stand-img-1">
                              <LazyLoadImage width="auto"  height="auto"   
                                src={item?.default_image_url}
                                alt={item.name}
                                onError={handleError}
                              />
                            </span>
                            <span className="common-stand-img white-stand-img">
                              <LazyLoadImage width="auto"  height="auto"   
                                src={`${imgBaseUrl}/${item.internal_sku}/${item.internal_sku}.side.jpg`}
                                alt={item.name}
                                onError={handleError}
                              />
                            </span>
                          </div>

                          <div className="all-img1 img-1 common-img Yellow">
                            <span className="common-stand-img-1">
                              <LazyLoadImage width="auto"  height="auto"   
                                src={`${imgBaseUrl}/${item.internal_sku}/${item.internal_sku}.alt.jpg`}
                                alt={item.name}
                                onError={handleError}
                              />
                            </span>
                            <span className="common-stand-img yellow-stand-img">
                              <LazyLoadImage width="auto"  height="auto"   
                                src={`${imgBaseUrl}/${item.internal_sku}/${item.internal_sku}.side.alt.jpg`}
                                alt={item.name}
                                onError={handleError}
                              />
                            </span>
                          </div>

                          <div className="all-img1 img-2 common-img Pink">
                            <span className="common-stand-img-1">
                              <LazyLoadImage width="auto"  height="auto"   
                                src={`${imgBaseUrl}/${item.internal_sku}/${item.internal_sku}.alt1.jpg`}
                                alt={item.name}
                                onError={handleError}
                              />
                            </span>
                            <span className="common-stand-img rose-stand-img">
                              <LazyLoadImage width="auto"  height="auto"   
                                src={`${imgBaseUrl}/${item.internal_sku}/${item.internal_sku}.side.alt1.jpg`}
                                alt={item.name}
                                onError={handleError}
                              />
                            </span>
                          </div>
                          <div className="all-img1 img-3 common-img Platinum">
                            <span className="common-stand-img-1">
                              <LazyLoadImage width="auto"  height="auto"   
                                src={item.default_image_url}
                                alt={item.name}
                                onError={handleError}
                              />
                            </span>
                            <span className="common-stand-img platinum-stand-img">
                              <LazyLoadImage width="auto"  height="auto"   
                                src={`${imgBaseUrl}/${item.internal_sku}/${item.internal_sku}.side.jpg`}
                                alt={item.name}
                                onError={handleError}
                              />
                            </span>
                          </div>
                        </div>

                        <div className="main-common-active all-card-four-colors ">
                          {metalColor.map((MetalColor, index) => (
                            <div
                            key={MetalColor.id}
                            className={`all-card-four-color ${MetalColor.name}${
                              (item.id === activePage &&
                                activeColor === MetalColor.slug) ||
                              MetalColor.slug == "18k-white-gold" ||
                              changeName == MetalColor.slug
                                ? " active"
                                : ""
                            }`}
                          >
                              <Link
                                href="#"
                                style={{
                                  background: MetalColor.color,
                                }}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  onChangeName(MetalColor.slug, item.id);
                                }}
                              ></Link>
                            </div>
                          ))}
                        </div>
                        <div className="main-common-active">
                          <div className="metal-name-by-default">
                            <span>{item.name}</span>
                          </div>
                          {metalColor.map((MetalValue, index) => (
                            <div
                              className={`metal-name-item-name ${MetalValue.name}`}
                              key={MetalValue.id}
                            >
                              <span id="metalValueSpan">
                                {MetalValue.value}
                              </span>
                              <span>{item.name}</span>
                            </div>
                          ))}
                        </div>

                        <div className="main-common-active">
                          <div className="all-img1 product-price defaultImg White">
                            $
                            {
                              Math.round(item.white_gold_price)}
                          </div>
                          <div className="all-img1 product-price img-1 Yellow">
                            $
                            {
                              Math.round(item.yellow_gold_price)}
                          </div>
                          <div className="all-img1 product-price img-2 Pink">
                            $
                            {
                              Math.round(item.rose_gold_price)}
                          </div>
                          <div className="all-img1 product-price img-3 Platinum">
                            $
                            {
                              Math.round(item?.platinum_price)}
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <h3 className="center">Data not found</h3>
            )}
          </div>
        </div>
      </div>
      <div>{loading && <LoaderSpinner />}</div>
      <Footer/>
    </>
  );
};

export default SearchPage;