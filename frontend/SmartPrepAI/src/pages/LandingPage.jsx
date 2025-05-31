import React, { useContext, useState, useEffect } from 'react';
import Modal from "../components/Loader/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import HERO_IMG from "../assets/hero-img.png";
import { APP_FEATURES, CARD_BG } from "../utilis/data";
import { useNavigate } from 'react-router-dom';
import { LuSparkles } from "react-icons/lu";
import { UserContext } from '../context/userContext';
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const [currentFeatureIndex, setCurrentFeatureIndex] = useState(0);

  const handleCTA = () => {
    if (!user) setOpenAuthModal(true);
    else navigate("/dashboard");
  };

  const handleNext = () => {
    setCurrentFeatureIndex((prev) => (prev + 1) % APP_FEATURES.length);
  };

  const handlePrev = () => {
    setCurrentFeatureIndex((prev) =>
      prev === 0 ? APP_FEATURES.length - 1 : prev - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className='w-full min-h-full bg-gradient-to-b from-[#f9f9f9] to-[#eef1f4]'>
        <div className="container mx-auto px-4 pt-6 pb-16 relative z-10">
          <header className='flex justify-between items-center mb-10'>
            <div className="text-2xl text-gray-800 font-bold">SmartPrepAI</div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className='bg-gradient-to-r from-[#4F46E5] to-[#6366F1] text-sm font-semibold text-white px-6 py-2.5 rounded-full hover:opacity-90 transition'
                onClick={() => setOpenAuthModal(true)}>
                Login / Signup
              </button>
            )}
          </header>

          <div className="flex flex-col-reverse md:flex-row items-center gap-10">
            <div className="w-full md:w-1/2">
              <div className="flex items-center gap-2 text-xs text-indigo-600 font-semibold bg-indigo-100 px-3 py-1 rounded-full mb-3 w-fit">
                <LuSparkles /> AI Powered
              </div>
              <h1 className='text-4xl sm:text-5xl text-gray-900 font-semibold leading-tight mb-6'>
                Ace Your Prep with <br />
                <span className='bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent'>
                  AI-Powered Learning
                </span>
              </h1>
              <p className='text-[16px] text-gray-700 mb-6'>
                Role-specific questions, expandable answers, and organization tools — everything you need to succeed in your interviews.
              </p>
              <button
                className='bg-indigo-600 text-white px-6 py-2.5 rounded-full font-medium hover:bg-indigo-700 transition'
                onClick={handleCTA}>
                Get Started
              </button>
            </div>

            <div className="w-full md:w-1/2">
              <img src={HERO_IMG} alt="Hero" className='w-full rounded-xl shadow-md' />
            </div>
          </div>
        </div>

        {/* Features Slider Moved Up */}
        <div className="container mx-auto px-4 py-10">
          <section>
            <h2 className='text-2xl font-semibold text-center text-gray-800 mb-10'>
              What Makes SmartPrepAI Shine?
            </h2>
            <div className="relative w-full flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFeatureIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  className="relative w-full max-w-xl mx-auto p-6 rounded-xl shadow-md border border-gray-200 transition text-center"
                  style={{
                    background: CARD_BG[currentFeatureIndex % CARD_BG.length].bgcolor,
                  }}
                >
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                    {APP_FEATURES[currentFeatureIndex].title}
                  </h3>
                  <p className='text-gray-700'>
                    {APP_FEATURES[currentFeatureIndex].description}
                  </p>
                  <div className="absolute left-0 top-1/2 -translate-y-1/2">
                    <button onClick={handlePrev} className="p-2 text-gray-600 hover:text-black">
                      <FaChevronLeft size={20} />
                    </button>
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <button onClick={handleNext} className="p-2 text-gray-600 hover:text-black">
                      <FaChevronRight size={20} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
        </div>

        <div className="text-sm text-gray-500 text-center p-6">
          Made with ♥ — Happy Coding
        </div>
      </div>

      <Modal isOpen={openAuthModal} onClose={() => {
        setOpenAuthModal(false);
        setCurrentPage("login");
      }} hideHeader>
        {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
        {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
      </Modal>
    </>
  );
};

export default LandingPage;
