"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import css from "@/styles/freelancer/components/sidebar.module.scss";
import { useAuth } from "@/authentication/authentication";
import { useAssignment } from "@/context/assignmentContext";
import { useNotification } from "@/context/notifcationContext";

interface SidebarItem {
  fontFamily?: string;
}

const baseUrl = String(process.env.NEXT_PUBLIC_BASE_URL);

const Sidebar: React.FC<SidebarItem> = ({ fontFamily }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAssignmentOpen, setAssignmentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const { activeStatus, setActiveStatus } = useAssignment();
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { user, clearUser, isHydrated } = useAuth();
  const { unreadCount, setUnreadCount } = useNotification();

  const toggleMobileMenu = () => setMobileMenuOpen(!isMobileMenuOpen);
  const [activities, setActivities] = useState([]);
  // const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch(`${baseUrl}/freelancer/getActivity`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.token}`,
          },
          body: JSON.stringify({
            last_activity_id: null,
            pagination_number: 100,
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setActivities(data.data);
          // Count unread activities
          const unreadActivities = data.data.filter(
            (activity: any) => activity.status === "unread"
          );
          setUnreadCount(unreadActivities.length);
        }
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    if (user?.token) {
      fetchActivities();
    }
  }, [user?.token]);

  const toggleAssignment = () => {
    const newParams = new URLSearchParams(searchParams);
    if (isAssignmentOpen) {
      setAssignmentOpen(false);
      newParams.delete("assignmentOpen");
    } else {
      setAssignmentOpen(true);
      newParams.set("assignmentOpen", "true");
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const assignmentOptions = [
    { label: "All", route: "/freelancer/assignments" },
    { label: "Completed", route: "/freelancer/assignments" },
    { label: "Pending", route: "/freelancer/assignments" },
  ];

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleTabClick = (tab: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (activeTab === tab) {
      setActiveTab("");
      newParams.delete("tab");
    } else {
      setActiveTab(tab);
      newParams.set("tab", tab);
    }
    router.push(`${pathname}?${newParams.toString()}`);
  };

  const handleAssignmentClick = (route: string, label: string) => {
    const newParams = new URLSearchParams();
    newParams.set("status", label);
    router.push(`${route}?${newParams.toString()}`);
    setActiveStatus(label as "All" | "Completed" | "Pending");
    closeMobileMenu();
  };

  useEffect(() => {
    // Set states from URL params
    const status = searchParams.get("status");
    const tab = searchParams.get("tab");
    const isOpen = searchParams.get("assignmentOpen");

    if (status) {
      setActiveStatus(status as "All" | "Completed" | "Pending");
    }
    if (tab) {
      setActiveTab(tab);
    }
    if (isOpen === "true") {
      setAssignmentOpen(true);
    }
  }, [searchParams]);
  const isActiveTab = (tab: string) => activeTab === tab;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleLogout = () => {
    clearUser();
    window.location.href = "/freelancer/login";
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

  const getRouteSegment = (path: string) => {
    const segments = path.split("/");
    return segments[2] || ""; // Get segment after /freelancer/
  };

  useEffect(() => {
    const currentRoute = getRouteSegment(pathname);

    // Set active tab based on current route
    switch (currentRoute) {
      case "dashboard":
        setActiveTab("overview");
        break;
      case "assignments":
        setActiveTab("assignments");
        break;
      case "notification":
        setActiveTab("notifications");
        break;
      case "invoice":
        setActiveTab("invoice");
        break;
      case "rewards":
        setActiveTab("rewards");
        break;
      default:
        const savedTab = localStorage.getItem("activeTab");
        if (savedTab) {
          setActiveTab(savedTab);
        }
    }
    // Rest of your existing useEffect code
    const savedAssignment = localStorage.getItem("activeStatus");
    if (savedAssignment) {
      setActiveStatus(savedAssignment as "All" | "Completed" | "Pending");
    }

    const savedIsAssignmentOpen = localStorage.getItem("isAssignmentOpen");
    if (savedIsAssignmentOpen) {
      setAssignmentOpen(true);
    }
  }, [pathname]);

  return (
    <>
      {isModalOpen && <Modal />}
      <div className={`freelance`} style={{ fontFamily: fontFamily }}>
        <div className={`${css.mobileNav}`}>
          <div
            className={`${css.logoSection}`}
            onClick={() => router.push("/freelancer/dashboard")}
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
          <div className={`${css.upperSection}`}>
            <div
              className={`${css.logoSection}`}
              onClick={() => router.push("/freelancer/dashboard")}
            >
              <img src="/assets/logo/bluepenLogo.webp" alt="Bluepen Logo" />
            </div>
            <div className={`${css.tabs} ${css.menuContainer}`}>
              <div
                className={`${css.sidebarTab} ${
                  isActiveTab("overview") ? css.active : ""
                }`}
                onClick={() => {
                  handleTabClick("overview");
                  router.push("/freelancer/dashboard");
                  closeMobileMenu();
                }}
              >
                <img
                  src="/assets/freelancer/dashboard/overview.svg"
                  alt="Overview"
                />
                <div className={`${css.labelText}`}>Overview</div>
              </div>

              <div
                className={`${css.sidebarTabAss} ${
                  isActiveTab("assignments") ? css.active : ""
                }`}
                onClick={() => {
                  handleTabClick("assignments");
                  toggleAssignment();
                  router.push("/freelancer/assignments");
                }}
              >
                <div className={`${css.assignmentOption}`}>
                  <img
                    src="/assets/freelancer/dashboard/assignment.svg"
                    alt="Assignment"
                  />
                  <div className={`${css.labelText}`}>Assignments</div>
                </div>
                <div
                  className={`${css.arrowImage} ${
                    isAssignmentOpen ? css.open : ""
                  }`}
                >
                  <svg
                    width="6"
                    height="10"
                    viewBox="0 0 6 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={`${isAssignmentOpen ? css.open : ""}`}
                  >
                    <path
                      d="M6.00016 4.99997C6.00016 5.21997 5.91016 5.42997 5.75016 5.57997L1.35016 9.77996C1.03016 10.09 0.520157 10.07 0.220157 9.74997C-0.0898432 9.42997 -0.069843 8.91996 0.250157 8.61996L4.04016 4.99997L0.250157 1.37996C-0.0698433 1.06996 -0.0798436 0.569965 0.220156 0.249966C0.530156 -0.0700341 1.03016 -0.0800353 1.35016 0.219965L5.75016 4.41997C5.91016 4.56997 6.00016 4.77997 6.00016 4.99997Z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
              </div>

              {isAssignmentOpen && (
                <div className={`${css.assignmentStatus}`}>
                  {assignmentOptions.map((option, index) => (
                    <React.Fragment key={option.label}>
                      <div
                        className={`${css.opt}`}
                        onClick={() => {
                          handleAssignmentClick(option.route, option.label);
                        }}
                      >
                        <div
                          className={`${css.dot} ${
                            activeStatus === option.label ? css.active : ""
                          }`}
                        ></div>
                        <div
                          className={`${css.optText} ${
                            activeStatus === option.label ? css.activeText : ""
                          }`}
                        >
                          {option.label}
                        </div>
                      </div>
                      {index < assignmentOptions.length - 1 && (
                        <div className={`${css.lines}`}></div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}

              <div
                className={`${css.sidebarTab} ${
                  isActiveTab("notifications") ? css.active : ""
                }`}
                onClick={() => {
                  handleTabClick("notifications");
                  router.push("/freelancer/notification");
                  closeMobileMenu();
                }}
              >
                <div className={css.notificationIcon}>
                  <img
                    src="/assets/freelancer/dashboard/notifications.svg"
                    alt="Notification"
                  />
                </div>
                <div className={`${css.labelText}`}>Notifications</div>
                {unreadCount > 0 && <div className={css.notificationDot} />}
              </div>
              <div
                className={`${css.sidebarTab} ${isActiveTab("invoice") ? css.active : ""
                  }`}
                onClick={() => {
                  handleTabClick("invoice");
                  router.push("/freelancer/invoice");
                  closeMobileMenu();
                }}
              >
                <img
                  src="/assets/freelancer/dashboard/invoice.svg"
                  alt="Invoice"
                />
                <div
                  className={`${css.labelText}`}
                >
                  Invoice
                </div>
              </div>
              <div
                className={`${css.sidebarTab} ${
                  isActiveTab("rewards") ? css.active : ""
                }`}
                onClick={() => {
                  handleTabClick("rewards");
                  router.push("/freelancer/rewards");
                  closeMobileMenu();
                }}
              >
                <img
                  src="/assets/freelancer/dashboard/trophy.svg"
                  alt="Rewards"
                />
                <div className={`${css.labelText}`}>Rewards</div>
              </div>
            </div>
          </div>

          <div className={`${css.profileLogOut}`}>
            <div
              className={`${css.profileDetails}`}
              onClick={() => {
                router.push("/freelancer/profile");
                closeMobileMenu();
              }}
            >
              <div className={`${css.profileImage}`}>
                <img
                  src="/assets/freelancer/dashboard/profileGirl.svg"
                  alt=""
                />
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
              <img src="/assets/freelancer/dashboard/logout.svg" alt="Logout" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
