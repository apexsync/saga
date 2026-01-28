import React from 'react';
import CircularHorizontalScroll from '../Components/CircularHorizontalScroll';
import ImageLayout from '../Components/ImageLayout';
import CategoryGrid from '../Components/CategoryGrid';
import HorizontalCarousal from '../Components/HorizontalCarousal';

const Home = () => {
  return (
    <div className="pt-24">
      <CircularHorizontalScroll />
      <ImageLayout />
      <CategoryGrid />
      <HorizontalCarousal />
    </div>
  );
};

export default Home;
