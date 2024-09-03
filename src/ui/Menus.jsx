import { createContext, useCallback, useContext, useState } from "react";
import styled from "styled-components";
import { HiEllipsisVertical } from "react-icons/hi2";
import { createPortal } from "react-dom";
import useOutsideModalClose from "../hooks/useOutsideModalClose";

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
`;

const StyledToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-700);
  }
`;

const StyledList = styled.ul`
  position: absolute;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-lg);
  border-radius: var(--border-radius-md);
  top: 105%;
  right: -5%;
  z-index: 100;
  /* left: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px; */
`;

const StyledButton = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  padding: 1.2rem 2.4rem;
  font-size: 1.4rem;
  transition: all 0.2s;

  display: flex;
  align-items: center;
  gap: 1.6rem;

  white-space: nowrap;

  &:hover {
    background-color: var(--color-grey-50);
  }

  & svg {
    width: 1.6rem;
    height: 1.6rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }
`;

const MenusContext = createContext();

function Menus({ children }) {
  const [activeMenuId, setActiveMenuId] = useState(null);
  const [position, setPosition] = useState(null);

  const openMenu = setActiveMenuId;
  const closeMenu = useCallback(() => setActiveMenuId(null), [setActiveMenuId]);
  const isOpen = useCallback(
    (id) => id === activeMenuId,
    [setActiveMenuId, activeMenuId]
  );

  return (
    <MenusContext.Provider
      value={{ openMenu, closeMenu, isOpen, setPosition, position }}
    >
      {children}
    </MenusContext.Provider>
  );
}

function Toggle({ id }) {
  const { isOpen, openMenu, closeMenu, setPosition } = useContext(MenusContext);

  function handleClick(e) {
    const rect = e.target.closest("button").getBoundingClientRect();
    setPosition({ x: rect.x, y: rect.y + rect.height });
    isOpen(id) ? closeMenu() : openMenu(id);
  }

  return (
    <StyledToggle id="toggleBtn" onClick={handleClick}>
      <HiEllipsisVertical />
    </StyledToggle>
  );
}
function List({ id, children }) {
  const { isOpen, position, closeMenu } = useContext(MenusContext);
  /*
   *
   */
  function addCheckAgainstTuggleBtn(eventTarget) {
    return eventTarget, eventTarget.closest("#toggleBtn") === null;
  }

  const ref = useOutsideModalClose(closeMenu, addCheckAgainstTuggleBtn);
  if (!isOpen(id)) return null;
  return (
    <StyledList ref={ref} position={position}>
      {children}
    </StyledList>
  );
}
function Button({ icon, children, onClick, disabled }) {
  const { closeMenu } = useContext(MenusContext);
  function handleClick() {
    onClick?.();
    closeMenu();
  }

  return (
    <li>
      <StyledButton disabled={disabled} onClick={handleClick}>
        {icon} <p>{children}</p>
      </StyledButton>
    </li>
  );
}

Menus.Menu = StyledMenu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
