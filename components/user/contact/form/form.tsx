"use client";
import React, { FormEvent, useState } from "react";
import styles from "@/styles/contact.module.scss";
import Input from "@/ui/Input";
import Textarea from "@/ui/textarea/textarea";
import { useContactForm } from "@/store/contact";
import {
  isValidName,
  isValidEmail,
  isValidMessage,
} from "@/utils/validationUtils";
import { useToast } from "@/context/toastContext";
import CustomPhoneInput from "@/ui/phoneInput/phoneInput";
import css from "@/styles/phoneInput.module.scss";

const URL = String(process.env.NEXT_PUBLIC_BASE_URL);

const ContactForm = () => {
  const { showToast } = useToast();
  const { formData, setField, resetForm } = useContactForm();
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
    number: "",
    country_code: "",
    country_name: "",
  });

  const isValidPhone = (phone: string): boolean => {
    return /^\d{10,15}$/.test(phone);
  };

  const validateForm = () => {
    let newErrors = {
      name: "",
      email: "",
      message: "",
      number: "",
      country_code: "",
      country_name: "",
    };
    let isValid = true;

    // Name validation
    if (!formData.name) {
      newErrors.name = "Name field cannot be empty.";
      isValid = false;
    } else if (!isValidName(formData.name)) {
      newErrors.name =
        "Name must be alphabetic and cannot exceed 50 characters.";
      isValid = false;
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email field cannot be empty.";
      isValid = false;
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
      isValid = false;
    }

    // Message validation
    if (!formData.message) {
      newErrors.message = "Message field cannot be empty.";
      isValid = false;
    } else if (!isValidMessage(formData.message)) {
      newErrors.message = "Message cannot exceed 250 words.";
      isValid = false;
    }

    if (!formData.number) {
      newErrors.number = "Phone number field cannot be empty.";
      isValid = false;
    } else if (!isValidPhone(formData.number)) {
      newErrors.number = "Please enter a valid 10-digit phone number.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleInputChange = (e: any) => {
    if (e && typeof e === "object" && "phoneNumber" in e) {
      const cleanNumber = e.phoneNumber.replace(/\D/g, "");

      if (cleanNumber.length <= 15) {
        setField("number", cleanNumber);
        setField("country_code", (e.countryCode || "91").replace("+", ""));
        setField("country_name", e.countryName || "India");
      }

      if (!e.phoneNumber) {
        setErrors((prev) => ({ ...prev, number: "Phone number is required" }));
      } else if (!isValidPhone(e.phoneNumber.replace(/\D/g, ""))) {
        setErrors((prev) => ({
          ...prev,
          number: "Please enter a valid 10-digit phone number",
        }));
      } else {
        setErrors((prev) => ({ ...prev, number: "" }));
      }
      return;
    }
    if (e && e.target) {
      const { name, value } = e.target;

      switch (name) {
        case "name":
          if (value === "" || (isValidName(value) && value.length <= 50)) {
            setField(name, value);
            setErrors((prev) => ({ ...prev, name: "" }));
          } else {
            setErrors((prev) => ({
              ...prev,
              name: "Name must be alphabetic and cannot exceed 50 characters.",
            }));
          }
          break;

        case "email":
          setField(name, value);
          if (isValidEmail(value)) {
            setErrors((prev) => ({ ...prev, email: "" }));
          } else {
            setErrors((prev) => ({
              ...prev,
              email: "Please enter a valid email address.",
            }));
          }
          break;

        case "message":
          if (isValidMessage(value)) {
            setField(name, value);
            setErrors((prev) => ({ ...prev, message: "" }));
          } else {
            setErrors((prev) => ({
              ...prev,
              message: "Message cannot exceed 250 words.",
            }));
          }
          break;

        default:
          break;
      }
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    if (!validateForm()) {
      const firstError = Object.entries(errors).find(
        ([_, value]) => value !== ""
      );
      if (firstError) {
        showToast(firstError[1], "error");
      } else {
        showToast("Please fix the errors in the form.", "error");
      }
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(`${URL}/user/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast("Form submitted successfully", "success");
        resetForm();
      } else {
        showToast("Error submitting the form", "error");
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
      showToast("Error submitting the form", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    resetForm();
    setErrors({
      name: "",
      email: "",
      message: "",
      number: "",
      country_code: "",
      country_name: "",
    });
  };

  return (
    <div className={styles.formContainer}>
      <div className={`${styles.formHeading} spartan-600`}>
        Leave us a note, we&apos;ll surely get back
      </div>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.inputRow}>
          <div className={styles.inputCol}>
            <div className={styles.formInputs}>Name</div>
            <Input
              name="name"
              placeholder="eg: Hritik Shettigar"
              value={formData.name}
              onChange={handleInputChange}
              disabled={isSubmitting}
            />
            {errors.name && <div className={styles.error}>{errors.name}</div>}
          </div>

          <div className={styles.inputCol}>
            <div className={styles.formInputs}>Phone</div>
            <CustomPhoneInput
              placeholder="eg: +91 9876543210"
              value={formData.number}
              onChange={(
                value: string,
                country: { code: string; name: string }
              ) =>
                handleInputChange({
                  phoneNumber: value,
                  countryCode: country.code,
                  countryName: country.name,
                })
              }
              disabled={isSubmitting}
              errorMessage={errors.number}
            />
          </div>
        </div>

        <div className={styles.inputCol}>
          <div className={styles.formInputs}>Email</div>
          <Input
            name="email"
            placeholder="eg: email@xyz.com"
            value={formData.email}
            onChange={handleInputChange}
            disabled={isSubmitting}
            errorMessage={errors.email}
            isError={Boolean(errors.email)}
          />
          {/* {errors.email && <div className={styles.error}>{errors.email}</div>} */}
        </div>

        <div className={styles.formInputs}>Message</div>
        <Textarea
          name="message"
          placeholder="eg: I want help for my assignment. Please contact me on 961......."
          value={formData.message}
          onChange={handleInputChange}
          className={`spartan-400 ${styles.textareaInput}`}
          disabled={isSubmitting}
        />

        {errors.message && <div className={styles.error}>{errors.message}</div>}

        <div className={styles.btns}>
          <button
            type="button"
            className={styles.reset}
            onClick={handleReset}
            disabled={
              isSubmitting ||
              (formData.name === "" &&
                formData.email === "" &&
                formData.message === "" &&
                formData.number === "")
            }
          >
            Reset
          </button>
          <button
            type="submit"
            className={styles.submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
