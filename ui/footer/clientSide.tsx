"use client";
import Link from "next/link";
import styles from "../../styles/footer.module.scss";
import React, { useEffect, useRef } from "react";
import TextSlideUp from "@/components/clientPreventors/footer/textslideup";
import ButtonBasic from "../button/buttonbasic";
import { useRouter } from "next/navigation";

const ClientSide = () => {
    const footerRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("animate-fade-in");
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, []);
    return (
        <>
            <span ref={footerRef} className={`${styles.title} spartan-500`}>
                <TextSlideUp parentClass={styles.title}>
                    {"bluepen".split("").map((char, index) => (
                        <span key={index}>{char}</span>
                    ))}
                </TextSlideUp>
            </span>{" "}
        </>
    )
}

export default ClientSide