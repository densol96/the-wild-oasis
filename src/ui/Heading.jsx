import styled, { css } from "styled-components";

const headingStyles = (fontSize, fontWeight) => {
  return `
    font-size: ${headingStyles}rem;
    font-weight: ${fontWeight};
  `;
};

const Heading = styled.h1`
  ${(props) => props.as === "h1" && headingStyles(3, 600)}
  ${(props) => props.as === "h2" && headingStyles(2, 600)}
  ${(props) => props.as === "h3" && headingStyles(2, 500)}
`;

export default Heading;
