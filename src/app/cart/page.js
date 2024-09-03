"use client";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { CiGift, CiHeart } from "react-icons/ci";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GooglePayButton from "@google-pay/button-react";
import { FaExclamationCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { v4 as uuidv4 } from "uuid";
import { addToWishlist } from "../../../store/actions/wishlistAction";
import { productList, productListCart } from "../../../store/actions/productActions";
import { useRouter } from "next/navigation";
import { UserContext } from "../context/UserContext";
import Header from "../_componentStatic/Header";
import { Footer } from "../_componentStatic/Footer";
import Link from "next/link";
// import { UserContext } from "../../App";
// import { addToWishlist, removeToCart } from "../../redux/action";
// import { productList, productListCart } from "../../redux/productAction";
// import { MetaTagCategoryPage } from "../../seoTags/MetaTagCategoryPage";
// import { CartPageJewellery } from "../AllRings/reusable_components/CartPageJewellery";
// import LoaderSpinner from "../LoaderSpinner";
// import PaypalCheckoutButton from "./PaypalCheckoutButton";
// import { ContinueShoping } from "../AllRings/reusable_components/ContinueShoping";
// import { ChooseYourImpact } from "../AllRings/reusable_components/ChooseYourImpact";

const CartPage = () => {
  const dispatch = useDispatch();
  const white = "18k-white-gold";
  const yellow = "18k-yellow-gold";
  const rose = "18k-rose-gold";
  const platinum = "platinum";
//   const location = useLocation();
  const navigate = useRouter();

  const [down, setDown] = useState(false);
  const [againDown, setAgainDown] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [removeCartItem, setRemoveCartItem] = useState();
  const [shapeData, setShapeData] = useState([]);
  const [checked, setChecked] = useState(true);
  const [plans, setPlans] = useState(1);
  const handleChange = (event) => setMessage(event.target.value);
  const cartData = useSelector((state) => state.cartData);
  const cartDetails = useSelector((state) => state.productDataCart);
  const { baseUrl, imgBaseUrl, imgAssetsUrl } = useContext(UserContext);
  const user_id = secureLocalStorage.getItem("formData");
  const now = new Date();
  const date = now.toLocaleDateString();
  const time = now.toLocaleTimeString();
  const localMessage = secureLocalStorage?.getItem("personalizedMessage");
  useEffect(() => {
    if (localMessage) {
      setShowMessage(true);
      setMessage(localMessage);
    }
  }, [localMessage]);
  const handleSaveMessage = () => {
    if (message.trim() !== "") {
      setShowMessage(true);
      setDown(false);
      secureLocalStorage.setItem("personalizedMessage", message);
    } else {
      setDown(false);
      setShowMessage(false);
    }
  };

  const handleCancelMessage = () => {
    if (message.trim() !== "") {
      setShowMessage(false);
      setDown(false);
      secureLocalStorage.removeItem("personalizedMessage");
    } else {
      setDown(false);
      setShowMessage(false);
    }
  };
  const handleCheckboxChange = () => {
    setChecked((prevChecked) => !prevChecked);
  };

  const handleEditMessage = () => {
    setDown(true);
    setShowMessage(false);
    secureLocalStorage.getItem("personalizedMessage");
  };

  const handleDeleteMessage = () => {
    setMessage("");
    setShowMessage(false);
    secureLocalStorage.removeItem("personalizedMessage");
  };

  // =============
  const [metalColor, setMetalColor] = useState([]);

  useEffect(() => {
    axios
      .get(`${baseUrl}/metalcolor`)
      .then((res) => {
        setMetalColor(res.data.data);
      })
      .catch(() => {
        console.log("API error");
      });
  }, []);

  const removeProduct = (item) => {
    dispatch(removeToCart(item));
  };
  const calculateTotalPrice = () => {
    let total = 0;
    cartData.forEach((item) => {
      total +=
        parseFloat(Math.round(item.ring_price || 0)) +
        parseFloat(Math.round(item.ringPrice || 0)) +
        parseFloat(Math.round(item.diamondItem?.total_sales_price || 0)) +
        parseFloat(Math.round(item.gemstone?.total_sales_price || 0)) +
        parseFloat(Math.round(item.gemstoneSingle?.total_sales_price || 0)) +
        parseFloat(Math.round(item.diamonds?.total_sales_price || 0)) +
        parseFloat(Math.round(item.item?.total_sales_price || 0));
    });
    return total;
  };

  const calculateTotalPriceDatabase = () => {
    let total = 0;
    cartDetails.forEach((item) => {
      total +=
        parseFloat(Math.round(item?.ring_price || 0)) +
        parseFloat(Math.round(item?.diamond_price || 0)) +
        parseFloat(Math.round(item.gemstone_price || 0)) +
        parseFloat(Math.round(item.matching_wedding_band?.price || 0));
    });
    return total;
  };

  let isDuplicate;
  let hasDuplicates;

  function handleWishlistItem(
    item,
    diamond,
    removingItem,
    product_type,
    ring_size,
    ring_color,
    ring_img,
    ring_price
  ) {
    const newItem = {
      item,
      diamond,
      uniqueId: uuidv4(),
      product_type: product_type,
      removingItem,
      ring_size: ring_size,
      diamond_type:
        product_type === "ring_diamond" ? item.diamond_type : undefined,
      ring_color,
      img_sku: ring_img,
      ring_price,
    };
    dispatch(addToWishlist(newItem));
    dispatch(removeToCart(removingItem));
  }

  function handleWishlistGemstoneAndBand(item) {
    dispatch(addToWishlist(item));
    dispatch(removeToCart(item));
  }

  function handleWishDataDiamonds(item) {
    dispatch(addToWishlist(item));
    dispatch(removeToCart(item));
  }

  // =======remove to card
  useEffect(() => {
    axios
      .get(`${baseUrl}/remove-cartitem/${removeCartItem}`)
      .then((res) => {
        dispatch(productListCart());
      })
      .catch((error) => {
        console.log("CSRF Token API Error:", error);
      });
  }, [removeCartItem]);
  // ==================
  // =======================
  const userId = secureLocalStorage.getItem("formData");

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
  // =============
  useEffect(() => {
    axios
      .get(`${baseUrl}/metalcolor`)
      .then((res) => {
        setMetalColor(res.data.data);
      })
      .catch(() => {
        console.log("API error");
      });
  }, []);

  const handleAllWishlist = () => {
    setDisableButton(true);
    cartDetails.map((item) => {
      handleWishlist(
        item.diamond_id && item.ring?.id == null && item?.gemstone_id == null
          ? "diamond"
          : item.gemstone_id &&
            item.ring?.id == null &&
            item?.diamond_id == null
          ? "gemstone"
          : item.ring?.id && item?.diamond_id && !item?.gemstone_id
          ? "ring_diamond"
          : item.ring?.id && item?.gemstone_id
          ? "ring_gemstone"
          : item.ring_id &&
            item?.diamond_id == null &&
            item?.gemstone_id == null
          ? "matching_set"
          : "",
        userId,
        item.gemstone_id ? item.gemstone_id : "",

        item.gemstone_price ? item.gemstone_price : "",
        item.ring_id ? item.ring_id : "",
        item.active_color ? item.active_color : "",
        item.img_sku ? item.img_sku : "",
        item.ring_price ? item.ring_price : "",
        item.diamond_id ? item.diamond_id : "",
        item.diamond_price ? item.diamond_price : "",
        item.ring_type ? item.ring_type : "",
        item.ring_size ? item.ring_size : "",
        item.diamond_type ? item.diamond_type : "",
        item.diamond_stock_no ? item.diamond_stock_no : "",
        item.gemstone_stock_no ? item.gemstone_stock_no : "",
        item.engraving ? item.engraving : "",
        item.font ? item.font : ""
      );

      axios
        .get(`${baseUrl}/remove-cartitem/${item.id}`)
        .then((res) => {
          dispatch(productListCart());
        })
        .catch((error) => {
          console.log("CSRF Token API Error:", error);
        });
    });
  };
  const [disableButton, setDisableButton] = useState(false);
  const handleWishlist = async (
    product_type,
    user_id,
    gemstone_id,
    gemstone_price,
    ring_id,
    ring_color,
    img_sku,
    ring_price,
    diamond_id,
    diamond_price,
    ring_type,
    ring_size,
    diamond_type,
    diamond_stock_no,
    gemstone_stock_no,
    textEngraving,
    font_style
  ) => {
    setDisableButton(true);
    try {
      const apiUrl = `${baseUrl}/add_to_wishlist?user_id=${user_id}&gemstone_price=${gemstone_price}&gemstone_id=${gemstone_id}&gemstone_stock_no=${gemstone_stock_no}&product_type=${product_type}&ring_id=${ring_id}&ring_color=${ring_color}&img_sku=${img_sku}&ring_price=${ring_price}&diamond_id=${diamond_id}&diamond_price=${diamond_price}&ring_type=${ring_type}&ring_size=${ring_size}&diamond_type=${diamond_type}&diamond_stock_no=${diamond_stock_no}&engraving=${textEngraving}&font=${font_style}`;
      const response = await axios.get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": shapeData,
        },
      });

      if (response.status === 200) {
        dispatch(productList());
        setTimeout(() => {
          setDisableButton(false);
        }, 2000);
      } else {
        console.error(
          "Error adding item to wishlist. Status:",
          response.status
        );
        setDisableButton(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setDisableButton(false);
    }
  };

  const handleRemoveItem = (itemId, ring_id) => {
    setRemoveCartItem(itemId);

    cartData.map((item) => {
      if ((item.item?.id || item.ring_data?.id) === ring_id) {
        dispatch(removeToCart(item));
      }
    });
  };
  const handleRemoveItemCart = (itemId, ring_id) => {
    dispatch(productList());
    setRemoveCartItem(itemId);

    cartData.map((item) => {
      if (
        (item.item?.id ||
          item.diamonds?.id ||
          item?.ring_data?.id ||
          item.ring_id) === parseInt(ring_id)
      ) {
        dispatch(removeToCart(item));
        dispatch(addToWishlist(item));
      }
    });
  };
  const [loader, setLoader] = useState(true);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoader(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  // ============ meta tag  =======================//
//   const currentUrl = window.location.href;
//   const pathSegments = location.pathname
//     .split("/")
//     .filter((segment) => segment);
//   const mainCategory = pathSegments[0] || "";

  const handleClickCheckOut = () => {
    navigate(user_id ? "/check_out" : "/login", {
      state: { from: location.pathname },
    });
    if (!user_id) {
      toast.info("Please log in to proceed to checkout. ", {
        position: "top-right",
        className: "foo-bar",
      });
    }
  };

  return (
    <>
    <Header/>
      {/* <MetaTagCategoryPage
        mainCategory={mainCategory}
        currentUrl={currentUrl}
      /> */}
      {userId ? (
        <div className="shoping-car-page data-base-cart">
          <div className="container">
            {cartDetails.length > 0 ? (
              <div className="shoping-card-main-wrap">
                <div className="shoping-card">
                  {loader ? (
                    <p>Loading....</p>
                  ) : (
                    cartDetails?.map((item, index) => {
                      const selectedMetalColor = metalColor.find(
                        (colorItem) => colorItem.slug === item?.active_color
                      );
                      // show error if the same diamond is selected
                      isDuplicate = cartDetails.some((cartItem, i) => {
                        return (
                          i !== index &&
                          cartItem.diamond?.some((diamond) =>
                            item.diamond?.some(
                              (itemDiamond) => diamond.id === itemDiamond.id
                            )
                          )
                        );
                      });
                      //Hide checkout if duplicate diamonds is present
                      if (
                        item.diamond.length > 0 &&
                        cartDetails.some(
                          (cartItem, i) =>
                            i !== index &&
                            cartItem.diamond?.some((diamond) =>
                              item.diamond?.some(
                                (itemDiamond) => diamond.id === itemDiamond.id
                              )
                            )
                        )
                      ) {
                        hasDuplicates = true;
                      }
                      return (
                        <>
                          {/* ===========only gemstone */}
                          {item.gemstone_id &&
                          item.ring?.id == null &&
                          item?.diamond_id == null ? (
                            <div className="shop-card-inner gemstone">
                              <div className="product-info gemstone-only">
                                {item.gemstone?.map((gemstoneItem) => {
                                  return (
                                    <>
                                      <div class="detail-price-main">
                                        <div class="detail-col img white">
                                          <div class="detail-ring-image ring">
                                            <Link
                                              href={`/gemstones-detail/?stock_num=${item?.gemstone_id}`}
                                            >
                                              <img
                                                width="auto"
                                                height="auto"
                                                src={gemstoneItem?.image_url}
                                                alt={gemstoneItem?.shape}
                                                onError={(e) => {
                                                  e.target.onerror = null;
                                                  e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                                }}
                                              />
                                            </Link>
                                          </div>
                                        </div>

                                        <div class="detail-col white content">
                                          <div class="detail-content-main">
                                            <h4>
                                              {" "}
                                              <Link
                                                href={`/gemstones-detail/?stock_num=${item?.gemstone_id}`}
                                              >
                                                {gemstoneItem.short_title}
                                              </Link>
                                            </h4>

                                            <div class="detail-content-list">
                                              <ul>
                                                <li>
                                                  Style{" "}
                                                  <span>
                                                    {gemstoneItem?.stock_num}
                                                  </span>
                                                </li>
                                                <li>
                                                  Color{" "}
                                                  <span>
                                                    {gemstoneItem?.color}
                                                  </span>
                                                </li>

                                                <li>
                                                  Price{" "}
                                                  <span>
                                                    $
                                                    {Math.round(
                                                      gemstoneItem?.total_sales_price
                                                    )}
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="remove-option">
                                          <Link
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
                                              handleRemoveItemCart(
                                                item.id,
                                                gemstoneItem?.id
                                              );

                                              handleWishlist(
                                                "gemstone",
                                                userId,
                                                gemstoneItem?.stock_num,
                                                gemstoneItem?.total_sales_price,

                                                item.item?.ring.id
                                                  ? item.item?.ring.id
                                                  : "",
                                                item.item?.active_color
                                                  ? item.item?.active_color
                                                  : "",
                                                item.item?.img_sku
                                                  ? item.item?.img_sku
                                                  : "",
                                                item.item?.ring_price
                                                  ? item.item?.ring_price
                                                  : "",
                                                item.diamondItem?.stock_num
                                                  ? item.diamondItem?.stock_num
                                                  : "",
                                                item.diamondItem
                                                  ?.total_sales_price
                                                  ? item.diamondItem
                                                      ?.total_sales_price
                                                  : "",
                                                item.ring_type
                                                  ? item.ring_type
                                                  : "",
                                                item.ring_size
                                                  ? item.ring_size
                                                  : "",
                                                item.diamond_type
                                                  ? item.diamond_type
                                                  : "",
                                                item.diamondItem?.id
                                                  ? item.diamondItem?.id
                                                  : "",
                                                gemstoneItem?.id
                                                  ? gemstoneItem?.id
                                                  : "",
                                                item.engraving
                                                  ? item.engraving
                                                  : "",
                                                item.font ? item.font : ""
                                              );
                                            }}
                                          >
                                            <span className="txt-mtw">
                                              <CiHeart />
                                              Move to Wish List
                                            </span>
                                          </Link>
                                          <br />
                                          <Link
                                            href="javascript:void(0);"
                                            onClick={() =>
                                              handleRemoveItem(
                                                item?.id,
                                                gemstoneItem?.id
                                              )
                                            }
                                          >
                                            <IoIosClose />
                                            Remove
                                          </Link>
                                        </div>
                                      </div>
                                      <div className="gemstone-cart"></div>
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}

                          {/* ===========only gemstone end*/}

                          {/* ========== ring + diamond*/}
                          {item.ring?.id &&
                          item?.diamond_id &&
                          !item?.gemstone_id ? (
                            <>
                              <div class="detail-price-main">
                                <div class="detail-col img">
                                  <div class="detail-ring-image">
                                    <Link
                                      href={`/engagement-ring/${
                                        item.ring?.slug
                                      }?color=${item?.active_color}${
                                        item?.ring_type
                                          ? `&diamond_original=${item?.ring_type}`
                                          : ""
                                      }`}
                                    >
                                      <ul className="">
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
                                      </ul>
                                    </Link>
                                  </div>
                                </div>

                                <div class="detail-col white content">
                                  <div class="detail-content-main">
                                    <h4>
                                      <Link
                                        href={`/engagement-ring/${
                                          item.ring?.slug
                                        }?color=${item?.active_color}${
                                          item?.ring_type
                                            ? `&diamond_original=${item?.ring_type}`
                                            : ""
                                        }`}
                                      >
                                        {selectedMetalColor?.value}{" "}
                                        {item.ring?.name}
                                      </Link>
                                    </h4>

                                    <div class="detail-content-list">
                                      <ul>
                                        <li>
                                          Style
                                          <span>{item?.img_sku}</span>
                                        </li>
                                        <li>
                                          Ring Size{" "}
                                          <span>{item?.ring_size}</span>
                                        </li>
                                        <li>
                                          Price{" "}
                                          <span>
                                            ${Math.round(item?.ring_price)}
                                          </span>
                                        </li>
                                        {item.engraving != null && (
                                          <li>
                                            Engraving{" "}
                                            <span>{item.engraving}</span>
                                          </li>
                                        )}
                                        {item.font != null && (
                                          <li>
                                            Font <span>{item.font}</span>
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                {item.diamond
                                  ?.slice(0, 1)
                                  .map((diamondItem) => {
                                    return (
                                      <>
                                        <div class="detail-col img white">
                                          <div class="detail-ring-image ring">
                                            <Link
                                              href={`/view_diamond/?stock_num=${
                                                item.diamond_id
                                              }&diamond_origin=${
                                                item.diamond_type ===
                                                "Lab_grown_Diamond"
                                                  ? "lab_grown"
                                                  : "natural"
                                              }`}
                                            >
                                              <img
                                                width="auto"
                                                height="auto"
                                                src={diamondItem?.image_url}
                                                alt={diamondItem?.name}
                                                onError={(e) => {
                                                  e.target.onerror = null;
                                                  e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                                }}
                                              />
                                            </Link>
                                          </div>
                                        </div>

                                        <div class="detail-col white content">
                                          <div class="detail-content-main">
                                            <h4>
                                              <Link
                                                href={`/view_diamond/?stock_num=${
                                                  item.diamond_id
                                                }&diamond_origin=${
                                                  item.diamond_type ===
                                                  "Lab_grown_Diamond"
                                                    ? "lab_grown"
                                                    : "natural"
                                                }`}
                                              >
                                                {diamondItem?.size} Carat{" "}
                                                {diamondItem?.shape} Diamond
                                              </Link>
                                            </h4>

                                            <div class="detail-content-list">
                                              <ul>
                                                {diamondItem?.cut && (
                                                  <li>
                                                    Cut{" "}
                                                    <span>
                                                      {diamondItem?.cut}
                                                    </span>
                                                  </li>
                                                )}

                                                <li>
                                                  Style{" "}
                                                  <span>
                                                    {diamondItem?.stock_num}
                                                  </span>
                                                </li>
                                                {diamondItem?.color && (
                                                  <li>
                                                    Color{" "}
                                                    <span>
                                                      {diamondItem?.color}
                                                    </span>
                                                  </li>
                                                )}
                                                {diamondItem?.clarity && (
                                                  <li>
                                                    Clarity{" "}
                                                    <span>
                                                      {diamondItem?.clarity}
                                                    </span>
                                                  </li>
                                                )}
                                                <li>
                                                  Price{" "}
                                                  <span>
                                                    $
                                                    {Math.round(
                                                      diamondItem?.total_sales_price
                                                    )}
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="remove-option">
                                          <Link
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
                                              handleRemoveItemCart(
                                                item.id,
                                                item.ring_id
                                              );

                                              handleWishlist(
                                                "ring_diamond",
                                                userId,
                                                item.gemstoneItem?.stock_num
                                                  ? item.gemstoneItem?.stock_num
                                                  : "",
                                                item.gemstoneItem
                                                  ?.total_sales_price
                                                  ? item.gemstoneItem
                                                      ?.total_sales_price
                                                  : "",

                                                item?.ring.id,
                                                item?.active_color,
                                                item?.img_sku,
                                                item?.ring_price,
                                                diamondItem?.stock_num,
                                                diamondItem?.total_sales_price,
                                                item.ring_type,
                                                item.ring_size,
                                                item.diamond_type
                                                  ? item.diamond_type
                                                  : "",
                                                diamondItem?.id
                                                  ? diamondItem?.id
                                                  : "",
                                                item.gemstoneItem?.id
                                                  ? item.gemstoneItem?.id
                                                  : "",
                                                item.engraving
                                                  ? item.engraving
                                                  : "",
                                                item.font ? item.font : ""
                                              );
                                            }}
                                          >
                                            <span className="txt-mtw">
                                              <CiHeart />
                                              Move to Wish List
                                            </span>
                                          </Link>
                                          <br />
                                          <Link
                                            href="javascript:void(0);"
                                            onClick={() =>
                                              handleRemoveItem(
                                                item.id,
                                                item.ring_id
                                              )
                                            }
                                          >
                                            <IoIosClose />
                                            Remove
                                          </Link>
                                        </div>

                                        {item.diamond && isDuplicate && (
                                          <div className="available-list">
                                            <p className="exclamation-symbol-red">
                                              <span>
                                                <FaExclamationCircle />
                                              </span>
                                              This unique diamond exists in
                                              multiple places in your Shopping
                                              Cart. Please remove one of the
                                              items or{" "}
                                              <Link href="/engagement-rings/start-with-a-diamond">
                                                choose a new diamond
                                              </Link>{" "}
                                              before submitting your order.
                                            </p>
                                          </div>
                                        )}
                                      </>
                                    );
                                  })}
                              </div>
                            </>
                          ) : null}
                          {/* ============ */}

                          {/* ===========only diamond */}
                          {item.diamond_id &&
                          item.ring?.id == null &&
                          item?.gemstone_id == null ? (
                            <div className="shop-card-inner diamond-ring">
                              <div className="product-info diamond-only">
                                {item.diamond?.map((diamondItem) => {
                                  return (
                                    <>
                                      <div class="detail-price-main">
                                        <div class="detail-col img white">
                                          <div class="detail-ring-image ring">
                                            <Link
                                              href={`/view_diamond?stock_num=${
                                                item?.diamond_id
                                              }${
                                                item?.diamond_type ===
                                                "Lab_grown_Diamond"
                                                  ? "&diamond_origin=lab_grown"
                                                  : ""
                                              }`}
                                            >
                                              <img
                                                width="auto"
                                                height="auto"
                                                src={diamondItem?.image_url}
                                                alt={diamondItem?.name}
                                                onError={(e) => {
                                                  e.target.onerror = null;
                                                  e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                                }}
                                              />
                                            </Link>
                                          </div>
                                        </div>

                                        <div class="detail-col white content">
                                          <div class="detail-content-main">
                                            <h4>
                                              <Link
                                                href={`/view_diamond?stock_num=${
                                                  item?.diamond_id
                                                }${
                                                  item?.diamond_type ===
                                                  "Lab_grown_Diamond"
                                                    ? "&diamond_origin=lab_grown"
                                                    : ""
                                                }`}
                                              >
                                                {diamondItem?.size} Carat{" "}
                                                {diamondItem?.shape} Diamond
                                              </Link>
                                            </h4>

                                            <div class="detail-content-list">
                                              <ul>
                                                {diamondItem?.cut && (
                                                  <li>
                                                    Cut{" "}
                                                    <span>
                                                      {diamondItem?.cut}
                                                    </span>
                                                  </li>
                                                )}

                                                <li>
                                                  Style{" "}
                                                  <span>
                                                    {diamondItem?.stock_num}
                                                  </span>
                                                </li>
                                                {diamondItem?.color && (
                                                  <li>
                                                    Color{" "}
                                                    <span>
                                                      {diamondItem?.color}
                                                    </span>
                                                  </li>
                                                )}
                                                {diamondItem?.clarity && (
                                                  <li>
                                                    Clarity{" "}
                                                    <span>
                                                      {diamondItem?.clarity}
                                                    </span>
                                                  </li>
                                                )}
                                                <li>
                                                  Price{" "}
                                                  <span>
                                                    $
                                                    {Math.round(
                                                      diamondItem?.total_sales_price
                                                    )}
                                                  </span>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>

                                        <div className="remove-option">
                                          <Link
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
                                              handleRemoveItemCart(
                                                item.id,
                                                item?.diamond_stock_no
                                              );

                                              handleWishlist(
                                                "diamond",
                                                userId,
                                                item.gemstoneItem?.stock_num
                                                  ? item.gemstoneItem?.stock_num
                                                  : "",
                                                item.gemstoneItem
                                                  ?.total_sales_price
                                                  ? item.gemstoneItem
                                                      ?.total_sales_price
                                                  : "",

                                                item.item?.ring.id
                                                  ? item.item?.ring.id
                                                  : "",
                                                item.item?.active_color
                                                  ? item.item?.ring.id
                                                  : "",
                                                item.item?.img_sku
                                                  ? item.item?.ring.id
                                                  : "",
                                                item.item?.ring_price
                                                  ? item.item?.ring_price
                                                  : "",

                                                diamondItem?.stock_num,
                                                diamondItem?.total_sales_price,
                                                item.ring_type
                                                  ? item.ring_type
                                                  : "",
                                                item.ring_size
                                                  ? item.ring_size
                                                  : "",
                                                item.diamond_type
                                                  ? item.diamond_type
                                                  : "",
                                                diamondItem?.id
                                                  ? diamondItem?.id
                                                  : "",
                                                item.gemstoneItem?.id
                                                  ? item.gemstoneItem?.id
                                                  : "",
                                                item.engraving
                                                  ? item.engraving
                                                  : "",
                                                item.font ? item.font : ""
                                              );
                                            }}
                                          >
                                            <span className="txt-mtw">
                                              <CiHeart />
                                              Move to Wish List
                                            </span>
                                          </Link>
                                          <br />
                                          <Link
                                            href="javascript:void(0);"
                                            onClick={() =>
                                              handleRemoveItem(
                                                item.id,
                                                item?.diamond_stock_no
                                              )
                                            }
                                          >
                                            <IoIosClose />
                                            Remove
                                          </Link>
                                        </div>
                                      </div>

                                      {item.diamond && isDuplicate && (
                                        <div className="available-list">
                                          <p className="exclamation-symbol-red">
                                            <span>
                                              <FaExclamationCircle />
                                            </span>
                                            This unique diamond exists in
                                            multiple places in your Shopping
                                            Cart. Please remove one of the items
                                            or{" "}
                                            <Link href="/engagement-rings/start-with-a-diamond">
                                              choose a new diamond
                                            </Link>{" "}
                                            before submitting your order.
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}

                          {/* ===========only diamond end*/}

                          {/* ============= ring + gemstone*/}
                          {item.ring?.id && item?.gemstone_id ? (
                            <>
                              <div class="detail-price-main">
                                <div class="detail-col img">
                                  <div class="detail-ring-image">
                                    <Link
                                      href={`/engagement-ring/${
                                        item.ring?.slug
                                      }?color=${item?.active_color}${
                                        item?.ring_type
                                          ? `&diamond_original=${item?.ring_type}`
                                          : ""
                                      }`}
                                    >
                                      <ul className="">
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
                                      </ul>
                                    </Link>
                                  </div>
                                </div>

                                <div class="detail-col white content">
                                  <div class="detail-content-main">
                                    <h4>
                                      <Link
                                        href={`/engagement-ring/${
                                          item.ring?.slug
                                        }?color=${item?.active_color}${
                                          item?.ring_type
                                            ? `&diamond_original=${item?.ring_type}`
                                            : ""
                                        }`}
                                      >
                                        {selectedMetalColor?.value}{" "}
                                        {item.ring?.name}
                                      </Link>
                                    </h4>

                                    <div class="detail-content-list">
                                      <ul>
                                        <li>
                                          Style
                                          <span>{item?.img_sku}</span>
                                        </li>
                                        <li>
                                          Ring Size{" "}
                                          <span>{item?.ring_size}</span>
                                        </li>
                                        <li>
                                          Price{" "}
                                          <span>
                                            ${Math.round(item?.ring_price)}
                                          </span>
                                        </li>
                                        {item.engraving != null && (
                                          <li>
                                            Engraving{" "}
                                            <span>{item.engraving}</span>
                                          </li>
                                        )}
                                        {item.font != null && (
                                          <li>
                                            Font <span>{item.font}</span>
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                                {item.gemstone?.map((gemstoneItem) => {
                                  return (
                                    <>
                                      <div class="detail-col img white">
                                        <div class="detail-ring-image ring">
                                          <Link
                                            href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                          >
                                            <img
                                              width="auto"
                                              height="auto"
                                              src={gemstoneItem?.image_url}
                                              alt={gemstoneItem?.shape}
                                              onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                              }}
                                            />
                                          </Link>
                                        </div>
                                      </div>

                                      <div class="detail-col white content">
                                        <div class="detail-content-main">
                                          <h4>
                                            <Link
                                              href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                            >
                                              {gemstoneItem.short_title}
                                            </Link>
                                          </h4>

                                          <div class="detail-content-list">
                                            <ul>
                                              <li>
                                                Style{" "}
                                                <span>
                                                  {gemstoneItem?.stock_num}
                                                </span>
                                              </li>
                                              <li>
                                                Color{" "}
                                                <span>
                                                  {gemstoneItem?.color}
                                                </span>
                                              </li>

                                              <li>
                                                Price{" "}
                                                <span>
                                                  $
                                                  {Math.round(
                                                    gemstoneItem?.total_sales_price
                                                  )}
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>

                                      <div className="remove-option">
                                        <Link
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
                                            handleRemoveItemCart(
                                              item.id,
                                              item.ring_id
                                            );
                                            handleWishlist(
                                              "ring_gemstone",
                                              userId,
                                              gemstoneItem?.stock_num,
                                              gemstoneItem?.total_sales_price,

                                              item?.ring.id,
                                              item?.active_color,
                                              item?.img_sku,
                                              item?.ring_price,

                                              item.diamondItem?.stock_num
                                                ? item.diamondItem?.stock_num
                                                : "",
                                              item.diamondItem
                                                ?.total_sales_price
                                                ? item.diamondItem
                                                    ?.total_sales_price
                                                : "",
                                              item.ring_type,
                                              item.ring_size,
                                              item.diamond_type
                                                ? item.diamond_type
                                                : "",
                                              item.diamondItem?.id
                                                ? item.diamondItem?.id
                                                : "",
                                              gemstoneItem?.id
                                                ? gemstoneItem?.id
                                                : "",
                                              item.engraving
                                                ? item.engraving
                                                : "",
                                              item.font ? item.font : ""
                                            );
                                          }}
                                        >
                                          <span className="txt-mtw">
                                            <CiHeart />
                                            Move to Wish List
                                          </span>
                                        </Link>
                                        <br />
                                        <Link
                                          href="javascript:void(0);"
                                          onClick={() =>
                                            handleRemoveItem(
                                              item.id,
                                              item.ring_id
                                            )
                                          }
                                        >
                                          <IoIosClose />
                                          Remove
                                        </Link>
                                      </div>
                                    </>
                                  );
                                })}
                              </div>
                            </>
                          ) : null}

                          {/* ===========only matching_set */}
                          {item.ring_id &&
                          item?.diamond_id == null &&
                          item?.gemstone_id == null ? (
                            <div className="shop-card-inner gemstone">
                              <div className="product-info gemstone-only">
                                <div class="detail-price-main">
                                  <div class="detail-col img white">
                                    <div class="detail-ring-image ring">
                                      <Link
                                        href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                      >
                                        <ul className="">
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
                                        </ul>
                                      </Link>
                                    </div>
                                  </div>

                                  <div class="detail-col white content">
                                    <div class="detail-content-main">
                                      <h4>
                                        {" "}
                                        <Link
                                          href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                        >
                                          {item.ring?.name}
                                        </Link>
                                      </h4>

                                      <div class="detail-content-list">
                                        <ul>
                                          <li>
                                            Style <span>{item.img_sku}</span>
                                          </li>
                                          <li>
                                            Ring Size{" "}
                                            <span>{item.ring_size}</span>
                                          </li>

                                          <li>
                                            Price{" "}
                                            <span>
                                              ${Math.round(item.ring_price)}
                                            </span>
                                          </li>
                                          {item.engraving != null && (
                                            <li>
                                              Engraving{" "}
                                              <span>{item.engraving}</span>
                                            </li>
                                          )}
                                          {item.font != null && (
                                            <li>
                                              Font <span>{item.font}</span>
                                            </li>
                                          )}
                                        </ul>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="remove-option">
                                    <Link
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
                                        handleRemoveItemCart(
                                          item.id,
                                          item.ring_id
                                        );

                                        handleWishlist(
                                          "matching_set",
                                          userId,
                                          item?.gemstone_stock_no
                                            ? item?.gemstone_stock_no
                                            : "",
                                          item?.gemstone_price
                                            ? item?.gemstone_price
                                            : "",
                                          item.ring_id ? item.ring_id : "",
                                          item.active_color
                                            ? item.active_color
                                            : "",
                                          item.img_sku ? item.img_sku : "",
                                          item.ring_price
                                            ? item.ring_price
                                            : "",
                                          item.diamondItem?.stock_num
                                            ? item.diamondItem?.stock_num
                                            : "",
                                          item.diamondItem?.total_sales_price
                                            ? item.diamondItem
                                                ?.total_sales_price
                                            : "",
                                          item.ring_type ? item.ring_type : "",
                                          item.ring_size ? item.ring_size : "",
                                          item.diamond_type
                                            ? item.diamond_type
                                            : "",
                                          item.diamondItem?.id
                                            ? item.diamondItem?.id
                                            : "",
                                          item?.gemstone_id
                                            ? item?.gemstone_id
                                            : "",
                                          item.engraving ? item.engraving : "",
                                          item.font ? item.font : ""
                                        );
                                      }}
                                    >
                                      <span className="txt-mtw">
                                        <CiHeart />
                                        Move to Wish List
                                      </span>
                                    </Link>
                                    <br />
                                    <Link
                                      href="javascript:void(0);"
                                      onClick={() =>
                                        handleRemoveItem(
                                          item?.id,
                                          item.ring?.id
                                        )
                                      }
                                    >
                                      <IoIosClose />
                                      Remove
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : null}

                          {/* ===========matching-set end*/}

                          {/* =================== */}
                        </>
                      );
                    })
                  )}
                  <div class="protect-purchase-main">
                    <div class="protect-content">
                      <div class="pro-left">
                        <h4>Protect Your Purchase</h4>
                        <p>
                          Add a Protection Plan from <b>Extend</b>
                        </p>
                      </div>

                      <div class="pro-right">
                        <Link class="btn learn" href="#">
                          Learn More &gt;
                        </Link>
                      </div>
                    </div>
                    <div class="protect-check-list">
                      <ul>
                        <li
                          className={
                            plans === 1 ? "plan-active" : "plan-inactive"
                          }
                          onClick={() => setPlans(1)}
                        >
                          <b>No Plan</b>
                        </li>

                        <li
                          className={
                            plans === 2 ? "plan-active" : "plan-inactive"
                          }
                          onClick={() => setPlans(2)}
                        >
                          <b>3 Years</b>$259.00
                        </li>

                        <li
                          className={
                            plans === 3 ? "plan-active" : "plan-inactive"
                          }
                          onClick={() => setPlans(3)}
                        >
                          <b>5 Years</b>$299.00
                        </li>

                        <li
                          className={
                            plans === 4 ? "plan-active" : "plan-inactive"
                          }
                          onClick={() => setPlans(4)}
                        >
                          <b>Lifetime</b>$599.00
                        </li>
                      </ul>
                    </div>
                  </div>

                  <ChooseYourImpact />
                </div>

                <div className="card-right-side">
                  <div className="card-right-side-in">
                    <div className="order-box">
                      <h3>Price & Cost Shipping</h3>
                      <p className="order-para-checkout">
                        Please Check Before Buy
                      </p>
                      {cartDetails?.slice(0, 1).map((item) => {
                        return (
                          <>
                            <div className="table-count">
                              <div class="detail-content-list-checkout">
                                <ul>
                                  <li>
                                    <b>Subtotal </b>
                                    <span>
                                      $
                                      {Math.round(
                                        calculateTotalPriceDatabase()
                                      )}
                                    </span>
                                  </li>
                                  <li>
                                    Price{" "}
                                    <span>
                                      $
                                      {Math.round(
                                        calculateTotalPriceDatabase()
                                      )}
                                    </span>
                                  </li>
                                  {/* <li>
                                    Shipping Fees <span>$15.00</span>
                                  </li> */}
                                  <li>
                                    Sales TAX est.
                                    <span>$0</span>
                                  </li>
                                  <li>
                                    UPS 2-Day (2 business days)
                                    <span>Complimentary</span>
                                  </li>
                                  <li>
                                    UPS Overnight (1 business day)
                                    <span>$50 USD (plus applicable taxes)</span>
                                  </li>
                                </ul>
                                <div className="last-update-order">
                                  <p>
                                    Last Update {date} | {time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>

                    <div className="shipping-info">
                      <h4>
                        <Link
                          href="javascript:void(0)"
                          style={{
                            pointerEvents: disableButton ? "none" : "auto",
                            cursor: disableButton ? "not-allowed" : "pointer",
                          }}
                          onClick={() => handleAllWishlist()}
                        >
                          {" "}
                          <span>Move to Wish List</span>
                          <span>
                            <CiHeart />
                          </span>
                        </Link>
                      </h4>
                    </div>
                    <div className="add-form-gift-message">
                      <div
                        className="add-per-info"
                        onClick={() => {
                          if (!localMessage) {
                            setDown(!down);
                            setShowMessage(false);
                          }
                        }}
                      >
                        <p>Add a Personalized Gift Message </p>
                        <span>
                          <CiGift />
                        </span>
                      </div>

                      {down && (
                        <div className="add-form">
                          <form>
                            <textarea
                              value={message}
                              onChange={handleChange}
                            ></textarea>
                            <label htmlFor="receipt">
                              <input
                                id="receipt"
                                type="checkbox"
                                checked={checked}
                                onChange={handleCheckboxChange}
                              />
                              Include price on receipt
                            </label>
                          </form>

                          <div className="save-buttons">
                            <p>
                              <Link
                                href="#"
                                className="td-u"
                                onClick={() => handleCancelMessage()}
                              >
                                Cancel
                              </Link>{" "}
                              |{" "}
                              <Link
                                href="#"
                                className="td-u"
                                onClick={handleSaveMessage}
                              >
                                Save Message
                              </Link>
                            </p>
                          </div>
                        </div>
                      )}
                      {showMessage && (
                        <div className="saved-message">
                          <p>
                            {secureLocalStorage?.getItem("personalizedMessage")}
                          </p>
                          <label htmlFor="receipt">
                            <input
                              id="receipt"
                              type="checkbox"
                              checked={checked}
                              onChange={handleCheckboxChange}
                            />
                            Include price on receipt
                          </label>
                          <div className="edit-delete-buttons">
                            <Link onClick={handleEditMessage}>Edit</Link> |{" "}
                            <Link onClick={handleDeleteMessage}>Delete</Link>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="add-form-gift">
                      <div className="add-per-info">
                        <p>
                          Need Assistance? <span>Chat Now or Call Us </span>{" "}
                        </p>
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="31"
                            height="30"
                            viewBox="0 0 31 30"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_492_16006)">
                              <path
                                d="M26.2969 23.4375V24.375C26.2969 25.3696 25.9018 26.3234 25.1985 27.0266C24.4953 27.7299 23.5414 28.125 22.5469 28.125H15.9844"
                                stroke="black"
                                stroke-width="1.875"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M26.2969 15H22.5469C22.0496 15 21.5727 15.1975 21.2211 15.5492C20.8694 15.9008 20.6719 16.3777 20.6719 16.875V21.5625C20.6719 22.0598 20.8694 22.5367 21.2211 22.8883C21.5727 23.24 22.0496 23.4375 22.5469 23.4375H26.2969V15ZM26.2969 15C26.2969 13.5226 26.0059 12.0597 25.4405 10.6948C24.8752 9.3299 24.0465 8.08971 23.0018 7.04505C21.9572 6.00039 20.717 5.17172 19.3521 4.60636C17.9872 4.04099 16.5242 3.75 15.0469 3.75C13.5695 3.75 12.1066 4.04099 10.7417 4.60636C9.37677 5.17172 8.13658 6.00039 7.09192 7.04505C6.04726 8.08971 5.2186 9.3299 4.65323 10.6948C4.08786 12.0597 3.79687 13.5226 3.79688 15M3.79688 15V21.5625C3.79688 22.0598 3.99442 22.5367 4.34605 22.8883C4.69768 23.24 5.17459 23.4375 5.67188 23.4375H7.54688C8.04416 23.4375 8.52107 23.24 8.8727 22.8883C9.22433 22.5367 9.42188 22.0598 9.42188 21.5625V16.875C9.42188 16.3777 9.22433 15.9008 8.8727 15.5492C8.52107 15.1975 8.04416 15 7.54688 15H3.79688Z"
                                stroke="black"
                                stroke-width="1.875"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_492_16006">
                                <rect
                                  width="30"
                                  height="30"
                                  fill="white"
                                  transform="translate(0.5)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {!hasDuplicates ? (
                      <div className="add-form-gift-checkout">
                        <div className="">
                          <Link
                            className=""
                            href={user_id ? "/check_out" : "#"}
                            onClick={() => {
                              if (!user_id) {
                                toast.info(
                                  "Please log in to proceed to checkout. ",
                                  {
                                    position: "top-right",
                                    className: "foo-bar",
                                  }
                                );
                              }
                            }}
                          >
                            <div className="add-per-info">
                              <p>
                                Total $
                                {Math.round(calculateTotalPriceDatabase())}
                              </p>
                              <span>Checkout</span>
                            </div>
                          </Link>
                        </div>

                        {againDown && (
                          <div className="add-form">
                            <form>
                              <input type="text" placeholder="" />
                            </form>
                          </div>
                        )}
                      </div>
                    ) : null}

                    <div className="other-payment-button">
                      <GooglePayButton
                        environment="TEST"
                        paymentRequest={{
                          apiVersion: 2,
                          apiVersionMinor: 0,
                          allowedPaymentMethods: [
                            {
                              type: "CARD",
                              parameters: {
                                allowedAuthMethods: [
                                  "PAN_ONLY",
                                  "CRYPTOGRAM_3DS",
                                ],
                                allowedCardNetworks: ["MASTERCARD", "VISA"],
                              },
                              tokenizationSpecification: {
                                type: "PAYMENT_GATEWAY",
                                parameters: {
                                  gateway: "example",
                                  gatewayMerchantId: "exampleGatewayMerchantId",
                                },
                              },
                            },
                          ],
                          merchantInfo: {
                            merchantId: "12345678901234567890",
                            merchantName: "Demo Merchant",
                          },
                          transactionInfo: {
                            totalPriceStatus: "FINAL",
                            totalPriceLabel: "Total",
                            totalPrice: "100.00",
                            currencyCode: "USD",
                            countryCode: "US",
                          },

                          shippingAddressRequired: true,
                          callbackIntents: [
                            "SHIPPING_ADDRESS",
                            "PAYMENT_AUTHORIZATION",
                          ],
                        }}
                        onLoadPaymentData={(paymentRequest) => {}}
                        onPaymentAuthorized={(paymentData) => {
                          return { transactionState: "SUCCESS" };
                        }}
                        onPaymentDataChanged={(paymentData) => {
                          return {};
                        }}
                        existingPaymentMethodRequired="false"
                        buttonColor="black"
                        buttonType="Buy"
                      />

                      <PaypalCheckoutButton />
                      {/* <ApplePayCheckoutButton/> */}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="shopping-card-main-wrap empty-cart">
                <h1>Your Shopping Bag Is Empty</h1>
                {/* <ContinueShoping /> */}
              </div>
            )}
            {/* <CartPageJewellery /> */}
          </div>
        </div>
      ) : (
        <div className="shoping-car-page">
          <div className="container">
            {cartData.length > 0 ? (
              <div className="shoping-card-main-wrap">
                <div className="shoping-card">
                  {cartData.map((item, index) => {
                    const selectedMetalColor = metalColor.find(
                      (colorItem) => colorItem?.slug === item.ring_color
                    );
                    // show error if the same diamond is selected

                    isDuplicate = cartData.some(
                      (cartItem, i) =>
                        i !== index &&
                        (cartItem.diamonds?.id || cartItem.diamondItem?.id) ===
                          (item.diamonds?.id || item.diamondItem?.id)
                    );

                    if (
                      (item.diamonds != null || item.diamondItem != null) &&
                      cartData.some(
                        (cartItem, i) =>
                          i !== index &&
                          (cartItem.diamonds?.id ||
                            cartItem.diamondItem?.id) ===
                            (item.diamonds?.id || item.diamondItem?.id)
                      )
                    ) {
                      hasDuplicates = true;
                    }

                    return (
                      <>
                        <div className="shop-card-inner main-cart-inner">
                          {item.gemstoneSingle || item.item ? (
                            <>
                              <div className="shop-card-inner gemstone">
                                <div className="product-info gemstone-only">
                                  <>
                                    <div class="detail-price-main">
                                      <div class="detail-col img white">
                                        <div class="detail-ring-image ring">
                                          <Link
                                            href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                                          >
                                            <img
                                              width="auto"
                                              height="auto"
                                              src={
                                                item.gemstoneSingle?.image_url
                                                  ? item.gemstoneSingle
                                                      ?.image_url
                                                  : item.item?.image_url
                                              }
                                              alt={
                                                item.gemstoneSingle?.shape
                                                  ? item.gemstoneSingle?.shape
                                                  : item.item?.name
                                              }
                                              onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                              }}
                                            />
                                          </Link>
                                        </div>
                                      </div>

                                      <div class="detail-col white content">
                                        <div class="detail-content-main">
                                          <h4>
                                            <Link
                                              href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                                            >
                                              {" "}
                                              {item.gemstoneSingle?.short_title
                                                ? item.gemstoneSingle
                                                    ?.short_title
                                                : item.item?.short_title}
                                            </Link>
                                          </h4>

                                          <div class="detail-content-list">
                                            <ul>
                                              <li>
                                                Style{" "}
                                                <span>
                                                  {item.gemstoneSingle
                                                    ? item?.gemstoneSingle
                                                        .stock_num
                                                    : item.item?.stock_num}
                                                </span>
                                              </li>
                                              <li>
                                                Color{" "}
                                                <span>
                                                  {item.gemstoneSingle
                                                    ? item?.gemstoneSingle.color
                                                    : item.item?.color}
                                                </span>
                                              </li>

                                              <li>
                                                Price{" "}
                                                <span>
                                                  $
                                                  {Math.round(
                                                    item.gemstoneSingle
                                                      ? item?.gemstoneSingle
                                                          .total_sales_price
                                                      : item.item
                                                          ?.total_sales_price
                                                  )}
                                                </span>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="main-cart-inner">
                                        <div className="cart-left-pic">
                                          <div className="remove-option">
                                            <Link
                                              href="#"
                                              onClick={() =>
                                                handleWishlistGemstoneAndBand(
                                                  item
                                                )
                                              }
                                            >
                                              <span className="txt-mtw">
                                                <CiHeart />
                                                Move to Wish List
                                              </span>
                                            </Link>
                                            <br />
                                            <Link
                                              href="javascript:void(0);"
                                              onClick={() =>
                                                removeProduct(item)
                                              }
                                            >
                                              <IoIosClose />
                                              Remove
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                </div>
                              </div>
                            </>
                          ) : item.ring_data ? (
                            <>
                              <div class="detail-price-main">
                                <div class="detail-col img">
                                  <div class="detail-ring-image">
                                    <Link
                                      href={`/engagement-ring/${
                                        item.ring_data?.slug
                                      }?color=${item?.ring_color}${
                                        item?.ring_type
                                          ? `&diamond_original=${item?.ring_type}`
                                          : ""
                                      }`}
                                    >
                                      <ul className="">
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
                                            src={`${imgBaseUrl}/${item.ring_img}/${item.ring_img}.jpg`}
                                            alt={item.ring_data?.name}
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
                                            src={`${imgBaseUrl}/${item.ring_img}/${item.ring_img}.alt.jpg`}
                                            alt={item.ring_data?.name}
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
                                            src={`${imgBaseUrl}/${item.ring_img}/${item.ring_img}.alt1.jpg`}
                                            alt={item.ring_data?.name}
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
                                            src={`${imgBaseUrl}/${item.ring_img}/${item.ring_img}.jpg`}
                                            alt={item.ring_data?.name}
                                            className="img-responsive center-block"
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </li>
                                      </ul>
                                    </Link>
                                  </div>
                                </div>

                                <div class="detail-col white content">
                                  <div class="detail-content-main">
                                    <h4>
                                      <Link
                                        href={`/engagement-ring/${
                                          item.ring_data?.slug
                                        }?color=${item?.ring_color}${
                                          item?.ring_type
                                            ? `&diamond_original=${item?.ring_type}`
                                            : ""
                                        }`}
                                      >
                                        {selectedMetalColor?.value}{" "}
                                        {item.ring_data?.name}
                                      </Link>
                                    </h4>

                                    <div class="detail-content-list">
                                      <ul>
                                        <li>
                                          Style
                                          <span>{item?.ring_img}</span>
                                        </li>
                                        <li>
                                          Ring Size{" "}
                                          <span>{item?.ring_size}</span>
                                        </li>
                                        <li>
                                          Price{" "}
                                          <span>
                                            $
                                            {Math.round(
                                              item?.ring_price || item.ringPrice
                                            )}
                                          </span>
                                        </li>
                                        {item?.textEngraving && (
                                          <li>
                                            Engraving{" "}
                                            <span>{item?.textEngraving}</span>
                                          </li>
                                        )}{" "}
                                        {item?.font_style && (
                                          <li>
                                            Font <span>{item?.font_style}</span>
                                          </li>
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                </div>

                                {item.diamondItem ? (
                                  <>
                                    <div class="detail-col img white">
                                      <div class="detail-ring-image ring">
                                        <Link
                                          href={`/view_diamond/?stock_num=${item.diamondItem?.stock_num}&diamond_origin=${item?.type_diamond}`}
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={item.diamondItem?.image_url}
                                            alt={item.diamondItem?.name}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </Link>
                                      </div>
                                    </div>

                                    <div class="detail-col white content">
                                      <div class="detail-content-main">
                                        <h4>
                                          <Link
                                            href={`/view_diamond/?stock_num=${item.diamondItem?.stock_num}&diamond_origin=${item?.type_diamond}`}
                                          >
                                            {item.diamondItem?.size} Carat{" "}
                                            {item.diamondItem?.shape} Diamond
                                          </Link>
                                        </h4>

                                        <div class="detail-content-list">
                                          <ul>
                                            <li>
                                              Cut{" "}
                                              <span>
                                                {item.diamondItem?.cut}
                                              </span>
                                            </li>
                                            <li>
                                              Style{" "}
                                              <span>
                                                {item.diamondItem?.stock_num}
                                              </span>
                                            </li>
                                            <li>
                                              Color{" "}
                                              <span>
                                                {item.diamondItem?.color}
                                              </span>
                                            </li>
                                            <li>
                                              Clarity{" "}
                                              <span>
                                                {item.diamondItem?.clarity}
                                              </span>
                                            </li>
                                            <li>
                                              Price{" "}
                                              <span>
                                                $
                                                {Math.round(
                                                  item.diamondItem
                                                    ?.total_sales_price
                                                )}
                                              </span>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="remove-option">
                                      <Link
                                        href="#"
                                        onClick={() =>
                                          handleWishlistItem(
                                            item.ring_data,
                                            item.diamondItem
                                              ? item.diamondItem
                                              : item.gemstone,
                                            item,
                                            item.diamondItem
                                              ? "ring_diamond"
                                              : "ring_gemstone",
                                            item?.ring_size,
                                            item?.ring_color,
                                            item?.ring_img,
                                            item?.ring_price
                                              ? item?.ring_price
                                              : item.ringPrice
                                          )
                                        }
                                      >
                                        <span className="txt-mtw">
                                          <CiHeart />
                                          Move to Wish List
                                        </span>
                                      </Link>
                                      <br />
                                      <Link
                                        href="javascript:void(0);"
                                        onClick={() => removeProduct(item)}
                                      >
                                        <IoIosClose />
                                        Remove
                                      </Link>
                                    </div>
                                    {item.diamondItem && isDuplicate && (
                                      <div className="available-list">
                                        <p className="exclamation-symbol-red">
                                          <span>
                                            <FaExclamationCircle />
                                          </span>
                                          This unique diamond exists in multiple
                                          places in your Shopping Cart. Please
                                          remove one of the items or{" "}
                                          <Link href="/engagement-rings/start-with-a-diamond">
                                            choose a new diamond
                                          </Link>{" "}
                                          before submitting your order.
                                        </p>
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div class="detail-col img white">
                                      <div class="detail-ring-image ring">
                                        <Link
                                          href={`/gemstones-detail/?stock_num=${item.gemstone?.stock_num}`}
                                        >
                                          <img
                                            width="auto"
                                            height="auto"
                                            src={item.gemstone?.image_url}
                                            alt={item.gemstone?.shape}
                                            onError={(e) => {
                                              e.target.onerror = null;
                                              e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                            }}
                                          />
                                        </Link>
                                      </div>
                                    </div>

                                    <div class="detail-col white content">
                                      <div class="detail-content-main">
                                        <h4>
                                          {" "}
                                          <Link
                                            href={`/gemstones-detail/?stock_num=${item.gemstone?.stock_num}`}
                                          >
                                            {item.gemstone?.short_title}
                                          </Link>
                                        </h4>

                                        <div class="detail-content-list">
                                          <ul>
                                            <li>
                                              Style{" "}
                                              <span>
                                                {item.gemstone?.stock_num}
                                              </span>
                                            </li>
                                            <li>
                                              Color{" "}
                                              <span>
                                                {item.gemstone?.color}
                                              </span>
                                            </li>

                                            <li>
                                              Price{" "}
                                              <span>
                                                $
                                                {Math.round(
                                                  item.gemstone
                                                    ?.total_sales_price
                                                )}
                                              </span>
                                            </li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="remove-option">
                                      <Link
                                        href="#"
                                        onClick={() =>
                                          handleWishlistItem(
                                            item.ring_data,
                                            item.diamondItem
                                              ? item.diamondItem
                                              : item.gemstone,
                                            item,
                                            item.diamondItem
                                              ? "ring_diamond"
                                              : "ring_gemstone",
                                            item?.ring_size,
                                            item?.ring_color,
                                            item?.ring_img,
                                            item?.ring_price
                                              ? item?.ring_price
                                              : item?.ringPrice
                                          )
                                        }
                                      >
                                        <span className="txt-mtw">
                                          <CiHeart />
                                          Move to Wish List
                                        </span>
                                      </Link>
                                      <br />
                                      <Link
                                        href="javascript:void(0);"
                                        onClick={() => removeProduct(item)}
                                      >
                                        <IoIosClose />
                                        Remove
                                      </Link>
                                    </div>
                                    {item.diamondItem && isDuplicate && (
                                      <div className="available-list">
                                        <p className="exclamation-symbol-red">
                                          <span>
                                            <FaExclamationCircle />
                                          </span>
                                          This unique diamond exists in multiple
                                          places in your Shopping Cart. Please
                                          remove one of the items or{" "}
                                          <Link href="/engagement-rings/start-with-a-diamond">
                                            choose a new diamond
                                          </Link>{" "}
                                          before submitting your order.
                                        </p>
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </>
                          ) : item.product_type === "matching_set" ? (
                            <>
                              <div className="shop-card-inner gemstone">
                                <div className="product-info gemstone-only">
                                  <>
                                    <div class="detail-price-main">
                                      <div class="detail-col img white">
                                        <div class="detail-ring-image ring">
                                          <Link
                                            href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                                          >
                                            <ul className="">
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
                                            </ul>
                                          </Link>
                                        </div>
                                      </div>

                                      <div class="detail-col white content">
                                        <div class="detail-content-main">
                                          <h4>
                                            <Link
                                              href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                                            >
                                              <>{item.ring?.name}</>
                                            </Link>
                                          </h4>

                                          <div class="detail-content-list">
                                            <ul>
                                              <li>
                                                Style{" "}
                                                <span>{item?.ring_img}</span>
                                              </li>
                                              <li>
                                                Ring Size{" "}
                                                <span>{item?.ring_size}</span>
                                              </li>
                                              <li>
                                                Price{" "}
                                                <span>
                                                  $
                                                  {Math.round(item?.ring_price)}
                                                </span>
                                              </li>
                                              {item?.textEngraving && (
                                                <li>
                                                  Engraving{" "}
                                                  <span>
                                                    {item?.textEngraving}
                                                  </span>
                                                </li>
                                              )}{" "}
                                              {item?.font_style && (
                                                <li>
                                                  Font{" "}
                                                  <span>
                                                    {item?.font_style}
                                                  </span>
                                                </li>
                                              )}
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="main-cart-inner">
                                        <div className="cart-left-pic">
                                          <div className="remove-option">
                                            <Link
                                              href="#"
                                              onClick={() =>
                                                handleWishlistGemstoneAndBand(
                                                  item
                                                )
                                              }
                                            >
                                              <span className="txt-mtw">
                                                <CiHeart />
                                                Move to Wish List
                                              </span>
                                            </Link>
                                            <br />
                                            <Link
                                              href="javascript:void(0);"
                                              onClick={() =>
                                                removeProduct(item)
                                              }
                                            >
                                              <IoIosClose />
                                              Remove
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                </div>
                              </div>
                            </>
                          ) : (
                            <>
                              <>
                                <div class="detail-price-main">
                                  <div class="detail-col img white">
                                    <div class="detail-ring-image ring">
                                      <Link
                                        href={`/view_diamond?stock_num=${
                                          item.diamonds?.stock_num
                                        }${
                                          item?.diamond_type === "natural"
                                            ? ""
                                            : `&diamond_origin=lab_grown`
                                        }`}
                                      >
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={item.diamonds?.image_url}
                                          alt={item.diamonds?.name}
                                          onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                          }}
                                        />
                                      </Link>
                                    </div>
                                  </div>

                                  <div class="detail-col white">
                                    <div class="detail-content-main">
                                      <h4>
                                        <Link
                                          href={`/view_diamond?stock_num=${
                                            item.diamonds?.stock_num
                                          }${
                                            item?.diamond_type === "natural"
                                              ? ""
                                              : `&diamond_origin=lab_grown`
                                          }`}
                                        >
                                          {item.diamonds?.size} Carat{" "}
                                          {item.diamonds?.shape} Diamond
                                        </Link>
                                      </h4>

                                      <div class="detail-content-list">
                                        <ul>
                                          <li>
                                            Cut{" "}
                                            <span>{item.diamonds?.cut}</span>
                                          </li>
                                          <li>
                                            Style{" "}
                                            <span>
                                              {item.diamonds?.stock_num}
                                            </span>
                                          </li>
                                          <li>
                                            Color{" "}
                                            <span>{item.diamonds?.color}</span>
                                          </li>
                                          <li>
                                            Clarity{" "}
                                            <span>
                                              {item.diamonds?.clarity}
                                            </span>
                                          </li>
                                          <li>
                                            Price{" "}
                                            <span>
                                              $
                                              {Math.round(
                                                item.diamonds?.total_sales_price
                                              )}
                                            </span>
                                          </li>
                                        </ul>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="main-cart-inner">
                                    <div className="cart-left-pic">
                                      <div className="remove-option">
                                        <Link
                                          href="#"
                                          onClick={() =>
                                            handleWishDataDiamonds(item)
                                          }
                                        >
                                          <span className="txt-mtw">
                                            <CiHeart />
                                            Move to Wish List
                                          </span>
                                        </Link>
                                        <br />
                                        <Link
                                          href="javascript:void(0);"
                                          onClick={() => removeProduct(item)}
                                        >
                                          <IoIosClose />
                                          Remove
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                  {item.diamonds && isDuplicate && (
                                    <div className="available-list">
                                      <p className="exclamation-symbol-red">
                                        <span>
                                          <FaExclamationCircle />
                                        </span>
                                        This unique diamond exists in multiple
                                        places in your Shopping Cart. Please
                                        remove one of the items or{" "}
                                        <Link href="/engagement-rings/start-with-a-diamond">
                                          choose a new diamond
                                        </Link>{" "}
                                        before submitting your order.
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </>
                            </>
                          )}
                        </div>
                      </>
                    );
                  })}

                  <div class="protect-purchase-main">
                    <div class="protect-content">
                      <div class="pro-left">
                        <h4>Protect Your Purchase</h4>
                        <p>
                          Add a Protection Plan from <b>Extend</b>
                        </p>
                      </div>

                      <div class="pro-right">
                        <Link class="btn learn" href="#">
                          Learn More &gt;
                        </Link>
                      </div>
                    </div>
                    <div class="protect-check-list">
                      <ul>
                        <li
                          className={
                            plans === 1 ? "plan-active" : "plan-inactive"
                          }
                          onClick={() => setPlans(1)}
                        >
                          <b>No Plan</b>
                        </li>

                        <li
                          className={
                            plans === 2 ? "plan-active" : "plan-inactive"
                          }
                          onClick={() => setPlans(2)}
                        >
                          <b>3 Years</b>$259.00
                        </li>

                        <li
                          className={
                            plans === 3 ? "plan-active" : "plan-inactive"
                          }
                          onClick={() => setPlans(3)}
                        >
                          <b>5 Years</b>$299.00
                        </li>

                        <li
                          className={
                            plans === 4 ? "plan-active" : "plan-inactive"
                          }
                          onClick={() => setPlans(4)}
                        >
                          <b>Lifetime</b>$599.00
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* <ChooseYourImpact /> */}
                  
                  <div class="protect-purchase-main social-cause-donation">
                    <div class="protect-content">
                      <div class="pro-left"></div>
                      <div class="pro-right"></div>
                      <div class="pro-left"></div>
                      <div class="pro-right"></div>
                    </div>
                  </div>
                </div>

                <div className="card-right-side">
                  <div className="card-right-side-in">
                    <div className="order-box">
                      <h3>Price & Cost Shipping</h3>
                      <p className="order-para-checkout">
                        Please Check Before Buy
                      </p>
                      {cartData?.slice(0, 1).map((item) => {
                        return (
                          <>
                            <div className="table-count">
                              <div class="detail-content-list-checkout">
                                <ul>
                                  <li>
                                    <b>Subtotal </b>
                                    <span>
                                      ${Math.round(calculateTotalPrice())}
                                    </span>
                                  </li>
                                  <li>
                                    Price{" "}
                                    <span>
                                      ${Math.round(calculateTotalPrice())}
                                    </span>
                                  </li>
                                  {/* <li>
                                    Shipping Fees <span>$15.00</span>
                                  </li> */}
                                  <li>
                                    Sales TAX est.
                                    <span>$0</span>
                                  </li>
                                  <li>
                                    UPS 2-Day (2 business days)
                                    <span>Complimentary</span>
                                  </li>
                                  <li>
                                    UPS Overnight (1 business day)
                                    <span>$50 USD (plus applicable taxes)</span>
                                  </li>
                                </ul>
                                <div className="last-update-order">
                                  <p>
                                    Last Update {date} | {time}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>

                    <div className="add-form-gift-message">
                      <div
                        className="add-per-info"
                        onClick={() => {
                          if (!localMessage) {
                            setDown(!down);
                          }
                        }}
                      >
                        <p>Add a Personalized Gift Message </p>
                        <span>
                          <CiGift />
                        </span>
                      </div>

                      {down && (
                        <div className="add-form">
                          <form>
                            <textarea
                              value={message}
                              onChange={handleChange}
                            ></textarea>
                            <label htmlFor="receipt">
                              <input
                                id="receipt"
                                type="checkbox"
                                checked={checked}
                                onChange={handleCheckboxChange}
                              />
                              Include price on receipt
                            </label>
                          </form>

                          <div className="save-buttons">
                            <p>
                              <Link
                                href="#"
                                className="td-u"
                                onClick={() => handleCancelMessage()}
                              >
                                Cancel
                              </Link>{" "}
                              |{" "}
                              <Link
                                href="#"
                                className="td-u"
                                onClick={handleSaveMessage}
                              >
                                Save Message
                              </Link>
                            </p>
                          </div>
                        </div>
                      )}
                      {showMessage && (
                        <div className="saved-message">
                          <p>{message}</p>
                          <label htmlFor="receipt">
                            <input
                              id="receipt"
                              type="checkbox"
                              checked={checked}
                              onChange={handleCheckboxChange}
                            />
                            Include price on receipt
                          </label>
                          <div className="edit-delete-buttons">
                            <Link onClick={handleEditMessage}>Edit</Link> |{" "}
                            <Link onClick={handleDeleteMessage}>Delete</Link>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="add-form-gift">
                      <div className="add-per-info">
                        <p>
                          Need Assistance? <span>Chat Now or Call Us </span>{" "}
                        </p>
                        <span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="31"
                            height="30"
                            viewBox="0 0 31 30"
                            fill="none"
                          >
                            <g clip-path="url(#clip0_492_16006)">
                              <path
                                d="M26.2969 23.4375V24.375C26.2969 25.3696 25.9018 26.3234 25.1985 27.0266C24.4953 27.7299 23.5414 28.125 22.5469 28.125H15.9844"
                                stroke="black"
                                stroke-width="1.875"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M26.2969 15H22.5469C22.0496 15 21.5727 15.1975 21.2211 15.5492C20.8694 15.9008 20.6719 16.3777 20.6719 16.875V21.5625C20.6719 22.0598 20.8694 22.5367 21.2211 22.8883C21.5727 23.24 22.0496 23.4375 22.5469 23.4375H26.2969V15ZM26.2969 15C26.2969 13.5226 26.0059 12.0597 25.4405 10.6948C24.8752 9.3299 24.0465 8.08971 23.0018 7.04505C21.9572 6.00039 20.717 5.17172 19.3521 4.60636C17.9872 4.04099 16.5242 3.75 15.0469 3.75C13.5695 3.75 12.1066 4.04099 10.7417 4.60636C9.37677 5.17172 8.13658 6.00039 7.09192 7.04505C6.04726 8.08971 5.2186 9.3299 4.65323 10.6948C4.08786 12.0597 3.79687 13.5226 3.79688 15M3.79688 15V21.5625C3.79688 22.0598 3.99442 22.5367 4.34605 22.8883C4.69768 23.24 5.17459 23.4375 5.67188 23.4375H7.54688C8.04416 23.4375 8.52107 23.24 8.8727 22.8883C9.22433 22.5367 9.42188 22.0598 9.42188 21.5625V16.875C9.42188 16.3777 9.22433 15.9008 8.8727 15.5492C8.52107 15.1975 8.04416 15 7.54688 15H3.79688Z"
                                stroke="black"
                                stroke-width="1.875"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_492_16006">
                                <rect
                                  width="30"
                                  height="30"
                                  fill="white"
                                  transform="translate(0.5)"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                      </div>
                    </div>

                    {!hasDuplicates ? (
                      <div className="add-form-gift-checkout">
                        <div className="">
                          <button onClick={handleClickCheckOut}>
                            <div className="add-per-info">
                              <p>Total ${Math.round(calculateTotalPrice())}</p>
                              <span>Checkout</span>
                            </div>
                            {/* <div className="add-per-info">
                              <p>
                                Total ${Math.round(calculateTotalPrice())}
                              </p>
                            </div> */}
                          </button>
                        </div>

                        {againDown && (
                          <div className="add-form">
                            <form>
                              <input type="text" placeholder="" />
                            </form>
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : (
              <div className="shopping-card-main-wrap empty-bag">
                <h1>Your Shopping Bag Is Empty</h1>
                <p>
                  <button onClick={handleClickCheckOut}>Sign in</button> to view
                  previously saved items or track a recent order
                </p>
                {/* <ContinueShoping /> */}
              </div>
            )}

            {/* <CartPageJewellery /> */}
          </div>
        </div>
      )}
      <Footer/>
    </>
  );
};

export default CartPage;