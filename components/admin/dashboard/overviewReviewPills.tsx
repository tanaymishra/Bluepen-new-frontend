"use client";
import React, { useState } from "react";
import css from "../../../styles/admin/dashboard.module.scss";
import Pills from "@/components/ui/radix-pills";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProgressStatsProps {
  dashboard: any;
}

const OverviewReviewPills: React.FC<ProgressStatsProps> = ({ dashboard }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { label: "Assignment Overview" },
    { label: "Freelancer Overview" },
    { label: "Student Overview" },
  ];

  const won =
    dashboard?.assignmentData?.underProcess +
    dashboard?.assignmentData?.reviewReceived +
    dashboard?.assignmentData?.assignedToPM +
    dashboard?.assignmentData?.assignedToFreelancer +
    dashboard?.assignmentData?.completedMarksNotReceived +
    dashboard?.assignmentData?.completed;

  const total = dashboard?.assignmentData?.assignmentsCount;

  const winPercentage = total ? (won / total) * 100 : 0;
  const lostPercentage = total
    ? ((dashboard?.assignmentData?.lost + dashboard?.assignmentData?.resit) /
      total) *
    100
    : 0;

  const hirePercentage =
    (dashboard?.freelancerData?.isApproved /
      (dashboard?.freelancerData?.isApproved +
        dashboard?.freelancerData?.rejected)) *
    100;

  const rejectPercentage =
    (dashboard?.freelancerData?.rejected /
      (dashboard?.freelancerData?.isApproved +
        dashboard?.freelancerData?.rejected)) *
    100;

  return (
    <div className={`${css.progressStats}`}>
      <div className={css.pillsCont}>
        <Pills
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          tabsStyle={{
            backgroundColor: `transparent`,
            gap: `2rem`,
            border: `none`,
            boxShadow: `none`,
          }}
          indicatorStyle={{
            background: `var(--primary)`,
            color: `#FFFFFF`,
            borderRadius: `32px`,
          }}
          tabStyle={(tabIndex: number) => ({
            color: activeTab === tabIndex ? `#FFFFFF` : `var(--primary)`,
            border: `1px solid var(--primary)`,
            borderRadius: `32px`,
          })}
          noComponent={false}
        />
      </div>

      <div className={`${css.head}`}>
        <div
          className={`${css.text} ${activeTab !== 0 ? css.assignProgress : ""}`}
        >
          <div className={`${css.count}`}>
            {parseFloat(winPercentage.toFixed(0))}%{" "}
          </div>
          <div className={`${css.countDetails}`}>{` win to loose ratio`}</div>
        </div>

        <div
          className={`${css.text} ${activeTab !== 1 ? css.assignProgress : ""}`}
        >
          <div className={`${css.count}`}>
            {parseFloat(hirePercentage.toFixed(0))}%{" "}
          </div>
          <div
            className={`${css.countDetails}`}
          >{` hire to rejected ratio`}</div>
        </div>

        <div
          className={`${css.progressBarContainer} ${activeTab !== 0 ? css.assignProgress : ""
            }`}
        >
          <div
            className={`${css.progressSegmentWrapper} ${css.won}`}
            style={{
              width: `${winPercentage}%`,
            }}
          >
            <div className={`${css.progressSegment}`}></div>
            <div className={`${css.percentage}`}>{`won`}</div>
          </div>
          <div
            className={`${css.progressSegmentWrapper} ${css.lost}`}
            style={{
              width: lostPercentage === 0 ? `1%` : `${lostPercentage}%`,
            }}
          >
            <div className={`${css.progressSegmentLoss}`}></div>
            <div className={`${css.percentageLoss}`}>{`lost`}</div>
          </div>
        </div>

        <div
          className={`${css.progressBarContainer} ${activeTab !== 1 ? css.assignProgress : ""
            }`}
        >
          <div
            className={`${css.progressSegmentWrapper} ${css.won}`}
            style={{
              width: `${hirePercentage}%`,
            }}
          >
            <div className={`${css.progressSegment}`}></div>
            <div className={`${css.percentage}`}>{`approved`}</div>
          </div>
          <div
            className={`${css.progressSegmentWrapper} ${css.lost}`}
            style={{
              width: rejectPercentage === 0 ? `1%` : `${rejectPercentage}%`,
            }}
          >
            <div className={`${css.progressSegmentLoss}`}></div>
            <div className={`${css.percentageLoss}`}>{`rejected`}</div>
          </div>
        </div>
      </div>

      {/* Assignment Overview */}
      <div
        className={`${css.overview} ${activeTab !== 0 ? css.hideOverview : ""}`}
      >
        <div
          className={css.singleTab}
          onClick={() => {
            router.push("/admin/assignments");
          }}
        >
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/total.svg"
              alt="Total"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.assignmentData?.assignmentsCount}
            </div>
            <div className={css.tabTitle}>{`Total Assignments`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/underProcess.svg"
              alt="underProcess"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.assignmentData?.underProcess}
            </div>
            <div className={css.tabTitle}>{`Under Process`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/reviewed.svg"
              alt="Total"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.assignmentData?.reviewReceived}
            </div>
            <div className={css.tabTitle}>{`Reviewed`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/assignedToPm.svg"
              alt="assignedToPm"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.assignmentData?.assignedToPM}
            </div>
            <div className={css.tabTitle}>{`Assigned to PM`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/assignedToFreelancer.svg"
              alt="assignedToFreelancer"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.assignmentData?.assignedToFreelancer}
            </div>
            <div className={css.tabTitle}>{`with Freelancers`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/marks.svg"
              alt="marks"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.assignmentData?.completedMarksNotReceived}
            </div>
            <div className={css.tabTitle}>{`Marks Not Received`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/completed.svg"
              alt="completed"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.assignmentData?.completed}
            </div>
            <div className={css.tabTitle}>{`Completed`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/lost.svg"
              alt="lost"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>{dashboard?.assignmentData?.lost}</div>
            <div className={css.tabTitle}>{`Lost`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/lost.svg"
              alt="Resit"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>{dashboard?.assignmentData?.resit}</div>
            <div className={css.tabTitle}>{`Resit`}</div>
          </div>
        </div>
      </div>

      {/* Freelancer Overview */}
      <div
        className={`${css.overview} ${activeTab !== 1 ? css.hideOverview : ""}`}
      >
        <div
          className={css.singleTab}
          onClick={() => {
            router.push("/admin/freelancers");
          }}
        >
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/freelancerOverview/total.svg"
              alt="Total"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.freelancerData?.freelancersCount}
            </div>
            <div className={css.tabTitle}>{`Total Freelaners`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/freelancerOverview/formFilled.svg"
              alt="formFilled"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.freelancerData?.formFilled}
            </div>
            <div className={css.tabTitle}>{`Form Filled`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/freelancerOverview/interview.svg"
              alt="interview"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.freelancerData?.isApproved}
            </div>
            <div className={css.tabTitle}>{`Approved`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/freelancerOverview/agreement.svg"
              alt="agreementSent"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.freelancerData?.agreementReceived}
            </div>
            <div className={css.tabTitle}>{`Agreement Received`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/freelancerOverview/agreementReceived.svg"
              alt="agreementReceived"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.freelancerData?.agreementSent}
            </div>
            <div className={css.tabTitle}>{`Agreement Sent`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/freelancerOverview/approved.svg"
              alt="approved"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {" "}
              {dashboard?.freelancerData?.interviewConducted}
            </div>
            <div className={css.tabTitle}>{`Interview Conducted`}</div>
          </div>
        </div>

        <div className={css.singleTab}>
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/freelancerOverview/rejected.svg"
              alt="rejected"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.freelancerData?.rejected}
            </div>
            <div className={css.tabTitle}>{`Rejected`}</div>
          </div>
        </div>
      </div>

      {/* Student Overview */}
      <div
        className={`${css.overview} ${activeTab !== 2 ? css.hideOverview : ""}`}
      >
        <div
          className={css.singleTab}
          onClick={() => {
            router.push("/admin/students");
          }}
        >
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/total.svg"
              alt="Total"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.studentsCount?.allStudentsCount}
            </div>
            <div className={css.tabTitle}>{`Total Students`}</div>
          </div>
        </div>

        <div
          className={css.singleTab}
          onClick={() => {
            router.push("/admin/students");
          }}
        >
          <div className={css.tabImg}>
            <Image
              src="/assets/admin/dashboard/assignmentOverview/assignedToPm.svg"
              alt="Total"
              width={24}
              height={24}
            />
          </div>
          <div className={css.tabDet}>
            <div className={css.numTab}>
              {dashboard?.studentsCount?.selectStudentsCount}
            </div>
            <div className={css.tabTitle}>{`Select Students`}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewReviewPills;
