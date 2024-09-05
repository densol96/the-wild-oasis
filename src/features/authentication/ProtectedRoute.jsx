import styled from "styled-components";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useUser from "./useUser";
import Spinner from "../../ui/Spinner";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useUser();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) navigate("/login");
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || !isAuthenticated)
    return (
      <FullPage>
        <Spinner />
      </FullPage>
    );
  if (isAuthenticated) return <div>{children}</div>;
}

export default ProtectedRoute;
