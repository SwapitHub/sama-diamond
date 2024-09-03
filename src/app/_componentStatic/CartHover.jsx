import React, { useContext, useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { removeToCart, setCartDetails } from "../../redux/action";
import axios from "axios";
// import { productListCart } from "../../redux/productAction";
import { toast } from "react-toastify";
// import { UserContext } from "../../App";
import secureLocalStorage from "react-secure-storage";
import { UserContext } from "../context/UserContext";
import { removeFromCart } from "../../../store/actions/cartActions";
import Link from "next/link";
import { productListCart } from "../../../store/actions/productActions";

export const CartHover = () => {
  const white = "18k-white-gold";
  const yellow = "18k-yellow-gold";
  const rose = "18k-rose-gold";
  const platinum = "platinum";

  const { baseUrl, imgBaseUrl, imgAssetsUrl } = useContext(UserContext);

  const dispatch = useDispatch();

  const cartData = useSelector((state) => state.cartData);
  const user_id = secureLocalStorage.getItem("formData");
  function removeFromTheCart(item) {
    dispatch(removeFromCart(item));
  }
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
    cartDetails?.forEach((item) => {
      total +=
        parseFloat(Math.round(item?.ring_price || 0)) +
        parseFloat(Math.round(item?.diamond_price || 0)) +
        parseFloat(Math.round(item.gemstone_price || 0)) +
        parseFloat(Math.round(item.matching_wedding_band?.price || 0));
    });
    return total;
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

  const [removeCart, setRemoveCart] = useState(null);
  const [shapeData, setShapeData] = useState();
  const cartDetails = useSelector((state) => state.productDataCart);

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

  const handleRemoveItem = (
    itemId,
    ring_id,
    gem_id,
    diamond_id,
    matching_set_id
  ) => {
    setRemoveCart(itemId);

    cartData.map((item) => {
      if (
        (item.item?.id ||
          item.diamonds?.id ||
          item.ring_data?.id ||
          item?.ring_id) ===
        (ring_id || parseInt(gem_id) || parseInt(diamond_id) || matching_set_id)
      ) {
        dispatch(removeToCart(item));
      }
    });
  };

  useEffect(() => {
    axios
      .get(`${baseUrl}/remove-cartitem/${removeCart}`)
      .then((res) => {
        dispatch(productListCart());
      })
      .catch((error) => {
        console.log("CSRF Token API Error:", error);
      });
  }, [removeCart]);
  // ==================
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
  const userId = secureLocalStorage.getItem("formData");

  const handleError = (e) => {
    e.target.onerror = null;
    e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
  };
  return (
    <>
      {userId ? (
        <div className="cart-card-main-wrap" id="user-log">
          <div className="cart-card">
            {cartDetails.length > 0 ? (
              cartDetails?.map((item) => {
                return (
                  <>
                    <div className="cart-card-inner">
                      {item.gemstone_id &&
                      item.ring?.id == null &&
                      item?.diamond_id == null ? (
                        item.gemstone?.map((gemstoneItem) => {
                          return (
                            <>
                              <div className="cart-left-main">
                                <Link
                                  href={`/gemstones-detail/?stock_num=${item?.gemstone_id}`}
                                  className="carts-pic"
                                >
                                  <img
                                    width="auto"
                                    height="auto"
                                    src={gemstoneItem?.image_url}
                                    alt={gemstoneItem?.shape}
                                    onError={handleError}
                                  />
                                </Link>
                              </div>
                              <div className="cart-right-main">
                                <Link
                                  href={`/gemstones-detail/?stock_num=${item?.gemstone_id}`}
                                  className="cart-info"
                                >
                                  <span>{gemstoneItem.short_title}</span>
                                </Link>
                                <div className="ir254-muted">
                                  <div className="code">
                                    <span id="prodcut_price_17566554">
                                      ${Math.round(item?.gemstone_price)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })
                      ) : item.ring?.id && item?.diamond_id ? (
                        <>
                          <div className="cart-left-main">
                            <ul className="carts-pic">
                              <Link
                                href={`/engagement-ring/${
                                  item.ring?.slug
                                }?color=${item?.active_color}${
                                  item?.ring_type
                                    ? `&diamond_original=${item?.ring_type}`
                                    : ""
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
                                    onError={handleError}
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
                                    onError={handleError}
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
                                    onError={handleError}
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
                                    onError={handleError}
                                  />
                                </li>
                              </Link>
                            </ul>
                          </div>
                          <div className="cart-right-main">
                            <div className="cart-info">
                              <div className="cart-info-inner">
                                <div className="cart-info-left">
                                  <div>
                                    <h2>
                                      <Link
                                        href={`/engagement-ring/${
                                          item.ring?.slug
                                        }?color=${item?.active_color}${
                                          item?.ring_type
                                            ? `&diamond_original=${item?.ring_type}`
                                            : ""
                                        }`}
                                        className="td-n2"
                                      >
                                        {item.ring?.name} (1/2{" "}
                                        <span
                                          style={{
                                            textTransform: "lowercase",
                                          }}
                                        >
                                          ct. tw.
                                        </span>
                                        )
                                      </Link>
                                    </h2>

                                    <div className="ir245-muted">
                                      {/* <div className="code">BE3D20-18KY</div> */}
                                      <div className="code">
                                        {/* <input
                                          name="cartitem_id"
                                          type="hidden"
                                          value="17566554"
                                        />
                                        <span
                                          className="iconfont iconfont-plus"
                                          onclick="increase_numbers(this);"
                                        ></span>
                                        <br /> */}
                                        <span
                                          style={{ whiteSpace: "nowrap" }}
                                          id="prodcut_price_17566554"
                                        >
                                          ${Math.round(item?.ring_price)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {item.diamond?.slice(0, 1).map((diamondItem) => {
                            return (
                              <>
                                <div className="cart-left-main">
                                  <Link
                                    href={`/view_diamond/?stock_num=${
                                      item.diamond_id
                                    }&diamond_origin=${
                                      item.diamond_type === "Lab_grown_Diamond"
                                        ? "lab_grown"
                                        : "natural"
                                    }`}
                                    className="carts-pic"
                                  >
                                    <img
                                      width="auto"
                                      height="auto"
                                      src={diamondItem?.image_url}
                                      alt={diamondItem?.name}
                                      onError={handleError}
                                    />
                                  </Link>
                                </div>
                                <div className="cart-right-main">
                                  <div className="cart-info">
                                    <div className="cart-info-inner">
                                      <div className="cart-info-left">
                                        <div className="td-n2">
                                          <p>
                                            <Link
                                              href={`/view_diamond/?stock_num=${
                                                item.diamond_id
                                              }&diamond_origin=${
                                                item.diamond_type ===
                                                "Lab_grown_Diamond"
                                                  ? "lab_grown"
                                                  : "natural"
                                              }`}
                                              className="td-n2"
                                            >
                                              <>
                                                {diamondItem?.size &&
                                                  diamondItem?.size +
                                                    ` Carat`}{" "}
                                                {diamondItem?.shape &&
                                                  diamondItem?.shape +
                                                    ` Diamond`}{" "}
                                                {diamondItem?.cut &&
                                                  diamondItem?.cut + ` Cut`}
                                                ,{" "}
                                                {diamondItem?.color &&
                                                  diamondItem?.color + ` Color`}
                                                ,{" "}
                                                {diamondItem?.clarity &&
                                                  diamondItem?.clarity +
                                                    ` Clarity`}
                                              </>
                                            </Link>
                                          </p>
                                          {/* <p className="small-text">Qty: 1</p> */}
                                        </div>
                                        <div className="ir254-muted">
                                          <div className="code">
                                            <span id="prodcut_price_17566554">
                                              $
                                              {Math.round(
                                                diamondItem?.total_sales_price
                                              )}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </>
                      ) : item.ring?.id && item?.gemstone_id ? (
                        <>
                          <div className="cart-left-main">
                            <ul className="carts-pic">
                              <Link
                                href={`/engagement-ring/${
                                  item.ring?.slug
                                }?color=${item?.active_color}${
                                  item?.ring_type
                                    ? `&diamond_original=${item?.ring_type}`
                                    : ""
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
                                    onError={handleError}
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
                                    onError={handleError}
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
                                    onError={handleError}
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
                                    onError={handleError}
                                  />
                                </li>
                              </Link>
                            </ul>
                          </div>
                          <div className="cart-right-main">
                            <Link
                              href={`/engagement-ring/${item.ring?.slug}?color=${
                                item?.active_color
                              }${
                                item?.ring_type
                                  ? `&diamond_original=${item?.ring_type}`
                                  : ""
                              }`}
                              className="cart-info"
                            >
                              <span>
                                {item.ring?.name} (1/2{" "}
                                <span style={{ textTransform: "lowercase" }}>
                                  ct. tw.
                                </span>
                                )
                              </span>
                            </Link>
                            <div className="ir254-muted">
                              <div className="code">
                                <span id="prodcut_price_17566554">
                                  ${Math.round(item?.ring_price)}
                                </span>
                              </div>
                            </div>
                          </div>

                          {item.gemstone?.map((gemstoneItem) => {
                            return (
                              <>
                                <div className="cart-left-main">
                                  <Link
                                    href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                    className="carts-pic"
                                  >
                                    <img
                                      width="auto"
                                      height="auto"
                                      src={gemstoneItem?.image_url}
                                      alt={gemstoneItem?.shape}
                                      onError={handleError}
                                    />
                                  </Link>
                                </div>
                                <div className="cart-right-main">
                                  <Link
                                    href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                    className="cart-info"
                                  >
                                    <span>{gemstoneItem.short_title}</span>
                                  </Link>
                                  <div className="ir254-muted">
                                    <div className="code">
                                      <span id="prodcut_price_17566554">
                                        ${Math.round(item?.gemstone_price)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </>
                      ) : null}

                      {/* only diamond start*/}
                      {item.diamond_id &&
                      item.ring?.id == null &&
                      item?.gemstone_id == null
                        ? item.diamond?.slice(0, 1).map((diamondItem) => {
                            return (
                              <>
                                <div className="cart-left-main">
                                  <Link
                                    href={`/view_diamond?stock_num=${
                                      item?.diamond_id
                                    }${
                                      item?.diamond_type === "Lab_grown_Diamond"
                                        ? "&diamond_origin=lab_grown"
                                        : ""
                                    }`}
                                    className="carts-pic"
                                  >
                                    <img
                                      width="auto"
                                      height="auto"
                                      src={diamondItem?.image_url}
                                      alt={diamondItem?.name}
                                      onError={handleError}
                                    />
                                  </Link>
                                </div>
                                <div className="cart-right-main">
                                  <div className="cart-info">
                                    <div className="cart-info-inner">
                                      <div className="cart-info-left">
                                        <div className="td-n2">
                                          <p>
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
                                              <>
                                              {diamondItem?.size &&
                                                  diamondItem?.size +
                                                    ` Carat`}{" "}
                                                {diamondItem?.shape &&
                                                  diamondItem?.shape +
                                                    ` Diamond`}{" "}
                                                {diamondItem?.cut &&
                                                  diamondItem?.cut + ` Cut`}
                                                ,{" "}
                                                {diamondItem?.color &&
                                                  diamondItem?.color + ` Color`}
                                                ,{" "}
                                                {diamondItem?.clarity &&
                                                  diamondItem?.clarity +
                                                    ` Clarity`}
                                              </>
                                            </Link>
                                          </p>
                                          {/* <p className="small-text">Qty: 1</p> */}
                                        </div>
                                        <div className="checkout-right-price">
                                          $
                                          {Math.round(
                                            diamondItem?.total_sales_price
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </>
                            );
                          })
                        : null}

                      {/* only matching_set start*/}
                      {item.ring_id &&
                      item?.diamond_id == null &&
                      item?.gemstone_id == null ? (
                        <>
                          <div className="cart-left-main">
                            <ul className="carts-pic">
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
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
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
                                    onError={handleError}
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
                                    onError={handleError}
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
                                    onError={handleError}
                                  />
                                </li>
                              </Link>
                            </ul>
                          </div>
                          <div className="cart-right-main">
                            <div className="cart-info">
                              <div className="cart-info-inner">
                                <div className="cart-info-left">
                                  <div className="td-n2">
                                    <p>
                                      <Link
                                        href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                      >
                                        <>{item.ring?.name}</>
                                      </Link>
                                    </p>
                                    {/* <p className="small-text">Qty: 1</p> */}
                                  </div>
                                  <div className="checkout-right-price">
                                    ${Math.round(item.ring_price)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : null}

                      <div className="cart-checkcross">
                        <IoIosClose
                          onClick={() =>
                            handleRemoveItem(
                              item.id,
                              item.ring_id,
                              item.gemstone_stock_no,
                              item.diamond_stock_no,
                              item.ring_id
                            )
                          }
                        />
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <div className="empty-wish-list">No items in your bag.</div>
            )}
          </div>
          <div className="checkout-fixed-bottom">
            <div className="king-shoping-material">
              <ul className="king-shopping-list">
                <li>
                  <div className="media-subtotal">
                    <span className="name pr10">SUBTOTAL : </span>
                    <span>${Math.round(calculateTotalPriceDatabase())}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="checkout-btn">
              <Link
                className="check-btn"
                href={
                  user_id && cartDetails.length > 0
                    ? "/cart"
                    : "javascript:void(0);"
                }
                onClick={() => {
                  if (!user_id && cartDetails?.length === 0) {
                    toast.info("Please log in to proceed to checkout.", {
                      position: "top-right",
                      className: "foo-bar",
                    });
                  }
                }}
              >
                checkout
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="cart-card-main-wrap" id="user-log">
          <div className="cart-card">
            {cartData.length > 0 ? (
              cartData.map((item) => {
                const selectedMetalColor = metalColor.find(
                  (colorItem) => colorItem.slug === item.ring_color
                );
                return (
                  <>
                    <div className="cart-card-inner">
                      {item.product_type === "gemstone" ? (
                        <>
                          <div className="product-pic-diamond-top">
                            <Link
                              href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                            >
                              <img
                                width="auto"
                                height="auto"
                                src={item.item?.image_url}
                                alt={item.item?.shape}
                                onError={handleError}
                              />
                            </Link>
                          </div>
                          <div className="product-info-inner">
                            <div className="cart-info-left">
                              <div>
                                <h2>
                                  <Link
                                    href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                                    className="td-n2"
                                  >
                                    <span>{item.item?.short_title}</span>
                                  </Link>
                                </h2>
                              </div>
                            </div>
                            <div className="ir254-muted">
                              <div className="code">
                                <span id="prodcut_price_17566554">
                                  ${Math.round(item.item?.total_sales_price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : item.product_type === "diamond" ? (
                        <>
                          <div className="product-pic-diamond-top">
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
                                onError={handleError}
                              />
                            </Link>
                          </div>
                          <div className="product-info-inner">
                            <div className="cart-info-left">
                              <div>
                                <h2>
                                  <Link
                                    href={`/view_diamond?stock_num=${
                                      item.diamonds?.stock_num
                                    }${
                                      item?.diamond_type === "natural"
                                        ? ""
                                        : `&diamond_origin=lab_grown`
                                    }`}
                                    className="td-n2"
                                  >
                                    {item.diamonds?.size} Carat,
                                    {item.diamonds?.shape} Diamond
                                  </Link>
                                </h2>
                              </div>
                            </div>
                            <div className="ir254-muted">
                              <div className="code">
                                <span id="prodcut_price_17566554">
                                  $
                                  {Math.round(
                                    item?.diamonds?.total_sales_price
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : item.product_type === "matching_set" ? (
                        <>
                          <div className="product-pic-diamond-top">
                            <ul className="carts-pic">
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
                                    src={`${imgBaseUrl}/${item.ring_img}/${item.ring_img}.jpg`}
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
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
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
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
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
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
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
                                  />
                                </li>
                              </Link>
                            </ul>
                          </div>
                          <div className="product-info-inner">
                            <div className="product-info-left">
                              <Link
                                href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                              >
                                <span>{item.ring?.name}</span>
                              </Link>
                            </div>
                            <div className="ir254-muted">
                              <div className="code">
                                <span id="prodcut_price_17566554">
                                  ${Math.round(item?.ring_price)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="cart-left-main">
                            <ul className="carts-pic">
                              <Link
                                href={`/engagement-ring/${
                                  item.ring_data?.slug
                                }?color=${item?.ring_color}${
                                  item?.ring_type
                                    ? `&diamond_original=${item?.ring_type}`
                                    : ""
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
                                    src={`${imgBaseUrl}/${item.ring_img}/${item.ring_img}.jpg`}
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
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
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
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
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
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
                                    alt={item?.name}
                                    className="img-responsive center-block"
                                    onError={handleError}
                                  />
                                </li>
                              </Link>
                            </ul>
                            {item.diamondItem?.sub_title_description ? (
                              <div>
                                <Link
                                  href={`/view_diamond/?stock_num=${item.diamondItem?.stock_num}&diamond_origin=${item?.type_diamond}`}
                                >
                                  <img
                                    width="auto"
                                    height="auto"
                                    src={item.diamondItem?.image_url}
                                    alt={item.diamondItem.name}
                                    onError={handleError}
                                  />
                                </Link>
                              </div>
                            ) : (
                              <div>
                                <Link
                                  href={`/gemstones-detail/?stock_num=${item.gemstone?.stock_num}`}
                                >
                                  <img
                                    width="auto"
                                    height="auto"
                                    src={item.gemstone?.image_url}
                                    alt={item.gemstone?.shape}
                                    onError={handleError}
                                  />
                                </Link>
                              </div>
                            )}
                          </div>
                          <div className="cart-right-main">
                            <div className="cart-info">
                              <div className="cart-info-inner">
                                <div className="cart-info-left">
                                  <div>
                                    {selectedMetalColor && (
                                      <h2>
                                        <Link
                                          href={`/engagement-ring/${
                                            item.ring_data?.slug
                                          }?color=${item?.ring_color}${
                                            item?.ring_type
                                              ? `&diamond_original=${item?.ring_type}`
                                              : ""
                                          }`}
                                          className="td-n2"
                                        >
                                          {selectedMetalColor.value}{" "}
                                          {item.ring_data?.name} (1/2{" "}
                                          <span
                                            style={{
                                              textTransform: "lowercase",
                                            }}
                                          >
                                            ct. tw.
                                          </span>
                                          )
                                        </Link>
                                      </h2>
                                    )}

                                    <div className="ir245-muted">
                                      {/* <div className="code">BE3D20-18KY</div> */}
                                      <div className="code quantity-number">
                                        <span
                                          style={{ whiteSpace: "nowrap" }}
                                          id="prodcut_price_17566554"
                                        >
                                          $
                                          {Math.round(
                                            item?.ring_price || item?.ringPrice
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="checkout-name-description">
                              <div className="cart-info-left">
                                <h2>
                                  {item.diamondItem?.sub_title_description ? (
                                    <>
                                      <Link
                                        href={`/view_diamond/?stock_num=${item.diamondItem?.stock_num}&diamond_origin=${item?.type_diamond}`}
                                        className="td-n2"
                                      >
                                        {item.diamondItem?.size} Carat,{" "}
                                        {item.diamondItem?.shape} Diamond,{" "}
                                        {item.diamondItem?.cut} Cut,{" "}
                                        {item.diamondItem?.color} Color,{" "}
                                        {item.diamondItem?.clarity} Clarity
                                      </Link>
                                    </>
                                  ) : (
                                    <Link
                                      href={`/gemstones-detail/?stock_num=${item.gemstone?.stock_num}`}
                                      className="td-n2"
                                    >
                                      {item.gemstone?.short_title}
                                    </Link>
                                  )}
                                </h2>

                                {/* <p className="small-text">Qty: 1</p> */}
                              </div>
                              <div className="checkout-right-price">
                                {item.diamondItem?.sub_title_description ? (
                                  <p>
                                    $
                                    {Math.round(
                                      item.diamondItem?.total_sales_price
                                    )}
                                  </p>
                                ) : (
                                  <p>
                                    $
                                    {Math.round(
                                      item.gemstone?.total_sales_price
                                    )}
                                  </p>
                                )}{" "}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      <div className="cart-checkcross">
                        <IoIosClose
                          onClick={() => removeFromTheCart(item ? item : item)}
                        />
                      </div>
                    </div>
                  </>
                );
              })
            ) : (
              <div className="empty-wish-list">No items in your bag.</div>
            )}
          </div>
          <div className="fixed-bottom">
            <div className="king-shoping-material">
              <ul className="king-shopping-list">
                <li>
                  <div className="media-subtotal">
                    <span className="name pr10">SUBTOTAL:</span>
                    <span>${Math.round(calculateTotalPrice())}</span>
                  </div>
                </li>
              </ul>
            </div>
            <div className="checkout-btn">
              <Link
                className="check-btn"
                href="/cart"
                onClick={() => {
                  if (!user_id && cartDetails?.length === 0) {
                    toast.info("Please log in to proceed to checkout", {
                      position: "top-right",
                      className: "foo-bar",
                    });
                  }
                }}
              >
                checkout
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
