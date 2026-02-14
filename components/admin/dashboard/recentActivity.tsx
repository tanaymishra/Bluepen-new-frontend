import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/authentication/authentication";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Drawer from "@/components/ui/radix-drawer";
import css from "@/styles/admin/dashboard.module.scss";

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

interface RecentActivityProps {
  initialActivities: any[];
}

const RecentActivity = ({ initialActivities }: RecentActivityProps) => {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [lastActivityId, setLastActivityId] = useState<string | null>("");
  const [activityList, setActivityList] = useState<any[]>([]);
  const [actLoading, setActLoading] = useState(false);
  const [actHasMore, setActHasMore] = useState(true);
  const activityObserverRef = useRef<IntersectionObserver | null>(null);
  const lastActivityRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (initialActivities?.length > 0) {
      setActivityList(initialActivities);
    }
  }, [initialActivities]);

  useEffect(() => {
    if (!isDrawerOpen) return;

    // Initialize intersection observer for infinite scroll
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !actLoading && actHasMore) {
          fetchActivity(lastActivityId ?? "", 10);
        }
      },
      { threshold: 0.1 }
    );

    // Start observing the last activity element
    const currentRef = lastActivityRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup observer on unmount or drawer close
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      observer.disconnect();
    };
  }, [isDrawerOpen, lastActivityId, actLoading, actHasMore]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
    // When opening drawer, fetch initial activities if none exist
    if (!isDrawerOpen && activityList.length <= 4) {
      fetchActivity("", 10);
    }
  };

  const closeDrawer = () => setIsDrawerOpen(false);

  const fetchActivity = async (
    last_activity_id: number | string,
    pageSize: number | string
  ) => {
    if (actLoading || !actHasMore) return;
    setActLoading(true);

    try {
      const response = await fetch(`${baseURL}/team/getActivity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          last_activity_id: last_activity_id,
          pagination_number: pageSize,
        }),
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const result = await response.json();

      if (result.data && result.data.length > 0) {
        setActivityList((prev) => [...prev, ...result.data]);
        setLastActivityId(result.data[result.data.length - 1].id);
      } else {
        setActHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      setActHasMore(false);
    } finally {
      setActLoading(false);
    }
  };

  const handleTabLink = (title: string, id: number) => {
    if (title.includes("Reward")) {
      router.push(`/admin/rewards`);
    } else if (title.includes("assignment:")) {
      router.push(`/admin/assignments`);
    } else if (title.startsWith("User sign up:")) {
      router.push("/admin/students");
    } else if (title.includes("Freelancer Signup:")) {
      router.push(`/admin/freelancers`);
    }
  };

  return (
    <>
      <div className={css.recentActivity}>
        <div className={css.head}>{`Recent Activity`}</div>
        <div className={css.contentBox}>
          {activityList?.slice(0, 4).map((item: any, index: any) => (
            <div
              className={css.activities}
              key={index}
              style={{ cursor: "pointer" }}
            >
              <div className={css.imgBell}>
                <Image
                  src="/assets/admin/dashboard/bell.svg"
                  alt="Bell"
                  width={24}
                  height={24}
                />
              </div>
              <div
                className={css.activityContent}
                style={{ padding: "0.5rem 0", whiteSpace: "nowrap" }}
                onClick={() => handleTabLink(item.action_details, item.id)}
              >
                <div className={css.recentActivityTitle}>
                  {item.action_details.length > 25
                    ? item.action_details.slice(0, 25) + "..."
                    : item.action_details}
                </div>
                <div className={css.dateTime}>{item.notification_time}</div>
              </div>
            </div>
          ))}

          <div className={css.downwardArrow} onClick={toggleDrawer}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={css.arrow}
              style={{
                display: "var(--dropdown-arrow-display, block)",
                filter: "var(--dropdown-arrow-filter, none)",
              }}
            >
              <path
                d="M7.99935 12.36L0.666016 5.02667L1.69268 4L7.99935 10.3067L14.306 4L15.3327 5.02667L7.99935 12.36Z"
                fill="currentColor"
                style={{ color: "var(--dropdown-arrow-color, #5b5b5b)" }}
              />
            </svg>
          </div>
        </div>
      </div>

      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        setDrawer={toggleDrawer}
        drawerContent="45%"
      >
        {/* Drawer content */}
        <div className={css.drawerHeader}>
          <h2 className={css.welTitle}>{`Recent Activities`}</h2>
          <button className={css.closeBtn} onClick={closeDrawer}>
            ×
          </button>
        </div>

        <div className={css.drawerContent}>
          <div className={css.contentBoxDrawer}>
            {activityList.map((activity, index) => (
              <div
                key={index}
                className={css.activities}
                ref={index === activityList.length - 1 ? lastActivityRef : null}
                onClick={() =>
                  handleTabLink(activity.action_details, activity.id)
                }
                style={{ cursor: "pointer" }}
              >
                <div className={css.imgBell}>
                  <Image
                    src="/assets/admin/dashboard/bell.svg"
                    alt="Bell"
                    width={24}
                    height={24}
                  />
                </div>
                <div className={css.activityContent}>
                  <div className={css.title}>{activity.action_details}</div>
                  <div className={css.dateTime}>
                    {activity.notification_time}
                  </div>
                </div>
              </div>
            ))}
            {actLoading && (
              <div className={css.loadingIndicator}>
                Loading more activities...
              </div>
            )}
            {!actHasMore && (
              <div className={css.noMoreActivities}>
                No more activities to load
              </div>
            )}
          </div>
        </div>

        <div className={css.drawerFooter}>
          <div className={css.closeFooterBtn} onClick={closeDrawer}>
            Close
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default RecentActivity;
