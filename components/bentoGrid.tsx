import React from 'react'
import styles from "@/styles/section4.module.scss"

export const BentoGrid = () => {
  return (
    <div className="container">
    <div className={styles.marker}>
      <div className={styles.text}>
        <div className={styles.col}>
        <span className={`${styles.title} spartan-400 `}>We do it all</span>
        <span className={`${styles.desc} spartan-900 `}>Every aspect is covered, guaranteeing a flawless result for <br /> everyone.</span>
        </div>
      </div>
      <div className={styles.img}>
      <img className={styles.turbanimg} src="/section4/main.png" alt="" />       
      </div>

    </div>

    <div className={styles.grid1}>
        <div className={styles.researchcard}>
          <div className={styles.researchrow}>
          <div className={styles.researchcontent}>

          <div className={`${styles.cardtitle} spartan-500 `}>
          Research Paper
          </div>
          <div className={`${styles.carddesc} spartan-300 `}>
          Get comprehensive research paper writing services from expert writers and ensure a top-quality submission.
          </div>

          </div>


          <div className={styles.researchimg}>
          <img className="reimg" src="/section4/research.png" alt="research" />
          </div>
          </div>


        </div>
       
        <div className={styles.dissertationcard}>
          <div className={styles.researchrow}>
        <div className={styles.researchcontent}>
        <div className={`${styles.cardtitle} spartan-500 `}>
          Dissertations & Thesis
        </div>

        <div className={`${styles.carddesc} spartan-300 `}>
        Get expert help with your dissertation or thesis and <br /> take the first step towards achieving <br /> your academic goals.
        </div>
        </div>

        <div className={styles.dissertationimg}>
          <img className="reimg" src="/section4/dissertation.png" alt="dissertation" />
        </div>
        </div>
        </div>
    </div>

    <div className={styles.grid2}>

      <div className={styles.logocard}>
        <img className={styles.logoimg} src="/section4/logo.png" />
      </div>

      <div className={styles.codingcard}>
          <div className={styles.codingrow}>
          <div className={styles.codingcontent}>

          <div className={`${styles.cardtitle} spartan-500`}>
          Coding Assignments
          </div>
          <div className={`${styles.carddesc} spartan-300`}>
          Get top-notch solutions for your coding assignments from the experienced
          programmers and take your assignment skills to the next level at Bluepen. 
          </div>
          </div>


          <div className={styles.codingimg}>
          <img className={styles.reimg} src="/section4/coding.png" alt="coding" />
          </div>
          </div>


      </div>

      <div className={styles.sopcard}>
          <div className={styles.soprow}>
          <div className={styles.sopcontent}>

          <div className={`${styles.cardtitle} spartan-500 `}>
          SOP&apos;s & LOR&apos;s
          </div>
          <div className={`${styles.carddesc} spartan-300 `}>
          Craft a compelling statement of purpose or secure a strong letter of recommendation with our professional writing services.            </div>

          </div>


          <div className={styles.codingimg}>
          <img className={styles.reimg} src="/section4/sop.png" alt="coding" />
          </div>
          </div>


      </div>



    </div>


  </div>
  )
}
