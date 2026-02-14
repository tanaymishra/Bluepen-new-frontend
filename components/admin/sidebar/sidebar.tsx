"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import css from "@/styles/freelancer/components/sidebar.module.scss";
import { useAuth } from "@/authentication/authentication";

interface SidebarItem {
  fontFamily?: string;
}

const Sidebar: React.FC<SidebarItem> = ({ fontFamily }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useAuth();
  const activeTabRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const sidebar = document.querySelector(`.${css.sidebar}`) as HTMLElement;

    if (!sidebar) return;

    const handleScroll = () => {
      sidebar.style.setProperty("--scrollbar-opacity", "1");
      clearTimeout((sidebar as any).scrollTimeout);
      (sidebar as any).scrollTimeout = setTimeout(() => {
        sidebar.style.setProperty("--scrollbar-opacity", "0");
      }, 1000);
    };

    sidebar.addEventListener("scroll", handleScroll);

    return () => {
      sidebar.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab) {
      setActiveTab(savedTab);
    }
  }, [pathname]);

  useEffect(() => {
    if (activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [activeTab]);

  const isActiveTab = (tab: string) => activeTab === tab;

  const sidebarItems = [
    {
      label: "overview",
      labelText: "Overview",
      path: "/admin/dashboard",
      iconSrc: "/assets/admin/sidebar/overview.svg",
    },
    {
      label: "metrics",
      labelText: "Metrics",
      path: "/admin/metrics",
      iconSrc: "/assets/admin/sidebar/metrics.svg",
      roles: ["Admin", "HR"],
    },
    {
      label: "employee",
      labelText: "Employee",
      path: "/admin/employee",
      iconSrc: "/assets/admin/sidebar/employees.svg",
      roles: ["Admin", "HR"],
    },
    {
      label: "leaves",
      labelText: "Leaves",
      path: "/admin/leaves",
      iconSrc: "/assets/admin/sidebar/leaves.svg",
    },
    {
      label: "assignments",
      labelText: "Assignments",
      path: "/admin/assignments",
      iconSrc: "/assets/admin/sidebar/assignments.svg",
    },
    {
      label: "myAssignments",
      labelText: "My Assignments",
      path: "/admin/myAssignments",
      iconSrc: "/assets/admin/sidebar/assignments.svg",
      roles: ["PM"],
    },
    {
      label: "results",
      labelText: "Results",
      path: "/admin/results",
      iconSrc: "/assets/admin/sidebar/results.svg",
    },
    {
      label: "freelancers",
      labelText: "Freelancers",
      path: "/admin/freelancers",
      iconSrc: "/assets/admin/sidebar/freelancers.svg",
    },
    {
      label: "referrals",
      labelText: "Referrals",
      path: "/admin/referrals",
      iconSrc: "/assets/admin/sidebar/referrals.svg",
    },
    {
      label: "affiliates",
      labelText: "Affiliates",
      path: "/admin/affiliates",
      iconSrc: "/assets/admin/sidebar/affiliate.svg",
    },
    {
      label: "pmReports",
      labelText: "PM Reports",
      path: "/admin/pmReports",
      iconSrc: "/assets/admin/sidebar/pmReports.svg",
      roles: ["Admin", "HR"],
    },
    {
      label: "freelancerReports",
      labelText: "Freelancer Reports",
      path: "/admin/freelancerReports",
      iconSrc: "/assets/admin/sidebar/freelancers.svg",
      roles: ["Admin", "HR"],
    },
    {
      label: "rewards",
      labelText: "Rewards",
      path: "/admin/rewards",
      iconSrc: "/assets/admin/sidebar/rewards.svg",
      roles: ["Admin", "HR"],
    },
    {
      label: "pm",
      labelText: "PMs",
      path: "/admin/pms",
      iconSrc: "/assets/admin/sidebar/pmReports.svg",
    },
    {
      label: "students",
      labelText: "Students",
      path: "/admin/students",
      iconSrc: "/assets/admin/sidebar/students.svg",
    },
    {
      label: "hr",
      labelText: "HRs",
      path: "/admin/hr",
      iconSrc: "/assets/admin/sidebar/hr.svg",
    },
    {
      label: "invoice",
      labelText: "Invoicing",
      path: "/admin/invoice",
      iconSrc: "/assets/admin/sidebar/invoice.svg",
      // roles: ["Admin", "HR", "PM"],
    },
    {
      label: "coupons",
      labelText: "Generate Coupons",
      path: "/admin/generateCoupons",
      iconSrc: "/assets/admin/sidebar/assignments.svg",
      roles: ["Admin"],
    },    {
      label: "queries",
      labelText: "Queries",
      path: "/admin/queries",
      iconSrc: "/assets/admin/sidebar/assignments.svg",
      roles: ["Admin", "HR"],
    },
    {
      label: "plagCheck",
      labelText: "Plagiarism Checker",
      path: "/admin/plagCheck",
      iconSrc: "/assets/admin/sidebar/assignments.svg",
      roles: ["Admin", "HR", "PM"],
    },
  ];

  const filteredSidebarItems = sidebarItems.filter(
    (item) => !item.roles || (user && item.roles.includes(user.role))
  );

  const handleTabClickSidebar = (label: string) => {
    const item = sidebarItems.find((i) => i.label === label);
    if (item) {
      router.push(item.path);
      setMobileMenuOpen(false);
      setActiveTab(label);
      localStorage.setItem("activeTab", label);
    }
  };

  const isActiveTabSidebar = (label: string) => {
    const item = sidebarItems.find((i) => i.label === label);
    return item && pathname.startsWith(item.path);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    clearUser();
    window.location.href = "/admin/login";
    setIsModalOpen(false);
  };

  const Modal = () => (
    <div className={css.modalOverlay} style={{ fontFamily: fontFamily }}>
      <div className={css.modalContent}>
        <h2 className={css.modalh2}>Logout</h2>
        <p className={css.modalP}>Are you sure you want to Logout?</p>
        <div className={css.modalActions}>
          <button className={css.deleteBtnModal} onClick={handleLogout}>
            Logout
          </button>
          <button
            className={css.cancelBtnModal}
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {isModalOpen && <Modal />}
      <div className={`freelance`} style={{ fontFamily: fontFamily }}>
        <div className={`${css.mobileNav}`}>
          <div
            className={`${css.logoSection}`}
            onClick={() => router.push("/admin/dashboard")}
          >
            <img src="/assets/logo/bluepenLogo.webp" alt="Bluepen Logo" />
          </div>
          <button
            className={`${css.menuToggle} ${isMobileMenuOpen ? css.close : ""}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <span className={css.hamburgerLine}></span>
            <span className={css.hamburgerLine}></span>
            <span className={css.hamburgerLine}></span>
          </button>
        </div>

        <div
          className={`${css.sidebar} ${isMobileMenuOpen ? "" : css.menuOpen}`}
        >
          <div className={css.scrollbarSpacer}></div>
          <div className={`${css.upperSection}`}>
            <div
              className={`${css.logoSection}`}
              onClick={() => router.push("/admin/dashboard")}
            >
              <img src="/assets/logo/bluepenLogo.webp" alt="Bluepen Logo" />
            </div>
            <div className={`${css.tabs} ${css.menuContainer}`}>
              {filteredSidebarItems.map((item) => (
                <div
                  key={item.label}
                  ref={isActiveTab(item.label) ? activeTabRef : null}
                  className={`${css.sidebarTab} ${
                    isActiveTabSidebar(item.label) ? css.active : ""
                  }`}
                  onClick={() => handleTabClickSidebar(item.label)}
                >
                  <img src={item.iconSrc} alt={item.labelText} />
                  <div className={`${css.labelText}`}>{item.labelText}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${css.profileLogOut}`}>
            <div
              className={`${css.profileDetails}`}
              onClick={() => router.push(`/admin/profileDetails`)}
            >
              <div className={`${css.profileImage}`}>
                <img src="/assets/admin/sidebar/profile.svg" alt="" />
              </div>
              <div className={`${css.profileContent}`}>
                <div className={`${css.userName} notosans-600`}>
                  {user?.firstname} {user?.lastname}
                </div>
                <div className={`${css.userEmail} notosans-400`}>
                  {user?.email}
                </div>
              </div>
            </div>

            <div onClick={handleOpenModal} className={`${css.logoutImage}`}>
              <img src="/assets/admin/sidebar/logout.svg" alt="Logout" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
