import React from 'react';
import css from '@/styles/admin/freelancerDetails.module.scss';

interface ResumeWorkCardProps {
  freelancerDetails: any;
  fileURL: string;
}

const ResumeWorkCard: React.FC<ResumeWorkCardProps> = ({ freelancerDetails, fileURL }) => {
  const NotAvailable = () => {
    return <div className={css.notAvailable}>Not Available</div>;
  };

  const cleanResumeFileName = (resumeString: string) => {
    try {
      const parsed = JSON.parse(resumeString) as { [key: string]: string };
      return Object.values(parsed)[0] || "";
    } catch {
      return resumeString?.replace(/[{}"]/g, "")?.replace(/\\/g, "");
    }
  };

  const downloadFile = (folderName: string, fileName: string) => {
    const fileInstall = `${fileURL}/file/${folderName}/${fileName}`;
    const a = document.createElement("a");
    a.href = fileInstall;
    a.download = fileName;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className={css.resumeWorkBox}>
      <div className={css.boxTitle}>{`Resume & Work`}</div>
      <div className={css.subTitle}>
        {`Hello, I'm ${freelancerDetails?.personalDetails.first_name} ${freelancerDetails?.personalDetails.last_name}!! my qualifications is ${freelancerDetails?.professionalDetails.qualification}! & my working hours are ${freelancerDetails?.professionalDetails.working_hours}`}
      </div>
      <div className={css.contentBox}>
        <div className={css.detContainer}>
          <div className={css.contTitle}>{`Resume`}</div>
          {freelancerDetails?.professionalDetails.resume ? (
            <div className={css.fileBox}>
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  const folderName = "freelancers/resume";
                  const fileName = cleanResumeFileName(
                    freelancerDetails?.professionalDetails.resume || ""
                  );
                  if (fileName) {
                    downloadFile(folderName, fileName);
                  }
                }}
                className={css.fileCont}
              >
                <div className={css.resumeImg}>
                  <img
                    src="/assets/admin/freelancer/download.svg"
                    alt="Download Resume"
                  />
                </div>
                <div className={css.fileName}>
                  {cleanResumeFileName(
                    freelancerDetails?.professionalDetails.resume
                  )}
                </div>
              </div>
            </div>
          ) : (
            <NotAvailable />
          )}
        </div>

        {freelancerDetails?.professionalDetails.past_work_file &&
        freelancerDetails.professionalDetails.past_work_file.length > 0 ? (
          <div className={css.detContainer}>
            <div className={css.contTitle}>{`Previous Work Samples`}</div>
            {freelancerDetails.professionalDetails.past_work_file.map(
              (file: string, index: number) => (
                <div key={index} className={css.fileBox}>
                  <div
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const folderName = "freelancers/past_work_files";
                      const fileName = cleanResumeFileName(file);
                      if (fileName) {
                        downloadFile(folderName, fileName);
                      }
                    }}
                    className={css.fileCont}
                  >
                    <div className={css.resumeImg}>
                      <img
                        src="/assets/admin/freelancer/download.svg"
                        alt="Download Work File"
                      />
                    </div>
                    <div className={css.fileName}>
                      {cleanResumeFileName(file)}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          <div className={css.detContainer}>
            <div className={css.contTitle}>{`Previous Work Samples`}</div>
            <NotAvailable />
          </div>
        )}

        <div className={css.detContainer}>
          <div className={css.contTitle}>{`Work Links`}</div>
        </div>
      </div>

      <div className={css.iconBox}>
        <div className={css.absBox}>
          {freelancerDetails?.professionalDetails?.linkedin && (
            <div className={css.logoIcon}>
              <img
                onClick={() =>
                  window.open(freelancerDetails?.professionalDetails?.linkedin)
                }
                src="/assets/admin/freelancer/linkedin.svg"
                alt="linkedIn"
              />
            </div>
          )}
          {freelancerDetails?.professionalDetails?.work_links && (
            <div className={css.logoIcon}>
              <img
                onClick={() =>
                  window.open(freelancerDetails?.professionalDetails?.work_links)
                }
                src="/assets/admin/freelancer/otherLinks.svg"
                alt="link"
              />
            </div>
          )}
          {freelancerDetails?.personalDetails?.number && (
            <div className={css.logoIcon}>
              <img
                onClick={() =>
                  window.open(
                    `https://wa.me/${freelancerDetails?.personalDetails?.country_code}${
                      freelancerDetails?.personalDetails?.number
                    }?text=${encodeURIComponent(
                      `Hey ${freelancerDetails?.personalDetails?.first_name} ${freelancerDetails?.personalDetails?.last_name},\nGreetings from Bluepen.co.in. Thankyou for registering with us. I have gone through your profile when can we have a call about the same?\n\nRegards,\nRutuja Sapkal\nHR Bluepen`
                    )}`
                  )
                }
                src="/assets/admin/freelancer/whatsappFl.svg"
                alt="Whatsapp"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeWorkCard;
