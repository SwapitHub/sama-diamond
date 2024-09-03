"use client";
import axios from "axios";
import debounce from "lodash.debounce";
import { useContext, useEffect, useMemo, useState } from "react";
import { AiOutlineHeart, AiOutlineSearch, AiOutlineUser } from "react-icons/ai";
import { BiDownArrow, BiPhoneCall, BiUpArrow } from "react-icons/bi";
import { BsBag, BsFillBellFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-use-history";
// import { Account } from "./Account";
// import { CartHover } from "./CartHover";
// import { OrderHistory } from "./OrderHistory";
// import { SearchSuggestion } from "./SearchSuggestion";
// import { WishlistHover } from "./WishlistHover";
import { TiArrowLeftThick } from "react-icons/ti";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Favicon from "react-favicon";
import secureLocalStorage from "react-secure-storage";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import { WishlistHover } from "./WishlistHover";
import { CartHover } from "./CartHover";
import { SearchSuggestion } from "./SearchSuggestion";
export const Header = () => {
  const [active, setActive] = useState(false);
  const [selected, setSelected] = useState(null);
  const {
    searching,
    setSearching,
    setShowSuggestion,
    setShowSuggestionHeader,
    showSuggestionHeader,
    baseUrl,
    imgAssetsUrl,
  } = useContext(UserContext);

  secureLocalStorage.setItem("searchedItem", JSON.stringify(searching));
  const ToggleClass = () => {
    setActive(!active);
  };

  useEffect(() => {
    if (active) {
      document.body.classList.add("navbar-popup-open");
    } else {
      document.body.classList.remove("navbar-popup-open");
    }
  }, [active]);

  const cartDetails = useSelector((state) => state.productDataCart);
  const wishListDataBase = useSelector((state) => state.productDataWishlist);

  const toggle = (id) => {
    setSelected(selected === id ? null : id);
  };

  const result = useSelector((state) => state.cartData);
  const wishlist = useSelector((state) => state.wishlistData);
  const dispatch = useDispatch();

  // ======
  // navbar
  const [searchData, setSearchData] = useState([]);

  const [navData, setNavData] = useState([]);
  useMemo(() => {
    axios
      .get(`${baseUrl}/menu`)
      .then((res) => {
        setNavData(res.data.data);
      })
      .catch(() => {
        console.log("API error");
      });
  }, []);

  // suggestion Api
  const [suggestion, setSuggestion] = useState();
  const [suggestionData, setSuggestionData] = useState([]);

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
    }, 500); // Adjust the debounce delay according to your preference

    delayedSuggestion(); // Initial call to avoid empty suggestion on component mount

    return delayedSuggestion.cancel; // Cleanup function
  }, [suggestion]);
  //search api
  const [searchValue, setSearchValue] = useState("");
  function handleSearch(value) {
    setShowSuggestionHeader(true);

    setSearchValue(value);
    setSearching(value);

    if (value.length < 1) {
      setShowSuggestionHeader(false);
    } else {
      setShowSuggestionHeader(true);
    }
  }
  useMemo(() => {
    const delayedSearch = debounce(() => {
      axios
        .get(`${baseUrl}/search?q=${searching}`)
        .then((res) => {
          setSearchData(res.data.data);
        })
        .catch(() => {
          console.log("API error");
        });
    }, 500); // Adjust the debounce delay according to your preference

    delayedSearch(); // Initial call to avoid empty search on component mount

    return delayedSearch.cancel; // Cleanup function
  }, [searchValue, searching]);
  // search end here

  const [hovered, setHovered] = useState(false);
  const [wishHovered, setWishHovered] = useState(false);
  const [bag, setBag] = useState(false);
  function handleWish() {
    setWishHovered(true);
    setShowSuggestionHeader(false)
    setActive(false);
  }
  function handleMouse() {
    setHovered(true);
    setShowSuggestionHeader(false)
    setActive(false);
  }
  function handleBag() {
    setBag(true);
    setShowSuggestionHeader(false)
    setActive(false);
  }
  // =========
  const updateSearchValue = (value) => {
    setSearchValue(value);
  };

  const userId = secureLocalStorage.getItem("formData");
  const [profileData, setProfileData] = useState();

  useMemo(() => {
    axios
      .get(`${baseUrl}/user-account?user_id=${userId}`)
      .then((res) => {
        setProfileData(res.data);
      })
      .catch(() => {
        console.log("profile API is not working");
      });
  }, []);

  useEffect(() => {
    setActive(false);
  }, [window.location.pathname]);

  const [siteInfo, setSiteInfo] = useState();
  useEffect(() => {
    axios
      .get(`${baseUrl}/siteinfo`)
      .then((res) => {
        setSiteInfo(res.data.data);
      })
      .catch(() => {
        console.log("profile API is not working");
      });
  }, []);

  // meta detail start
  // const currentUrl = window.location.href;

  // useEffect(() => {
  //   const metaTags = document.getElementsByTagName("meta");
  //   Array.from(metaTags).forEach((tag) => {
  //     if (tag.getAttribute("name") === "description") {
  //       tag.setAttribute("content", siteInfo?.meta_description || "");
  //     }
  //     // if (tag.getAttribute('name') === 'keywords') {
  //     //   tag.setAttribute('content', siteInfo?.meta_keyword || '');
  //     // }
  //     if (tag.getAttribute("property") === "og:title") {
  //       tag.setAttribute("content", siteInfo?.meta_title || "");
  //     }
  //     if (tag.getAttribute("property") === "og:description") {
  //       tag.setAttribute("content", siteInfo?.meta_description || "");
  //     }
  //     if (tag.getAttribute("property") === "og:url") {
  //       tag.setAttribute("content", currentUrl || "");
  //     }
  //     if (tag.getAttribute("property") === "og:image") {
  //       tag.setAttribute("content", siteInfo?.logo || "");
  //     }
  //   });
  // }, [siteInfo, currentUrl]);

  // useEffect(() => {
  //   if (siteInfo?.meta_title) {
  //     document.title = siteInfo?.meta_title;
  //   }
  // }, [siteInfo]);

  return (
    <>
      {/* {siteInfo && siteInfo.favicon && <Favicon url={siteInfo?.favicon} />} */}
      <header className="header">
        <div className="container">
          <div
            className={`header-top ${
              location.pathname == "/check_out" ||
              location.pathname == "/payment"
                ? "active"
                : ""
            } ${location.pathname == "/success" ? "success-active" : ""}`}
          >
            <div className="header-contact-us ">
              <Link href="/contact-us">
                Contact Us
                <span>
                  <img
                    width="auto"
                    height="auto"
                    src={`${imgAssetsUrl}/frontend/images/call.png`}
                    alt="call"
                  />
                </span>
              </Link>
            </div>

            <div className="header-logo">
              <Link href="/">
                <LazyLoadImage
                  width="auto"
                  height="auto"
                  // effect="blur"
                  src={siteInfo?.logo}
                  alt="samaLogo"
                />
              </Link>
            </div>

            <div className="header-icons">
              <div className="bell-icon">
                <Link href="javascript:void(0);">
                  <BsFillBellFill />
                  <span>01</span>
                </Link>
              </div>
              <div className="search-icon">
                <Link href="javascript:void(0);" onClick={ToggleClass}>
                  <AiOutlineSearch />
                </Link>
                <input
                  className={active ? "search-open" : "search-close"}
                  type="text"
                  placeholder="Search Product"
                  onClick={() => {
                    setShowSuggestion(false);
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyUp={(e) => handleSuggestion(e.target.value)}
                  value={searching}
                />
                <div
                  className="show-suggestion-page"
                  onMouseLeave={() => setShowSuggestionHeader(false)}
                >
                  {showSuggestionHeader && (
                    <SearchSuggestion
                      suggestionData={suggestionData}
                      suggestion={suggestion}
                    />
                  )}
                </div>
              </div>
              <div className="bag-icon" onMouseOver={handleBag}>
                <Link
                  href="javascript:void(0)"
                  className={`bag-msgheader ${
                    (userId && cartDetails?.length > 0) ||
                    (!userId && result.length > 0)
                      ? ""
                      : "bag-active"
                  } `}
                >
                  {userId && cartDetails?.length > 0 ? (
                    <span className="msg-box">{cartDetails?.length}</span>
                  ) : !userId && result.length > 0 ? (
                    <span className="msg-box">{result?.length}</span>
                  ) : null}

                  <Link href={"/cart"}>
                    <BsBag />
                  </Link>
                </Link>
                <CartHover />
              </div>

              <div className="header-heart-icon" onMouseOver={handleWish}>
                <Link
                  href="javascript:void(0)"
                  className={`whishlist-msg ${
                    (userId && wishListDataBase.length > 0) ||
                    (!userId && wishlist.length > 0)
                      ? ""
                      : "bag-active"
                  }`}
                >
                  {userId && wishListDataBase.length > 0 ? (
                    <span className="msg-box">{wishListDataBase?.length}</span>
                  ) : !userId && wishlist.length > 0 ? (
                    <span className="msg-box">{wishlist?.length}</span>
                  ) : null}

                  <Link href={"/wishlist"}>
                    <AiOutlineHeart />
                  </Link>
                </Link>
                <WishlistHover />
              </div>
              <div className="user-icon" onMouseOver={handleMouse}>
                <Link href={userId ? "/accounts" : "/login"}>
                  <span className="use-name-login">
                    {userId &&
                      `${
                        profileData?.userdata?.first_name
                          ? `Hi, ${profileData?.userdata?.first_name}`
                          : ""
                      }`}
                  </span>
                  <AiOutlineUser />
                </Link>

                {/* {hovered && userId ? <OrderHistory /> : <Account />} */}
              </div>
            </div>
          </div>

          <nav className="nav">
            <ul>
              {navData.map((res) => {
                var urlslug = "";

                return (
                  
                    <li className={res.slug} key={res?.id}>
                      <Link
                        href={
                          res.slug == "gemstones"
                            ? `gemstone`
                            : res.slug == "diamonds"
                            ? `diamond`
                            : res.slug
                        }
                      >
                        {res.name}
                      </Link>
                      <div className="engagement-ring flex">
                        {res.categories?.map((catRes) => {
                          return (
                           
                              <ul>
                                <li key={catRes?.id}>
                                  <Link
                                    href={`${
                                      res.name === "BRAND"
                                        ? catRes.slug
                                        : "javascript:void(0)"
                                    }`}
                                    style={{
                                      cursor:
                                        res.name === "BRAND"
                                          ? "pointer"
                                          : "text",
                                    }}
                                  >
                                    {catRes.name}
                                  </Link>
                                </li>

                                {catRes.subcategories.map((subRes) => {
                                  return (
                                   
                                      <li key={subRes?.id}>
                                        {subRes.image ? (
                                          <i>
                                            <img
                                              width="auto"
                                              height="auto"
                                              src={subRes.image}
                                              alt={subRes.name}
                                            />
                                          </i>
                                        ) : null}
                                        <Link href={`${subRes.alias}`}>
                                          {subRes.name}
                                        </Link>
                                      </li>
                                   
                                  );
                                })}
                              </ul>
                           
                          );
                        })}
                      </div>
                    </li>
                 
                );
              })}
            </ul>
          </nav>
          {/* ===============================================header mobile device start ===================================================== */}

          <div
            className={
              active ? "mobile-nav-main nav-mobile" : "res-nav-main nav-mobile"
            }
          >
            <div
              onClick={ToggleClass}
              className={
                active ? "navabar-icons close-icons" : "navabar-icons2"
              }
            >
              <svg
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_895_16684)">
                  <path
                    d="M12.25 10.25H3.95312"
                    stroke="white"
                    stroke-width="1.28125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.0469 5.125H3.95312"
                    stroke="white"
                    stroke-width="1.28125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.75 15.375H3.95312"
                    stroke="white"
                    stroke-width="1.28125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_895_16684">
                    <rect
                      width="20.5"
                      height="20.5"
                      fill="white"
                      transform="translate(0.75)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div
              onClick={ToggleClass}
              className={
                active ? "navabar-icons2 " : "navabar-icons HamburgerMenu-icons"
              }
            >
              <svg
                width="22"
                height="21"
                viewBox="0 0 22 21"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_895_12547)">
                  <path
                    d="M12.25 10.25H3.95312"
                    stroke="black"
                    stroke-width="1.28125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M18.0469 5.125H3.95312"
                    stroke="black"
                    stroke-width="1.28125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M7.75 15.375H3.95312"
                    stroke="black"
                    stroke-width="1.28125"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_895_12547">
                    <rect
                      width="20.5"
                      height="20.5"
                      fill="white"
                      transform="translate(0.75)"
                    />
                  </clipPath>
                </defs>
              </svg>
            </div>

            <nav className={active ? "mobile-nav allnav" : "res-nav allnav"}>
              <div
                className={
                  selected
                    ? "contents-show-main allnav-menu"
                    : "contents-main allnav-menu"
                }
              >
                <ul>
                  {navData.map((item) => (
                    <li
                      key={item?.id}
                      className={`title ${item.slug}}`}
                      onClick={() => toggle(item.id)}
                    >
                      <Link href="javascript:void(0)">{item.name}</Link>
                      <span>
                        {selected === item.id ? <BiUpArrow /> : <BiDownArrow />}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {navData.map((item) => (
                <div
                  key={item?.id}
                  className={
                    selected === item.id
                      ? `content-show main-content ${item.slug}`
                      : `content main-content ${item.slug}`
                  }
                >
                  <ul>
                    <li className="title" onClick={() => toggle(item.id)}>
                      <Link href="javascript:void(0)">
                        <span>
                          <TiArrowLeftThick />
                        </span>{" "}
                        Back
                      </Link>
                      <span>
                        {selected === item.id ? <BiUpArrow /> : <BiDownArrow />}
                      </span>
                    </li>
                    {item.categories && (
                      <div className="engagement-ring flex">
                        <Link
                          href={
                            item.slug == "gemstones"
                              ? `gemstone`
                              : item.slug == "diamonds"
                              ? `diamond`
                              : item.slug
                          }
                        >
                          {item.name}
                        </Link>
                        {item.categories.map((catItem, index) => (
                          <ul>
                            <li key={catItem?.id}>
                              <Link
                                 href={`${
                                  item.name === "BRAND"
                                    ? catItem.slug
                                    : "javascript:void(0)"
                                }`}
                                style={{
                                  cursor:
                                    item.name === "BRAND" ? "pointer" : "text",
                                }}
                                onClick={ToggleClass}
                              >
                                {catItem.name}
                              </Link>
                            </li>
                            {catItem.subcategories.map((subItem, index) => {
                              return (
                               
                                  <li key={subItem?.id}>
                                    {subItem.image ? (
                                      <i>
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={subItem.image}
                                          alt={subItem?.name}
                                        />
                                      </i>
                                    ) : null}
                                    <Link
                                      onClick={ToggleClass}
                                      href={`${subItem.alias}`}
                                    >
                                      {subItem.name}
                                    </Link>
                                  </li>
                               
                              );
                            })}
                          </ul>
                        ))}
                      </div>
                    )}
                  </ul>
                </div>
              ))}
            </nav>
            <div className="nav-mobile-logo">
              <Link href="/" onClick={active === true ? ToggleClass : undefined}>
                <LazyLoadImage
                  width="auto"
                  height="auto"
                  src={siteInfo?.logo}
                  alt="samaLogo"
                />
              </Link>
            </div>
            <div className="nav-mobile-icons">
              <div className="call-icon">
                <Link
                  href="/contact-us"
                  onClick={active === true ? ToggleClass : undefined}
                >
                  <BiPhoneCall />
                </Link>
              </div>

              <div className="bag-icon">
                <Link
                  href="/cart"
                  onClick={active === true ? ToggleClass : undefined}
                >
                  <BsBag />
                </Link>
              </div>
              <div className="header-heart-icon" onMouseOver={handleWish}>
                <Link
                  href="javascript:void(0)"
                  className={`whishlist-msg ${
                    (userId && wishListDataBase.length > 0) ||
                    (!userId && wishlist.length > 0)
                      ? ""
                      : "bag-active"
                  }`}
                >                  

                  <Link href={"/wishlist"}>
                    <AiOutlineHeart />
                  </Link>
                </Link>
                <WishlistHover />
              </div>
              <div className="user-icon" onMouseOver={handleMouse}>
                <Link href={userId ? "/accounts" : "/login"}>
                  <AiOutlineUser />
                </Link>

                {/* {hovered && userId ? <OrderHistory /> : <Account />} */}
              </div>
            </div>
            <div className="header-search">
              <form action="javascript:void(0);">
                <input
                  className={active ? "search-open" : "search-close"}
                  type="text"
                  placeholder="Search Product"
                  onClick={() => {
                    setShowSuggestion(false);
                  }}
                  onChange={(e) => handleSearch(e.target.value)}
                  onKeyUp={(e) => handleSuggestion(e.target.value)}
                  value={searching}
                />
                
              </form>
              <div className="search-icon">
                <Link href="/search">
                  <AiOutlineSearch />
                </Link>
              </div>
            </div>
          </div>
          {/* =============================================== header mobile device start ===================================================== */}
        </div>
      </header>
    </>
  );
};
export default Header;
