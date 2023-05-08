import React, { useEffect, useState, useRef, useContext } from "react";
import { SessionContext } from "../sessionContext";
import { Node } from '../models/types/Node'
import { ContextMenuItem } from "../models/types/ContextMenuItem";
import { ContextMenuType } from "../models/types/ContextMenuType";

const ContextMenu: React.FC<{ menu: ContextMenuType }> = ({ menu }) => {

  const handleContextMenu = (e: any) => {
    menu.items[0].action()
    console.log(e)
  }

  return (
    <g>
      {menu.items.map((item, index) => {
        return (
          <rect fill="orange" onClick={handleContextMenu} height={30} id={index.toString()} width={120} key={index} visibility={menu.visible} x={menu.posX} y={menu.posY + index * 30}  ></rect>
        )
      })}
      {menu.items.map((item, index) => {
        return (
          <text key={index} id={index.toString()} onClick={handleContextMenu} visibility={menu.visible} x={menu.posX} y={menu.posY + index * 30 + 20}  >{item.title}</text>
        )
      })}
    </g>
  );
};

export default ContextMenu;