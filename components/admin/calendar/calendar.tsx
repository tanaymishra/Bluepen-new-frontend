import React, { useState, useEffect, CSSProperties, useRef } from "react";
import css from "@/styles/admin/components/calendar.module.scss";
import { formatDateMonthYear } from "@/utils/admin/dateFormatter";
import { useAuth } from "@/authentication/authentication";
import { useToast } from "@/context/toastContext";
import Textarea from "@/ui/textarea/textarea";
import OptionsModal from "@/components/admin/optionsModal/optionsModal";
import Input from "@/ui/Input";

interface Event {
  type: "Public Holiday" | "Leave" | "Deadline" | "Notes" | "Announcements";
  title: string;
  date: Date;
  details?: string;
  id?: string;
  assignment_id?: string;
  project_manager_name?: string;
  freelancer_name?: string;
}

interface CalendarProps {
  onChange?: (date: Date) => void;
  style?: CSSProperties;
}

interface EventModal {
  isOpen: boolean;
  events: Event[];
  date: Date | null;
}

const daysOfWeek = [
  { full: "SUN", short: "S" },
  { full: "MON", short: "M" },
  { full: "TUE", short: "T" },
  { full: "WED", short: "W" },
  { full: "THUR", short: "T" },
  { full: "FRI", short: "F" },
  { full: "SAT", short: "S" },
];

const eventTypeColors: { [key: string]: string } = {
  Deadline: "#E92C2C",
  "Public Holiday": "#0085FF",
  Leave: "#FF9F2D",
  Announcements: "#00BA34",
  Notes: "#585757",
};

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  announcement: string;
  setAnnouncement: (value: string) => void;
}

const AnnouncementModal: React.FC<AnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  announcement,
  setAnnouncement,
}) => {
  if (!isOpen) return null;

  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <div className={css.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={css.modalHeader}>
          <h2 style={{ color: "#b22828" }} className={css.modalh2}>
            Announcement
          </h2>
          <div className={css.crossBtn} onClick={onClose}>
            <img src="/assets/admin/dashboard/calendar/cross.svg" alt="" />
          </div>
        </div>
        <div className={css.modalSeparator}></div>

        <div className={css.modalBody}>
          <div className={css.modalBody}>
            <div className={css.inputGroup}>
              <label htmlFor="announcement" className={css.fieldName}>
                Announcement:
              </label>
              <Textarea
                name={`announcement`}
                value={announcement}
                onChange={(e) => setAnnouncement(e.target.value)}
                placeholder="Enter announcement"
                className={css.textarea}
              />
            </div>
          </div>

          <div className={css.modalActions}>
            <button className={css.addBtnAnnouncement} onClick={onSubmit}>
              Add
            </button>
            <button className={css.cancelBtn} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const getIndianTime = () => {
  const now = new Date();
  return new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
};

const getIndianMidnight = () => {
  const indian = getIndianTime();
  indian.setHours(24, 0, 0, 0);
  return indian;
};

const Calendar: React.FC<CalendarProps> = ({ onChange, style = {} }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<Event[]>([]);
  const [currentMonthEvents, setCurrentMonthEvents] = useState<Event[]>([]);
  const [modal, setModal] = useState<EventModal>({
    isOpen: false,
    events: [],
    date: null,
  });
  const { showToast } = useToast();
  const [isAssignmentOpen, setIsAssignmentOpen] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [isNoteInputVisible, setIsNoteInputVisible] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [announcementInput, setAnnouncementInput] = useState("");
  const [isAnnouncementInputVisible, setIsAnnouncementInputVisible] =
    useState(true);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const modalRefOp = useRef<HTMLDivElement>(null);
  const [today, setToday] = useState(getIndianTime());

  const [modalOpenOp, setModalOpenOp] = useState(false);

  const moreBtnRefOp = useRef<HTMLDivElement>(null);

  const getCircleColor = (type: string) => {
    if (type === "deadlines") return css.daedlineCircle;
    if (type === "publicHolidays") return css.publicHolidaysCircle;
    if (type === "leaves") return css.leavesCircle;
    if (type === "announcements") return css.announcementsCircle;
    if (type === "notes") return css.notesCircle;
  };

  const isPastDate = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    return compareDate < today;
  };

  const Circle = () => {
    return (
      <div className={css.legendCircle}>
        <div className={css.circleRow}>
          <div className={`${css.circle} ${getCircleColor("deadlines")}`}></div>
          <div className={css.circleText}>Deadlines</div>
        </div>
        <div className={css.circleRow}>
          <div
            className={`${css.circle} ${getCircleColor("publicHolidays")}`}
          ></div>
          <div className={css.circleText}>Public Holiday</div>
        </div>
        <div className={css.circleRow}>
          <div className={`${css.circle} ${getCircleColor("leaves")}`}></div>
          <div className={css.circleText}>Leaves</div>
        </div>
        <div className={css.circleRow}>
          <div
            className={`${css.circle} ${getCircleColor("announcements")}`}
          ></div>
          <div className={css.circleText}>Announcements</div>
        </div>
        <div className={css.circleRow}>
          <div className={`${css.circle} ${getCircleColor("notes")}`}></div>
          <div className={css.circleText}>Notes</div>
        </div>
      </div>
    );
  };

  const { user } = useAuth();

  const isToday = (date: Date) => {
    const indianToday = today;
    return (
      date.getDate() === indianToday.getDate() &&
      date.getMonth() === indianToday.getMonth() &&
      date.getFullYear() === indianToday.getFullYear()
    );
  };

  const todaysEvents = calendarEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return isToday(eventDate);
  });

  const uniqueEventTypesToday = Array.from(
    new Set(todaysEvents.map((event: Event) => event.type))
  );

  const getEventsForDate = (date: Date): Event[] => {
    return calendarEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const fetchCalendarEvents = async (date: Date) => {
    try {
      const formattedMonth = `${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getFullYear()}`;

      const response = await fetch(`${baseURL}/team/calendar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({ month: formattedMonth }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const { data } = await response.json();

      // Transform API response into Event[] format
      const transformedEvents: Event[] = [
        ...data.public_holidays.map(
          (h: { holiday_for: string; holiday_on: string }) => ({
            type: "Public Holiday" as const,
            title: h.holiday_for,
            date: parseCustomDate(h.holiday_on),
          })
        ),
        ...data.deadline.map(
          (d: {
            id: string;
            assignment_id: string;
            title: string | null;
            deadline: string;
            project_manager_name: string | null;
            freelancer_name: string | null;
          }) => ({
            type: "Deadline" as const,
            title: d.title || "Untitled Assignment",
            date: parseCustomDate(d.deadline),
            details: `Assignment #${d.assignment_id}`,
            id: d.id,
            assignment_id: d.assignment_id,
            project_manager_name: d.project_manager_name,
            freelancer_name: d.freelancer_name,
          })
        ),
        ...data.notes.map((n: { note: string; date: string }) => ({
          type: "Notes" as const,
          title: n.note,
          date: parseCustomDate(n.date),
        })),
        ...data.announcements.map(
          (a: { announcement: string; date: string }) => ({
            type: "Announcements" as const,
            title: a.announcement,
            date: parseCustomDate(a.date),
          })
        ),
      ];

      setCalendarEvents(transformedEvents);

      if (
        date.getMonth() === new Date().getMonth() &&
        date.getFullYear() === new Date().getFullYear()
      ) {
        setCurrentMonthEvents(transformedEvents);
      }
    } catch (error) {
      console.error("Error fetching calendar events:", error);
      setCalendarEvents([]);
    }
  };

  const parseCustomDate = (dateStr: string): Date => {
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  useEffect(() => {
    if (user?.token) {
      fetchCalendarEvents(currentDate);
    }
  }, [user?.token]);

  const jumpToday = () => {
    setCalendarEvents(currentMonthEvents);
    setCurrentDate(() => {
      const newDate = new Date();
      newDate.setMonth(newDate.getMonth());
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dateEvents = getEventsForDate(clickedDate);

    setModal({
      isOpen: true,
      events: dateEvents,
      date: clickedDate,
    });

    setIsAssignmentOpen(true);
    setIsNotesOpen(true);

    setSelectedDate(clickedDate);
    if (onChange) onChange(clickedDate);
  };

  useEffect(() => {
    const updateDate = () => {
      setToday(getIndianTime());
    };

    const setNextUpdate = () => {
      const midnight = getIndianMidnight();
      const now = getIndianTime();
      const timeUntilMidnight = midnight.getTime() - now.getTime();

      return setTimeout(updateDate, timeUntilMidnight);
    };

    const timeout = setNextUpdate();

    return () => clearTimeout(timeout);
  }, []);

  const renderDays = () => {
    const days = [];
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    ).getDate();

    const startDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    ).getDay();

    // Empty days before start of month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className={css.emptyDay} />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateEvents = getEventsForDate(date);

      const isToday = (date: Date) => {
        const indianToday = today;
        return (
          date.getDate() === indianToday.getDate() &&
          date.getMonth() === indianToday.getMonth() &&
          date.getFullYear() === indianToday.getFullYear()
        );
      };

      // Get unique event types for the day
      const uniqueEventTypes = Array.from(
        new Set(dateEvents.map((event) => event.type))
      );

      // Create dots for each unique event type
      const eventDots = uniqueEventTypes.map((type, index) => (
        <span
          key={index}
          className={css.eventDot}
          style={{ backgroundColor: eventTypeColors[type] || "#000" }}
        ></span>
      ));

      days.push(
        <div
          key={day}
          className={css.dayCell}
          onClick={() => handleDateClick(day)}
        >
          <div className={`${css.dayNumber} ${isToday(date) ? css.today : ""}`}>
            {day}
          </div>
          <div className={css.eventContainer}>
            {uniqueEventTypes.map((type, index) => (
              <div
                key={index}
                className={`${css.eventTag} ${
                  css[type.toLowerCase().replace(" ", "")]
                }`}
              >
                {type}
              </div>
            ))}
          </div>
          <div className={css.eventContainerMob}>{eventDots}</div>
        </div>
      );
    }
    return days;
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
  };

  const [currentDateMonth, setCurrentDateMonth] = useState(new Date());

  const changeDateMonth = (direction: number) => {
    setCurrentDateMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleAddAnnouncement = async () => {
    if (!announcementInput.trim()) {
      showToast("Please enter an announcement", "error");
      return;
    }

    try {
      const formattedDate = modal.date
        ?.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .join("-");

      const response = await fetch(`${baseURL}/team/addAnnouncement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          announcement: announcementInput,
          date: formattedDate,
        }),
      });

      if (response.ok) {
        // Update local state immediately
        const newEvent: Event = {
          type: "Announcements",
          title: announcementInput,
          date: modal.date!,
        };

        setCalendarEvents((prev) => [...prev, newEvent]);
        setModal((prev) => ({
          ...prev,
          events: [...prev.events, newEvent],
        }));

        setAnnouncementInput("");
        setIsAnnouncementInputVisible(false);
        setIsAnnouncementModalOpen(false);
        showToast("Announcement added successfully", "success");
      }
    } catch (error) {
      console.error("Error adding announcement:", error);
      showToast("Failed to add announcement", "error");
    }
  };

  const noteInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && isNoteInputVisible) {
        handleAddNotes();
      }
    };

    if (noteInputRef.current) {
      noteInputRef.current.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (noteInputRef.current) {
        noteInputRef.current.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [isNoteInputVisible, noteInput]);

  const handleAddNotes = async () => {
    if (!noteInput.trim() || !modal.date) return;

    try {
      const formattedDate = modal.date
        .toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .split("/")
        .join("-");

      const response = await fetch(`${baseURL}/team/addNotes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          note: noteInput,
          date: formattedDate,
        }),
      });

      if (response.ok) {
        // Update local state immediately
        const newEvent: Event = {
          type: "Notes",
          title: noteInput,
          date: modal.date,
        };

        setCalendarEvents((prev) => [...prev, newEvent]);
        setModal((prev) => ({
          ...prev,
          events: [...prev.events, newEvent],
        }));

        setNoteInput("");
        setIsNoteInputVisible(false);
        showToast("Note added successfully", "success");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      showToast("Failed to add note", "error");
    }
  };

  const changeMonth = (direction: number) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });

    // Fetch events for the new month
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    fetchCalendarEvents(newDate);
  };

  return (
    <>
      <div className={css.calendarContainer}>
        <div className={css.calendar}>
          <div className={css.currentMonth}>
            <div className={css.currentMonthText}>
              {formatDateMonthYear(currentDate)}
            </div>
            <div
              className={css.moreOptions}
              ref={moreBtnRefOp}
              onClick={(e) => {
                e.stopPropagation();
                setModalOpenOp(!modalOpenOp);
              }}
            >
              <div className={css.dot}></div>
              <div className={css.dot}></div>
              <div className={css.dot}></div>
            </div>
            <OptionsModal
              isOpen={modalOpenOp}
              className={css.optionsModal}
              options={[
                {
                  component: <Circle />,
                },
              ]}
              onClose={() => setModalOpenOp(false)}
              modalRef={modalRefOp as any}
              btnRef={moreBtnRefOp as any}
              itemStyle={{
                padding: "2px 4px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "13px",
                fontWeight: 500,
                zIndex: 100,
                width: "100%",
              }}
              itemClassName={css.modalItem}
            />
          </div>
          <div className={css.header} style={style}>
            <div className={css.headerLeft}>
              <div className={css.todayDate}>
                <div className={css.eventTit}>
                  {todaysEvents.length > 0 && `Today's Events:`}
                </div>
                <div className={css.todaysEvents}>
                  {uniqueEventTypesToday.length > 0 &&
                    uniqueEventTypesToday.map((type, index) => (
                      <div
                        key={index}
                        className={`${css.eventTags} ${
                          css[type.toLowerCase().replace(" ", "")]
                        }`}
                      >
                        {type}
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className={css.headerRight}>
              <button onClick={() => changeMonth(-1)} className={css.navButton}>
                <img
                  src="/assets/admin/dashboard/calendar/arrowLeft.svg"
                  alt=""
                />
              </button>
              <div className={css.todayTit} onClick={() => jumpToday()}>
                {`Today`}
              </div>
              <button onClick={() => changeMonth(1)} className={css.navButton}>
                <img
                  src="/assets/admin/dashboard/calendar/arrowRight.svg"
                  alt=""
                />
              </button>
            </div>
          </div>
          <div className={css.calendarBox}>
            <div className={css.daysOfWeek}>
              {daysOfWeek.map((day, index) => (
                <div key={index} className={css.dayOfWeek}>
                  <span className={css.fullDay}>{day.full}</span>
                  <span className={css.shortDay}>{day.short}</span>
                </div>
              ))}
            </div>
            <div className={css.days}>{renderDays()}</div>
          </div>
        </div>

        {modal.isOpen && (
          <div className={css.modalOverlayCal} onClick={closeModal}>
            <div
              className={css.modalContentCal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={css.headerModal}>
                <div className={css.headerCont}>
                  {`How does the day look like`}
                </div>
                <div className={css.crossBtn} onClick={closeModal}>
                  <img
                    src="/assets/admin/dashboard/calendar/cross.svg"
                    alt=""
                    onClick={closeModal}
                  />
                </div>
              </div>

              <div className={css.modalMainContent}>
                <div className={css.modalHeaderCal}>
                  <div className={css.date}>
                    {modal.date?.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </div>

                  {!isPastDate(modal.date) &&
                    (user?.role === "Admin" || user?.role === "HR") && (
                      <div
                        className={css.addBtnAnn}
                        onClick={() => setIsAnnouncementModalOpen(true)}
                      >
                        <img
                          src="/assets/admin/dashboard/calendar/addNotes.svg"
                          alt=""
                        />
                        <div className={css.btnName}>{`Add Announcement`}</div>
                      </div>
                    )}
                </div>

                <div className={css.eventCont}>
                  {/* Public Holidays Section */}
                  {modal.events.some(
                    (event) => event.type === "Public Holiday"
                  ) && (
                    <div className={css.section}>
                      {modal.events
                        .filter((event) => event.type === "Public Holiday")
                        .map((event, index) => (
                          <div
                            key={index}
                            className={`${css.eventItem} ${css.holiday}`}
                          >
                            {event.title + " - Public Holiday"}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Leave Section */}
                  {modal.events.some((event) => event.type === "Leave") && (
                    <div className={css.section}>
                      {modal.events
                        .filter((event) => event.type === "Leave")
                        .map((event, index) => (
                          <div
                            key={index}
                            className={`${css.eventItem} ${css.leave}`}
                          >
                            {event.title}
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Announcements Section */}
                  {modal.events.some(
                    (event) => event.type === "Announcements"
                  ) && (
                    <div className={css.section}>
                      {modal.events
                        .filter((event) => event.type === "Announcements")
                        .map((event, index) => (
                          <div
                            key={index}
                            className={`${css.eventItem} ${css.announcements}`}
                          >
                            {event.title + " - Announcements"}
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Assignment Deadline Section */}
                {modal.events.some((event) => event.type === "Deadline") && (
                  <div className={css.dropdownBox}>
                    <div
                      className={css.dropdownHeader}
                      onClick={() => setIsAssignmentOpen(!isAssignmentOpen)}
                    >
                      <img
                        src="/assets/admin/dashboard/calendar/arrowDown.svg"
                        alt=""
                        className={isAssignmentOpen ? css.rotated : ""}
                      />
                      <div
                        className={`${css.headingTitle} ${css.assignmentDeadline}`}
                      >{`Assignment Deadlines`}</div>
                    </div>
                    {isAssignmentOpen && (
                      <div
                        className={`${css.contentBox} ${
                          isAssignmentOpen ? css.open : ""
                        } ${css.scrollable}`}
                      >
                        {modal.events
                          .filter((event) => event.type === "Deadline")
                          .map((event, index) => (
                            <div key={index} className={css.eventItem}>
                              <div className={css.eventBox}>
                                <div className={css.eventTitle}>
                                  {event.title}
                                </div>
                                <div className={css.eventDate}>
                                  {event.date.toLocaleDateString()}
                                </div>
                              </div>
                              <div className={css.assignmentDetails}>
                                {event.details && (
                                  <p className={css.eventDetails}>
                                    {event.details}
                                  </p>
                                )}
                                {event.project_manager_name && (
                                  <div className={css.pmDetails}>
                                    <span className={css.label}>PM:</span>
                                    <span className={css.value}>{event.project_manager_name}</span>
                                  </div>
                                )}
                                {event.freelancer_name && (
                                  <div className={css.freelancerDetails}>
                                    <span className={css.label}>Freelancer:</span>
                                    <span className={css.value}>{event.freelancer_name}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Notes Section */}
                <div className={css.dropdownBox} style={{ backgroundColor: "lightYellow" }}>
                  <div className={css.dropdownHeaderNotes} style={{backgroundColor: "#F5F5F5"}}>
                    <div
                      className={css.nameArrow}
                      onClick={() => setIsNotesOpen(!isNotesOpen)}
                    >
                      <img
                        src="/assets/admin/dashboard/calendar/arrowDown.svg"
                        alt=""
                        className={isNotesOpen ? css.rotated : ""}
                      />
                      <div
                        className={`${css.headingTitle} ${css.notes}`}
                      >{`Notes`}
                      </div>
                    </div>
                    {!isPastDate(modal.date) && !isNoteInputVisible ? (
                      <div
                        className={css.addBtn}
                        onClick={() => setIsNoteInputVisible(true)}
                      >
                        <img
                          src="/assets/admin/dashboard/calendar/addNotes.svg"
                          alt=""
                        />
                        <div className={css.btnName}>{`Add Note`}</div>
                      </div>
                    ) : !isPastDate(modal.date) && isNoteInputVisible ? (
                      <div
                        className={css.discardNoteBtn}
                        onClick={() => setIsNoteInputVisible(false)}
                      >
                        {`Discard note`}
                      </div>
                    ) : null}
                  </div>
                  {isNotesOpen && (
                    <>
                      {modal.events.some((event) => event.type === "Notes") && (
                        <div
                          className={`${css.contentBox} ${
                            isAssignmentOpen ? css.open : ""
                          }`}
                        >
                          {modal.events
                            .filter((event) => event.type === "Notes")
                            .map((event, index) => (
                              <div key={index} className={css.eventItem} style={{borderBottom: "1px solid #E5E5E5"}}>
                                <div className={css.eventBox}>
                                  <span className={css.eventTitle}>
                                    {event.title}
                                  </span>
                                </div>
                                {event.details && (
                                  <p className={css.eventDetails}>
                                    {event.details}
                                  </p>
                                )}
                              </div>
                            ))}
                        </div>
                      )}

                      {/* Note Input Section */}
                      {!isPastDate(modal.date) && isNoteInputVisible && (
                        <div className={css.noteInputContainer}>
                          <Input
                            type="text"
                            className={css.noteInput}
                            placeholder="Add a note"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            ref={noteInputRef}
                            inputWrapperClassName={css.inputWrapper}
                          />
                            <div
                            className={`${css.addNotes} ${!noteInput.trim() ? css.disabled : ''}`}
                            onClick={noteInput.trim() ? handleAddNotes : undefined}
                            >
                            <img
                              src="/assets/admin/dashboard/calendar/send.svg"
                              alt=""
                              style={{ opacity: noteInput.trim() ? 1 : 0.5 }}
                            />
                            </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              <div className={css.modalFooter}>
                <div className={css.discardBtn} onClick={closeModal}>
                  {`Close`}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
        onSubmit={handleAddAnnouncement}
        announcement={announcementInput}
        setAnnouncement={setAnnouncementInput}
      />
    </>
  );
};

export default Calendar;
