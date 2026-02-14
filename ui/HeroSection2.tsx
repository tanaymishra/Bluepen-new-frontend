import React from 'react'
import '../styles/HeroSection2.css'

const HeroSection2 = () => {
  return (
    <div>
      <img className='img' src="/paper.png" alt="" />
      <div className= 'background'>
      <div className='container'>
        <div className='box'>
          <div className='textbox'>
            <span className='box-text'>We love to flaunt our numbers</span> <br /> <div className='box-text1'>~Since 2020</div>
          </div>
        <img className='woman' src="/woman.png" alt="" />
        </div>
        <div className='bottom-box'>
          <div className='content'>
            {/* <div> */}
            <div>
              <img src="/step1.png" alt="" />
            </div>
            <span className='numbers'>3000+</span>
            <span className='content-text'>Students <br /> trust us</span>
            </div>

            <div className='content'>
            <div>
              <img src="/step2.png" alt="" />
            </div>
            <span className='numbers'>400+</span>
            <span className='content-text'>Genuine experts <br />  & writers</span>
            </div>

            <div className='content'>

            <div>
              <img src="/step3.png" alt="" />
            </div>
            <span className='numbers'>400+</span>
            <div className='content-text'>Genuine experts <br /> & writers</div>
            </div>

            <div className='content'>
            <div>
              <img src="/step4.png" alt="" />
            </div>
            <span className='numbers'>1000+</span>
            <div className='content-text'>Domains & <br /> subjects covered</div>
            </div>

          {/* </div> */}
        </div>
      </div>
      </div>

    </div>
  )
}

export default HeroSection2