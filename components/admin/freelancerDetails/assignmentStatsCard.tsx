import React from 'react';
import css from "@/styles/admin/freelancerDetails.module.scss";
import Speedometer from "@/components/speedometer/speedometer";
import SkeletonLoader from "@/ui/loader/skeletonLoader";

interface AssignmentStats {
    totalAssignments: number;
    average_marks_out_of_100: number;
    marksResultFinal: {
        performance: string;
        total_marks_obtained: number;
        total_marks_out_of: number;
        total_marks_out_of_100: number;
        marksReceivedAssignments: number;
        average_marks_out_of_100: number;
    };
}

interface AssignmentStatsCardProps {
  assignmentStats: any;
  loading: boolean;
}

const AssignmentStatsCard: React.FC<AssignmentStatsCardProps> = ({ assignmentStats, loading }) => {
  if (loading || !assignmentStats) return <SkeletonLoader />;

  return (
    <>
      <div className={`${css.betweenTitile}`}>{`Assignment Stats`}</div>
      <div className={css.totalCounterMarksContainer}>
        <div className={css.cardCont}>
          <div className={css.card}>
            <div className={css.cardTitle}>Total Assignments</div>
            <div className={css.cardValue}>
              {assignmentStats?.totalAssignments}
            </div>
          </div>
          <div className={css.card}>
            <div className={css.cardTitle}>Total Marks</div>
            <div className={css.cardValue}>
              {assignmentStats?.marksResultFinal?.total_marks_obtained}
            </div>
          </div>
        </div>

        <div className={`${css.marksDistribution}`}>
          <div className={`${css.head}`}>
            <div className={`${css.title}`}>Marks Distribution</div>
          </div>
          <div className={`${css.content}`}>
            <div className={`${css.speedometerWrapper}`}>
              <Speedometer
                averageMarks={
                  assignmentStats?.marksResultFinal?.average_marks_out_of_100
                    ? Math.round(assignmentStats?.marksResultFinal?.average_marks_out_of_100)
                    : 0
                }
              />
            </div>
            <div className={`${css.line}`}></div>
            <div className={`${css.details}`}>
                          <div className={css.detailCont}>
                              <div className={`${css.detailBox}`}>
                                  <div className={`${css.labelDetail}`}>
                                  Marks Received Assignments
                                  </div>
                                  <div className={`${css.category}`}>
                                      {
                                          assignmentStats?.marksResultFinal
                                              ?.marksReceivedAssignments
                                      }
                                  </div>
                              </div>
                              <div className={`${css.detailBox}`}>
                                  <div className={`${css.labelDetail}`}>Category</div>
                                  <div className={`${css.category}`}>
                                      {assignmentStats?.marksResultFinal
                                          ?.marksReceivedAssignments === 0
                                          ? "-"
                                          : assignmentStats?.marksResultFinal?.performance ||
                                          "-"}
                                  </div>
                              </div>
                          </div>

                          <div className={css.detailCont}>
                              <div className={`${css.detailBox}`}>
                                  <div className={`${css.labelDetail}`}>Completed but marks not received</div>
                                  <div className={`${css.averageMarks}`}>
                                      {Math.round(
                                          assignmentStats?.completedAssignments
                                      )}
                                  </div>
                              </div>

                              <div className={`${css.detailBox}`}>
                                  <div className={`${css.labelDetail}`}>
                                      Total Marks Obtained
                                  </div>
                                  <div className={`${css.totalMarks}`}>
                                      <div className={`${css.numerator}`}>
                                          {
                                              assignmentStats?.marksResultFinal
                                                  ?.total_marks_obtained
                                          }
                                      </div>
                                      <div className={`${css.denominator}`}>
                                          {`/` +
                                              assignmentStats?.marksResultFinal
                                                  ?.total_marks_out_of}
                                      </div>
                                  </div>
                              </div>
                          </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignmentStatsCard;
