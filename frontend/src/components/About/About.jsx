import React from 'react'
import { Link } from 'react-router-dom'
import aboutImg from '../../assets/images/about.png'
import aboutCardImg from '../../assets/images/about-card.png'

const About = () => {
  return (
    <section>
        <div className='container'>
            <div className='flex justify-between gap-[50px] lg:gap-[130px] xl:gap-0 flex-col lg:flex-row '>
{/*--about image--*/}
                <div className='relative w-3/4 lg:w-1/2 xl:w-[750px] z-1- order-2 lg:order-1'>
                    <img src={aboutImg} alt="" />
                    <div className='absolute z-20 bottom-4 w-[200px] md:w-[300px] right-[-30%] md:right-[-7%] lg:right-[20%]'>
                        <img src={aboutCardImg} alt="" />
                    </div>
                </div>
            {/*--about content--*/}
            <div className='w-full lg:w-1/2 xl:w-[650px] order-1 lg:order-2'>
                <h2 className='heading'>Proud to be the best Islandwide</h2>
                <p className='text__para'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed accumsan ipsum. Vivamus nisl leo, condimentum ut mauris quis, venenatis feugiat eros. Sed et erat fringilla, feugiat ipsum quis, elementum nunc. </p>
                <p className='text__para mt-[25px]'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi sed accumsan ipsum. Vivamus nisl leo, condimentum ut mauris quis, venenatis feugiat eros. Sed et erat fringilla, feugiat ipsum quis, elementum nunc. </p>
                <Link to='/serivces'>
                <button className='btn'>Learn More</button>
                </Link>

            </div>

            </div>
        </div>
    </section>
  )
}

export default About