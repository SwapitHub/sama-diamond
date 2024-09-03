"use client";
import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { VscChromeClose } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { addToCart} from "../../../store/actions/cartActions";
// import { MetaTagCategoryPage } from "../../seoTags/MetaTagCategoryPage";
// import { ContinueShoping } from "../AllRings/reusable_components/ContinueShoping";
import { productList, productListCart } from "../../../store/actions/productActions";
import { validateEmail } from "../_componentStatic/ValidationFunctions";
import { removeToWishlist } from "../../../store/actions/wishlistAction";
import { UserContext } from "../context/UserContext";
import Link from "next/link";
import Header from "../_componentStatic/Header";
import { Footer } from "../_componentStatic/Footer";

const WishList = () => {
  const white = "18k-white-gold";
  const yellow = "18k-yellow-gold";
  const rose = "18k-rose-gold";
  const platinum = "platinum";
  let engagementRingShown = false;
  const all = "all";
  const gemstone = "gemstone";
  const ring = "ring";
  const diamond = "diamond";
  const matchingSet = "matching_set";
  const [activeWishList, setActiveWishList] = useState(all);
  const [shapeData, setShapeData] = useState();
  const [removeWishList, setRemoveWishList] = useState();
  const [newsLetterEmail, setNewsletterEmail] = useState([]);
  const [newsLetterResult, setNewsLetterResult] = useState("");

  const { baseUrl, imgBaseUrl, imgAssetsUrl } = useContext(UserContext);

  function validateWhishList() {
    validateEmail(
      document.getElementById("whishlist-email").value,
      "whishlist-email",
      "Email Address"
    );
  }

  const wishlist = useSelector((state) => state.wishlistData);
  const dispatch = useDispatch();
  function handleWishlistData(item, product_type, type_diamond) {
    dispatch(
      addToCart({
        ...item.removingItem,
        product_type,
        diamond_type: type_diamond,
        ring_size: item.ring_size,
      })
    );
    dispatch(removeToWishlist(item));
  }

  function handleWishlistDataGemstonesAndBand(item) {
    dispatch(addToCart(item));
    dispatch(removeToWishlist(item));
  }

  function handleWishlistDataDiamond(item) {
    dispatch(addToCart(item));
    dispatch(removeToWishlist(item));
  }

  const handleWishList = (item) => {
    setActiveWishList(item);
  };

  function handleRing(item) {
    dispatch(removeToWishlist(item));
  }

  function handleDiamond(item) {
    dispatch(removeToWishlist(item));
  }

  function handleGemstoneAndBand(item) {
    dispatch(removeToWishlist(item));
  }

  function handleDiamondRing(item) {
    dispatch(removeToWishlist(item));
  }

  function handleGemRing(item) {
    dispatch(removeToWishlist(item));
  }

  const wishListDataBase = useSelector((state) => state.productDataWishlist);

  // =======================
  const userId = secureLocalStorage.getItem("formData");

  // ========================end
  useEffect(() => {
    axios
      .get(
        "http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/csrf-token"
      )
      .then((res) => {
        setShapeData(res.data.csrf_token);
      })
      .catch((error) => {
        console.log("CSRF Token API Error:", error);
      });
  }, []);
  // =============

  //   =======

  const removeWishlistItem = (wish_list_id, ring_id) => {
    wishlist?.map((item) => {
      if (ring_id === (item.item?.id || item.diamonds?.id)) {
        dispatch(removeToWishlist(item));
      }
    });
    setRemoveWishList(wish_list_id);
  };
  const removeWishlistItemWishlist = (wish_list_id, ring_id) => {
    wishlist?.map((item) => {
      if (ring_id === (item.item?.id || item.diamonds?.id)) {
        dispatch(removeToWishlist(item));
      }
    });
    setRemoveWishList(wish_list_id);
  };
  // =======remove to card
  useMemo(() => {
    axios
      .get(`${baseUrl}/remove_wishlist_item/${removeWishList}`)
      .then((res) => {
        dispatch(productListt());
      })
      .catch((error) => {
        console.log("CSRF Token API Error:", error);
      });
  }, [removeWishList]);
  // ==================

  const [disableButton, setDisableButton] = useState(false);
  const handleCreateAccount = async (
    ring_price,
    ring_id,
    ring_data,
    ring_img,
    ring_color,
    diamond_id,
    diamondItem,
    diamond_price,
    gemstone_id,
    gemstone_price,
    gemstoneItem,
    userId,
    ring_size,
    diamond_type,
    ring_type,
    product_type,
    gemstone_stock_no,
    diamond_stock_no,
    textEngraving,
    font_style
  ) => {
    setDisableButton(true);
    const formData = {
      user_id: userId,
      gemstone_id: gemstone_id,
      gemstone_price: gemstone_price,
      ring_id: ring_id,
      ring_color: ring_color,
      ring_price: ring_price,
      diamond_id: diamond_id,
      diamond_price: diamond_price,
      img_sku: ring_img,
      ring_size: ring_size,
      diamond_type: diamond_type,
      ring_type: ring_type,
      product_type: product_type,
      gemstone_stock_no: gemstone_stock_no,
      diamond_stock_no: diamond_stock_no,
      textEngraving: textEngraving,
      font_style: font_style,
    };

    secureLocalStorage.setItem("cart_data", JSON.stringify(formData));

    const API_URl = `${baseUrl}/cart?user_id=${formData.user_id}&gemstone_id=${
      formData.gemstone_id
    }&gemstone_price=${formData.gemstone_price}&ring_id=${
      formData.ring_id
    }&ring_color=${formData.ring_color}&diamond_id=${
      formData.diamond_id
    }&diamond_price=${diamond_price}&img_sku=${formData.img_sku}&ring_price=${
      formData.ring_price
    }&ring_size=${formData.ring_size}&diamond_type=${diamond_type}&ring_type=${
      formData.ring_type
    }&product_type=${formData.product_type}&gemstone_stock_no=${
      formData.gemstone_stock_no
    }&diamond_stock_no=${formData.diamond_stock_no}${
      formData.textEngraving ? `&engraving=${formData.textEngraving}` : ""
    }${formData.font_style ? `&font=${formData.font_style}` : ""}`;

    axios
      .get(
        API_URl,

        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": shapeData,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          dispatch(productList());
          dispatch(productListCart());
          setTimeout(() => {
            setDisableButton(false);
          }, 2000);
        } else {
          console.error("Error Status:", response.status);
          setDisableButton(false);
        }
      })

      .catch((error) => {
        console.error("Error:", error);
        setDisableButton(false);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const fetchData = () => {
      axios
        .get(`${baseUrl}/newsletter?email=${newsLetterResult}`)
        .then((res) => {
          setNewsletterEmail(res.data);
        })
        .catch(() => {
          console.log("API error");
        });
    };

    fetchData();
  };

  const numberOfGemstones = userId
    ? wishListDataBase.filter((item) => item.product_type === "gemstone").length
    : wishlist.filter((item) => item.product_type === "gemstone").length;
  const numberOfDiamond = userId
    ? wishListDataBase.filter((item) => item.product_type === "diamond").length
    : wishlist.filter((item) => item.product_type === "diamond").length;
  const numberOfRing_gemstone = userId
    ? wishListDataBase.filter((item) => item.product_type === "ring_gemstone")
        .length
    : wishlist.filter((item) => item.product_type === "ring_gemstone").length;
  const numberOfRing = userId
    ? wishListDataBase.filter((item) => item.product_type === "ring").length
    : wishlist.filter((item) => item.product_type === "ring").length;
  const numberOfRing_diamond = userId
    ? wishListDataBase.filter((item) => item.product_type === "ring_diamond")
        .length
    : wishlist.filter((item) => item.product_type === "ring_diamond").length;
  const numberOfMatchingSets = userId
    ? wishListDataBase.filter((item) => item.product_type === "matching_set")
        .length
    : wishlist.filter((item) => item.product_type === "matching_set").length;

  // ============ meta tag  =======================//
//   const location = useLocation();
//   const currentUrl = window.location.href;
//   const pathSegments = location.pathname
//     .split("/")
//     .filter((segment) => segment);
//   const mainCategory = pathSegments[0] || "";

  return (
    <>
      {/* <MetaTagCategoryPage
        mainCategory={mainCategory}
        currentUrl={currentUrl}
      /> */}
    <Header/>
      {userId ? (
        <section className="wishlist-main wishlist-data-base">
          <div className="container">
            <div className="breadcrums">
              <ul>
                <li>
                  <Link href="/">Home /</Link>
                </li>
                <li>
                  <Link href="/wishlist">Wish List </Link>
                </li>
              </ul>
            </div>
            <div className="wishlist-reset-content">
              <h1 className="main-head-title">Wish List</h1>
            </div>
            {wishListDataBase?.length < 1 && (
              <div className="wishlist-create">
                <div className="wishlist-reset-content">
                  <p>
                    Your wish list is empty. Click the heart icon near an item
                    you love to save across all your devices.
                  </p>
                </div>
              </div>
            )}
            {/* =========== */}

            {wishListDataBase?.length > 0 && (
              <div className="wishlist_tab_engagementrings">
                <div class="wish-list-tab">
                  <ul>
                    <li
                      className={
                        activeWishList === all
                          ? "wish-header  active"
                          : "wish-header "
                      }
                      onClick={(e) => {
                        handleWishList(all);
                      }}
                    >
                      all ({wishListDataBase?.length})
                    </li>
                    {wishListDataBase
                      .reduce((acc, item) => {
                        if (
                          item.product_type &&
                          !acc.includes(item.product_type)
                        ) {
                          acc.push(item.product_type);
                        }
                        return acc;
                      }, [])
                      .map((productType, index) => (
                        <li
                          key={index}
                          className={
                            activeWishList === productType
                              ? "wish-header active"
                              : "wish-header"
                          }
                          onClick={() => {
                            handleWishList(productType);
                          }}
                        >
                          {productType === "gemstone"
                            ? `gemstones (${numberOfGemstones})`
                            : productType === "diamond"
                            ? `diamond (${numberOfDiamond})`
                            : (productType === "ring" ||
                                productType === "ring_diamond" ||
                                productType === "ring_gemstone") &&
                              !engagementRingShown
                            ? ((engagementRingShown = true),
                              `engagement rings (${
                                numberOfRing +
                                numberOfRing_diamond +
                                numberOfRing_gemstone
                              })`)
                            : productType === "matching_set"
                            ? `Matching Sets (${numberOfMatchingSets})`
                            : ""}
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="wishlist_page-column">
                  {wishListDataBase?.map((item) => {
                    return (
                      <>
                        {/* ==============all view */}
                        {item.product_type ? (
                          <div
                            className={
                              activeWishList === all
                                ? "wishList-data all active"
                                : "wishList-data"
                            }
                          >
                            {item.product_type === "ring_diamond" ||
                            item.product_type === "ring" ||
                            item.product_type === "ring_gemstone" ? (
                              <div class="wishlists-inner-row all-ring">
                                <div class="whishlist-colum">
                                  <span>
                                    <Link
                                      href="#"
                                      onClick={() =>
                                        removeWishlistItemWishlist(
                                          item.id,
                                          item?.ring_id
                                        )
                                      }
                                    >
                                      <VscChromeClose />
                                    </Link>
                                  </span>
                                  <div class="top-whish-list">
                                    <ul>
                                      <Link
                                        href={`${
                                          item.product_type === "ring"
                                            ? `/engagement-ring/${
                                                item.ring?.slug
                                              }?color=${item?.active_color}${
                                                item?.ring_type
                                                  ? `&diamond_original=${item?.ring_type}`
                                                  : ""
                                              }`
                                            : item.product_type ===
                                              "ring_diamond"
                                            ? `/final_ring/${
                                                item.ring?.slug
                                              }?color=${
                                                item?.active_color
                                              }&stock_num=${
                                                item?.diamond_id
                                              }&diamond_original=${
                                                item?.ring_type
                                              }&diamond_origin=${
                                                item?.diamond_type ===
                                                "Lab_grown_Diamond"
                                                  ? "lab_grown"
                                                  : "natural"
                                              }&ring_size=${item.ring_size}`
                                            : `/final_ring_gemstone/${item.ring?.slug}?color=${item?.active_color}&stock_num=${item?.gemstone_id}&diamond_original=${item?.ring_type}&ring_size=${item.ring_size}`
                                        }`}
                                      >
                                        <li
                                          className={
                                            item.active_color === white
                                              ? "active"
                                              : "displayed"
                                          }
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                            alt={item?.name}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                            className="img-responsive center-block"
                                          />
                                        </li>

                                        <li
                                          className={
                                            item.active_color === yellow
                                              ? "active"
                                              : "displayed"
                                          }
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt.jpg`}
                                            alt={item?.name}
                                            className="img-responsive center-block"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </li>

                                        <li
                                          className={
                                            item.active_color === rose
                                              ? "active"
                                              : "displayed"
                                          }
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt1.jpg`}
                                            alt={item?.name}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                            className="img-responsive center-block"
                                          />
                                        </li>

                                        <li
                                          className={
                                            item.active_color === platinum
                                              ? "active"
                                              : "displayed"
                                          }
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                            alt={item?.name}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                            className="img-responsive center-block"
                                          />
                                        </li>
                                      </Link>
                                    </ul>
                                  </div>
                                  <div class="caption">
                                    <Link
                                      href={`${
                                        item.product_type === "ring"
                                          ? `/engagement-ring/${
                                              item.ring?.slug
                                            }?color=${item?.active_color}${
                                              item?.ring_type
                                                ? `&diamond_original=${item?.ring_type}`
                                                : ""
                                            }`
                                          : item.product_type === "ring_diamond"
                                          ? `/final_ring/${
                                              item.ring?.slug
                                            }?color=${
                                              item?.active_color
                                            }&stock_num=${
                                              item?.diamond_id
                                            }&diamond_original=${
                                              item?.ring_type
                                            }&diamond_origin=${
                                              item?.diamond_type ===
                                              "Lab_grown_Diamond"
                                                ? "lab_grown"
                                                : "natural"
                                            }&ring_size=${item.ring_size}`
                                          : `/final_ring_gemstone/${item.ring?.slug}?color=${item?.active_color}&stock_num=${item?.gemstone_id}&diamond_original=${item?.ring_type}&ring_size=${item.ring_size}`
                                      }`}
                                      class="product-info"
                                    >
                                      <div
                                        class="headline"
                                        data-item="CYO Rings"
                                      >
                                        {item.ring.name} <br />
                                        {item.engraving &&
                                          `Engraving: ${item.engraving}`}{" "}
                                        <br />
                                        {item.font && `Font: ${item.font}`}
                                      </div>
                                    </Link>

                                    {item.diamond.length > 0
                                      ? item.diamond.map((diamond_item) => {
                                          return (
                                            <>
                                              <div class="money">
                                                {diamond_item.size} carat{" "}
                                                {diamond_item.shape} Diamond
                                              </div>
                                            </>
                                          );
                                        })
                                      : item.gemstone.map((gemstone_item) => {
                                          return (
                                            <>
                                              <div class="money">
                                                {gemstone_item.short_title}
                                              </div>
                                            </>
                                          );
                                        })}

                                    <div className="money">
                                      {item.diamond_price !== null ? (
                                        <>
                                          $
                                          {Math.round(
                                            parseFloat(item.ring_price || 0) +
                                              parseFloat(
                                                item.diamond_price || 0
                                              )
                                          )}
                                        </>
                                      ) : (
                                        // If diamond_price is null, display only ring_price
                                        <>
                                          $
                                          {Math.round(
                                            parseFloat(item.ring_price || 0) +
                                              parseFloat(
                                                item.gemstone_price || 0
                                              )
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>

                                  <div className="whishlist-footer">
                                    {/* <Select
                                      defaultValue={selectedOption}
                                      onChange={setSelectedOption}
                                      options={options}
                                      placeholder="Select Size"
                                    /> */}
                                    {item.product_type === "ring" ? (
                                      item.ring_size !== null ? (
                                        <Link
                                          href={`/engagement-rings/start-with-a-diamond/${
                                            item.ring?.slug
                                          }${
                                            item?.ring_type == "lab_grown"
                                              ? "/lab_grown"
                                              : "/natural"
                                          }?color=${item?.active_color}${
                                            item?.ring_type
                                              ? `&diamond_original=${item?.ring_type}`
                                              : ""
                                          }&ring_size=${item?.ring_size}${
                                            item.engraving
                                              ? `&textEngraving=${item.engraving}`
                                              : ""
                                          }${
                                            item.font
                                              ? `&font_style=${item.font}`
                                              : ""
                                          }`}
                                          className="bg-btn"
                                        >
                                          Add a Diamond
                                        </Link>
                                      ) : (
                                        <Link
                                          href={`/engagement-ring/${
                                            item.ring?.slug
                                          }?color=${item?.active_color}${
                                            item?.ring_type
                                              ? `&diamond_original=${item?.ring_type}`
                                              : ""
                                          }${
                                            item.engraving
                                              ? `&textEngraving=${item.engraving}`
                                              : ""
                                          }${
                                            item.font
                                              ? `&font_style=${item.font}`
                                              : ""
                                          }`}
                                          className="bg-btn"
                                        >
                                          Add a Diamond
                                        </Link>
                                      )
                                    ) : item.product_type === "ring_diamond" ? (
                                      // Map over each diamond item and render a link
                                      item.diamond.map(
                                        (diamond_item, index) => (
                                          <Link
                                            key={index} // Add a unique key for each link
                                            className="bg-btn"
                                            href="javascript:void(0)"
                                            style={{
                                              pointerEvents: disableButton
                                                ? "none"
                                                : "auto",
                                              cursor: disableButton
                                                ? "not-allowed"
                                                : "pointer",
                                            }}
                                            onClick={() => {
                                              removeWishlistItem(item.id);
                                              handleCreateAccount(
                                                item?.ring_price,
                                                item.ring?.id,
                                                item.ring,
                                                item.img_sku,
                                                item.active_color,
                                                diamond_item.stock_num,
                                                diamond_item,
                                                diamond_item.total_sales_price,
                                                item.item?.stock_num
                                                  ? item.item.stock_num
                                                  : "",
                                                item.item?.total_sales_price
                                                  ? item.item.total_sales_price
                                                  : "",
                                                item.item?.gemstoneItem
                                                  ? item.item.gemstoneItem
                                                  : "",
                                                userId ? userId : null,
                                                item.ring_size
                                                  ? item.ring_size
                                                  : "",
                                                item.diamond_type
                                                  ? item.diamond_type
                                                  : "",
                                                item?.ring_type,
                                                item.product_type,
                                                item.item?.id
                                                  ? item.item.id
                                                  : "",
                                                diamond_item.id,
                                                item.engraving
                                                  ? item.engraving
                                                  : "",
                                                item.font ? item.font : ""
                                              );
                                            }}
                                          >
                                            Add To Bag
                                          </Link>
                                        )
                                      )
                                    ) : (
                                      item.gemstone.map(
                                        (gemstone_item, index) => (
                                          <Link
                                            key={index} // Add a unique key for each link
                                            className="bg-btn"
                                            href="javascript:void(0)"
                                            style={{
                                              pointerEvents: disableButton
                                                ? "none"
                                                : "auto",
                                              cursor: disableButton
                                                ? "not-allowed"
                                                : "pointer",
                                            }}
                                            onClick={() => {
                                              removeWishlistItem(item.id);
                                              handleCreateAccount(
                                                item?.ring_price,
                                                item.ring?.id,
                                                item.ring,
                                                item.img_sku,
                                                item.active_color,
                                                item.diamond_item?.stock_num
                                                  ? item.diamond_item?.stock_num
                                                  : "",
                                                item.diamond_item
                                                  ? item?.diamond_item
                                                  : "",
                                                item.diamond_item
                                                  ?.total_sales_price
                                                  ? item?.diamond_item
                                                      ?.total_sales_price
                                                  : "",

                                                gemstone_item?.stock_num,
                                                gemstone_item?.total_sales_price,
                                                gemstone_item,

                                                userId ? userId : null,
                                                item.ring_size
                                                  ? item.ring_size
                                                  : "",
                                                item.diamond_type
                                                  ? item.diamond_type
                                                  : "",
                                                item?.ring_type,
                                                item.product_type,
                                                gemstone_item?.id,
                                                item.diamond_item?.id
                                                  ? item.diamond_item?.id
                                                  : "",
                                                item.engraving
                                                  ? item.engraving
                                                  : "",
                                                item.font ? item.font : ""
                                              );
                                            }}
                                          >
                                            Add To Bag
                                          </Link>
                                        )
                                      )
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : null}

                            {item.product_type === "diamond" ? (
                              <div class="wishlists-inner-row diamond">
                                {item.diamond?.map((diamondsItem) => {
                                  return (
                                    <div class="whishlist-colum">
                                      <span>
                                        <Link
                                          href="#"
                                          onClick={() =>
                                            removeWishlistItemWishlist(
                                              item.id,
                                              diamondsItem.id
                                            )
                                          }
                                        >
                                          <VscChromeClose />
                                        </Link>
                                      </span>
                                      <div class="top-whish-list">
                                        <Link
                                          href={`/view_diamond?stock_num=${
                                            item.diamond_id
                                          }${
                                            item?.diamond_type === "Diamond"
                                              ? ""
                                              : `&diamond_origin=lab_grown`
                                          }`}
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={diamondsItem?.image_url}
                                            alt={diamondsItem?.shape}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </Link>
                                      </div>
                                      <div class="caption">
                                        <Link
                                          href={`/view_diamond?stock_num=${
                                            item.diamond_id
                                          }${
                                            item?.diamond_type === "Diamond"
                                              ? ""
                                              : `&diamond_origin=lab_grown`
                                          }`}
                                          class="product-info"
                                        >
                                          <div class="money">
                                            {diamondsItem?.size} carat{" "}
                                            {diamondsItem?.shape} Diamond
                                          </div>
                                        </Link>

                                        <div class="money">
                                          $
                                          {Math.round(
                                            diamondsItem?.total_sales_price
                                          )}
                                        </div>
                                      </div>
                                      {item?.diamond.map(
                                        (diamond_item, index) => (
                                          <div
                                            key={index}
                                            className="whishlist-footer"
                                          >
                                            <Link
                                              href={`/engagement-rings/start-with-a-setting?stock_num=${
                                                diamond_item?.stock_num || ""
                                              }`}
                                              className="transparent-btn"
                                            >
                                              Add to Ring
                                            </Link>
                                            <Link
                                              className="bg-btn"
                                              href="javascript:void(0)"
                                              style={{
                                                pointerEvents: disableButton
                                                  ? "none"
                                                  : "auto",
                                                cursor: disableButton
                                                  ? "not-allowed"
                                                  : "pointer",
                                              }}
                                              onClick={() => {
                                                removeWishlistItem(item.id);

                                                handleCreateAccount(
                                                  item?.ring_price || "",
                                                  item.ring?.id || "",
                                                  item.ring || "",
                                                  item.ring?.imgUrl || "",
                                                  item.productColor || "",
                                                  diamond_item?.stock_num || "", // Ensure diamond_item is defined
                                                  diamond_item || "", // Ensure diamond_item is defined
                                                  diamond_item?.total_sales_price ||
                                                    "", // Ensure diamond_item is defined
                                                  item.gemstoneItem
                                                    ?.stock_num || "", // Ensure gemstoneItem is defined
                                                  item.gemstoneItem
                                                    ?.total_sales_price || "", // Ensure gemstoneItem is defined
                                                  item.gemstoneItem || "", // Ensure gemstoneItem is defined
                                                  userId || null,
                                                  item.ring_size
                                                    ? item.ring_size
                                                    : "",
                                                  item.diamond_type
                                                    ? item.diamond_type
                                                    : "",
                                                  item?.ring_type,
                                                  item.product_type,
                                                  item.gemstoneItem?.id || "",
                                                  diamond_item?.id || "",
                                                  item.engraving
                                                    ? item.engraving
                                                    : "",
                                                  item.font ? item.font : ""
                                                );
                                              }}
                                            >
                                              Add To Bag
                                            </Link>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : null}

                            {item.product_type === "gemstone" &&
                              item.gemstone?.map((gemstoneItem) => {
                                return (
                                  <div class="wishlists-inner-row gemstone">
                                    <div class="whishlist-colum">
                                      <span>
                                        <Link
                                          href="#"
                                          onClick={() =>
                                            removeWishlistItemWishlist(
                                              item.id,
                                              gemstoneItem.id
                                            )
                                          }
                                        >
                                          <VscChromeClose />
                                        </Link>
                                      </span>
                                      <div class="top-whish-list">
                                        <Link
                                          href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={gemstoneItem.image_url}
                                            alt={gemstoneItem?.shape}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </Link>
                                      </div>
                                      <div class="caption">
                                        <Link
                                          href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                          class="product-info"
                                        >
                                          <div
                                            class="headline"
                                            data-item="CYO Rings"
                                          >
                                            {gemstoneItem.short_title}
                                          </div>
                                        </Link>

                                        <div class="money">
                                          $
                                          {Math.round(
                                            gemstoneItem?.total_sales_price
                                          )}
                                        </div>
                                      </div>

                                      <div class="whishlist-footer">
                                        <Link
                                          href={`/engagement-rings/start-with-a-setting?stock_num=${gemstoneItem?.stock_num}`}
                                          class="transparent-btn"
                                        >
                                          Add to Ring
                                        </Link>
                                        <Link
                                          class="bg-btn"
                                          href="javascript:void(0)"
                                          style={{
                                            pointerEvents: disableButton
                                              ? "none"
                                              : "auto",
                                            cursor: disableButton
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
                                          onClick={() => {
                                            removeWishlistItem(
                                              item.id,
                                              gemstoneItem.id
                                            );
                                            handleCreateAccount(
                                              item?.ring_price
                                                ? item?.ring_price
                                                : "",
                                              item.ring?.id
                                                ? item.ring?.id
                                                : "",
                                              item.ring ? item.ring : "",
                                              item.ring.imgUrl
                                                ? item.ring.imgUrl
                                                : "",
                                              item.productColor
                                                ? item.productColor
                                                : "",
                                              item.stock_num
                                                ? item.stock_num
                                                : "",
                                              item.diamond_item
                                                ? item.diamond_item
                                                : "",
                                              item.total_sales_price
                                                ? item.total_sales_price
                                                : "",
                                              gemstoneItem.stock_num,
                                              gemstoneItem.total_sales_price,
                                              gemstoneItem,
                                              userId ? userId : null,
                                              item.ring_size
                                                ? item.ring_size
                                                : "",
                                              item.diamond_type
                                                ? item.diamond_type
                                                : "",
                                              item?.ring_type,
                                              item.product_type,
                                              gemstoneItem.id,
                                              item.id ? item.id : "",
                                              item.engraving
                                                ? item.engraving
                                                : "",
                                              item.font ? item.font : ""
                                            );
                                          }}
                                        >
                                          Add To Bag
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            {item.product_type === "matching_set" && (
                              <div class="wishlists-inner-row gemstone">
                                <div class="whishlist-colum">
                                  <span>
                                    <Link
                                      href="#"
                                      onClick={() =>
                                        removeWishlistItemWishlist(
                                          item.id,
                                          item.ring_id
                                        )
                                      }
                                    >
                                      <VscChromeClose />
                                    </Link>
                                  </span>
                                  <div class="top-whish-list">
                                    <ul>
                                      {" "}
                                      <Link
                                        href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                      >
                                        <li
                                          className={
                                            item.active_color === white
                                              ? "active"
                                              : "displayed"
                                          }
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                            alt={item.ring?.name}
                                            className="img-responsive center-block"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </li>

                                        <li
                                          className={
                                            item.active_color === yellow
                                              ? "active"
                                              : "displayed"
                                          }
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt.jpg`}
                                            alt={item.ring?.name}
                                            className="img-responsive center-block"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </li>

                                        <li
                                          className={
                                            item.active_color === rose
                                              ? "active"
                                              : "displayed"
                                          }
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt1.jpg`}
                                            alt={item.ring?.name}
                                            className="img-responsive center-block"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </li>

                                        <li
                                          className={
                                            item.active_color === platinum
                                              ? "active"
                                              : "displayed"
                                          }
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                            alt={item.ring?.name}
                                            className="img-responsive center-block"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </li>
                                      </Link>
                                    </ul>
                                  </div>
                                  <div class="caption">
                                    <Link
                                      href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                      class="product-info"
                                    >
                                      <div
                                        class="headline"
                                        data-item="CYO Rings"
                                      >
                                        {item.ring?.name}
                                        <br />
                                        {item.engraving &&
                                          `Engraving: ${item.engraving}`}{" "}
                                        <br />
                                        {item.font && `Font: ${item.font}`}
                                      </div>
                                    </Link>

                                    <div class="money">
                                      ${Math.round(item.ring_price)}
                                    </div>
                                  </div>

                                  <div class="whishlist-footer">
                                    {item.ring_price > 0 ? (
                                      item.ring_size ? (
                                        <Link
                                          class="bg-btn"
                                          href="javascript:void(0)"
                                          style={{
                                            pointerEvents: disableButton
                                              ? "none"
                                              : "auto",
                                            cursor: disableButton
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
                                          onClick={() => {
                                            removeWishlistItem(
                                              item.id,
                                              item.ring_id
                                            );
                                            handleCreateAccount(
                                              item.ring_price,
                                              item.ring_id ? item.ring_id : "",
                                              item.ring ? item.ring : "",
                                              item.img_sku ? item.img_sku : "",
                                              item.active_color
                                                ? item.active_color
                                                : "",
                                              item.stock_num
                                                ? item.stock_num
                                                : "",
                                              item.diamond_item
                                                ? item.diamond_item
                                                : "",
                                              item.total_sales_price
                                                ? item.total_sales_price
                                                : "",
                                              item.gemstoneItem?.stock_num ||
                                                "",
                                              item.gemstoneItem
                                                ?.total_sales_price || "",
                                              item.gemstoneItem || "",
                                              userId ? userId : null,
                                              item.ring_size
                                                ? item.ring_size
                                                : "",
                                              item.diamond_type
                                                ? item.diamond_type
                                                : "",
                                              item?.ring_type,
                                              item.product_type,
                                              item.gemstoneItem?.id || "",
                                              item.id ? item.id : "",
                                              item.engraving
                                                ? item.engraving
                                                : "",
                                              item.font ? item.font : ""
                                            );
                                          }}
                                        >
                                          Add To Bag
                                        </Link>
                                      ) : (
                                        <Link
                                          href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                          class="bg-btn"
                                        >
                                          Select Ring Size
                                        </Link>
                                      )
                                    ) : (
                                      <p className="band-not-available">
                                        <Link href="/wedding-band/wedding">
                                          Band Unavailable Choose Another Band
                                        </Link>
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : null}
                        {/* ========all end */}

                        {/* ring and diamond  */}
                        {item.product_type === "ring_diamond" ||
                        item.product_type === "ring" ||
                        item.product_type === "ring_gemstone" ? (
                          <div
                            className={
                              activeWishList === ring ||
                              activeWishList === "ring_diamond" ||
                              activeWishList === "ring_gemstone"
                                ? "wishList-data active"
                                : "wishList-data"
                            }
                          >
                            <div class="wishlists-inner-row all-ring">
                              <div class="whishlist-colum">
                                <span>
                                  <Link
                                    href="#"
                                    onClick={() =>
                                      removeWishlistItemWishlist(
                                        item.id,
                                        item?.ring_id
                                      )
                                    }
                                  >
                                    <VscChromeClose />
                                  </Link>
                                </span>
                                <div class="top-whish-list">
                                  <ul>
                                    <Link
                                      href={`${
                                        item.product_type === "ring"
                                          ? `/engagement-ring/${
                                              item.ring?.slug
                                            }?color=${item?.active_color}${
                                              item?.ring_type
                                                ? `&diamond_original=${item?.ring_type}`
                                                : ""
                                            }`
                                          : item.product_type === "ring_diamond"
                                          ? `/final_ring/${
                                              item.ring?.slug
                                            }?color=${
                                              item?.active_color
                                            }&stock_num=${
                                              item?.diamond_id
                                            }&diamond_original=${
                                              item?.ring_type
                                            }&diamond_origin=${
                                              item?.diamond_type ===
                                              "Lab_grown_Diamond"
                                                ? "lab_grown"
                                                : "natural"
                                            }&ring_size=${item.ring_size}`
                                          : `/final_ring_gemstone/${item.ring?.slug}?color=${item?.active_color}&stock_num=${item?.gemstone_id}&diamond_original=${item?.ring_type}&ring_size=${item.ring_size}`
                                      }`}
                                    >
                                      <li
                                        className={
                                          item.active_color === white
                                            ? "active"
                                            : "displayed"
                                        }
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                          alt={item?.name}
                                          className="img-responsive center-block"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </li>

                                      <li
                                        className={
                                          item.active_color === yellow
                                            ? "active"
                                            : "displayed"
                                        }
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt.jpg`}
                                          alt={item?.name}
                                          className="img-responsive center-block"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </li>

                                      <li
                                        className={
                                          item.active_color === rose
                                            ? "active"
                                            : "displayed"
                                        }
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt1.jpg`}
                                          alt={item?.name}
                                          className="img-responsive center-block"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </li>

                                      <li
                                        className={
                                          item.active_color === platinum
                                            ? "active"
                                            : "displayed"
                                        }
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                          alt={item?.name}
                                          className="img-responsive center-block"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </li>
                                    </Link>
                                  </ul>
                                </div>
                                <div class="caption">
                                  <Link
                                    href={`${
                                      item.product_type === "ring"
                                        ? `/engagement-ring/${
                                            item.ring?.slug
                                          }?color=${item?.active_color}${
                                            item?.ring_type
                                              ? `&diamond_original=${item?.ring_type}`
                                              : ""
                                          }`
                                        : item.product_type === "ring_diamond"
                                        ? `/final_ring/${
                                            item.ring?.slug
                                          }?color=${
                                            item?.active_color
                                          }&stock_num=${
                                            item?.diamond_id
                                          }&diamond_original=${
                                            item?.ring_type
                                          }&diamond_origin=${
                                            item?.diamond_type ===
                                            "Lab_grown_Diamond"
                                              ? "lab_grown"
                                              : "natural"
                                          }&ring_size=${item.ring_size}`
                                        : `/final_ring_gemstone/${item.ring?.slug}?color=${item?.active_color}&stock_num=${item?.gemstone_id}&diamond_original=${item?.ring_type}&ring_size=${item.ring_size}`
                                    }`}
                                    class="product-info"
                                  >
                                    <div class="headline" data-item="CYO Rings">
                                      {item.ring.name}
                                      <br />
                                      {item.engraving &&
                                        `Engraving: ${item.engraving}`}{" "}
                                      <br />
                                      {item.font && `Font: ${item.font}`}
                                    </div>
                                  </Link>

                                  {item.diamond.length > 0
                                    ? item.diamond.map((diamond_item) => {
                                        return (
                                          <>
                                            <div class="money">
                                              {diamond_item.size} carat{" "}
                                              {diamond_item.shape} Diamond
                                            </div>
                                          </>
                                        );
                                      })
                                    : item.gemstone.map((gemstone_item) => {
                                        return (
                                          <>
                                            <div class="money">
                                              {gemstone_item.short_title}
                                            </div>
                                          </>
                                        );
                                      })}

                                  <div className="money">
                                    {item.diamond_price !== null ? (
                                      <>
                                        $
                                        {Math.round(
                                          parseFloat(item.ring_price || 0) +
                                            parseFloat(item.diamond_price || 0)
                                        )}
                                      </>
                                    ) : (
                                      // If diamond_price is null, display only ring_price
                                      <>
                                        $
                                        {Math.round(
                                          parseFloat(item.ring_price || 0) +
                                            parseFloat(item.gemstone_price || 0)
                                        )}
                                      </>
                                    )}
                                  </div>
                                </div>

                                <div className="whishlist-footer">
                                  {/* <Select
                                    defaultValue={selectedOption}
                                    onChange={setSelectedOption}
                                    options={options}
                                    placeholder="Select Size"
                                  /> */}
                                  {item.product_type === "ring" ? (
                                    item.ring_size !== null ? (
                                      <Link
                                        href={`/engagement-rings/start-with-a-diamond/${
                                          item.ring?.slug
                                        }${
                                          item?.ring_type == "lab_grown"
                                            ? "/lab_grown"
                                            : "/natural"
                                        }?color=${item?.active_color}${
                                          item?.ring_type
                                            ? `&diamond_original=${item?.ring_type}`
                                            : ""
                                        }&ring_size=${item?.ring_size}${
                                          item.engraving
                                            ? `&textEngraving=${item.engraving}`
                                            : ""
                                        }${
                                          item.font
                                            ? `&font_style=${item.font}`
                                            : ""
                                        }`}
                                        className="bg-btn"
                                      >
                                        Add a Diamond
                                      </Link>
                                    ) : (
                                      <Link
                                        href={`/engagement-ring/${
                                          item.ring?.slug
                                        }?color=${item?.active_color}${
                                          item?.ring_type
                                            ? `&diamond_original=${item?.ring_type}`
                                            : ""
                                        }${
                                          item.engraving
                                            ? `&textEngraving=${item.engraving}`
                                            : ""
                                        }${
                                          item.font
                                            ? `&font_style=${item.font}`
                                            : ""
                                        }`}
                                        className="bg-btn"
                                      >
                                        Add a Diamond
                                      </Link>
                                    )
                                  ) : item.product_type === "ring_diamond" ? (
                                    // Map over each diamond item and render a link
                                    item.diamond.map((diamond_item, index) => (
                                      <Link
                                        key={index} // Add a unique key for each link
                                        className="bg-btn"
                                        href="javascript:void(0)"
                                        style={{
                                          pointerEvents: disableButton
                                            ? "none"
                                            : "auto",
                                          cursor: disableButton
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                        onClick={() => {
                                          removeWishlistItem(item.id);
                                          handleCreateAccount(
                                            item?.ring_price,
                                            item.ring?.id,
                                            item.ring,
                                            item.img_sku,
                                            item.active_color,
                                            diamond_item.stock_num,
                                            diamond_item,
                                            diamond_item.total_sales_price,
                                            item.item?.stock_num
                                              ? item.item.stock_num
                                              : "",
                                            item.item?.total_sales_price
                                              ? item.item.total_sales_price
                                              : "",
                                            item.item?.gemstoneItem
                                              ? item.item.gemstoneItem
                                              : "",
                                            userId ? userId : null,
                                            item.ring_size
                                              ? item.ring_size
                                              : "",
                                            item.diamond_type
                                              ? item.diamond_type
                                              : "",
                                            item?.ring_type,
                                            item.product_type,
                                            item.item?.id ? item.item.id : "",
                                            diamond_item.id,
                                            item.engraving
                                              ? item.engraving
                                              : "",
                                            item.font ? item.font : ""
                                          );
                                        }}
                                      >
                                        Add To Bag
                                      </Link>
                                    ))
                                  ) : (
                                    item.gemstone.map(
                                      (gemstone_item, index) => (
                                        <Link
                                          key={index} // Add a unique key for each link
                                          className="bg-btn"
                                          href="javascript:void(0)"
                                          style={{
                                            pointerEvents: disableButton
                                              ? "none"
                                              : "auto",
                                            cursor: disableButton
                                              ? "not-allowed"
                                              : "pointer",
                                          }}
                                          onClick={() => {
                                            removeWishlistItem(item.id);
                                            handleCreateAccount(
                                              item?.ring_price,
                                              item.ring?.id,
                                              item.ring,
                                              item.img_sku,
                                              item.active_color,
                                              item.diamond_item?.stock_num
                                                ? item.diamond_item?.stock_num
                                                : "",
                                              item.diamond_item
                                                ? item?.diamond_item
                                                : "",
                                              item.diamond_item
                                                ?.total_sales_price
                                                ? item?.diamond_item
                                                    ?.total_sales_price
                                                : "",

                                              gemstone_item?.stock_num,
                                              gemstone_item?.total_sales_price,
                                              gemstone_item,

                                              userId ? userId : null,
                                              item.ring_size
                                                ? item.ring_size
                                                : "",
                                              item.diamond_type
                                                ? item.diamond_type
                                                : "",
                                              item?.ring_type,
                                              item.product_type,
                                              gemstone_item?.id,
                                              item.diamond_item?.id
                                                ? item.diamond_item?.id
                                                : "",
                                              item.engraving
                                                ? item.engraving
                                                : "",
                                              item.font ? item.font : ""
                                            );
                                          }}
                                        >
                                          Add To Bag
                                        </Link>
                                      )
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ) : null}

                        {item.product_type === "diamond" ? (
                          <div
                            className={
                              activeWishList === diamond
                                ? "wishList-data active"
                                : "wishList-data"
                            }
                          >
                            <div class="wishlists-inner-row diamond">
                              {item.diamond?.map((diamondsItem) => {
                                return (
                                  <div class="whishlist-colum">
                                    <span>
                                      <Link
                                        href="#"
                                        onClick={() =>
                                          removeWishlistItemWishlist(
                                            item.id,
                                            diamondsItem.id
                                          )
                                        }
                                      >
                                        <VscChromeClose />
                                      </Link>
                                    </span>
                                    <div class="top-whish-list">
                                      <Link
                                        href={`/view_diamond?stock_num=${
                                          item.diamond_id
                                        }${
                                          item?.diamond_type === "Diamond"
                                            ? ""
                                            : `&diamond_origin=lab_grown`
                                        }`}
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={diamondsItem?.image_url}
                                          alt={diamondsItem?.shape}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </Link>
                                    </div>
                                    <div class="caption">
                                      <Link
                                        href={`/view_diamond?stock_num=${
                                          item.diamond_id
                                        }${
                                          item?.diamond_type === "Diamond"
                                            ? ""
                                            : `&diamond_origin=lab_grown`
                                        }`}
                                        class="product-info"
                                      >
                                        <div class="money">
                                          {diamondsItem?.size} carat{" "}
                                          {diamondsItem?.shape} Diamond
                                        </div>
                                      </Link>

                                      <div class="money">
                                        $
                                        {Math.round(
                                          diamondsItem?.total_sales_price
                                        )}
                                      </div>
                                    </div>
                                    {item?.diamond.map(
                                      (diamond_item, index) => (
                                        <div
                                          key={index}
                                          className="whishlist-footer"
                                        >
                                          <Link
                                            href={`/engagement-rings/start-with-a-setting?stock_num=${
                                              diamond_item?.stock_num || ""
                                            }`}
                                            className="transparent-btn"
                                          >
                                            Add to Ring
                                          </Link>
                                          <Link
                                            className="bg-btn"
                                            href="javascript:void(0)"
                                            style={{
                                              pointerEvents: disableButton
                                                ? "none"
                                                : "auto",
                                              cursor: disableButton
                                                ? "not-allowed"
                                                : "pointer",
                                            }}
                                            onClick={() => {
                                              removeWishlistItem(item.id);
                                              handleCreateAccount(
                                                item?.ring_price || "",
                                                item.ring?.id || "",
                                                item.ring || "",
                                                item.ring?.imgUrl || "",
                                                item.productColor || "",
                                                diamond_item?.stock_num || "", // Ensure diamond_item is defined
                                                diamond_item || "", // Ensure diamond_item is defined
                                                diamond_item?.total_sales_price ||
                                                  "", // Ensure diamond_item is defined
                                                item.gemstoneItem?.stock_num ||
                                                  "", // Ensure gemstoneItem is defined
                                                item.gemstoneItem
                                                  ?.total_sales_price || "", // Ensure gemstoneItem is defined
                                                item.gemstoneItem || "", // Ensure gemstoneItem is defined
                                                userId || null,
                                                item.ring_size
                                                  ? item.ring_size
                                                  : "",
                                                item.diamond_type
                                                  ? item.diamond_type
                                                  : "",
                                                item?.ring_type,
                                                item.product_type,
                                                item.gemstoneItem?.id || "",
                                                diamond_item?.id || "",
                                                item.engraving
                                                  ? item.engraving
                                                  : "",
                                                item.font ? item.font : ""
                                              );
                                            }}
                                          >
                                            Add To Bag
                                          </Link>
                                        </div>
                                      )
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ) : null}

                        {item.product_type === "gemstone" &&
                          item.gemstone?.map((gemstoneItem) => {
                            return (
                              <div
                                className={
                                  activeWishList === gemstone
                                    ? "wishList-data active"
                                    : "wishList-data"
                                }
                              >
                                <div class="wishlists-inner-row gemstone">
                                  <div class="whishlist-colum">
                                    <span>
                                      <Link
                                        href="#"
                                        onClick={() =>
                                          removeWishlistItemWishlist(
                                            item.id,
                                            gemstoneItem.id
                                          )
                                        }
                                      >
                                        <VscChromeClose />
                                      </Link>
                                    </span>
                                    <div class="top-whish-list">
                                      <Link
                                        href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={gemstoneItem.image_url}
                                          alt={gemstoneItem?.shape}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </Link>
                                    </div>
                                    <div class="caption">
                                      <Link
                                        href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                        class="product-info"
                                      >
                                        <div
                                          class="headline"
                                          data-item="CYO Rings"
                                        >
                                          {gemstoneItem.short_title}
                                        </div>
                                      </Link>

                                      <div class="money">
                                        $
                                        {Math.round(
                                          gemstoneItem?.total_sales_price
                                        )}
                                      </div>
                                    </div>

                                    <div class="whishlist-footer">
                                      <Link
                                        href={`/engagement-rings/start-with-a-setting?stock_num=${gemstoneItem?.stock_num}`}
                                        class="transparent-btn"
                                      >
                                        Add to Ring
                                      </Link>
                                      <Link
                                        class="bg-btn"
                                        href="javascript:void(0)"
                                        style={{
                                          pointerEvents: disableButton
                                            ? "none"
                                            : "auto",
                                          cursor: disableButton
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                        onClick={() => {
                                          removeWishlistItem(
                                            item.id,
                                            gemstoneItem.id
                                          );
                                          handleCreateAccount(
                                            item?.ring_price
                                              ? item?.ring_price
                                              : "",
                                            item.ring?.id ? item.ring?.id : "",
                                            item.ring ? item.ring : "",
                                            item.ring.imgUrl
                                              ? item.ring.imgUrl
                                              : "",
                                            item.productColor
                                              ? item.productColor
                                              : "",
                                            item.stock_num
                                              ? item.stock_num
                                              : "",
                                            item.diamond_item
                                              ? item.diamond_item
                                              : "",
                                            item.total_sales_price
                                              ? item.total_sales_price
                                              : "",
                                            gemstoneItem.stock_num,
                                            gemstoneItem.total_sales_price,
                                            gemstoneItem,
                                            userId ? userId : null,
                                            item.ring_size
                                              ? item.ring_size
                                              : "",
                                            item.diamond_type
                                              ? item.diamond_type
                                              : "",
                                            item?.ring_type,
                                            item.product_type,
                                            gemstoneItem.id,
                                            item.id ? item.id : "",
                                            item.engraving
                                              ? item.engraving
                                              : "",
                                            item.font ? item.font : ""
                                          );
                                        }}
                                      >
                                        Add To Bag
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        {/* Matching set */}
                        {item.product_type === "matching_set" && (
                          <div
                            className={
                              activeWishList === matchingSet
                                ? "wishList-data active"
                                : "wishList-data"
                            }
                          >
                            <div class="wishlists-inner-row gemstone">
                              <div class="whishlist-colum">
                                <span>
                                  <Link
                                    href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                    onClick={() =>
                                      removeWishlistItemWishlist(
                                        item.id,
                                        item.ring_id
                                      )
                                    }
                                  >
                                    <VscChromeClose />
                                  </Link>
                                </span>
                                <div class="top-whish-list">
                                  <ul>
                                    <Link
                                      href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                    >
                                      <li
                                        className={
                                          item.active_color === white
                                            ? "active"
                                            : "displayed"
                                        }
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                          alt={item.ring?.name}
                                          className="img-responsive center-block"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </li>

                                      <li
                                        className={
                                          item.active_color === yellow
                                            ? "active"
                                            : "displayed"
                                        }
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt.jpg`}
                                          alt={item.ring?.name}
                                          className="img-responsive center-block"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </li>

                                      <li
                                        className={
                                          item.active_color === rose
                                            ? "active"
                                            : "displayed"
                                        }
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt1.jpg`}
                                          alt={item.ring?.name}
                                          className="img-responsive center-block"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </li>

                                      <li
                                        className={
                                          item.active_color === platinum
                                            ? "active"
                                            : "displayed"
                                        }
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                          alt={item.ring?.name}
                                          className="img-responsive center-block"
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </li>
                                    </Link>
                                  </ul>
                                </div>
                                <div class="caption">
                                  <Link
                                    href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}`}
                                    class="product-info"
                                  >
                                    <div class="headline" data-item="CYO Rings">
                                      {item.ring?.name}
                                      <br />
                                      {item.engraving &&
                                        `Engraving: ${item.engraving}`}{" "}
                                      <br />
                                      {item.font && `Font: ${item.font}`}
                                    </div>
                                  </Link>

                                  <div class="money">
                                    ${Math.round(item.ring_price)}
                                  </div>
                                </div>

                                <div class="whishlist-footer">
                                  {item.ring_price > 0 ? (
                                    item.ring_size ? (
                                      <Link
                                        class="bg-btn"
                                        href="javascript:void(0)"
                                        style={{
                                          pointerEvents: disableButton
                                            ? "none"
                                            : "auto",
                                          cursor: disableButton
                                            ? "not-allowed"
                                            : "pointer",
                                        }}
                                        onClick={() => {
                                          removeWishlistItem(
                                            item.id,
                                            item.ring_id
                                          );
                                          handleCreateAccount(
                                            item.ring_price,
                                            item.ring_id ? item.ring_id : "",
                                            item.ring ? item.ring : "",
                                            item.img_sku ? item.img_sku : "",
                                            item.active_color
                                              ? item.active_color
                                              : "",
                                            item.stock_num
                                              ? item.stock_num
                                              : "",
                                            item.diamond_item
                                              ? item.diamond_item
                                              : "",
                                            item.total_sales_price
                                              ? item.total_sales_price
                                              : "",
                                            item.gemstoneItem?.stock_num || "",
                                            item.gemstoneItem
                                              ?.total_sales_price || "",
                                            item.gemstoneItem || "",
                                            userId ? userId : null,
                                            item.ring_size
                                              ? item.ring_size
                                              : "",
                                            item.diamond_type
                                              ? item.diamond_type
                                              : "",
                                            item?.ring_type,
                                            item.product_type,
                                            item.gemstoneItem?.id || "",
                                            item.id ? item.id : "",
                                            item.engraving
                                              ? item.engraving
                                              : "",
                                            item.font ? item.font : ""
                                          );
                                        }}
                                      >
                                        Add To Bag
                                      </Link>
                                    ) : (
                                      <Link
                                        href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                        class="bg-btn"
                                      >
                                        Select Ring Size
                                      </Link>
                                    )
                                  ) : (
                                    <p className="band-not-available">
                                      <Link href="/wedding-band/wedding">
                                        Band Unavailable Choose Another Band
                                      </Link>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>{" "}
                          </div>
                        )}
                        {/* End */}
                      </>
                    );
                  })}
                </div>
              </div>
            )}
            {/* =========== */}
            <ContinueShoping />
          </div>
        </section>
      ) : (
        <section className="wishlist-main wishlist-data-base">
          <div className="container">
            <div className="breadcrums">
              <ul>
                <li>
                  <Link href="/">Home /</Link>
                </li>
                <li>
                  <Link href="/wishlist">Wish List </Link>
                </li>
              </ul>
            </div>
            <div className="wishlist-reset-content">
              <h2>Wish List</h2>
            </div>
            {wishlist.length < 1 && (
              <div className="wishlist-create">
                <div className="wishlist-reset-content">
                  <p>
                    Your wish list is empty. Sign in or Create an Account to
                    view your saved favorites across all your devices.
                  </p>
                </div>
                <div className="reset-forms wishlist-acct">
                  {newsLetterEmail && newsLetterEmail?.res === "success" ? (
                    <p>Thank you for subscribing to the SAMA newsletter.</p>
                  ) : (
                    <form
                      action=""
                      className="form-inline"
                      onSubmit={handleSubmit}
                    >
                      <div className="input-group">
                        <label className="sr-only">Email address</label>
                        <input
                          type="text"
                          className="zip-code"
                          placeholder="Your Email Address"
                          name="email"
                          id="whishlist-email"
                          onChange={(e) => setNewsLetterResult(e.target.value)}
                        />
                        <div className="error_1"></div>
                        <span className="input-group-btn">
                          <input
                            type="submit"
                            className="view-menu"
                            value=""
                            onClick={validateWhishList}
                          ></input>
                        </span>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            )}
            {/* =========== */}
            <div className="wishlist_tab_engagementrings">
              {wishlist.length > 0 && (
                <div className="wish-list-tab">
                  <ul>
                    <li
                      className={
                        activeWishList === "all"
                          ? "wish-header active"
                          : "wish-header"
                      }
                      onClick={() => {
                        handleWishList("all");
                      }}
                    >
                      all ({wishlist?.length})
                    </li>

                    {wishlist
                      .reduce((acc, item) => {
                        if (
                          item.product_type &&
                          !acc.includes(item.product_type)
                        ) {
                          acc.push(item.product_type);
                        }
                        return acc;
                      }, [])
                      .map((productType, index) => (
                        <li
                          key={index}
                          className={
                            activeWishList === productType
                              ? "wish-header active"
                              : "wish-header"
                          }
                          onClick={() => {
                            handleWishList(productType);
                          }}
                        >
                          {productType === "gemstone"
                            ? `gemstones (${numberOfGemstones})`
                            : productType === "diamond"
                            ? `diamond (${numberOfDiamond})`
                            : (productType === "ring" ||
                                productType === "ring_diamond" ||
                                productType === "ring_gemstone") &&
                              !engagementRingShown
                            ? ((engagementRingShown = true),
                              `engagement rings (${
                                numberOfRing +
                                numberOfRing_diamond +
                                numberOfRing_gemstone
                              })`)
                            : productType === "matching_set"
                            ? `Matching Sets (${numberOfMatchingSets})`
                            : ""}
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              <div className="wishlist_page-column">
                {wishlist?.map((item) => {
                  return (
                    <>
                      <div
                        className={
                          activeWishList === all
                            ? "wishList-data active"
                            : "wishList-data"
                        }
                      >
                        {(item.product_type === "ring_diamond" ||
                          item.product_type === "ring" ||
                          item.product_type === "ring_gemstone") && (
                          <div class="wishlists-inner-row all-ring">
                            <div class="whishlist-colum">
                              <span>
                                <Link
                                  href="#"
                                  onClick={() => {
                                    item.product_type === "ring_diamond"
                                      ? handleDiamondRing(item)
                                      : item.product_type === "ring_gemstone"
                                      ? handleGemRing(item)
                                      : handleRing(item);
                                  }}
                                >
                                  <VscChromeClose />
                                </Link>
                              </span>
                              <div class="top-whish-list">
                                <ul>
                                  <Link
                                    href={`${
                                      item.product_type === "ring"
                                        ? `/engagement-ring/${
                                            item.item?.slug
                                          }?color=${item.ring_color}${
                                            item?.ring_type
                                              ? `&diamond_original=${item?.ring_type}`
                                              : ""
                                          }`
                                        : item.product_type === "ring_diamond"
                                        ? `/final_ring/${
                                            item.item?.slug
                                          }?color=${
                                            item.removingItem?.ring_color
                                          }&stock_num=${
                                            item.diamond?.stock_num
                                          }&diamond_original=${
                                            item?.diamond_original
                                              ? item?.diamond_original
                                              : item.ring_type
                                          }&diamond_origin=${
                                            item?.diamond_origin
                                              ? item.diamond_origin
                                              : item.type_diamond
                                          }&ring_size=${item.ring_size}`
                                        : `/final_ring_gemstone/${item.item?.slug}?color=${item.removingItem?.ring_color}&stock_num=${item.diamond?.stock_num}&diamond_original=${item?.ring_type}&ring_size=${item.ring_size}`
                                    }`}
                                  >
                                    <li
                                      className={
                                        item.ring_color === white
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                        alt={item?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === yellow
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt.jpg`}
                                        alt={item?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === rose
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt1.jpg`}
                                        alt={item?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === platinum
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                        alt={item?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>
                                  </Link>
                                </ul>
                              </div>
                              <div class="caption">
                                <Link
                                  href={`${
                                    item.product_type === "ring"
                                      ? `/engagement-ring/${
                                          item.item?.slug
                                        }?color=${item.ring_color}${
                                          item?.ring_type
                                            ? `&diamond_original=${item?.ring_type}`
                                            : ""
                                        }`
                                      : item.product_type === "ring_diamond"
                                      ? `/final_ring/${item.item?.slug}?color=${
                                          item.removingItem?.ring_color
                                        }&stock_num=${
                                          item.diamond?.stock_num
                                        }&diamond_original=${
                                          item?.diamond_original
                                            ? item?.diamond_original
                                            : item.ring_type
                                        }&diamond_origin=${
                                          item?.diamond_origin
                                            ? item.diamond_origin
                                            : item.type_diamond
                                        }&ring_size=${item.ring_size}`
                                      : `/final_ring_gemstone/${item.item?.slug}?color=${item.removingItem?.ring_color}&stock_num=${item.diamond?.stock_num}&diamond_original=${item?.ring_type}&ring_size=${item.ring_size}`
                                  }`}
                                  class="product-info"
                                >
                                  <div class="headline" data-item="CYO Rings">
                                    {item.item?.name} <br />
                                    {item.textEngraving &&
                                      `Engraving: ${item.textEngraving}`}{" "}
                                    <br />
                                    {item.font_style &&
                                      `Font: ${item.font_style}`}
                                  </div>
                                </Link>
                                {item.product_type === "ring_diamond" ? (
                                  <div class="money">
                                    {item.diamond?.size} carat{" "}
                                    {item.diamond?.shape} Diamond
                                  </div>
                                ) : (
                                  <div class="money">
                                    {item.diamond?.short_title}
                                  </div>
                                )}

                                <div class="money">
                                  $
                                  {Math.round(
                                    parseFloat(item.ring_price || 0) +
                                      parseFloat(
                                        item.diamond?.total_sales_price || 0
                                      )
                                  )}
                                </div>
                              </div>
                              <div class="whishlist-footer">
                                {/* <Select
                                  defaultValue={selectedOption}
                                  onChange={setSelectedOption}
                                  options={options}
                                  placeholder="Select Size"
                                /> */}
                                {item.product_type === "ring" ? (
                                  item.ring_size ? (
                                    <Link
                                      href={`/engagement-rings/start-with-a-diamond/${
                                        item.item?.slug
                                      }${
                                        item?.diamond_original == "lab_grown"
                                          ? "/lab_grown"
                                          : "/natural"
                                      }?color=${item?.ring_color}&ring_size=${
                                        item?.ring_size
                                      }${
                                        item.textEngraving
                                          ? `&textEngraving=${item.textEngraving}`
                                          : ""
                                      }${
                                        item.font_style
                                          ? `&font_style=${item.font_style}`
                                          : ""
                                      }`}
                                      class="bg-btn"
                                    >
                                      Add a Diamond
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/engagement-ring/${
                                        item.item?.slug
                                      }?color=${item.ring_color}${
                                        item?.ring_type
                                          ? `&diamond_original=${item?.ring_type}`
                                          : ""
                                      }${
                                        item.textEngraving
                                          ? `&textEngraving=${item.textEngraving}`
                                          : ""
                                      }${
                                        item.font_style
                                          ? `&font_style=${item.font_style}`
                                          : ""
                                      }`}
                                      class="bg-btn"
                                    >
                                      Add a Diamond{" "}
                                    </Link>
                                  )
                                ) : item.product_type === "ring_diamond" ? (
                                  <Link
                                    href="#"
                                    class="bg-btn"
                                    onClick={() => {
                                      handleWishlistData(
                                        item,
                                        item.product_type,
                                        item?.type_diamond
                                          ? item.type_diamond
                                          : item?.diamond_type,
                                        item?.ring_type
                                      );
                                    }}
                                  >
                                    Add to Bag
                                  </Link>
                                ) : (
                                  <Link
                                    href="#"
                                    class="bg-btn"
                                    onClick={() => {
                                      handleWishlistData(
                                        item,
                                        item.product_type,
                                        item?.ring_type
                                      );
                                    }}
                                  >
                                    Add to Bag
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                        {item.product_type === "diamond" && (
                          <div class="wishlists-inner-row diamond">
                            <div class="whishlist-colum">
                              <span>
                                <Link
                                  href="#"
                                  onClick={() => handleDiamond(item)}
                                >
                                  <VscChromeClose />
                                </Link>
                              </span>
                              <div class="top-whish-list">
                                <Link
                                  href={`/view_diamond?stock_num=${
                                    item.diamonds?.stock_num
                                  }${
                                    item?.diamond_type === "natural"
                                      ? ""
                                      : `&diamond_origin=${item.diamond_type}`
                                  }`}
                                >
                                  <img
                                    width="auto"
                                    height="auto"
                                    src={item.diamonds?.image_url}
                                    alt={item.diamonds?.shape}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                    }}
                                  />
                                </Link>
                              </div>
                              <div class="caption">
                                <Link
                                  href={`/view_diamond?stock_num=${
                                    item.diamonds?.stock_num
                                  }${
                                    item?.diamond_type === "natural"
                                      ? ""
                                      : `&diamond_origin=${item.diamond_type}`
                                  }`}
                                  class="product-info"
                                >
                                  <div class="headline" data-item="CYO Rings">
                                    {item.diamonds?.size} Carat{" "}
                                    {item.diamonds?.shape} Diamond
                                  </div>
                                </Link>

                                <div class="money">
                                  {" "}
                                  $
                                  {Math.round(item.diamonds?.total_sales_price)}
                                </div>
                              </div>
                              <div class="whishlist-footer">
                                <Link
                                  class="transparent-btn"
                                  href={`/engagement-rings/start-with-a-setting?stock_num=${item.diamonds?.stock_num}`}
                                >
                                  Add to Ring
                                </Link>
                                <Link
                                  href="#"
                                  class="bg-btn"
                                  onClick={() =>
                                    handleWishlistDataDiamond(item)
                                  }
                                >
                                  Add to Bag
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}

                        {item.product_type === "gemstone" && (
                          <div class="wishlists-inner-row gemstone">
                            <div class="whishlist-colum">
                              <span>
                                <Link
                                  href="#"
                                  onClick={() => handleGemstoneAndBand(item)}
                                >
                                  <VscChromeClose />
                                </Link>
                              </span>
                              <div class="top-whish-list">
                                <Link
                                  href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                                >
                                  <img
                                    width="auto"
                                    height="auto"
                                    src={item.item?.image_url}
                                    alt={item.item?.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                    }}
                                  />
                                </Link>
                              </div>
                              <div class="caption">
                                <Link
                                  href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                                  class="product-info"
                                >
                                  <div class="headline" data-item="CYO Rings">
                                    {item.item?.short_title}
                                  </div>
                                </Link>

                                <div class="money">
                                  ${Math.round(item.item?.total_sales_price)}
                                </div>
                              </div>
                              <div class="whishlist-footer">
                                <Link
                                  href={`/engagement-rings/start-with-a-setting?stock_num=${item.item?.stock_num}`}
                                  class="transparent-btn"
                                >
                                  Add to Ring
                                </Link>
                                <Link
                                  href="#"
                                  class="bg-btn"
                                  onClick={() => {
                                    handleWishlistDataGemstonesAndBand(item);
                                  }}
                                >
                                  Add to Bag
                                </Link>
                              </div>
                            </div>
                          </div>
                        )}
                        {item.product_type === "matching_set" && (
                          <div class="wishlists-inner-row gemstone">
                            <div class="whishlist-colum">
                              <span>
                                <Link
                                  href="#"
                                  onClick={() => handleGemstoneAndBand(item)}
                                >
                                  <VscChromeClose />
                                </Link>
                              </span>
                              <div class="top-whish-list">
                                <ul>
                                  <Link
                                    href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                                  >
                                    <li
                                      className={
                                        item.ring_color === white
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.jpg`}
                                        alt={item.ring?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === yellow
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.alt.jpg`}
                                        alt={item.ring?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === rose
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.alt1.jpg`}
                                        alt={item.ring?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === platinum
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.jpg`}
                                        alt={item.ring?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>
                                  </Link>
                                </ul>
                              </div>
                              <div class="caption">
                                <Link
                                  href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}`}
                                  class="product-info"
                                >
                                  <div class="headline" data-item="CYO Rings">
                                    {item.ring?.name}
                                    <br />
                                    {item.textEngraving &&
                                      `Engraving: ${item.textEngraving}`}{" "}
                                    <br />
                                    {item.font_style &&
                                      `Font: ${item.font_style}`}
                                  </div>
                                </Link>

                                <div class="money">
                                  ${Math.round(item.ring_price)}
                                </div>
                              </div>
                              <div class="whishlist-footer">
                                {item.ring_price > 0 ? (
                                  item.ring_size ? (
                                    <Link
                                      href="#"
                                      class="bg-btn"
                                      onClick={() => {
                                        handleWishlistDataGemstonesAndBand(
                                          item
                                        );
                                      }}
                                    >
                                      Add to Bag
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                                      class="bg-btn"
                                    >
                                      Select Ring Size
                                    </Link>
                                  )
                                ) : (
                                  <p className="band-not-available">
                                    <Link href="/wedding-band/wedding">
                                      Band Unavailable Choose Another Band
                                    </Link>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {(item.product_type === "ring_diamond" ||
                        item.product_type === "ring" ||
                        item.product_type === "ring_gemstone") && (
                        <div
                          className={
                            activeWishList === ring ||
                            activeWishList === "ring_diamond" ||
                            activeWishList === "ring_gemstone"
                              ? "wishList-data active"
                              : "wishList-data"
                          }
                        >
                          <div class="wishlists-inner-row all-ring">
                            <div class="whishlist-colum">
                              <span>
                                <Link
                                  href="#"
                                  onClick={() => {
                                    item.product_type === "ring_diamond"
                                      ? handleDiamondRing(item)
                                      : item.product_type === "ring_gemstone"
                                      ? handleGemRing(item)
                                      : handleRing(item);
                                  }}
                                >
                                  <VscChromeClose />
                                </Link>
                              </span>
                              <div class="top-whish-list">
                                <ul>
                                  <Link
                                    href={`${
                                      item.product_type === "ring"
                                        ? `/engagement-ring/${
                                            item.item?.slug
                                          }?color=${item.ring_color}${
                                            item?.ring_type
                                              ? `&diamond_original=${item?.ring_type}`
                                              : ""
                                          }`
                                        : item.product_type === "ring_diamond"
                                        ? `/final_ring/${
                                            item.item?.slug
                                          }?color=${
                                            item.removingItem?.ring_color
                                          }&stock_num=${
                                            item.diamond?.stock_num
                                          }&diamond_original=${
                                            item?.diamond_original
                                              ? item?.diamond_original
                                              : item.ring_type
                                          }&diamond_origin=${
                                            item?.diamond_origin
                                              ? item.diamond_origin
                                              : item.type_diamond
                                          }&ring_size=${item.ring_size}`
                                        : `/final_ring_gemstone/${item.item?.slug}?color=${item.removingItem?.ring_color}&stock_num=${item.diamond?.stock_num}&diamond_original=${item?.ring_type}&ring_size=${item.ring_size}`
                                    }`}
                                  >
                                    <li
                                      className={
                                        item.ring_color === white
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                        alt={item?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === yellow
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt.jpg`}
                                        alt={item?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === rose
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.alt1.jpg`}
                                        alt={item?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === platinum
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.img_sku}/${item?.img_sku}.jpg`}
                                        alt={item?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>
                                  </Link>
                                </ul>
                              </div>
                              <div class="caption">
                                <Link
                                  href={`${
                                    item.product_type === "ring"
                                      ? `/engagement-ring/${
                                          item.item?.slug
                                        }?color=${item.ring_color}${
                                          item?.ring_type
                                            ? `&diamond_original=${item?.ring_type}`
                                            : ""
                                        }`
                                      : item.product_type === "ring_diamond"
                                      ? `/final_ring/${item.item?.slug}?color=${
                                          item.removingItem?.ring_color
                                        }&stock_num=${
                                          item.diamond?.stock_num
                                        }&diamond_original=${
                                          item?.diamond_original
                                            ? item?.diamond_original
                                            : item.ring_type
                                        }&diamond_origin=${
                                          item?.diamond_origin
                                            ? item.diamond_origin
                                            : item.type_diamond
                                        }&ring_size=${item.ring_size}`
                                      : `/final_ring_gemstone/${item.item?.slug}?color=${item.removingItem?.ring_color}&stock_num=${item.diamond?.stock_num}&diamond_original=${item?.ring_type}&ring_size=${item.ring_size}`
                                  }`}
                                  class="product-info"
                                >
                                  <div class="headline" data-item="CYO Rings">
                                    {item.item?.name}
                                    <br />
                                    {item.textEngraving &&
                                      `Engraving: ${item.textEngraving}`}{" "}
                                    <br />
                                    {item.font_style &&
                                      `Font: ${item.font_style}`}
                                  </div>
                                </Link>
                                {item.product_type === "ring_diamond" ? (
                                  <div class="money">
                                    {item.diamond?.size} carat{" "}
                                    {item.diamond?.shape} Diamond
                                  </div>
                                ) : (
                                  <div class="money">
                                    {item.diamond?.short_title}
                                  </div>
                                )}

                                <div class="money">
                                  $
                                  {Math.round(
                                    parseFloat(item.ring_price || 0) +
                                      parseFloat(
                                        item.diamond?.total_sales_price || 0
                                      )
                                  )}
                                </div>
                              </div>
                              <div class="whishlist-footer">
                                {/* <Select
                                  defaultValue={selectedOption}
                                  onChange={setSelectedOption}
                                  options={options}
                                  placeholder="Select Size"
                                /> */}
                                {item.product_type === "ring" ? (
                                  item.ring_size ? (
                                    <Link
                                      href={`/engagement-rings/start-with-a-diamond/${
                                        item.item?.slug
                                      }${
                                        item?.diamond_original == "lab_grown"
                                          ? "/lab_grown"
                                          : "/natural"
                                      }?color=${item?.ring_color}&ring_size=${
                                        item?.ring_size
                                      }${
                                        item.textEngraving
                                          ? `&textEngraving=${item.textEngraving}`
                                          : ""
                                      }${
                                        item.font_style
                                          ? `&font_style=${item.font_style}`
                                          : ""
                                      }`}
                                      class="bg-btn"
                                    >
                                      Add a Diamond
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/engagement-ring/${
                                        item.item?.slug
                                      }?color=${item.ring_color}${
                                        item?.ring_type
                                          ? `&diamond_original=${item?.ring_type}`
                                          : ""
                                      }${
                                        item.textEngraving
                                          ? `&textEngraving=${item.textEngraving}`
                                          : ""
                                      }${
                                        item.font_style
                                          ? `&font_style=${item.font_style}`
                                          : ""
                                      }`}
                                      class="bg-btn"
                                    >
                                      Add a Diamond{" "}
                                    </Link>
                                  )
                                ) : item.product_type === "ring_diamond" ? (
                                  <Link
                                    href="#"
                                    class="bg-btn"
                                    onClick={() => {
                                      handleWishlistData(
                                        item,
                                        item.product_type,
                                        item?.type_diamond
                                          ? item.type_diamond
                                          : item?.diamond_type,
                                        item?.ring_type
                                      );
                                    }}
                                  >
                                    Add to Bag
                                  </Link>
                                ) : (
                                  <Link
                                    href="#"
                                    class="bg-btn"
                                    onClick={() => {
                                      handleWishlistData(
                                        item,
                                        item.product_type,
                                        item?.type_diamond
                                          ? item.type_diamond
                                          : item?.diamond_type,
                                        item?.ring_type
                                      );
                                    }}
                                  >
                                    Add to Bag
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {item.product_type === "diamond" && (
                        <div
                          className={
                            activeWishList === diamond
                              ? "wishList-data active"
                              : "wishList-data"
                          }
                        >
                          <div class="wishlists-inner-row diamond">
                            <div class="whishlist-colum">
                              <span>
                                <Link
                                  href="#"
                                  onClick={() => handleDiamond(item)}
                                >
                                  <VscChromeClose />
                                </Link>
                              </span>
                              <div class="top-whish-list">
                                <Link
                                  href={`/view_diamond?stock_num=${
                                    item.diamonds?.stock_num
                                  }${
                                    item?.diamond_type === "natural"
                                      ? ""
                                      : `&diamond_origin=${item.diamond_type}`
                                  }`}
                                >
                                  <img
                                    width="auto"
                                    height="auto"
                                    src={item.diamonds?.image_url}
                                    alt={item.diamonds?.shape}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                    }}
                                  />
                                </Link>
                              </div>
                              <div class="caption">
                                <Link
                                  href={`/view_diamond?stock_num=${
                                    item.diamonds?.stock_num
                                  }${
                                    item?.diamond_type === "natural"
                                      ? ""
                                      : `&diamond_origin=${item.diamond_type}`
                                  }`}
                                  class="product-info"
                                >
                                  <div class="headline" data-item="CYO Rings">
                                    {item.diamonds?.size} Carat{" "}
                                    {item.diamonds?.shape} Diamond
                                  </div>
                                </Link>

                                <div class="money">
                                  {" "}
                                  $
                                  {Math.round(item.diamonds?.total_sales_price)}
                                </div>
                              </div>
                              <div class="whishlist-footer">
                                <Link
                                  class="transparent-btn"
                                  href={`/engagement-rings/start-with-a-setting?stock_num=${item.diamonds?.stock_num}`}
                                >
                                  Add to Ring
                                </Link>
                                <Link
                                  href="#"
                                  class="bg-btn"
                                  onClick={() =>
                                    handleWishlistDataDiamond(item)
                                  }
                                >
                                  Add to Bag
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {item.product_type === "gemstone" && (
                        <div
                          className={
                            activeWishList === gemstone
                              ? "wishList-data active"
                              : "wishList-data"
                          }
                        >
                          <div class="wishlists-inner-row gemstone">
                            <div class="whishlist-colum">
                              <span>
                                <Link
                                  href="#"
                                  onClick={() => handleGemstoneAndBand(item)}
                                >
                                  <VscChromeClose />
                                </Link>
                              </span>
                              <div class="top-whish-list">
                                <Link
                                  href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                                >
                                  <img
                                    width="auto"
                                    height="auto"
                                    src={item.item?.image_url}
                                    alt={item.item?.name}
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                    }}
                                  />
                                </Link>
                              </div>
                              <div class="caption">
                                <Link
                                  href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                                  class="product-info"
                                >
                                  <div class="headline" data-item="CYO Rings">
                                    {item.item?.short_title}
                                  </div>
                                </Link>

                                <div class="money">
                                  ${Math.round(item.item?.total_sales_price)}
                                </div>
                              </div>
                              <div class="whishlist-footer">
                                <Link
                                  href={`/engagement-rings/start-with-a-setting?stock_num=${item.item?.stock_num}`}
                                  class="transparent-btn"
                                >
                                  Add to Ring
                                </Link>
                                <Link
                                  href="#"
                                  class="bg-btn"
                                  onClick={() => {
                                    handleWishlistDataGemstonesAndBand(item);
                                  }}
                                >
                                  Add to Bag
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      {item.product_type === "matching_set" && (
                        <div
                          className={
                            activeWishList === matchingSet
                              ? "wishList-data active"
                              : "wishList-data"
                          }
                        >
                          <div class="wishlists-inner-row gemstone">
                            <div class="whishlist-colum">
                              <span>
                                <Link
                                  href="#"
                                  onClick={() => handleGemstoneAndBand(item)}
                                >
                                  <VscChromeClose />
                                </Link>
                              </span>
                              <div class="top-whish-list">
                                <ul>
                                  <Link
                                    href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                                  >
                                    <li
                                      className={
                                        item.ring_color === white
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.jpg`}
                                        alt={item.ring?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === yellow
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.alt.jpg`}
                                        alt={item.ring?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === rose
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.alt1.jpg`}
                                        alt={item.ring?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>

                                    <li
                                      className={
                                        item.ring_color === platinum
                                          ? "active"
                                          : "displayed"
                                      }
                                    >
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.jpg`}
                                        alt={item.ring?.name}
                                        className="img-responsive center-block"
                                        onError={(e) => {
                                          e.target.onerror = null;
                                          e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                        }}
                                      />
                                    </li>
                                  </Link>
                                </ul>
                              </div>
                              <div class="caption">
                                <Link
                                  href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                                  class="product-info"
                                >
                                  <div class="headline" data-item="CYO Rings">
                                    {item.ring?.name}
                                    <br />
                                    {item.textEngraving &&
                                      `Engraving: ${item.textEngraving}`}{" "}
                                    <br />
                                    {item.font_style &&
                                      `Font: ${item.font_style}`}
                                  </div>
                                </Link>

                                <div class="money">
                                  ${Math.round(item.ring_price)}
                                </div>
                              </div>
                              <div class="whishlist-footer">
                                {item.ring_price > 0 ? (
                                  item.ring_size ? (
                                    <Link
                                      href="#"
                                      class="bg-btn"
                                      onClick={() => {
                                        handleWishlistDataGemstonesAndBand(
                                          item
                                        );
                                      }}
                                    >
                                      Add to Bag
                                    </Link>
                                  ) : (
                                    <Link
                                      href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                                      class="bg-btn"
                                    >
                                      Select Ring Size
                                    </Link>
                                  )
                                ) : (
                                  <p className="band-not-available">
                                    <Link href="/wedding-band/wedding">
                                      Band Unavailable Choose Another Band
                                    </Link>
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  );
                })}
              </div>
            </div>

            {/* =========== */}
            {/* <ContinueShoping /> */}
          </div>
        </section>
      )}
      <Footer/>
    </>
  );
};

export default WishList;