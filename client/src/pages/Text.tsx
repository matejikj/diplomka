import React, { useEffect, useState, useRef } from "react";
import { IProps } from "../visualisation/types";
import { createGraph } from "../visualisation/Visualisation";
import Sidenav from "../components/Sidenav";

const Text: React.FC<{ id: string, ix: number, iy: number, title: string, parentSetPosition: Function }> = ({ id, ix, iy, title, parentSetPosition}) => {
    const [position, setPosition] = React.useState({
        active: false,
        offset: {}
    });

    useEffect(()=>{
        setPosition({active: position.active, offset: position.offset });
       },[]);

    const handlePointerDown = (e: any) => {
        const el = e.target;
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;
        el.setPointerCapture(e.pointerId);
        
        setPosition({
            ...position,
            active: true,
            offset: {
                x,
                y
            }
        });
    };
    const handlePointerMove = (e: any) => {
        const bbox = e.target.getBoundingClientRect();
        const x = e.clientX - bbox.left;
        const y = e.clientY - bbox.top;
        if (position.active) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            let a = ix - (position.offset.x - x)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            let b = iy - (position.offset.y - y)
            parentSetPosition(a, b, e.target.id)
        }
    };
    const handlePointerUp = (e: any) => {
        setPosition({
            ...position,
            active: false
        });
    };

    return (
        <text
            x={ix - id.length * 4}
            y={iy + 5}
            id={id}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerMove={handlePointerMove}
            fill={position.active ? "blue" : "red"}
        >{id}</text>
    );
};

export default Text;
