"use client"
import React, { ReactNode, SyntheticEvent, useEffect, useId, useLayoutEffect } from 'react'
import { ScrollTrigger } from '@/lib/customFunctions/animation';
interface props {
    startTrigger:number,
    endTrigger:number,
    unit:"percent" |"px",
    children: ReactNode,
    style?:React.CSSProperties,
    animation1?:{
        selector:string,
        animationClass:string
    }
}
export const ScrollHandler: React.FC<props> = ({ children ,endTrigger,startTrigger ,unit , style={},animation1={selector:"",animationClass:""}}) => {
    const id = useId()
    useLayoutEffect(() => {
        const refactoredId=id.replace(/:/g, '\\:')
        const removeLitsenser = ScrollTrigger(`#${refactoredId}`, {//This is here to replace the semicolon since it's not a valid syntax in the querySelection
            startTrigger: startTrigger,
            endTrigger: endTrigger,
            unit: unit,
            setPin:true,
            onStart:()=>{
                if(animation1.selector==""){return false}
                document.querySelector(animation1?.selector)?.classList.add(animation1.animationClass)
            }
        })
        return removeLitsenser;
    }, [])
    return (
        <div id={id} style={{width:"100%",...style}}>
            {children}
        </div>
    )
}
