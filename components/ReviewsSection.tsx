"use client";
import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { GoogleReview } from "@/lib/customFunctions/getGoogleReviews";

interface Props {
    reviews: GoogleReview[];
}

const ReviewsSection: React.FC<Props> = ({ reviews }) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: "left" | "right") => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400;
            scrollContainerRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="py-24 bg-[#F8F9FC] relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[-5%] w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[80px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-[80px]" />
            </div>

            <div className="max-w-[1380px] mx-auto px-6 lg:px-12 relative z-10">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                    <div className="max-w-2xl">
                        <span className="text-primary font-bold tracking-wider uppercase text-xs mb-4 block font-poppins">
                            Testimonials
                        </span>
                        <h2 className="text-4xl md:text-5xl font-bold font-montserrat text-gray-900 leading-tight">
                            Loved by students <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">
                                worldwide.
                            </span>
                        </h2>
                    </div>

                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll("left")}
                            className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            className="w-12 h-12 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Reviews Carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 lg:mx-0 lg:px-0"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="min-w-[320px] md:min-w-[400px] bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-between snap-center group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex gap-1 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                fill={i < (review.rating || 5) ? "currentColor" : "none"}
                                                className={i < (review.rating || 5) ? "" : "text-gray-200"}
                                            />
                                        ))}
                                    </div>
                                    <Quote className="text-blue-100 group-hover:text-blue-200 transition-colors" size={32} />
                                </div>

                                <p className="text-gray-600 font-poppins leading-relaxed mb-8 line-clamp-4">
                                    "{review.text}"
                                </p>
                            </div>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 relative shrink-0">
                                    <Image
                                        src={review.profile_photo_url || "/section6.png"}
                                        alt={review.author_name}
                                        fill
                                        className="object-cover"
                                        onError={(e: any) => e.target.src = "/section6.png"}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold font-montserrat text-gray-900 line-clamp-1">{review.author_name}</h4>
                                    <span className="text-xs text-gray-400 font-poppins">{review.relative_time_description}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default ReviewsSection;
