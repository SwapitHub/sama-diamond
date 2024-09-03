"use client";
import { createContext, useState, useContext } from 'react';

// Create the context
export const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [cartDetails, setCartDetails] = useState();
  const [userId, setUserId] = useState();
  const [removeWishList, setRemoveWishList] = useState();
  const [searching, setSearching] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [showSuggestionHeader, setShowSuggestionHeader] = useState(false);
  const [loadingCart, setLoadingCart] = useState(false);
  const [toggle, setToggle] = useState(1);

  const baseUrl = "http://ec2-3-18-62-57.us-east-2.compute.amazonaws.com/admin/api/v1";
  const imgBaseUrl = "https://assets.rocksama.com/products/images";
  const imgAssetsUrl = "https://assets.rocksama.com";

  return (
    <UserContext.Provider
      value={{
        cartDetails,
        setCartDetails,
        userId,
        setUserId,
        removeWishList,
        setRemoveWishList,
        searching,
        setSearching,
        showSuggestion,
        setShowSuggestion,
        showSuggestionHeader,
        setShowSuggestionHeader,
        loadingCart,
        setLoadingCart,
        toggle,
        setToggle,
        baseUrl,
        imgBaseUrl,
        imgAssetsUrl,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
