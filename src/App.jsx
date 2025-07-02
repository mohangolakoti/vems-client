import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Pcc1 from './pages/Pcc1';
import Pcc2 from './pages/Pcc2';
import Pcc3 from './pages/Pcc3';
import SingleMeter from './pages/SingleMeter';
import PageNotFound from './components/PageNotFound';
import DatewiseGraphs from './pages/DatewiseGraphs';
import Prediction from './pages/Prediction';
import Data from './pages/Data';
import PredictionBarChart from './pages/PredictionBarChart';
import Tiegrad from './components/Tiegrad';
import Video from './components/Video';
import Team from './components/Team';

// Home Carousel Component
const HomeCarousel = () => {
  const slides = [<Dashboard />, <Tiegrad />, <Team />];
  const durations = [20000, 10000, 10000]; // Dashboard (20s), Tiegrad (20s), Video (2 mins)
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, durations[currentIndex]);

    return () => clearTimeout(timeout);
  }, [currentIndex]);

  return <div>{slides[currentIndex]}</div>;
};

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeCarousel />} />
        <Route path="/graphs" element={<DatewiseGraphs />} />
        <Route path="/Pcc1" element={<Pcc1 />} />
        <Route path="/Pcc2" element={<Pcc2 />} />
        <Route path="/Pcc3" element={<Pcc3 />} />
        <Route path="/SingleMeter/:id" element={<SingleMeter />} />
        <Route path="*" element={<PageNotFound />} />
        <Route path="/sensordata" element={<Data />} />
        <Route path="/predictions" element={<Prediction />} />
        <Route path="/pred" element={<PredictionBarChart />} />
        <Route path="/video" element={<Video />} />
        <Route path="/image" element={<Tiegrad />} />
        <Route path='/team' element={<Team/>} />
      </Routes>
    </div>
  );
};

export default App;
