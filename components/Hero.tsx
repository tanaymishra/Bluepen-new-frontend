import React from 'react'
import '../styles/hero.scss'
import Image from 'next/image'
import InfiniteSlider from './InfiniteSlider'
import heroimg from '/hero/heroimg.png'
import Navbar from '@/components/user/navbar/navbar'; 

const Hero = () => {
  const slider = [
    {
      id: 1,
      img: "/hero/australia.png",
    },
    {
      id: 2,
      img: "/hero/canada.png",
    },
    {
      id: 3,
      img: "/hero/india.png",
    },
    {
      id: 4,
      img: "/hero/uk.png",
    },
    {
      id: 5,
      img: "/hero/usa.png",
    },
  ];

    return (
        <div className='bgcolor'>
            {/* <Navbar/> */}
            <div className='main'>
                <span className='maintext'>We help you do your <br /> Assignments</span>
                <span className='sidetext'>Never worry about not knowing your assignments. Find <br /> experts to help you with your assignments and projects.</span>
                <div className='button-row'>
                    <button className='ass'>Post your Assignment</button>
                    <button className='plag'>Check Plagiarism</button>
                </div>
            </div>
            
            <div className="relative">
                <img src="/hero/Vector.png" className="buildingimg" alt="" />
                <div className="absolute">
                    <span className="slidertext">Trusted by the world&apos;s leading universites in</span>
                    <div className="slider-hero-container">
                        <div className="slider-container">
                            <InfiniteSlider items={slider} />
                        </div>
                        <img className='heroimg' src="/hero/heroimg.png" alt="" />
                    </div>
              </div>
            </div>

        </div>
    )
}

export default Hero;


{
  /* 
{
  /* 
                    <div className='slider-container'>
                        <div className='slider'>

                            {slider.map((el, index) => (
                                <div className="slider-item" key={index}>
                                    <img src={el.img} alt="" />
                                </div>
                            ))}
                        </div>
                    </div> */
}
