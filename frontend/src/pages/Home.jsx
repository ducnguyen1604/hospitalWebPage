import React, { useRef, useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

import About from '../components/About/About'

import heroImg01 from '../assets/images/hero-img01.jpeg'
import heroImg02 from '../assets/images/hero-img02.png'
import heroImg03 from '../assets/images/hero-img03.png'
import icon01 from '../assets/images/icon01.png'
import icon02 from '../assets/images/icon02.png'
import icon03 from '../assets/images/icon03.png'
import featureImg from '../assets/images/feature-img.png'
import videoIcon from '../assets/images/video-icon.png'
import avatarIcon from '../assets/images/avatar-icon.png'
import faqImg from '../assets/images/faq-img.png'
import Faqlist from '../components/FAQ/Faqlist'



const Home = () => {
    const scrollRef = useRef(null); // Reference for the carousel
    const [cards, setCards] = useState([
        { id: 1, title: "Find a Doctor", icon: icon01, description: "Browse our directory of experienced doctors and specialists. Choose the one that best fits your needs and get expert medical advice." },
        { id: 2, title: "Find a Center", icon: icon02, description: "Locate the nearest healthcare center or clinic. We have multiple locations to serve you better, ensuring prompt and efficient care." },
        { id: 3, title: "Book an Appointment", icon: icon03, description: "Schedule an appointment at your convenience. We offer online booking for easy access to consultations and follow-ups." },
       
    ]);

    // Duplicate cards for smooth infinite scroll
    const repeatedCards = [...cards, ...cards];

    const scrollLeft = () => {
        scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    };

    const scrollRight = () => {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    };
    
    return <>
        <>
            <section className='hero__section pt-[60px] 2xl:h-[800px]'>
                <div className='container'>
                    <div className='flex flex-col lg:flex-row gap-[90px] items-center justify-between'>

                        {/* <!-- Head --> */}
                        <div>
                            <div className='lg:w-[570px]'>
                                <h1 className='text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]'>We help Patient live a heathy life longer life</h1>
                                <p className='mt-5'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed accumsan ipsum. Vivamus nisl leo, condimentum ut mauris quis, venenatis feugiat eros. Sed et erat fringilla, feugiat ipsum quis, elementum nunc.</p>
                                <Link to='doctors'>
                                    <button className='btn transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700'>Request appointment</button>
                                </Link>

                            </div>

                            {/* <!-- Counter --> */}
                            <div className='mt-[30px] lg:mt-[70px] flex flex-col lg:flex-row lg:items-center gap-5 lg:gap-[30px]'>
                                <div>
                                    <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>30+</h2>
                                    <span className='w-[100px] h-2 bg-yellowColor rounded-full block mt-[-14px]'></span>
                                    <p className='text__para'>Year of Experience</p>
                                </div>

                                <div>
                                    <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>50+</h2>
                                    <span className='w-[100px] h-2 bg-purpleColor rounded-full block mt-[-14px]'></span>
                                    <p className='text__para'>Clinic Locations</p>
                                </div>

                                <div>
                                    <h2 className='text-[36px] leading-[56px] lg:text-[44px] lg:leading-[54px] font-[700] text-headingColor'>99.8%</h2>
                                    <span className='w-[100px] h-2 bg-irisBlueColor rounded-full block mt-[-14px]'></span>
                                    <p className='text__para'>Patient Satisfaction</p>
                                </div>

                            </div>
                        </div>

                        <div className='flex gap-[30px] justify-end'>
                            <div>
                                <img className='w-full' src={heroImg01} />
                            </div>
                            <div className='mt-[30px]'>
                                <img className='w-full mb-[30px]' src={heroImg02} alt="sd" />
                                <img className='w-full' src={heroImg03} alt="d" />
                            </div>
                        </div>


                    </div>
                </div>
            </section>

            {/* <!-- Intro --> */}

            <section className="bg-gray-50 py-16">
                <div className="container mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-headingColor mb-4">
                            Providing the Best Medical
                        </h2>
                        <p className="text-lg text-gray-600">
                            Experience top-tier healthcare with our trusted professionals.Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed accumsan ipsum. Vivamus nisl leo, condimentum ut mauris quis, venenatis feugiat eros. Sed et erat fringilla.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Carousel Container */}
                        <div
                            ref={scrollRef}
                            className="ml-[60px] flex gap-10 overflow-x-auto scroll-smooth scrollbar-hide"
                            style={{ scrollSnapType: "x mandatory" }}
                        >
                            {repeatedCards.map((card, index) => (
                                <Link
                                    key={index}
                                    to="/services"
                                    className="flex-shrink-0 w-[400px] mb-2"
                                    style={{ scrollSnapAlign: "start" }}
                                >
                                    <div className="p-6 bg-white shadow-md rounded-lg hover:shadow-xl transition-shadow flex flex-col items-center text-center">
                                        <h3 className="text-xl font-semibold text-headingColor mb-4">
                                            {card.title}
                                        </h3>
                                        <img src={card.icon} alt={card.title} className="mb-4" />
                                        <p className="text-gray-600 leading-7">{card.description}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Navigation Buttons */}
                        <button
                            onClick={scrollLeft}
                            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
                        >
                            <AiOutlineLeft size={24} />
                        </button>
                        <button
                            onClick={scrollRight}
                            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md hover:shadow-lg transition"
                        >
                            <AiOutlineRight size={24} />
                        </button>
                    </div>
                </div>
            </section>



            {/* <!-- About --> */}
            <About></About>

            {/* <!-- Services --> */}
            <section className="bg-gray-50 py-16">
                <div className="container mx-auto">
                    <div className="text-center max-w-xl mx-auto mb-12">
                        <h2 className="text-3xl lg:text-4xl font-bold text-headingColor mb-4">
                            Our Medical Services
                        </h2>
                        <p className="text-lg text-gray-600">
                            Providing high-quality, personalized healthcare. We ensure every patient gets the best treatment and care.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Service 1 */}
                        <div className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-center h-16 w-16 bg-blue-100 rounded-full mb-6">
                                <img src={icon01} alt="Service Icon" className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                                General Checkup
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Regular health checkups help detect potential health issues early. Our general checkup service ensures you stay on top of your health.
                            </p>
                            <Link
                                to="/doctors"
                                className="text-primaryColor font-semibold flex items-center group-hover:underline"
                            >
                                Learn More <BsArrowRight className="ml-2" />
                            </Link>
                        </div>

                        {/* Service 2 */}
                        <div className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-center h-16 w-16 bg-purple-100 rounded-full mb-6">
                                <img src={icon02} alt="Service Icon" className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 group-hover:text-purple-600 transition-colors">
                                Surgery Department
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Our expert surgeons provide top-tier surgical care with state-of-the-art equipment and facilities to ensure the best outcomes.
                            </p>
                            <Link
                                to="/doctors"
                                className="text-primaryColor font-semibold flex items-center group-hover:underline"
                            >
                                Learn More <BsArrowRight className="ml-2" />
                            </Link>
                        </div>

                        {/* Service 3 */}
                        <div className="group bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
                            <div className="flex items-center justify-center h-16 w-16 bg-yellow-100 rounded-full mb-6">
                                <img src={icon03} alt="Service Icon" className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 group-hover:text-yellow-600 transition-colors">
                                Pediatrics
                            </h3>
                            <p className="text-gray-600 mb-6">
                                We provide specialized healthcare services for children, ensuring their well-being and healthy growth from infancy to adolescence.
                            </p>
                            <Link
                                to="/doctors"
                                className="text-primaryColor font-semibold flex items-center group-hover:underline"
                            >
                                Learn More <BsArrowRight className="ml-2" />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>


            {/* <!-- Features --> */}
            <section>
                <div className='container'>
                    <div className='flex items-center justify-between flex-col lg:flex-row'>
                        {/* <!-- Features Content --> */}
                        <div className='xl:w-[670px]'>
                            <h2 className='heading'>
                                Get Virtual Treatment <br /> From Anywhere
                            </h2>
                            <ul className='pl-4'>
                                <li className='text__para'>
                                    1. Schedule a virtual visit with a doctor from the comfort of your home.
                                </li>
                                <li className='text__para'>
                                    2. Search for your doctor and their contact here.
                                </li>
                                <li className='text__para'>
                                    3. View doctors who accepts new patients and use online tool to schedule appointment.
                                </li>
                            </ul>
                            <Link to='/'>
                                <button className='btn transform transition-transform duration-100 ease-in-out active:scale-95 active:bg-blue-700'>Learn More</button>
                            </Link>
                        </div>
                        {/* <!-- Features Img --> */}
                        <div className='relative z-10 xl:w-[750px]flex justify-end mt-[50px] lg:mt-0'>
                            <img src={featureImg} alt="" className='w-5/6' />
                            <div className='w-[150px] lg:w-[250px] bg-white absolute bottom-[50px] left-0 md:bottom-[100px] md:left-5 z-20 p-2 pb-3 lg:pt-4 lg:px-4 lg:pb-[26px] rounded-[10px]'>
                                <div className='flex items-center justify-between'>
                                    <div className='flex items-center gap-[6px] lg:gap-3'>
                                        <p className='text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-headingColor font-[600]'>Mon, 31</p>
                                        <p className='text-[10px] leading-[10px] lg:text-[14px] lg:leading-5 text-textColor font-[400]'>16:00</p>
                                    </div>
                                    <span className='w-5 h-5 lg:w-[30px] lg:h-[30px] flex items-center justify-center bg-yellowColor rounded py-1 px-[6px] lg:py-3 lg:px-[4px]'>
                                        <img src={videoIcon} alt="" />
                                    </span>
                                </div>

                                <div className='flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]'>
                                    <img src={avatarIcon} alt="ava" />
                                    <h4 className='text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] text-headingColor'>Jonny Sins</h4>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           
            {/* <!-- FAQ --> */}
            <section>
                <div className='container'>
                    <div className='flex justify-between gap-[50px] lg:gap-0'>
                        <div className='w-1/2 hidden md:block'>
                            <img src={faqImg} alt="" />
                        </div>
                        <div className='w-full md:w-1/2'>
                            <h2 className='heading'>Most Frequenly Asked Questions</h2>
                            <Faqlist />
                        </div>
                    </div>
                </div>
            </section>

        </>
    </>


}

export default Home