import React, { useState, useEffect, useRef } from 'react';
import css from "@/styles/admin/freelancerDetails.module.scss";
import Dropdown from "@/components/admin/dropdown/dropdown";
import { useAuth } from "@/authentication/authentication";
import { useToast } from "@/context/toastContext";
import SkeletonLoader from "@/ui/loader/skeletonLoader";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";

interface Message {
  id: number;
  user: string;
  name: string;
  status: string;
  message: string;
  date: string;
  docs?: string[];
}

interface CommentSectionProps {
  freelancerId: string | null;
  baseURL: string;
}

const CommentSection: React.FC<CommentSectionProps> = ({ freelancerId, baseURL }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [status, setStatus] = useState("");
  const [paginationNumber] = useState<number>(5);
  const [loader, setLoader] = useState(true);
  const [lastChatId, setLastChatId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { showToast } = useToast();

  const sendMessage = async () => {
    if (!messageInput) {
      showToast("Please enter a comment", "error");
      return;
    }
    try {
      const response = await fetch(`${baseURL}/team/addComment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          freelancer_id: Number(freelancerId),
          comment: messageInput,
          comment_type: "Normal",
          tag: "Text",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        showToast(data.message, "success");
        const newMessage: Message = {
          id: data.messageId,
          user: "admin",
          name: "Admin",
          status: status,
          message: messageInput,
          date: new Date().toISOString(),
          docs: attachments.map((file) => file.name),
        };

        setMessages([newMessage, ...messages]);
        setMessageInput("");
        setAttachments([]);
        setStatus("");
      } else {
        console.error("Error:", data.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const fetchAssignmentChats = async () => {
    try {
      const response = await fetch(`${baseURL}/team/getComments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          freelancer_id: Number(freelancerId),
          last_comment_id: "",
          pagination_number: paginationNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const initialMessages = data.data;

        if (initialMessages.length > 0) {
          const initialLastChatId = initialMessages[initialMessages.length - 1].id;
          setLastChatId(initialLastChatId);

          setMessages(
            initialMessages.map((comment: any) => ({
              id: comment.id,
              user: comment.sent_by_role === "Admin" ? "admin" : "freelancer",
              name: comment.sent_by_name,
              status: comment.tag,
              message: comment.comment,
              date: comment.sent_on,
              docs: comment.files,
            }))
          );
        } else {
          setHasMore(false);
        }
        setLoader(false);
      } else {
        showToast(data.message, "error");
      }
    } catch (error) {
      showToast("An error occurred. Please try again.", "error");
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchAssignmentChats();
    }
  }, [user?.token, freelancerId]);

  const fetchMessages = async () => {
    if (loading || !hasMore || !lastChatId) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/team/getComments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          freelancer_id: Number(freelancerId),
          last_comment_id: lastChatId,
          pagination_number: paginationNumber,
        }),
      });

      const result = await response.json();

      if (result.status === 200) {
        if (result.data && result.data.length > 0) {
          const newMessages = result.data.map((comment: any) => ({
            id: comment.id,
            user: comment.sent_by_role === "Admin" ? "admin" : "freelancer",
            name: comment.sent_by_name,
            status: comment.tag,
            message: comment.comment,
            date: comment.sent_on,
            docs: comment.files,
          }));

          const newLastChatId = newMessages[newMessages.length - 1].id;
          setLastChatId(newLastChatId);
          setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        } else {
          setHasMore(false);
        }
      } else {
        console.error("Failed to fetch messages:", result.message);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (messages.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          fetchMessages();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current = observer;
    return () => observer.disconnect();
  }, [messages, hasMore, loading]);

  useEffect(() => {
    if (messages.length === 0) return;

    const observer = observerRef.current;
    const lastMessageElement = lastMessageRef.current;

    if (observer && lastMessageElement) {
      observer.observe(lastMessageElement);
    }

    return () => {
      if (observer && lastMessageElement) {
        observer.unobserve(lastMessageElement);
      }
    };
  }, [messages]);

  const handleStatusChange = (option: string) => {
    setStatus(option);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prevAttachments) =>
      prevAttachments.filter((_, i) => i !== index)
    );
  };

  const getStatusClass = (status: string) => {
    if (!status) return "";

    switch (status.toLowerCase()) {
      case "completed":
        return css.completed;
      case "updates":
        return css.updates;
      case "query":
        return css.query;
      case "completion":
        return css.completed;
      case "submission":
        return css.updates;
      case "feedback":
        return css.query;
      case "draft":
        return css.completed;
      case "instructions":
        return css.updates;
      case "accepted":
        return css.query;
      case "assigned":
        return css.completed;
      default:
        return "";
    }
  };

  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    switch (extension) {
      case "pdf":
        return "/assets/freelancer/assignments/details/pdf.svg";
      case "xls":
        return "/assets/freelancer/assignments/details/xls.svg";
      case "doc":
      case "docx":
        return "/assets/freelancer/assignments/details/word.svg";
      case "ppt":
      case "pptx":
        return "/assets/freelancer/assignments/details/pptx.svg";
      default:
        return "/assets/freelancer/assignments/details/pdf.svg";
    }
  };

  return (
    <>
      <div className={`${css.betweenTitile}`}>{`Feedback & Comment's`}</div>
      {messages ? (
        <div className={`${css.DraftTips}`}>
          <div className={`${css.submitDraft}`}>
            <div className={`${css.messageBox}`}>
              <div className={`${css.profile}`}>
                <img src="/assets/admin/freelancer/profileGirl.svg" alt="U" />
              </div>
              <div className={css.messageInput}>
                <div className={`${css.inputs}`}>
                  <input
                    type="text"
                    placeholder="add a comment or drag & drop to attach a file"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <div className={css.statusAttach}>
                    <Dropdown
                      options={["Completed", "Updates", "Query"]}
                      defaultOption="Status"
                      onChange={handleStatusChange}
                      style={{
                        "--dropdown-border-radius": "16px",
                        "--dropdown-margin-right": "8px",
                        "--dropdown-options-width": "max-content",
                        "--dropdown-border-color": "#9C9797",
                        "--dropdown-text-color": "#766D6D",
                      } as React.CSSProperties}
                      value={status}
                      onReset={() => setStatus("")}
                    />
                  </div>
                </div>
                <div className={css.attachments}>
                  {attachments.map((file, index) => (
                    <div key={index} className={`${css.documents}`}>
                      <div className={`${css.documentImg}`}>
                        <img
                          src="/assets/freelancer/assignments/details/pdf.svg"
                          alt="PDF"
                        />
                      </div>
                      <div className={`${css.documentName}`}>{file.name}</div>
                      <button
                        onClick={() => removeAttachment(index)}
                        className={`${css.crossBtn}`}
                      >
                        <img
                          src="/assets/freelancer/assignments/details/cross.svg"
                          alt="PDF"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`${css.sendButton} ${
                  !messageInput ? css.overlay : css.sendButton
                }`}
                onClick={sendMessage}
              >
                <img
                  src="/assets/freelancer/assignments/details/send.svg"
                  alt=""
                />
              </div>
            </div>
            {loader ? (
              <SkeletonLoader />
            ) : (
              <div className={`${css.commentsBox}`}>
                <div className={`${css.title}`}>history</div>
                <div className={`${css.commentsContainer}`}>
                  {messages.map((comment, index) => (
                    <div
                      key={comment.id}
                      ref={
                        index === messages.length - 1 ? lastMessageRef : null
                      }
                      className={`${css.comments}`}
                    >
                      {comment.user === "freelancer" ? (
                        <div className={`${css.commentProfile}`}>
                          <img
                            src="/assets/freelancer/dashboard/profileGirl.svg"
                            alt="U"
                          />
                        </div>
                      ) : (
                        <div className={`${css.userProfile}`}>A</div>
                      )}
                      <div className={`${css.commentMessages}`}>
                        <div className={`${css.userStatus}`}>
                          <div className={`${css.user}`}>{comment.name}</div>
                          <div
                            className={`${css.status} ${getStatusClass(
                              comment.status
                            )}`}
                          >
                            {comment.status}
                          </div>
                        </div>
                        <div className={`${css.messages}`}>
                          {comment.message}
                        </div>
                        {comment.docs && comment.docs.length > 0 && (
                          <div className={`${css.documentBox}`}>
                            {comment.docs.map((doc, docIndex) => (
                              <div
                                key={docIndex}
                                className={`${css.documents}`}
                              >
                                <div className={`${css.documentImg}`}>
                                  <img
                                    src={getDocumentIcon(doc)}
                                    alt="Document"
                                  />
                                </div>
                                <div className={`${css.documentName}`}>
                                  {doc}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className={`${css.date}`}>
                          {comment.date
                            ? formatDate(
                                comment.date,
                                "dd-mm-yyyy hh:mm AM/PM"
                              )
                            : ""}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className={css.loading}>
                      Loading more messages...
                    </div>
                  )}
                  {!loading && !hasMore && messages.length > 0 && (
                    <div className={css.endMessage}>
                      No more messages to load
                    </div>
                  )}
                  {!loading && messages.length === 0 && (
                    <div className={css.endMessage}>No messages yet</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <SkeletonLoader />
      )}
    </>
  );
};

export default CommentSection;
