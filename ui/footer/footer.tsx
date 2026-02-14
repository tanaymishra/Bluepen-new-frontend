import Link from "next/link";
import styles from "../../styles/footer.module.scss";
import TextSlideUp from "@/components/clientPreventors/footer/textslideup";
import ButtonBasic from "../button/buttonbasic";
import ClientSide from "./clientSide";
export const Footer = () => {


  return (
    <div className={styles.section}>
      <ClientSide></ClientSide>
      <div className={styles.footer}>
        <div className="">
          <div className={styles.footertitle}>
            <span className={`${styles.footertitletext}`}>
              {`You are not alone`}{" "}
            </span>
            <ButtonBasic
              variant="primary"
              className={`${styles.button} spartan-400`}
              href="/newPost/post"
            >
              Post Assignment
            </ButtonBasic>
          </div>
        </div>

        <div className={styles.footercontent}>
          <div className="flex">
            <div className={styles.footerrow}>
              <div className={styles.footercol1}>
                {/* <div> */}
                <img className={styles.logoimg} src="/bluepenlogo.png" alt="" />
                <div className={`${styles.footercol1text} spartan-400`}>
                  Your trusted platform for all your academic needs, providing
                  seamless collaboration, expert guidance, and innovative
                  solutions to help you achieve your goals.
                </div>
                <div className={styles.socialIconsRow}>
                  <Link href={"https://facebook.com/bluepen11"} target="_blank">
                    <ButtonBasic variant="custom">
                      <img className={styles.fb} src="/facebook.png" alt="" />
                    </ButtonBasic>
                  </Link>
                  <Link href={"https://www.linkedin.com/company/bluepen-co-in/posts/?feedView=all"} target="_blank">
                    <ButtonBasic variant="custom">
                      <img
                        className={styles.linkedin}
                        src="/linkedin.png"
                        alt=""
                      />
                    </ButtonBasic>
                  </Link>
                  <Link href={"https://www.instagram.com/bluepen_assignment_pvt_ltd?igsh=ZDVzNmIwaGVuNmxp"} target="_blank">
                    <ButtonBasic variant="custom">
                      <img
                        className={styles.instagram}
                        src="/instagram.png"
                        alt=""
                      />
                    </ButtonBasic>
                  </Link>
                  {/* <ButtonBasic variant="custom">
                    <img className={styles.twitter} src="/twitter.png" alt="" />
                  </ButtonBasic> */}
                </div>
                {/* </div> */}
              </div>

              <div className={styles.footerow2}>
                <div className={styles.footercol2}>
                  <div className={`${styles.footercol2title} spartan-600`}>
                    Navigate
                  </div>
                  {/* <div className={styles.footercol2titleline}></div> */}
                  <div className={`${styles.footercol2text} spartan-300`}>
                    {/* <span>
                      <Link href={"/about"}>About Us</Link>
                    </span> */}
                    <span>
                      <Link href={"/contact"}>Contact Us</Link>
                    </span>
                  </div>
                  <div className={`${styles.footercol2text} spartan-300`}></div>
                  <div className={`${styles.footercol2text} spartan-300`}></div>
                  <div className={`${styles.footercol2title} spartan-600`}>
                    For Freelancers
                  </div>
                  {/* <div className={styles.footercol2titleline}></div> */}
                  <div className={`${styles.footercol2text} spartan-300`}>
                    <span>
                      <Link href={"/freelancer/login"}>Freelancer Login</Link>
                    </span>
                    <span>
                      <Link href={"/freelancer/signup"}>Freelancer Signup</Link>
                    </span>
                  </div>
                  <div className={`${styles.footercol2text} spartan-300`}></div>
                  <div className={`${styles.footercol2text} spartan-300`}></div>
                  
                  <div className={`${styles.footercol2title} spartan-600`}>
                    For Affiliates
                  </div>
                  {/* <div className={styles.footercol2titleline}></div> */}
                  <div className={`${styles.footercol2text} spartan-300`}>
                    <span>
                      <Link href={"/affiliate/login"}>Affiliate Login</Link>
                    </span>
                    <span>
                      <Link href={"/affiliate"}>Affiliate Signup</Link>
                    </span>
                  </div>
                  <div className={`${styles.footercol2text} spartan-300`}></div>
                  <div className={`${styles.footercol2text} spartan-300`}></div>
                  
                  <div className={`${styles.footercol2title} spartan-600`}>
                    For Team
                  </div>
                  {/* <div className={styles.footercol2titleline}></div> */}
                  <div className={`${styles.footercol2text} spartan-300`}>
                    <span>
                      <Link href={"/admin/login"}>{`Team Login`}</Link>
                    </span>
                  </div>
                </div>

                <div className={styles.footercol2}>
                  <div className={`${styles.footercol2title} spartan-600`}>
                    Policies
                  </div>
                  <div className={styles.footercol2titleline}></div>
                  <div className={`${styles.footercol2text} spartan-300`}>
                    <span>
                      <Link href={"/terms"} about="Term & Conditions">Term & Conditions</Link>
                    </span>
                    <span>
                      <Link href={"/paymentpolicy"} about="Payment Policy">Payment Policy</Link>
                    </span>
                    <span>
                      <Link href={"/changespolicy"} about="Changes Policy">Changes Policy</Link>
                    </span>
                    <span>
                      <Link href={"/referralpolicy"} about="Referral Policy">Referral Policy</Link>
                    </span>
                    <span>
                      <Link about="Refund and cancellation policy" href={"/refundandcancellationpolicy"}>
                        Refund & Cancellation Policy
                      </Link>
                    </span>
                    <span>
                      <Link href={"/rewards"}>Reward Terms & Conditions</Link>
                    </span>
                    <span>
                      <Link href="/privacy" about="Privacy Policy" >Privacy Policy</Link>
                    </span>{" "}
                  </div>
                </div>

                <div className={styles.footercol2}>
                  <div className={`${styles.footercol2title} spartan-600`}>
                    Contact Us
                  </div>
                  <div className={styles.footercol2titleline}></div>
                  <div className={`${styles.footercol2text} spartan-300`}>
                    {/* <span>
                9004185304 / 9619305482
                </span> */}
                    <span>
                      <a href="tel:9174117419">9174117419</a>
                    </span>
                    <span>
                      <a href="mailto:bluepenassign@gmail.com">
                        bluepenassign@gmail.com
                      </a>
                    </span>
                    <span className={styles.address}>
                      <Link href="https://www.google.com/maps/place/BluePen/@19.1542355,72.9355831,17z/data=!4m6!3m5!1s0x3be7b9a67d56bd8b:0x38ad76830fccbe4c!8m2!3d19.1542355!4d72.9355831!16s%2Fg%2F11j9cq_yh4!5m1!1e1?entry=ttu&g_ep=EgoyMDI1MDExNC4wIKXMDSoASAFQAw%3D%3D" target="_blank">
                      
                      Bhandup(West), Mumbai - 400078
                      </Link>
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.footerimg}>
                <img className={styles.bitMoji} src="/footerimg.png" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
