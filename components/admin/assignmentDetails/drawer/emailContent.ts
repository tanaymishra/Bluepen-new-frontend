import { EmailDrawerProps } from "../types";

export const generateEmailContent = (
  assignments: EmailDrawerProps['assignments'],
  assignmentNumber: string,
  downloadUrl: string
): string => {
  return `<p><strong>Subject:</strong></p>
    <p>Assignment ID: ${assignmentNumber}, ${assignments.title}, Deadline: ${assignments.deadline}</p>
    <p><strong>Body:</strong></p>
    <p>Dear Freelancer,</p>
    <p>Greetings from Team Bluepen.</p>
    <p>I am writing to provide you with the details of your assignment:</p>
    <p><strong>Title:</strong> ${assignments.title}</p>
    <p><strong>Deadline:</strong> ${assignments.deadline}</p>
    <p><strong>Budget:</strong> ₹${assignments.freelancerAmount}</p>
    <p><strong>Description:</strong> ${assignments.description}</p>
    <p><strong>Assignment Files:</strong></p>
    ${Array.isArray(assignments.files)
      ? assignments.files
          .map(
            (file: string, idx: number) => `
              <p>File ${idx + 1}: ${file}</p>
              <p><a href="${`${downloadUrl}/${file}`}" target="_blank">Download Link</a></p>`
          )
          .join("")
      : `<p>No Files Attached</p>`
    }
    <p><strong>Additional Requirements:</strong></p>
    <ul>
      <li>Word count - ${assignments.wordCount || "[Insert Word Count]"}</li>
      <li>Plagiarism - Less than 10% when checked with Turnitin.</li>
      <li>No AI-generated content.</li>
      <li>References - [Insert Reference Style]</li>
      <li>Style - [Insert Style]</li>
    </ul>
    <p>If you have any questions, please reach out.</p>
    <p>Best regards,</p>
    <p>Project Manager</p>`;
};

export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    window.navigator.userAgent
  );
};

export const openEmailClient = (content: string): void => {
  // Extract subject from the content
  const subjectMatch = content.match(/<p><strong>Subject:<\/strong><\/p>\s*<p>(.*?)<\/p>/);
  const subject = subjectMatch ? subjectMatch[1] : 'Assignment Details';
  
  // Extract body and convert HTML to plain text with line breaks
  const bodyMatch = content.match(/<p><strong>Body:<\/strong><\/p>([\s\S]*?)(?=<p><strong>Additional Requirements:<\/strong><\/p>)/);
  const body = bodyMatch ? bodyMatch[1] : content;
  
  // Convert HTML to plain text with proper line breaks
  const formattedBody = body
    .replace(/<p>/g, '')  // Remove opening p tags
    .replace(/<\/p>/g, '\n\n')  // Replace closing p tags with double line breaks
    .replace(/<strong>/g, '')  // Remove strong tags
    .replace(/<\/strong>/g, '')  // Remove closing strong tags
    .replace(/<a[^>]*>([^<]*)<\/a>/g, '$1')  // Replace links with their text
    .replace(/<ul>/g, '')  // Remove ul tags
    .replace(/<\/ul>/g, '')  // Remove closing ul tags
    .replace(/<li>/g, '• ')  // Replace li tags with bullet points
    .replace(/<\/li>/g, '\n')  // Add line break after each list item
    .replace(/&nbsp;/g, ' ')  // Replace non-breaking spaces
    .replace(/\n\s*\n/g, '\n\n')  // Remove extra line breaks
    .trim();
  
  // Create mailto link with formatted text
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(formattedBody)}`;
  
  // Open email client
  window.location.href = mailtoLink;
}; 