"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Facebook, Linkedin, Instagram, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-[#0f1629] text-gray-300 py-16 border-t border-gray-800">
            <div className="max-w-[1380px] mx-auto px-6 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

                    {/* Column 1: Brand */}
                    <div className="space-y-6">
                        <div className="relative w-40 h-12">
                            <Image
                                src="/bluepenlogo.png"
                                alt="Bluepen Logo"
                                fill
                                className="object-contain object-left invert brightness-0 grayscale-0"
                            />
                        </div>
                        <p className="text-gray-400 font-poppins text-sm leading-relaxed max-w-xs">
                            Your trusted platform for all your academic needs, providing seamless collaboration, expert guidance, and innovative solutions to help you achieve your goals.
                        </p>

                        <div className="flex gap-4">
                            <Link href="https://facebook.com/bluepen11" target="_blank" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] hover:text-white transition-all duration-300">
                                <Facebook size={18} />
                            </Link>
                            <Link href="https://www.linkedin.com/company/bluepen-co-in" target="_blank" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#0A66C2] hover:text-white transition-all duration-300">
                                <Linkedin size={18} />
                            </Link>
                            <Link href="https://www.instagram.com/bluepen_assignment_pvt_ltd" target="_blank" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-[#E4405F] hover:text-white transition-all duration-300">
                                <Instagram size={18} />
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h4 className="text-white font-montserrat font-bold text-lg mb-6">Explore</h4>
                        <ul className="space-y-3 font-poppins text-sm">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li className="pt-4 font-semibold text-gray-500 uppercase text-xs tracking-wider">Freelancers</li>
                            <li><Link href="/freelancer/login" className="hover:text-primary transition-colors">Login</Link></li>
                            <li><Link href="/freelancer/signup" className="hover:text-primary transition-colors">Signup</Link></li>
                            <li className="pt-4 font-semibold text-gray-500 uppercase text-xs tracking-wider">Affiliates</li>
                            <li><Link href="/affiliate/login" className="hover:text-primary transition-colors">Login</Link></li>
                            <li><Link href="/affiliate" className="hover:text-primary transition-colors">Signup</Link></li>
                        </ul>
                    </div>

                    {/* Column 3: Policies */}
                    <div>
                        <h4 className="text-white font-montserrat font-bold text-lg mb-6">Policies</h4>
                        <ul className="space-y-3 font-poppins text-sm">
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
                            <li><Link href="/paymentpolicy" className="hover:text-primary transition-colors">Payment Policy</Link></li>
                            <li><Link href="/changespolicy" className="hover:text-primary transition-colors">Changes Policy</Link></li>
                            <li><Link href="/referralpolicy" className="hover:text-primary transition-colors">Referral Policy</Link></li>
                            <li><Link href="/refundandcancellationpolicy" className="hover:text-primary transition-colors">Refund & Cancellation</Link></li>
                            <li><Link href="/rewards" className="hover:text-primary transition-colors">Reward Terms</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div>
                        <h4 className="text-white font-montserrat font-bold text-lg mb-6">Contact</h4>
                        <ul className="space-y-4 font-poppins text-sm">
                            <li className="flex items-start gap-3">
                                <Phone size={18} className="text-primary mt-0.5" />
                                <a href="tel:9174117419" className="hover:text-white transition-colors">9174117419</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <Mail size={18} className="text-primary mt-0.5" />
                                <a href="mailto:bluepenassign@gmail.com" className="hover:text-white transition-colors">bluepenassign@gmail.com</a>
                            </li>
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-primary mt-0.5" />
                                <Link
                                    href="https://www.google.com/maps/place/BluePen/@19.1542355,72.9355831,17z"
                                    target="_blank"
                                    className="hover:text-white transition-colors leading-relaxed"
                                >
                                    Bhandup (West), <br /> Mumbai - 400078
                                </Link>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-gray-800 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-poppins">
                    <p>&copy; {new Date().getFullYear()} Bluepen. All rights reserved.</p>
                    <div className="mt-4 md:mt-0 flex gap-6">
                        <Link href="/admin/login" className="hover:text-gray-400">Team Login</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
