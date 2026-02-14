import React, { useRef, useState, useEffect } from "react";
import css from "@/styles/admin/assignmentDetails.module.scss";
import Dropdown from "@/components/admin/dropdown/dropdown";
import SkeletonLoader from "@/ui/loader/skeletonLoader";
import { formatDate } from "@/utils/customJsFunctions/dateFormatJS";
import Avatar from "@/ui/getAvatar";
import { useToast } from "@/context/toastContext";
import { DraftTipsProps, Message, UploadedFile } from "./types";
import { useAuth } from "@/authentication/authentication";

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);
const fileURL = process.env.NEXT_PUBLIC_FILE_URL;

const DraftTips: React.FC<DraftTipsProps> = ({ 
  assignmentNumber,
  userName,
  editable = true 
}) => {
  const { user } = useAuth();
  const userToken = user?.token;
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(true);
  const [status, setStatus] = useState("");
  const [messageInput, setMessageInput] = useState("");
  const [lastChatId, setLastChatId] = useState<number | null>(null);
  const [paginationNumber] = useState<number>(5);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { showToast } = useToast();

  const uploadFiles = async (files: File[]): Promise<void> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
      formData.append("folder", "/freelancers/comments");
    });

    try {
      const response = await fetch(`${fileURL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Upload failed");
      }
      setUploadedFiles(data.files);
    } catch (error) {
      console.error("Upload failed:", error);
      setAttachments([]);
    }
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files || []);
    setAttachments(newFiles);
    await uploadFiles(newFiles);
  };

  const sendMessage = async () => {
    try {
      const messagePayload = uploadedFiles.length > 0
        ? JSON.stringify(uploadedFiles.map((f) => f.savedAs))
        : messageInput;

      const response = await fetch(`${baseURL}/team/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          assignment_id: Number(assignmentNumber),
          message: messagePayload,
          message_type: "Text",
          tag: status,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const newMessage = {
          id: data.messageId,
          user: "admin",
          name: userName || "",
          status: status,
          message: messagePayload,
          date: formatDate(new Date().toISOString(), "dd-mm-yyyy hh:mm AM/PM"),
        };

        setMessages([newMessage, ...messages]);
        setMessageInput("");
        setAttachments([]);
        setUploadedFiles([]);
        setStatus("");
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
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
      case "completion":
      case "draft":
      case "assigned":
        return css.completed;
      case "updates":
      case "submission":
      case "instructions":
        return css.updates;
      case "query":
      case "feedback":
      case "accepted":
        return css.query;
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

  const fetchAssignmentChats = async () => {
    try {
      const response = await fetch(`${baseURL}/team/getAssignmentChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          assignment_id: Number(assignmentNumber),
          last_message_id: "",
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
            initialMessages.map((comment: any) => {
              let messageContent = comment.message;
              try {
                if (messageContent.startsWith("{") && messageContent.endsWith("}")) {
                  const files = JSON.parse(messageContent.replace(/[{}]/g, '"'));
                  messageContent = "";
                }
              } catch (e) {
                messageContent = comment.message;
              }

              return {
                id: comment.id,
                user: comment.sent_by_role === "Admin" ? "admin" : "freelancer",
                name: comment.sent_by_name,
                status: comment.tag,
                message: messageContent,
                date: comment.sent_on,
                message_type: comment.message_type,
                ...(comment.sent_by_role === "Freelancer" && {
                  profileImage: comment.profile_photo,
                }),
              };
            })
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

  const fetchMessages = async () => {
    if (loading || !hasMore || !lastChatId) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/team/getAssignmentChat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          assignment_id: Number(assignmentNumber),
          last_message_id: lastChatId,
          pagination_number: paginationNumber,
        }),
      });

      const result = await response.json();

      if (result.status === 200) {
        if (result.data && result.data.length > 0) {
          const newMessages = result.data.map((comment: any) => {
            let msgText = comment.message;
            let docs: string[] = [];

            if (msgText.trim().startsWith("{") && msgText.trim().endsWith("}")) {
              const fileName = msgText.trim().slice(1, -1);
              msgText = "";
              docs = [fileName];
            }

            return {
              id: comment.id,
              user: comment.sent_by_role === "Admin" ? "admin" : "freelancer",
              name: comment.sent_by_name,
              status: comment.tag,
              message: msgText,
              date: comment.sent_on,
              docs: docs,
            };
          });

          const newLastChatId = newMessages[newMessages.length - 1].id;
          setLastChatId(newLastChatId);
          setMessages((prevMessages) => [...prevMessages, ...newMessages]);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userToken) {
      fetchAssignmentChats();
    }
  }, [userToken, assignmentNumber]);

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

  const handleSubmit = async () => {
    if (!messageInput.trim() && attachments.length === 0) return;
    if (!editable) return;

    try {
      const success = await sendMessage();
      if (success) {
        setMessageInput("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Rest of your render code remains exactly the same
  return (
    <div className={css.DraftTips}>
      <div className={css.submitDraft}>
        <div className={css.messageBox}>
          <div className={css.profile}>
            <img src="/assets/admin/freelancer/profileGirl.svg" alt="User" />
          </div>
          <div className={css.messageInput}>
            <div className={css.inputs}>
              <input
                type="text"
                placeholder="Add a comment or drag & drop to attach a file"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    e.key === "Enter" &&
                    messageInput.length > 0 &&
                    editable
                  ) {
                    handleSubmit();
                  }
                }}
              />
              <div className={css.statusAttach}>
                <Dropdown
                  options={["Completed", "Updates", "Query"]}
                  defaultOption="Status"
                  onChange={setStatus}
                  style={
                    {
                      "--dropdown-border-radius": "16px",
                      "--dropdown-margin-right": "8px",
                      "--dropdown-options-width": "max-content",
                      "--dropdown-border-color": "#9C9797",
                      "--dropdown-text-color": "#766D6D",
                    } as React.CSSProperties
                  }
                  value={status}
                  onReset={() => setStatus("")}
                />
                <img
                  src="/assets/freelancer/assignments/details/attachment.svg"
                  alt="Attach file"
                  onClick={handleFileSelect}
                  style={{ cursor: "pointer" }}
                />
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                  multiple
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx"
                />
              </div>
            </div>
            <div className={css.attachments}>
              {attachments.map((file, index) => (
                <div key={index} className={css.documents}>
                  <div className={css.documentImg}>
                    <img
                      src="/assets/freelancer/assignments/details/pdf.svg"
                      alt="PDF"
                    />
                  </div>
                  <div className={css.documentName}>{file.name}</div>
                  <button
                    onClick={() => removeAttachment(index)}
                    className={css.crossBtn}
                  >
                    <img
                      src="/assets/freelancer/assignments/details/cross.svg"
                      alt="Remove"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div
            className={css.sendButton}
            onClick={
              (messageInput.length > 0 || attachments.length > 0) && editable
                ? handleSubmit
                : undefined
            }
            style={{
              opacity:
                (messageInput.length > 0 || attachments.length > 0) && editable
                  ? "100%"
                  : "30%",
              cursor:
                (messageInput.length > 0 || attachments.length > 0) && editable
                  ? "pointer"
                  : "not-allowed",
            }}
          >
            <img
              src="/assets/freelancer/assignments/details/send.svg"
              alt="Send"
            />
          </div>
        </div>
        {loader ? (
          <SkeletonLoader />
        ) : (
          <div className={css.commentsBox}>
            <div className={css.title}>History</div>
            <div className={css.commentsContainer}>
              {messages && messages.length > 0 ? (
                messages.map((comment, index) => (
                  <div
                    key={comment.id}
                    ref={
                      index === messages.length - 1
                        ? lastMessageRef
                        : null
                    }
                    className={css.comments}
                  >
                    <div>
                      {comment.user === "freelancer" ? (
                        comment?.profileImage ? (
                          <Avatar
                            name={comment.name}
                            profileImage={
                              comment.user === "freelancer"
                                ? fileURL +
                                  "/file/freelancers/profile_photo/" +
                                  comment.profileImage
                                : undefined
                            }
                          />
                        ) : (
                          <div className={css.freelancerProfile}>
                            {comment.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </div>
                        )
                      ) : (
                        <div className={css.userProfile}>A</div>
                      )}
                    </div>
                    <div className={css.commentMessages}>
                      <div className={css.userStatus}>
                        <div className={css.user}>{comment.name}</div>
                        <div
                          className={`${css.status} ${getStatusClass(
                            comment.status
                          )}`}
                        >
                          {comment.status}
                        </div>
                      </div>

                      <div className={css.messages}>
                        {(() => {
                          // Handle file message types
                          if (comment.message_type === "File") {
                            const files = Array.isArray(comment.message)
                              ? comment.message
                              : JSON.parse(comment.message);
                            return (
                              <div className={css.documentBox}>
                                {files.map((doc: string, docIndex: number) => (
                                  <div key={docIndex} className={css.documents}>
                                    <div className={css.documentImg}>
                                      <img
                                        src={getDocumentIcon(doc)}
                                        alt="Document"
                                      />
                                    </div>
                                    <div className={css.documentName}>
                                      <a
                                        href={`${fileURL}/file/freelancers/comments/${doc}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                      >
                                        {doc}
                                      </a>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            );
                          }

                          // Handle text messages that might contain file arrays
                          try {
                            const messageContent = JSON.parse(comment.message);
                            if (Array.isArray(messageContent)) {
                              return (
                                <div className={css.documentBox}>
                                  {messageContent.map(
                                    (doc: string, docIndex: number) => (
                                      <div
                                        key={docIndex}
                                        className={css.documents}
                                      >
                                        <div className={css.documentImg}>
                                          <img
                                            src={getDocumentIcon(doc)}
                                            alt="Document"
                                          />
                                        </div>
                                        <div className={css.documentName}>
                                          <a
                                            href={`${fileURL}/file/freelancers/comments/${doc}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            download
                                          >
                                            {doc}
                                          </a>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              );
                            }
                          } catch {
                            // If parsing fails, treat as regular message
                            return comment.message;
                          }

                          return comment.message;
                        })()}
                      </div>

                      <div className={css.date}>
                        {comment.date
                          ? formatDate(comment.date, "dd-mm-yyyy hh:mm AM/PM")
                          : ""}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={css.endMessage}>No messages yet</div>
              )}
              {loading && (
                <div className={css.loading}>Loading more messages...</div>
              )}
              {!loading && !hasMore && messages.length > 0 && (
                <div className={css.endMessage}>No more messages to load</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DraftTips;
