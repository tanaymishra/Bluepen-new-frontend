"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/authentication/authentication";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Menu,
  X,
  LogOut,
  User,
  BookOpen,
  Gift,
  Ticket,
  ExternalLink,
} from "lucide-react";

const products = [
  {
    name: "Bluepen",
    description: "Assignment help platform",
    imgSrc: "/assets/navbar/bluepenLogoShort.webp",
    link: "https://bluepen.co.in",
  },
  {
    name: "Writeyfy",
    description: "Professional writing services",
    imgSrc: "/assets/navbar/writeyfyLogo.webp",
    link: "https://writeyfy.com",
  },
  {
    name: "Greenguide",
    description: "Sustainable learning",
    imgSrc: "/assets/navbar/GreenGuideLogo.svg",
    link: "https://greenguide.co.in",
  },
];

const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { user, clearUser, isHydrated, getUserRole, isAuthenticated } =
    useAuth();

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isProductsOpen, setProductsOpen] = useState(false);
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const productsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const getInitials = (firstname: string, lastname: string) =>
    `${firstname?.charAt(0).toUpperCase()}${lastname?.charAt(0).toUpperCase()}`;

  const handleLogout = () => {
    clearUser();
    window.location.href = "/login";
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (productsRef.current && !productsRef.current.contains(target))
        setProductsOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const isLoggedInStudent =
    isHydrated && isAuthenticated() && getUserRole() === "student";

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm"
          : "bg-white/0 border-b border-transparent"
          }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-6 lg:px-12">
          {/* Logo */}
          <Link href="/" className="relative flex shrink-0 items-center h-full pr-8 group">
            <Image
              src="/assets/logo/bluepenonly.svg"
              alt="Bluepen"
              width={100}
              height={44}
              priority
              className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Products Dropdown */}
            <div ref={productsRef} className="relative group/products">
              <button
                onClick={() => setProductsOpen(!isProductsOpen)}
                onMouseEnter={() => setProductsOpen(true)}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 cursor-pointer font-poppins tr]king-wide ${isProductsOpen
                  ? "bg-primary/10 text-primary"
                  : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
              >
                Products
                <ChevronDown
                  size={15}
                  className={`transition-transform duration-300 ${isProductsOpen ? "rotate-180 text-primary" : "text-gray-400 group-hover/products:text-primary"}`}
                />
              </button>

              <AnimatePresence>
                {isProductsOpen && (
                  <motion.div
                    onMouseLeave={() => setProductsOpen(false)}
                    className="absolute left-0 top-[calc(100%+8px)] w-[320px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.02)] p-2 overflow-hidden ring-1 ring-black/5"
                    initial={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: 10, scale: 0.98, filter: "blur(4px)" }}
                    transition={{ duration: 0.2, ease: "circOut" }}
                  >
                    <div className="px-3 py-2 text-[11px] font-bold text-gray-400 font-montserrat uppercase tracking-wider">
                      Our Ecosystem
                    </div>
                    {products.map((product) => (
                      <a
                        key={product.name}
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 p-3 rounded-xl transition-all duration-200 hover:bg-gradient-to-br hover:from-blue-50/80 hover:to-transparent group/item"
                      >
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover/item:scale-110 group-hover/item:rotate-3">
                          <Image
                            src={product.imgSrc}
                            alt={product.name}
                            width={24}
                            height={24}
                            className="object-contain"
                          />
                        </div>
                        <div className="flex flex-col flex-1 min-w-0">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[14px] font-semibold text-gray-900 font-montserrat tracking-tight group-hover/item:text-primary transition-colors">
                              {product.name}
                            </span>
                            <ExternalLink
                              size={12}
                              className="text-gray-300 opacity-0 -translate-x-2 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0"
                            />
                          </div>
                          <span className="text-[12px] leading-snug text-gray-500 font-poppins mt-0.5 line-clamp-2">
                            {product.description}
                          </span>
                        </div>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/about"
              className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 font-poppins tracking-wide ${pathname === "/about"
                ? "text-primary bg-primary/5"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
            >
              About Us
            </Link>

            <Link
              href="/contact"
              className={`px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-200 font-poppins tracking-wide ${pathname === "/contact"
                ? "text-primary bg-primary/5"
                : "text-gray-600 hover:text-primary hover:bg-gray-50"
                }`}
            >
              Contact
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4 pl-4">
            {isLoggedInStudent ? (
              <>
                <Link
                  href="/newPost/post"
                  className="hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-primary via-[#3b6dbf] to-primary bg-[length:200%_100%] hover:bg-[100%_0] text-white text-[13px] font-semibold font-poppins shadow-[0_4px_14px_rgba(41,86,168,0.25)] hover:shadow-[0_6px_20px_rgba(41,86,168,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                >
                  <span className="tracking-wide">Post Assignment</span>
                </Link>

                {/* User Avatar */}
                <div ref={userMenuRef} className="relative hidden md:block group/user">
                  <button
                    onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-white to-gray-50 p-0.5 ring-1 ring-black/5 shadow-sm transition-transform duration-200 hover:scale-105 active:scale-95"
                  >
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-[13px] font-bold font-montserrat flex items-center justify-center shadow-inner">
                      {getInitials(user!.firstname, user!.lastname)}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        className="absolute right-0 top-[calc(100%+12px)] w-[280px] bg-white/95 backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15),0_0_0_1px_rgba(0,0,0,0.02)] p-2 overflow-hidden ring-1 ring-black/5 origin-top-right z-[60]"
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -4 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.2 }}
                      >
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 mb-2 ring-1 ring-black/[0.03]">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white text-sm font-bold flex items-center justify-center font-montserrat shadow-md">
                              {getInitials(user!.firstname, user!.lastname)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[14px] font-bold text-gray-900 truncate font-montserrat leading-tight">
                                {user!.firstname} {user!.lastname}
                              </p>
                              <p className="text-[11px] font-medium text-primary uppercase tracking-wider mt-0.5 font-poppins bg-primary/10 inline-block px-1.5 py-0.5 rounded-md">
                                Student
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-0.5">
                          {[
                            { href: "/student/dashboard", icon: <BookOpen size={16} />, label: "My Assignments" },
                            { href: "/student/profile", icon: <User size={16} />, label: "Profile" },
                            { href: "/student/referral", icon: <Gift size={16} />, label: "Referrals" },
                            { href: "/student/coupons", icon: <Ticket size={16} />, label: "Coupons" },
                          ].map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-600 transition-all duration-200 hover:bg-gray-50 hover:text-gray-900 group/link"
                            >
                              <span className="text-gray-400 group-hover/link:text-primary transition-colors">
                                {item.icon}
                              </span>
                              <span className="font-poppins">{item.label}</span>
                            </Link>
                          ))}
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent my-2" />

                        <button
                          onClick={() => { handleLogout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 hover:text-red-600 hover:bg-red-50/50 transition-all duration-200 group/logout"
                        >
                          <LogOut size={16} className="text-gray-400 group-hover/logout:text-red-500 transition-colors" />
                          <span className="font-poppins">Sign out</span>
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/affiliate"
                  className="hidden md:block px-5 py-2.5 rounded-full text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 font-poppins"
                >
                  For Affiliates
                </Link>
                {pathname !== "/freelancer/login" && pathname !== "/login" && (
                  <Link
                    href="/login"
                    className="hidden md:flex items-center px-7 py-2.5 rounded-full bg-gradient-to-br from-primary to-[#1e4690] text-white text-[13px] font-semibold font-poppins shadow-lg shadow-blue-900/10 hover:shadow-xl hover:shadow-blue-900/20 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-300"
                  >
                    Sign In
                  </Link>
                )}
              </>
            )}

            {/* Mobile Toggle */}
            <button
              className="flex md:hidden w-10 h-10 items-center justify-center rounded-xl bg-gray-50 text-gray-900 hover:bg-gray-100 active:scale-95 transition-all duration-200 ring-1 ring-black/5"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Spacer */}
      <div className="h-[72px]" />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            {/* Drawer */}
            <motion.div
              className="fixed right-0 top-0 z-50 h-[100dvh] w-[300px] bg-white shadow-2xl flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                <Image
                  src="/assets/logo/bluepenonly.svg"
                  alt="Bluepen"
                  width={100}
                  height={32}
                  className="object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-6 scrollbar-thin scrollbar-thumb-gray-200">
                <div className="mb-8">
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4 px-2 font-montserrat">
                    Our Products
                  </h3>
                  <div className="space-y-2">
                    {products.map((product) => (
                      <a
                        key={product.name}
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-3 rounded-xl bg-gray-50/50 hover:bg-blue-50/50 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center shrink-0">
                          <Image
                            src={product.imgSrc}
                            alt={product.name}
                            width={20}
                            height={20}
                          />
                        </div>
                        <span className="font-semibold text-gray-900 font-montserrat text-[14px]">
                          {product.name}
                        </span>
                        <ExternalLink size={14} className="ml-auto text-gray-300 group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-4 px-2 font-montserrat">
                    Menu
                  </h3>
                  <div className="space-y-1">
                    {[
                      { href: "/about", label: "About Us" },
                      { href: "/contact", label: "Contact Us" },
                      { href: "/affiliate", label: "Affiliate Program" },
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 py-3 rounded-xl text-[15px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors font-poppins"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                {isLoggedInStudent ? (
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/newPost/post"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full py-3.5 rounded-xl bg-primary text-white text-[15px] font-semibold shadow-lg shadow-blue-900/10 font-poppins"
                    >
                      Post Assignment
                    </Link>
                    <Link
                      href="/student/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center justify-center w-full py-3.5 rounded-xl bg-white border border-gray-200 text-gray-700 text-[15px] font-medium font-poppins"
                    >
                      Dashboard
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full py-3.5 rounded-xl bg-primary text-white text-[15px] font-semibold shadow-lg shadow-blue-900/10 font-poppins transition-transform active:scale-95"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
