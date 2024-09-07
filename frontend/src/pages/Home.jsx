import React from 'react'
import { Link } from 'react-router-dom'
import { BsArrowRight } from 'react-icons/bs'

import About from '../components/About/About'
import ServicesList from '../components/Services/ServicesList'

import heroImg01 from '../assets/images/hero-img01.jpeg'
import heroImg02 from '../assets/images/hero-img02.png'
import heroImg03 from '../assets/images/hero-img03.png'
import icon01 from '../assets/images/icon01.png'
import icon02 from '../assets/images/icon02.png'
import icon03 from '../assets/images/icon03.png'
import featureImg from '../assets/images/feature-img.png'
import videoIcon from '../assets/images/video-icon.png'
import avatarIcon from '../assets/images/avatar-icon.png'

const Home = () => {
    return <>
        <>
            <section className='hero__section pt-[60px] 2xl:h-[800px]'>
                <div className='container'>
                    <div className='flex flex-col lg:flex-row gap-[90px] items-center justify-between'>

                        {/* <!-- Head --> */}
                        <div>
                            <div className='lg:w-[570px]'>
                                <h1 className='text-[36px] leading-[46px] text-headingColor font-[800] md:text-[60px] md:leading-[70px]'>We help Patient live a heathy life longer life</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed accumsan ipsum. Vivamus nisl leo, condimentum ut mauris quis, venenatis feugiat eros. Sed et erat fringilla, feugiat ipsum quis, elementum nunc.</p>

                                <button className='btn'>Request appointment</button>
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
            <section>
                <div className='container'>
                    <div className='lg:w-[470px] mx-auto'>
                        <h2 className='heading text-center'>Providing the Best Medical</h2>
                        <p className='text__para text-center'>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut elit mollis, elementum nulla id, scelerisque sapien. Morbi in mollis erat.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]'>
                        <div className='py-[30px] px-5'>
                            <div className='flex items-center justify-center'>
                                <img src={icon01} alt="" />
                            </div>
                            <div className='mt-[30px]'>
                                <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>Find a Doctor</h2>
                                <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut elit mollis, elementum nulla id, scelerisque sapien. Morbi in mollis erat.</p>
                                <Link to='/doctors' className='w-[44px] h-[44px] border border-solid border-[#181a1E] rounded-full mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none' >
                                    <BsArrowRight className='group-hover:text-white w-6 h-5' />
                                </Link>
                            </div>
                        </div>
                        <div className='py-[30px] px-5'>
                            <div className='flex items-center justify-center'>
                                <img src={icon02} alt="" />
                            </div>
                            <div className='mt-[30px]'>
                                <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>Find a Center</h2>
                                <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut elit mollis, elementum nulla id, scelerisque sapien. Morbi in mollis erat.</p>
                                <Link to='/doctor' className='w-[44px] h-[44px] border border-solid border-[#181a1E] rounded-full mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none' >
                                    <BsArrowRight />
                                </Link>
                            </div>
                        </div>
                        <div className='py-[30px] px-5'>
                            <div className='flex items-center justify-center'>
                                <img src={icon03} alt="" />
                            </div>
                            <div className='mt-[30px]'>
                                <h2 className='text-[26px] leading-9 text-headingColor font-[700] text-center'>Book an Appointment</h2>
                                <p className='text-[16px] leading-7 text-textColor font-[400] mt-4 text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas ut elit mollis, elementum nulla id, scelerisque sapien. Morbi in mollis erat.</p>
                                <Link to='/doctor' className='w-[44px] h-[44px] border border-solid border-[#181a1E] rounded-full mt-[30px] mx-auto flex items-center justify-center group hover:bg-primaryColor hover:border-none' >
                                    <BsArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* <!-- About --> */}
            <About></About>

            {/* <!-- Services --> */}
            <section>
                <div className='container'>
                    <div className='xl:w-[450px] mx-auto'>
                        <h2 className='heading text-center'>Our Medical Services</h2>
                        <p className='text__para text-center'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed accumsan ipsum.</p>
                    </div>
                    <ServicesList />
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
                                    1.Schedule a virtual visit with a doctor from the comfort of your home.
                                </li>
                                <li className='text__para'>
                                    2. Search for your doctor and their contact here.
                                </li>
                                <li className='text__para'>
                                    3. View doctors who accepts new patients and use online tool to schedule appointment.
                                </li>
                            </ul>
                            <Link to='/'>
                                <button className='btn'>Learn More</button>
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


                                <div  className='flex items-center gap-[6px] lg:gap-[10px] mt-2 lg:mt-[18px]'>
                                    <img src={avatarIcon} alt="ava" />
                                    <h4 className='text-[10px] leading-3 lg:text-[16px] lg:leading-[22px] font-[700] text-headingColor'>Jonny Sins</h4>

                                </div>

                            </div>
                        </div>


                    </div>
                </div>
            </section>

        </>
    </>


}

export default Home