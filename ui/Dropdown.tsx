import React, { useState, useEffect, useRef } from "react";
import css from "../styles/dropdown.module.scss";
import Link from "next/link";

interface Props {
  onChangeFunc?: any;
  value?: string;
  options: Array<{ name: string; imgSrc: string; link?:string }>;
  //   options: Array<{ name: string }>;
  title?: string;
  style?: any;
  className?: string;
}

const DropDown: React.FC<Props> = ({
  onChangeFunc,
  value,
  options,
  style = {},
  title,
}) => {
  const [showDown, setDown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      style={style}
      className={`${css.contain} ${showDown ? css.open : ""}`}
      onClick={() => setDown((prev) => !prev)}
    >
      <div className={css.content}>
        <span className={css.title}>{title}</span>
        <img
          src="/assets/navbar/arrow-down-sign-to-navigate.webp"
          className={css.downArrow}
          alt="dropdown arrow"
        />
      </div>
      <div className={css.dropDown}
       style={{display: "flex", gap: "1.5rem", padding: "0 1.5rem"}}
       onClick={(e) => e.stopPropagation()}>
        {options.map((item, index) => (
          <Link
            href={item.link ? item.link : "/"}
            target="_blank"
            key={index}
            className={css.dropdownItem}
            // onClick={(e) => {
            //   e.stopPropagation();
            //   onChangeFunc(item.name);
            //   setDown(false);
            // }}
          >
            <img
              src={item.imgSrc}
              alt={`${item.name} icon`}
              className={`${css.dropdownImage} ${
                index === 0 ? css.bluepenCircle : ""
              } ${index === 1 ? css.writeyfyCircle : ""} ${
                index === 2 ? css.greenguideCircle : ""
              }`}
            />
            <span className={`${css.itemName} spartan-400`}>{item.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DropDown;
