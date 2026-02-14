import React from 'react';
import css from '@/styles/admin/freelancerDetails.module.scss';

interface ProfessionalDetailsCardProps {
  freelancerDetails: any;
}

const NotAvailable = () => {
  return <div className={css.notAvailable}>Not Available</div>;
};

const ProfessionalDetailsCard: React.FC<ProfessionalDetailsCardProps> = ({
  freelancerDetails,
}) => {
  return (
    <div className={css.freelancingDetails}>
      <div className={css.titleBox}>{`Freelancing Details`}</div>
      <div className={css.freelancerDet}>
        <div className={css.categoryBox}>
          <div className={css.categoryTitle}>{`Domains`}</div>
          <div className={css.categoryContainer}>
            {freelancerDetails?.professionalDetails?.domains ? (
              freelancerDetails?.professionalDetails?.domains?.map(
                (el: string) => {
                  return (
                    <div key={el} className={css.domains}>
                      {el}
                    </div>
                  );
                }
              )
            ) : (
              <NotAvailable />
            )}
          </div>
        </div>

        <div className={css.categoryBox}>
          <div className={css.categoryTitle}>{`Subject Tags`}</div>
          <div className={css.categoryContainer}>
            {freelancerDetails?.professionalDetails?.subject_tags ? (
              freelancerDetails?.professionalDetails?.subject_tags.map(
                (el: string) => {
                  return (
                    <div key={el} className={css.subTags}>
                      {el}
                    </div>
                  );
                }
              )
            ) : (
              <NotAvailable />
            )}
          </div>
        </div>

        <div className={css.categoryBox}>
          <div className={css.categoryTitle}>{`Assignment Types`}</div>
          <div className={css.categoryContainer}>
            {freelancerDetails?.professionalDetails?.assignment_type ? (
              freelancerDetails?.professionalDetails?.assignment_type.map(
                (el: string) => {
                  return (
                    <div key={el} className={css.assTypes}>
                      {el}
                    </div>
                  );
                }
              )
            ) : (
              <NotAvailable />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDetailsCard;
