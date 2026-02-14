"use client";
import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Drawer from "@/components/ui/radix-drawer";
import { useToast } from "@/context/toastContext";
import css from "@/styles/admin/assignmentDetails.module.scss";
import { EmailDrawerProps } from "../types";
import { generateEmailContent, isMobileDevice, openEmailClient } from "./emailContent";

const tinyMceKey = String(process.env.NEXT_PUBLIC_TINY_MCE_KEY);
const fileURL = process.env.NEXT_PUBLIC_FILE_URL || '';

const EmailDrawer: React.FC<EmailDrawerProps> = ({
  isOpen,
  onClose,
  assignments,
  assignmentNumber,
}) => {
  const { showToast } = useToast();
  const editorRef = useRef<any>(null);
  const downloadUrl = `${fileURL}/file/assignments/freelancing`;

  const emailContent = generateEmailContent(assignments, assignmentNumber || '', downloadUrl);

  const handleCopyOrOpenEmail = () => {
    if (editorRef.current) {
      const content = editorRef.current.getContent({ format: "html" });

      if (isMobileDevice()) {
        openEmailClient(content);
      } else {
        const blob = new Blob([content], { type: "text/html" });
        const data = [new ClipboardItem({ "text/html": blob })];

        navigator.clipboard
          .write(data)
          .then(() => {
            showToast("Content copied to clipboard!", "success");
          })
          .catch((err) => {
            showToast("Content failed copied to clipboard!", "error");
            console.error("Failed to copy: ", err);
          });
      }
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      setDrawer={onClose}
      drawerContent="45%"
    >
      <div className={`${css.drawerHeader}`}>
        <h2 className={`${css.welTitle}`}>{`Send Email`}</h2>
        <button className={`${css.closeBtn}`} onClick={onClose}>
          ×
        </button>
      </div>

      <div className={`${css.drawerContent}`}>
        <Editor
          onInit={(evt, editor) => (editorRef.current = editor)}
          apiKey={tinyMceKey}
          init={{
            height: 600,
            plugins: ["table powerpaste", "lists media", "paste"],
            toolbar:
              "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify",
            tinycomments_mode: "embedded",
            tinycomments_author: "Author name",
            mergetags_list: [
              { value: "First.Name", title: "First Name" },
              { value: "Email", title: "Email" },
            ],
            ai_request: (request: any, respondWith: any) =>
              respondWith.string(() =>
                Promise.reject("See docs to implement AI Assistant")
              ),
            convert_urls: false,
            menubar: false,
            valid_elements: "a[href|target|rel],strong,b,em,i,p,ul,li,br",
            extended_valid_elements: "a[href|target|rel]",
          }}
          initialValue={emailContent}
        />
      </div>

      <div className={`${css.drawerFooter}`}>
        <div className={`${css.closeFooterBtn}`} onClick={onClose}>
          Close
        </div>
        <div onClick={handleCopyOrOpenEmail} className={css.assignBtn}>
          {isMobileDevice() ? "Open Email" : "Copy To Clipboard"}
        </div>
      </div>
    </Drawer>
  );
};

export default EmailDrawer;
