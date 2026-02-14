import React, { useRef, useState, useEffect } from "react";
import css from "@/styles/admin/assignmentDetails.module.scss";
import Drawer from "@/components/ui/radix-drawer";
import { useToast } from "@/context/toastContext";
import { useAuth } from "@/authentication/authentication";
import { WordCountDrawerProps } from "../types";

const baseURL = String(process.env.NEXT_PUBLIC_BASE_URL);

const WordCountDrawer: React.FC<WordCountDrawerProps> = ({
  isOpen,
  onClose,
  assignmentNumber,
  fetchAssignmentDetails,
  assignments,
}) => {
  const [formData, setFormData] = useState({
    wordcount: null as number | null,
    freelancervalue: null as number | null,
    bluepenvalue: null as number | null,
  });

  const { user } = useAuth();
  const { showToast } = useToast();
  const userToken = user?.token;

  useEffect(() => {
    if (isOpen) {
      setFormData({
        wordcount: assignments.wordCount || null,
        freelancervalue: assignments.freelancerAmount || null,
        bluepenvalue: assignments.totalAmount || null,
      });
    }
  }, [isOpen, assignments]);

  const inputRefs = {
    freelancerValue: useRef<HTMLInputElement>(null),
    bluepenValue: useRef<HTMLInputElement>(null),
    wordCount: useRef<HTMLInputElement>(null),
  };

  const handleInputclick = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref.current) {
      ref.current.focus();
    }
  };

  const addWordCount = async () => {
    const response = await fetch(`${baseURL}/team/addWordCount`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        assignment_id: Number(assignmentNumber),
        word_count: formData.wordcount,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    showToast(data.message, "success");
    return data;
  };

  const addAmount = async () => {
    const response = await fetch(`${baseURL}/team/addAmounts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        assignment_id: Number(assignmentNumber),
        total_amount: formData.bluepenvalue,
        freelancer_amount: formData.freelancervalue,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    showToast(data.message, "success");
    return data;
  };

  function handleInputChange(field: keyof typeof formData, input: string) {
    const regex = /^[0-9\s]*$/;
    if (input === "") {
      setFormData(prev => ({ ...prev, [field]: null }));
    } else if (input.length <= 7 && regex.test(input)) {
      setFormData(prev => ({ ...prev, [field]: Number(input.trim()) }));
    } else {
      console.log("Invalid input. Please enter numbers only.");
    }
  }

  const handleSubmitWordCountValue = async () => {
    if (
      formData.wordcount === null &&
      formData.bluepenvalue === null &&
      formData.freelancervalue === null
    ) {
      showToast("Please fill the details before submitting the form", "error");
      return;
    }

    try {
      const promises = [];

      if (formData.wordcount !== null) {
        promises.push(addWordCount());
      }

      if (formData.bluepenvalue !== null && formData.freelancervalue !== null) {
        promises.push(addAmount());
      }

      if (promises.length === 0) {
        showToast("Please fill the details before submitting the form", "error");
        return;
      }

      await Promise.all(promises);
      await fetchAssignmentDetails();
      setFormData({ wordcount: null, freelancervalue: null, bluepenvalue: null });
      onClose();
    } catch (error) {
      showToast(error instanceof Error ? error.message : "An error occurred. Please try again.", "error");
    }
  };

  const handleClose = () => {
    setFormData({ wordcount: null, freelancervalue: null, bluepenvalue: null });
    onClose();
  };

  return (
    <Drawer isOpen={isOpen} onClose={onClose} setDrawer={onClose} drawerContent="35%">
      <div className={`${css.drawerHeader}`}>
        <h2 className={`${css.welTitle}`}>{`Word Count / Payments`}</h2>
        <button className={`${css.closeBtn}`} onClick={onClose}>
          ×
        </button>
      </div>
      <div className={css.wordCountDrawer}>
        <div
          className={css.inputBox}
          onClick={() => handleInputclick(inputRefs.freelancerValue)}
        >
          <div className={css.inputLabel}>{`Freelancer Amount`}</div>
          <input
            type="tel"
            className={css.input}
            placeholder="Enter"
            value={
              formData.freelancervalue != null && formData.freelancervalue != 0
                ? formData.freelancervalue
                : ""
            }
            onChange={(e) => handleInputChange("freelancervalue", e.target.value)}
            ref={inputRefs.freelancerValue}
          />
        </div>
        <div
          className={css.inputBox}
          onClick={() => handleInputclick(inputRefs.bluepenValue)}
        >
          <div className={css.inputLabel}>{`Total Amount`}</div>
          <input
            type="tel"
            className={css.input}
            placeholder="Enter"
            value={
              formData.bluepenvalue != null && formData.bluepenvalue != 0
                ? formData.bluepenvalue
                : ""
            }
            onChange={(e) => handleInputChange("bluepenvalue", e.target.value)}
            ref={inputRefs.bluepenValue}
          />
        </div>
        <div
          className={css.inputBox}
          onClick={() => handleInputclick(inputRefs.wordCount)}
        >
          <div className={css.inputLabel}>{`Word count`}</div>
          <input
            type="tel"
            className={css.input}
            placeholder="Enter"
            value={
              formData.wordcount != null && formData.wordcount != 0
                ? formData.wordcount
                : ""
            }
            onChange={(e) => handleInputChange("wordcount", e.target.value)}
            ref={inputRefs.wordCount}
          />
        </div>
        <div className={`${css.drawerFooter}`}>
          <div
            className={`${css.closeFooterBtn}`}
            onClick={handleClose}
          >
            Close
          </div>
          <div
            className={css.assignBtn}
            onClick={handleSubmitWordCountValue}
          >{`Submit`}</div>
        </div>
      </div>
    </Drawer>
  );
};

export default WordCountDrawer;
