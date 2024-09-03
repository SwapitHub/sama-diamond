import axios from "axios";
import React, { useContext, useEffect, useMemo, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import secureLocalStorage from "react-secure-storage";
import { UserContext } from "../context/UserContext";
import { removeToWishlist } from "../../../store/actions/wishlistAction";
import { addToCart } from "../../../store/actions/cartActions";
import Link from "next/link";


export const WishlistHover = () => {
  const white = "18k-white-gold";
  const yellow = "18k-yellow-gold";
  const rose = "18k-rose-gold";
  const platinum = "platinum";
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlistData);

  const { baseUrl, imgBaseUrl, imgAssetsUrl } = useContext(UserContext);

  function handleWishData(item) {
    dispatch(removeToWishlist(item));
  }
  function handleHoverWishlist(item, product_type, ring_type) {
    dispatch(
      addToCart({
        ...item.removingItem,
        product_type: product_type,
        ring_size: item.ring_size,
        diamond_type: item.type_diamond,
        ring_type: ring_type,
      })
    );
    dispatch(removeToWishlist(item));
  }

  function handleHoverWishlistDiamond(item) {
    dispatch(addToCart({ ...item, product_type: "diamond" }));
    dispatch(removeToWishlist(item));
  }

  function handleWishDataGemstoneAndBand(item) {
    dispatch(removeToWishlist(item));
  }

  function handleWishDataDiamond(item) {
    dispatch(removeToWishlist(item));
  }

  const userId = secureLocalStorage.getItem("formData");

  const [tocaken, setTocaken] = useState();
  const [removeWishList, setRemoveWishList] = useState();
  const wishlistData = useSelector((state) => state.wishlistData);
  const wishListDataBase = useSelector((state) => state.productDataWishlist);

  // =======remove to card
  const fetchRemoveWishlistItem = useMemo(() => {
    return async (removeWishList) => {
      try {
        const response = await axios.get(
          `${baseUrl}/remove_wishlist_item/${removeWishList}`
        );
        dispatch(productList());
      } catch (error) {
        console.log("CSRF Token API Error:", error);
      }
    };
  }, []);

  useEffect(() => {
    if (removeWishList) {
      fetchRemoveWishlistItem(removeWishList);
    }
  }, [fetchRemoveWishlistItem, removeWishList]);

  //   ==========
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
    gemstone_stock_no,
    diamond_stock_no,
    userId,
    ring_size,
    diamond_type,
    ring_type,
    product_type,
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
      gemstone_stock_no: gemstone_stock_no,
      diamond_stock_no: diamond_stock_no,
      ring_size: ring_size,
      ring_type: ring_type,
      product_type: product_type,
      textEngraving: textEngraving,
      font_style: font_style,
    };

    secureLocalStorage.setItem("cart_data", JSON.stringify(formData));
    const savedWishlist =
      JSON.parse(secureLocalStorage.getItem("cart_data")) || [];

    const API_URl = `${baseUrl}/cart?user_id=${formData.user_id}&product_type=${product_type}&gemstone_id=${formData.gemstone_id}&gemstone_price=${formData.gemstone_price}&ring_id=${formData.ring_id}&ring_color=${formData.ring_color}&diamond_id=${formData.diamond_id}&diamond_price=${diamond_price}&img_sku=${formData.img_sku}&ring_price=${formData.ring_price}&gemstone_stock_no=${formData.gemstone_stock_no}&diamond_stock_no=${formData.diamond_stock_no}&ring_size=${formData.ring_size}&diamond_type=${diamond_type}&ring_type=${formData.ring_type}${formData.textEngraving ? `&engraving=${formData.textEngraving}`: ""}${formData.font_style ? `&font=${formData.font_style}`:""}`;

    axios
      .get(
        API_URl,

        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": tocaken,
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
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

  const fetchCsrfToken = useMemo(() => {
    return async () => {
      try {
        const response = await axios.get(
          "http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/csrf-token"
        );
        return response.data.csrf_token;
      } catch (error) {
        console.log("CSRF Token API Error:", error);
        return null;
      }
    };
  }, []);

  useEffect(() => {
    fetchCsrfToken().then((token) => {
      if (token) {
        setTocaken(token);
      }
    });
  }, [fetchCsrfToken]);

  const handleWishDataRemove = (wish_list_id, ring_id) => {
    setRemoveWishList(wish_list_id);
    const values = Object.values(wishListDataBase);
    values.forEach((item) => {
      if (wish_list_id === item?.id) {
      }
    });

    wishlistData?.map((item) => {
      if (ring_id === (item.item?.id || item.diamonds?.id)) {
        dispatch(removeToWishlist(item));
        dispatch(addToCart(item));
      }
    });
  };

  const handleWishDataRemoveWishlist = (wish_list_id, ring_id) => {
    const updatedItems = wishListDataBase.filter(
      (item) => item?.id !== wish_list_id
    );
    setRemoveWishList(wish_list_id);
    const values = Object.values(wishListDataBase);
    values.forEach((item) => {
      if (wish_list_id === item?.id) {
      }
    });

    wishlistData?.map((item) => {
      if (ring_id === (item.item?.id || item.diamonds?.id)) {
        dispatch(removeToWishlist(item));
      }
    });
  };

  return (
    <>
      {userId ? (
        <div className="cart-card-main-wrap" id="user-log">
          <div className="cart-card">
            {wishListDataBase.length > 0 ? (
              wishListDataBase?.map((item, index) => {
                return (
                  <>
                    {item.product_type == "ring_diamond" ||
                    item.product_type == "ring" ||
                    item.product_type == "ring_gemstone" ? (
                      <div className="cart-card-inner" key={index}>
                        <div className="cart-left-main">
                          <ul className="carts-pic">
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
                                  ? `/final_ring/${item.ring?.slug}?color=${
                                      item?.active_color
                                    }&stock_num=${
                                      item?.diamond_id
                                    }&diamond_original=${
                                      item?.ring_type
                                    }&diamond_origin=${
                                      item?.diamond_type === "Lab_grown_Diamond"
                                        ? "lab_grown"
                                        : "natural"
                                    }`
                                  : `/final_ring_gemstone/${item.ring?.slug}?color=${item?.active_color}&stock_num=${item?.gemstone_id}&diamond_original=${item?.ring_type}`
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
                        <div className="cart-right-main">
                          <div className="cart-info">
                            <div className="cart-info-inner">
                              <div className="cart-info-left">
                                <h2>
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
                                          }`
                                        : `/final_ring_gemstone/${item.ring?.slug}?color=${item?.active_color}&stock_num=${item?.gemstone_id}&diamond_original=${item?.ring_type}`
                                    }`}
                                    className="td-n2"
                                  >
                                    {item.ring?.name}
                                  </Link>
                                </h2>
                                <div className="money">
                                  ${Math.round(item?.ring_price)}
                                </div>
                                <div className="money">
                                  {item?.ring_size &&
                                    `Ring Size: ${item?.ring_size}`}
                                </div>
                              </div>
                            </div>

                            <div className=" whislist-button-purple">
                              {item.product_type == "ring" &&
                                (item.ring_size !== null ? (
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
                                    }&ring_size=${item?.ring_size}${item.engraving ? `&textEngraving=${item.engraving}`:""}${item.font? `&font_style=${item.font}`: ""}`}
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
                                    }${item.engraving ? `&textEngraving=${item.engraving}`:""}${item.font? `&font_style=${item.font}`: ""}`}
                                  >
                                    Add a Diamond
                                  </Link>
                                ))}
                            </div>
                          </div>
                        </div>

                        {item?.diamond &&
                          item?.diamond.map((diamond_item) => {
                            return (
                              <>
                                <div className="cart-left-main">
                                  <ul className="carts-pic">
                                    <Link href="javascript:void(0);">
                                      <li>
                                        <img
                                          width="auto"
                                          height="auto"
                                          src={diamond_item?.image_url}
                                          alt={diamond_item?.shape}
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
                                <div className="cart-right-main">
                                  <div className="cart-info">
                                    <div className="cart-info-inner">
                                      <div className="cart-info-left">
                                        <div className="money">
                                          {diamond_item?.size &&
                                            diamond_item?.size + ` Carat`}{" "}
                                          {diamond_item?.shape &&
                                            diamond_item?.shape + ` Diamond`}
                                        </div>
                                        <div className="money">
                                          ${Math.round(item?.diamond_price)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="whislist-button-purple">
                                    {item.product_type == "ring" ? (
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
                                          }&ring_size=${item?.ring_size}${item.engraving ? `&textEngraving=${item.engraving}`:""}${item.font? `&font_style=${item.font}`: ""}`}
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
                                          }${item.engraving ? `&textEngraving=${item.engraving}`:""}${item.font? `&font_style=${item.font}`: ""}`}
                                        >
                                          Add a Diamond
                                        </Link>
                                      )
                                    ) : (
                                      <Link
                                        key={index}
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
                                          handleWishDataRemove(
                                            item.id,
                                            item.ring_id
                                          );
                                          handleCreateAccount(
                                            item?.ring_price,
                                            item.ring?.id,
                                            item.ring,
                                            item.img_sku,
                                            item.active_color,
                                            diamond_item?.stock_num,
                                            diamond_item,
                                            diamond_item?.total_sales_price,

                                            item.gemstone_item?.stock_num
                                              ? item.gemstone_item?.stock_num
                                              : "",
                                            item.gemstone_item
                                              ?.total_sales_price
                                              ? item.gemstone_item
                                                  ?.total_sales_price
                                              : "",
                                            item.gemstone_item
                                              ? item.gemstone_item
                                              : "",
                                            item.gemstone_item?.id
                                              ? item.gemstone_item?.id
                                              : "",
                                            diamond_item?.id,
                                            userId ? userId : null,
                                            item?.ring_size,
                                            item.diamond_type
                                              ? item.diamond_type
                                              : "",
                                            item?.ring_type,
                                            item.product_type,
                                            item.engraving
                                              ? item.engraving
                                              : "",
                                            item.font ? item.font : ""
                                          );
                                        }}
                                      >
                                        Add to Bag
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              </>
                            );
                          })}

                        {item.gemstone?.map((gemstoneItem) => {
                          return (
                            <>
                              <div className="cart-left-main">
                                <ul className="carts-pic">
                                  <Link href="javascript:void(0);">
                                    <li>
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={gemstoneItem?.image_url}
                                        alt={gemstoneItem?.shape}
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
                              <div className="cart-right-main">
                                <div className="cart-info">
                                  <div className="cart-info-inner">
                                    <div className="cart-info-left">
                                      <div className="money">
                                        {gemstoneItem?.short_title}
                                      </div>
                                      <div className="money">
                                        {" "}
                                        $
                                        {Math.round(
                                          gemstoneItem?.total_sales_price
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="whislist-button-purple">
                                  {item.product_type == "ring" ? (
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
                                        }&ring_size=${item?.ring_size}${item.engraving ? `&textEngraving=${item.engraving}`:""}${item.font? `&font_style=${item.font}`: ""}`}
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
                                        }${item.engraving ? `&textEngraving=${item.engraving}`:""}${item.font? `&font_style=${item.font}`: ""}`}
                                      >
                                        Add a Diamond
                                      </Link>
                                    )
                                  ) : (
                                    <Link
                                      key={index} // Add a unique key for each link
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
                                        handleWishDataRemove(
                                          item.id,
                                          item?.ring_id
                                        );
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
                                          item.diamond_item?.total_sales_price
                                            ? item?.diamond_item
                                                ?.total_sales_price
                                            : "",

                                          gemstoneItem?.stock_num,
                                          gemstoneItem?.total_sales_price,
                                          gemstoneItem,
                                          gemstoneItem?.id,
                                          item.diamond_item?.id
                                            ? item.diamond_item?.id
                                            : "",
                                          userId ? userId : null,
                                          item?.ring_size,
                                          item.diamond_type
                                            ? item.diamond_type
                                            : "",
                                          item?.ring_type,
                                          item.product_type,
                                          item.engraving ? item.engraving : "",
                                          item.font ? item.font : ""
                                        );
                                      }}
                                    >
                                      Add to Bag
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </>
                          );
                        })}

                        <div className="cart-checkcross">
                          <IoIosClose
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishDataRemoveWishlist(
                                item.id,
                                item?.ring_id
                              );
                            }}
                          />
                        </div>
                      </div>
                    ) : item.product_type == "matching_set" ? (
                      <div className="cart-card-inner" key={index}>
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
                        <div className="cart-right-main">
                          <div className="cart-info">
                            <div className="cart-info-inner">
                              <div className="cart-info-left">
                                <Link
                                  href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
                                  className="money"
                                >
                                  {item.ring?.name}
                                </Link>
                                <div className="money">
                                  {" "}
                                  ${Math.round(item.ring_price)}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="whislist-button-purple">
                            {item.ring_price > 0 ? (
                              item.ring_size ? (
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
                                    handleWishDataRemove(item.id, item.ring_id);
                                    handleCreateAccount(
                                      item?.ring_price,
                                      item.ring_id,
                                      item.ring,
                                      item.img_sku,
                                      item.active_color,
                                      item.stock_num ? item.stock_num : "",
                                      item.diamond_item
                                        ? item.diamond_item
                                        : "",
                                      item.total_sales_price
                                        ? item.total_sales_price
                                        : "",
                                      item.gemstone_item?.stock_num
                                        ? item.gemstone_item?.stock_num
                                        : "",
                                      item.gemstone_item?.total_sales_price
                                        ? item.gemstone_item?.total_sales_price
                                        : "",
                                      item.gemstone_item
                                        ? item.gemstone_item
                                        : "",
                                      item.gemstone_item?.id
                                        ? item.gemstone_item?.id
                                        : "",
                                      item.diamond_item?.id
                                        ? item.diamond_item?.id
                                        : "",
                                      userId ? userId : null,
                                      item?.ring_size ? item?.ring_size : "",
                                      item.diamond_type
                                        ? item.diamond_type
                                        : "",
                                      item?.ring_type,
                                      item.product_type,
                                      item.engraving ? item.engraving : "",
                                      item.font ? item.font : ""
                                    );
                                  }}
                                >
                                  Add to Bag
                                </Link>
                              ) : (
                                <Link
                                  href={`/detail-wedding-band/${item.ring?.slug}?color=${item.active_color}&diamond_original=${item.ring_type}`}
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

                        <div className="cart-checkcross">
                          <IoIosClose
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishDataRemoveWishlist(
                                item.id,
                                item.ring_id
                              );
                            }}
                          />
                        </div>
                      </div>
                    ) : item.product_type == "gemstone" ? (
                      item?.gemstone?.map((gemstoneItem) => {
                        return (
                          <>
                            <div className="cart-card-inner" key={index}>
                              <div className="cart-left-main">
                                <ul className="carts-pic">
                                  <Link
                                    href={`/gemstones-detail/?stock_num=${item.gemstone_id}`}
                                  >
                                    <li>
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={gemstoneItem?.image_url}
                                        alt={gemstoneItem?.shape}
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
                              <div className="cart-right-main">
                                <div className="cart-info">
                                  <div className="cart-info-inner">
                                    <div className="cart-info-left">
                                      <Link
                                        href={`/gemstones-detail/?stock_num=${item?.gemstone_id}`}
                                        className="money"
                                      >
                                        {gemstoneItem?.short_title}
                                      </Link>
                                      <div className="money">
                                        {" "}
                                        $
                                        {Math.round(
                                          gemstoneItem?.total_sales_price
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="whislist-button-purple">
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
                                      handleWishDataRemove(
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
                                        item.stock_num ? item.stock_num : "",
                                        item.diamond_item
                                          ? item.diamond_item
                                          : "",
                                        item.total_sales_price
                                          ? item.total_sales_price
                                          : "",
                                        gemstoneItem.stock_num,
                                        gemstoneItem.total_sales_price,
                                        gemstoneItem,
                                        gemstoneItem?.id,
                                        item.diamond_item?.id
                                          ? item.diamond_item?.id
                                          : "",
                                        userId ? userId : null,
                                        item?.ring_size ? item?.ring_size : "",
                                        item.diamond_type
                                          ? item.diamond_type
                                          : "",
                                        item?.ring_type,
                                        item.product_type,
                                        item.engraving ? item.engraving : "",
                                        item.font ? item.font : ""
                                      );
                                    }}
                                  >
                                    Add to Bag
                                  </Link>
                                </div>
                              </div>

                              <div className="cart-checkcross">
                                <IoIosClose
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleWishDataRemoveWishlist(
                                      item.id,
                                      gemstoneItem.id
                                    );
                                  }}
                                />
                              </div>
                            </div>
                          </>
                        );
                      })
                    ) : (
                      item?.diamond &&
                      item?.diamond.map((diamond_item) => {
                        return (
                          <>
                            <div className="cart-card-inner">
                              <div className="cart-left-main">
                                <ul className="carts-pic">
                                  <Link
                                    href={`/view_diamond?stock_num=${
                                      item.diamond_id
                                    }${
                                      item?.diamond_type === "Diamond"
                                        ? ""
                                        : `&diamond_origin=lab_grown`
                                    }`}
                                  >
                                    <li>
                                      <img
                                        width="auto"
                                        height="auto"
                                        src={diamond_item?.image_url}
                                        alt={diamond_item?.shape}
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
                              <div className="cart-right-main">
                                <div className="cart-info">
                                  <div className="cart-info-inner">
                                    <div className="cart-info-left">
                                      <Link
                                        href={`/view_diamond?stock_num=${
                                          item.diamond_id
                                        }${
                                          item?.diamond_type === "Diamond"
                                            ? ""
                                            : `&diamond_origin=lab_grown`
                                        }`}
                                        className="money"
                                      >
                                        {diamond_item?.size &&
                                            diamond_item?.size + ` Carat`}{" "}
                                          {diamond_item?.shape &&
                                            diamond_item?.shape + ` Diamond`}
                                      </Link>
                                      <div className="money">
                                        ${Math.round(item?.diamond_price)}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="whislist-button-purple">
                                  <Link
                                    key={index} // Add a unique key for each link
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
                                      handleWishDataRemove(
                                        item.id,
                                        diamond_item.id
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
                                        diamond_item?.stock_num,
                                        diamond_item,
                                        diamond_item?.total_sales_price,

                                        item.gemstone_item?.stock_num
                                          ? item.gemstone_item?.stock_num
                                          : "",
                                        item.gemstone_item?.total_sales_price
                                          ? item.gemstone_item
                                              ?.total_sales_price
                                          : "",
                                        item.gemstone_item
                                          ? item.gemstone_item
                                          : "",
                                        item.gemstone_item?.id
                                          ? item.gemstone_item?.id
                                          : "",
                                        diamond_item?.id,
                                        userId ? userId : null,

                                        item?.ring_size ? item?.ring_size : "",
                                        item.diamond_type
                                          ? item.diamond_type
                                          : "",
                                        item?.ring_type,
                                        item.product_type,
                                        item.engraving ? item.engraving : "",
                                        item.font ? item.font : ""
                                      );
                                    }}
                                  >
                                    Add to Bag
                                  </Link>
                                </div>
                                <div className="cart-checkcross">
                                  <IoIosClose
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleWishDataRemoveWishlist(
                                        item.id,
                                        diamond_item.id
                                      );
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })
                    )}
                  </>
                );
              })
            ) : (
              <div className="empty-wish-list">
                Oops! Looks like your wish list is empty.
              </div>
            )}
          </div>

          <div className="checkout-btn">
            <Link href="/wishlist" className="btn btn-success btn-lg btn-block">
              View Wish List
            </Link>
          </div>
        </div>
      ) : (
        <div className="cart-card-main-wrap" id="user-log">
          <div className="cart-card">
            {wishlist.length > 0 ? (
              wishlist.map((item, index) => {
                return (
                  <>
                    {item.product_type === "gemstone" ? (
                      <div className="cart-card-inner" key={index}>
                        <div className="cart-left-main">
                          <ul className="carts-pic">
                            <Link
                              href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                            >
                              <li>
                                <img
                                  width="auto"
                                  height="auto"
                                  src={
                                    item.gemstoneSingle?.image_url ||
                                    item.diamond?.image_url ||
                                    item.item?.image_url
                                  }
                                  alt={
                                    item.gemstoneSingle?.shape ||
                                    item.diamond?.shape ||
                                    item.item?.shape
                                  }
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
                        <div className="cart-right-main">
                          <div className="cart-info">
                            <div className="cart-info-inner">
                              <div className="cart-info-left">
                                <div>
                                  <h2>
                                    <Link
                                      href={`/gemstones-detail/?stock_num=${item.item?.stock_num}`}
                                      className="td-n2"
                                    >
                                      {item.item?.short_title ||
                                        item.gemstoneSingle?.short_title ||
                                        `${item.diamond?.size} Carat ${item.diamond?.shape} Diamond`}
                                    </Link>
                                  </h2>
                                  <div className="ir245-muted">
                                    <div>
                                      $
                                      {Math.round(
                                        item.item?.total_sales_price ||
                                          item.gemstoneSingle
                                            ?.total_sales_price ||
                                          item.diamond?.total_sales_price
                                      )}
                                    </div>
                                  </div>

                                  <div className="whislist-button-purple">
                                    <Link
                                      href="javascript:void(0);"
                                      onClick={() => {
                                        dispatch(
                                          addToCart({
                                            ...item,
                                            product_type: "gemstone",
                                          })
                                        );
                                        dispatch(removeToWishlist(item));
                                        // setToggledProducts((prevState) => ({
                                        //   ...prevState,
                                        //   [item.item?.id]: false,
                                        // }));
                                        // item.diamond &&
                                        //   setDiamondRingToggle((prevState) => ({
                                        //     ...prevState,
                                        //     [item.diamond?.id]: false,
                                        //   }));
                                      }}
                                    >
                                      Add to Bag
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="cart-checkcross">
                          <IoIosClose
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishDataGemstoneAndBand(item);
                            }}
                          />
                        </div>
                      </div>
                    ) : item.product_type === "ring" ||
                      item.product_type === "ring_diamond" ||
                      item.product_type === "ring_gemstone" ? (
                      <div className="cart-card-inner" key={index}>
                        <div className="cart-left-main">
                          <ul className="carts-pic">
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
                              <li
                                className={
                                  item.item?.image_url ? "active" : "displayed"
                                }
                              >
                                <img
                                  width="auto"
                                  height="auto"
                                  src={item.item?.image_url}
                                  alt={item.item?.shape}
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
                        <div className="cart-right-main">
                          <div className="cart-info">
                            <div className="cart-info-inner">
                              <div className="cart-info-left">
                                <div>
                                  <h2>
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
                                      className="td-n2"
                                    >
                                      {item.item?.name
                                        ? item.item?.name
                                        : item.item?.short_title}
                                    </Link>
                                  </h2>
                                  <div className="ir245-muted">
                                    <div>
                                      $
                                      {Math.round(
                                        item.ring_price
                                          ? item.ring_price || 0
                                          : item.item?.total_sales_price || 0
                                      )}
                                    </div>
                                  </div>
                                  {(item.item?.sku && item.item?.imageName) ||
                                  (item.item?.ProductClass && !item.diamond) ? (
                                    <div className="whislist-button-purple">
                                      {item.ring_size ? (
                                        <Link
                                          href={`/engagement-rings/start-with-a-diamond/${
                                            item.item?.slug
                                          }${
                                            item?.ring_type == "lab_grown"
                                              ? "/lab_grown"
                                              : "/natural"
                                          }?color=${item.ring_color}${
                                            item?.ring_type
                                              ? `&diamond_original=${item?.ring_type}`
                                              : ""
                                          }&ring_size=${item.ring_size}${item.textEngraving ? `&textEngraving=${item.textEngraving}`:""}${item.font_style? `&font_style=${item.font_style}`: ""}`}
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
                                          }${item.textEngraving ? `&textEngraving=${item.textEngraving}`:""}${item.font_style? `&font_style=${item.font_style}`: ""}`}
                                        >
                                          Add a Diamond
                                        </Link>
                                      )}
                                    </div>
                                  ) : (
                                    (item?.qty || item.item?.gem_type) && (
                                      <div className="whislist-button-purple">
                                        <Link
                                          href="#"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            dispatch(
                                              addToCart({
                                                ...item,
                                                product_type: item.product_type,
                                                ring_type: item?.ring_type,
                                              })
                                            );
                                            dispatch(removeToWishlist(item));
                                            
                                          }}
                                        >
                                          Add to Bag
                                        </Link>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="cart-checkcross">
                          <IoIosClose
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishData(item);
                            }}
                          />
                        </div>
                        {item.diamond && (
                          // item.diamond.map((diamond, index) => (
                          <div className="cart-card-inner inner-diamond">
                            <div className="cart-left-main">
                              <img
                                width="auto"
                                height="auto"
                                src={item.diamond?.image_url}
                                alt={item.diamond?.name}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                }}
                              />
                            </div>
                            <div className="cart-right-main">
                              <div className="cart-info">
                                <div className="cart-info-inner">
                                  <div className="cart-info-left">
                                    <div>
                                      <h2>
                                        <Link
                                          href="javascript:void(0);"
                                          className="td-n2"
                                        >
                                          {item.diamond
                                            .sub_title_description ? (
                                            <>
                                              {item.diamond.size}{" "}
                                              <span>Carat</span>{" "}
                                              {item.diamond.shape}{" "}
                                              <span> Diamond</span>{" "}
                                            </>
                                          ) : (
                                            item.diamond.short_title
                                          )}
                                        </Link>
                                      </h2>
                                      <div className="ir245-muted">
                                        <div>
                                          $
                                          {Math.round(
                                            item.diamond?.total_sales_price
                                          )}
                                        </div>
                                      </div>
                                      <div className="whislist-button-purple">
                                        <Link
                                          href="javascript:void(0);"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            handleHoverWishlist(
                                              item,
                                              item.product_type,
                                              item?.ring_type
                                            );
                                          }}
                                        >
                                          Add to Bag
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : item.product_type === "matching_set" ? (
                      <div className="cart-card-inner" key={index}>
                        <div className="cart-left-main">
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
                                  src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.jpg`}
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
                                  src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.alt.jpg`}
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
                                  src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.alt1.jpg`}
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
                                  src={`${imgBaseUrl}/${item?.ring_img}/${item?.ring_img}.jpg`}
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
                        <div className="cart-right-main">
                          <div className="cart-info">
                            <div className="cart-info-inner">
                              <div className="cart-info-left">
                                <div>
                                  <h2>
                                    <Link
                                      href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
                                      className="td-n2"
                                    >
                                      {item.ring?.name}
                                    </Link>
                                  </h2>
                                  <div className="ir245-muted">
                                    <div>${Math.round(item.ring_price)}</div>
                                  </div>

                                  <div className="whislist-button-purple">
                                    {item.ring_price > 0 ? (
                                      item.ring_size ? (
                                        <Link
                                          href="javascript:void(0);"
                                          onClick={() => {
                                            dispatch(addToCart(item));
                                            dispatch(removeToWishlist(item));
                                            // setToggledProducts((prevState) => ({
                                            //   ...prevState,
                                            //   [item.item?.id]: false,
                                            // }));
                                            // item.diamond &&
                                            //   setDiamondRingToggle((prevState) => ({
                                            //     ...prevState,
                                            //     [item.diamond?.id]: false,
                                            //   }));
                                          }}
                                        >
                                          Add to Bag
                                        </Link>
                                      ) : (
                                        <Link
                                          href={`/detail-wedding-band/${item.ring?.slug}?color=${item.ring_color}&diamond_original=${item.ring_type}`}
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
                          </div>
                        </div>
                        <div className="cart-checkcross">
                          <IoIosClose
                            onClick={(e) => {
                              e.preventDefault();
                              handleWishDataGemstoneAndBand(item);
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      item.product_type === "diamond" && (
                        // item.diamond.map((diamond, index) => (
                        <>
                          <div className="cart-card-inner">
                            <div className="cart-checkcross">
                              <IoIosClose
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleWishDataDiamond(item);
                                }}
                              />
                            </div>
                            <div className="cart-left-main">
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
                                  alt={item.diamonds?.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `${imgAssetsUrl}/frontend/images/grayscalelogo.png`;
                                  }}
                                />
                              </Link>
                            </div>
                            <div className="cart-right-main">
                              <div className="cart-info">
                                <div className="cart-info-inner">
                                  <div className="cart-info-left">
                                    <div>
                                      <h2>
                                        <Link
                                          href={`/view_diamond?stock_num=${
                                            item.diamonds?.stock_num
                                          }${
                                            item?.diamond_type === "natural"
                                              ? ""
                                              : `&diamond_origin=${item.diamond_type}`
                                          }`}
                                          className="td-n2"
                                        >
                                          {item.diamonds
                                            .sub_title_description ? (
                                            <>
                                              {item.diamonds.size}{" "}
                                              <span>Carat</span>{" "}
                                              {item.diamonds.shape}{" "}
                                              <span> Diamond</span>{" "}
                                            </>
                                          ) : (
                                            item.diamond.short_title
                                          )}
                                        </Link>
                                      </h2>
                                      <div className="ir245-muted">
                                        <div>
                                          $
                                          {Math.round(
                                            item.diamonds?.total_sales_price
                                          )}
                                        </div>
                                      </div>
                                      <div className="whislist-button-purple">
                                        <Link
                                          href="javascript:void(0);"
                                          onClick={(event) => {
                                            event.preventDefault();
                                            handleHoverWishlistDiamond(item);
                                          }}
                                        >
                                          Add to Bag
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                      )
                    )}
                  </>
                );
              })
            ) : (
              <div className="empty-wish-list">
                Oops! Looks like your wish list is empty.
              </div>
            )}
          </div>
          <div className="checkout-btn">
            <Link href="/wishlist" className="btn btn-success btn-lg btn-block">
              View Wish List
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
