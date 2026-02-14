import React from 'react'
import styles from '../styles/section5.module.scss'

const Section5 = () => {
  return (
    <div className={styles.section}> 
      <div className='container'>
        <div className={styles.section5}>
       <div className={styles.content}>
      <div className={`${styles.heading} spartan-400`}>We bring you the best</div>
       <div className={`${styles.title} spartan-400`}>Assignments By Top 5% of Experts</div>
       <div className={styles.btns}>
        <button className={`${styles.join} spartan-400`}>Join Them</button>
        <p className={ `${styles.btnstext} spartan-300 `}>Our Selection Criteria</p>
       </div>
       </div>
        <img className={styles.img} src="/assets/section5.png" alt="assets" />
      </div>
      </div>
    </div>
  )
} 

export default Section5