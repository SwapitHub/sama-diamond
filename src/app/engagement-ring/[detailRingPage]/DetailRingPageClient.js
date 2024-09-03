// src/app/engagement-ring/[detailRingPage]/DetailRingPageClient.js

"use client";

import React from 'react';

const DetailRingPageClient = ({ data }) => {
  console.log(data.data);
  
  function MyFunction() {
    alert("Hello, World!");
  }

  return (
    <>
     <h2>ser sing</h2>
     <button onClick={MyFunction}>click</button>
    </>
  );
};

export default DetailRingPageClient;
