import React from "react";
import styles from '@/styles/welcomeSection.module.scss'
const WelcomeSection: React.FC = () => {
    return (

        <div className={styles.welcomeContainer}>
                    <div className="container">
                    <div className={styles.cardContainer}>
                <div className={styles.content}>
                    <span className={`${styles.heading} spartan-400`}>Amazing! for our team to look into your requirements</span>
                    <h2 className={`${styles.title} spartan-600`}>Choose your domain</h2>
                </div>
                {/* <div> */}
                    <img  className={styles.img} src="/assets/dashboard/postReq.png" alt="Girl with Cap" />
                {/* </div> */}
            </div>
            </div>

        </div>
    )
}

export default WelcomeSection;