import React from "react";
import css from "@/styles/tipBox.module.scss";

interface tipBoxProps {
  title: string;
  subtitle: string;
  sutbtile2?: string;
  subtitle3?: string;
  align?: "row" | "column";
  style?: React.CSSProperties;
}

const tipBox: React.FC<tipBoxProps> = ({
  title,
  subtitle,
  sutbtile2,
  subtitle3,
  align,
  style,
}) => {
  return (
    <div className={`${css.tipsBox} ${align == "row" ? css.row : css.coloum}`}>
      <div className={css.tipsImgBox}>
        <div className={css.tipsImgs}>
          <img src="/assets/admin/tipsImg.svg" alt="" />
        </div>
        <div className={css.tipsHeader}>{title}</div>
      </div>
      <div
        className={`${css.tipsContent} ${
          align == "row" ? css.coloumn : css.row
        }`}
      >
        <div className={css.tips}>
          <div className={css.imgs}>
            <img src="/assets/admin/clock.svg" alt="" />
          </div>
          <div className={css.tipsMsg}>{subtitle}</div>
        </div>

        <div className={css.tips}>
          <div className={css.imgs}>
            <img src="/assets/admin/money.svg" alt="" />
          </div>
          <div className={css.tipsMsg}>
            {/* {`Maximize potential savings by adding more suppliers`} */}
            {sutbtile2}
          </div>
        </div>
        {subtitle3 && (
          <div className={css.tips}>
            <div className={css.imgs}>
              <img src="/assets/admin/money.svg" alt="" />
            </div>
            <div className={css.tipsMsg}>
              {/* {`Maximize potential savings by adding more suppliers`} */}
              {subtitle3}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default tipBox;
