import { createContext, useCallback, useContext, useState } from "react";
import styled from "styled-components";

const StyledMenu = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
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
  position: fixed;

  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-md);
  border-radius: var(--border-radius-md);

  right: ${(props) => props.position.x}px;
  top: ${(props) => props.position.y}px;
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
  const openMenu = useCallback((id) => setActiveMenuId(id), [setActiveMenuId]);
  const closeMenu = useCallback(() => setActiveMenuId(null), [setActiveMenuId]);
  const isOpen = useCallback(
    (id) => id === activeMenuId,
    [setActiveMenuId, activeMenuId]
  );

  return (
    <MenusContext.Provider value={{ openMenu, closeMenu, isOpen }}>
      {children}
    </MenusContext.Provider>
  );
}

function Menu({ children }) {
  return <div>{children}</div>;
}
function Toggle({ id }) {
  const { isOpen, openMenu, closeMenu } = useContext(MenusContext);
  const isClosed = !isOpen(id);
  return (
    <button onClick={() => (isClosed ? openMenu(id) : closeMenu())}>
      {isClosed ? "OPEN" : "CLOSE"}
    </button>
  );
}
function List({ id, children }) {
  const { isOpen } = useContext(MenusContext);
  if (!isOpen(id)) return null;
  return <div>{children}</div>;
}
function Button({ children }) {
  return <button>{children}</button>;
}

Menus.Menu = Menu;
Menus.Toggle = Toggle;
Menus.List = List;
Menus.Button = Button;

export default Menus;
