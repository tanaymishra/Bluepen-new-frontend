

"use client";
import React, {
  Dispatch,
  ReactNode,
  SetStateAction,
  useId,
  useState,
  useEffect,
  useRef,
} from "react";
// import css from "@/css/writeyfyUiComponents/dragcomp.module.scss";
import Link from "next/link";
interface props {
  children: ReactNode;
  style?: any;
  className?: string;
  href?:string
  defaultTranslateX?:number
}

function handleDrag(
  e: any,
  isClicked: boolean,
  startedAt: number,
  setXtranslatePercentage: any,
  initialTranslate: number
) {
  if (isClicked) {
    const clientX = e.touches ? e.touches[0].clientX : e.pageX;
    setXtranslatePercentage(initialTranslate + (startedAt - clientX));
  }
}

function handleMouseDown(
  e: any,
  setClick: Dispatch<SetStateAction<boolean>>,
  setStarted: Dispatch<SetStateAction<number>>,
  setInitialTranslate: Dispatch<SetStateAction<number>>,
  xTranslate: number
) {
  const clientX = e.touches ? e.touches[0].clientX : e.pageX;
  setClick(true);
  setStarted(clientX);
  setInitialTranslate(xTranslate); // Save initial translate value
}

function handleMouseUp(
  setClick: Dispatch<SetStateAction<boolean>>,
  xTranslate: number,
  setXtranslatePercentage: Dispatch<SetStateAction<number>>,
  containerWidth: number,
  contentWidth: number
) {
  setClick(false);
  if (contentWidth <= containerWidth) {
    setXtranslatePercentage(0); // Snap back if content fits in the container
  } else if (xTranslate < 0) {
    setXtranslatePercentage(0); // Snap back to start if dragged beyond the left edge
  } else if (xTranslate > contentWidth - containerWidth) {
    setXtranslatePercentage(contentWidth - containerWidth); // Snap back to end if dragged beyond the right edge
  }
}

const DragComponent: React.FC<props> = ({ children, style, className , defaultTranslateX=0}) => {
  let [xTranslate, setXtranslate] = useState<number>(0);
  let [isTrue, setClicked] = useState(false);
  let [started, setStarted] = useState<number>(0);
  let [initialTranslate, setInitialTranslate] = useState<number>(0);
  const id = useId();
  const id2 = useId();

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      const container = document.getElementById(id2);
      const content = document.getElementById(id);
      if (container && content) {
        handleMouseUp(
          setClicked,
          xTranslate,
          setXtranslate,
          container.clientWidth,
          content.scrollWidth
        );
      }
    };

    document.addEventListener("mouseup", handleMouseUpGlobal);
    document.addEventListener("touchend", handleMouseUpGlobal);
    return () => {
      document.removeEventListener("mouseup", handleMouseUpGlobal);
      document.removeEventListener("touchend", handleMouseUpGlobal);
    };
  }, [xTranslate]);

  useEffect(() => {
    const overflowControl:any = document.getElementById(id);
    const overflowWrapperWidth = document.getElementById(id2)?.clientWidth;
    let pillSize=overflowControl?.children[0]?.clientWidth
    if (overflowControl && overflowWrapperWidth) {
      const overflowControlWidth = overflowControl.clientWidth;
      if (overflowControlWidth > overflowWrapperWidth) {
        setXtranslate((defaultTranslateX) * pillSize)
      }
    }
  }, [id, id2]);


  return (
    <div
      style={style}
      onMouseDown={e => {
        handleMouseDown(e, setClicked, setStarted, setInitialTranslate, xTranslate);
      }}
      onTouchStart={e => {
        handleMouseDown(e, setClicked, setStarted, setInitialTranslate, xTranslate);
      }}
      onMouseMove={e => {
        handleDrag(e, isTrue, started, setXtranslate, initialTranslate);
      }}
      onTouchMove={e => {
        handleDrag(e, isTrue, started, setXtranslate, initialTranslate);
      }}
    //   className={`${css.DragComponentWrapper} ${className ? className : ""}`}
      id={id2}
    >
      <div
        // className={css.overflowControl}
        id={id}
        style={{
          transform: `translateX(${-xTranslate}px)`,
          display: "flex"
        }}
      >
        {children}
      </div>
    </div>
  );
};



export default DragComponent;