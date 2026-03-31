import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFacebookF,
  faLinkedinIn,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUp,
  faBars,
  faChevronDown,
  faClock,
  faEnvelope,
  faLocationDot,
  faPhone,
  faS,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import { lgDown, mdDown, mdUp } from "../utils/responsive";
import { gsap } from "gsap";

library.add(
  faLocationDot,
  faS,
  faClock,
  faEnvelope,
  faPhone,
  faChevronDown,
  faBars,
  faArrowUp
);

const Container = styled.div`
  opacity: 0;
  padding: 0 48px;
  position: fixed;
  top: 0;
  transform: translateY(
    ${({ isSticky, isDesktop }) => (isSticky && isDesktop ? -45 : 0)}px
  );
  left: 0;
  right: 0;
  z-index: 4;
  transition: all 100ms ease;
  background-color: ${({ isSticky, theme }) =>
    isSticky ? theme.palette.common.white : "transparent"};
  box-shadow: ${({ isSticky, theme }) => (isSticky ? theme.boxShadow : "none")};
  ${mdDown({
    padding: "0 12px",
  })}
`;

const Top = styled.div`
  width: 100%;
  height: 45px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mdDown({
    display: "none",
  })}
`;

const Column = styled.div`
  & > small:last-child {
    margin-left: 24px;
  }
`;

const Small = styled.small`
  color: ${({ theme }) => theme.palette.common.black};
  font-size: 14px;
  font-family: "Open Sans", "sans-serif";
`;

const StyledIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.palette.primary.main};
  margin-right: 8px;
`;

const Bottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  padding: 8px 0;
`;

const LogoContainer = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 0;
`;

const Logo = styled.h1`
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 3rem;
  cursor: pointer;
  ${lgDown({
    fontSize: "calc(1.425rem + 2.1vw)",
  })}
`;

const Right = styled.div`
  display: flex;
  transition: max-height 350ms ease;
  ${({ toggle, theme }) =>
    toggle === true
      ? `
  @media only screen and (max-width:992px) {
    display: flex;
    max-height: 447px;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    overflow: hidden;
    background-color: ${theme.palette.background.paper};
    border-top: 1px solid ${theme.palette.grey[300]};
  }
  `
      : `
  @media only screen and (max-width:992px) {
    display: flex;
    max-height: 0;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    overflow: hidden;
    background-color: ${theme.palette.background.paper};
    border-top: none;
  }
  `}
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  ${({ theme }) =>
    mdDown({
      flexDirection: "column",
      width: "100%",
      padding: `calc(${theme.containerPaddingX}px /2)`,
    })}
`;

const NavItem = styled(NavLink)`
  text-decoration: none;
  &.active {
    color: ${({ theme }) => theme.palette.primary.main};
  }
  color: ${({ theme }) => theme.palette.common.black};
  font-weight: 500;
  padding: 25px 15px;
  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
  }
  ${mdDown({
    width: "100%",
    padding: "10px 0",
  })}
`;

const NavItemIcon = styled(FontAwesomeIcon)`
  margin-left: 10px;
  font-size: 10px;
  vertical-align: inherit;
`;

const DropDownContainer = styled.span`
  color: ${({ theme, isactive }) =>
    isactive === "true"
      ? theme.palette.primary.main
      : theme.palette.common.black};
  font-weight: 500;
  padding: 25px 15px;
  font-size: 1rem;
  font-family: "Open Sans", "sans-serif";
  position: relative;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.palette.primary.main};
    & > svg {
      color: ${({ theme }) => theme.palette.primary.main};
    }
  }
  ${({ toggle }) =>
    mdDown({
      width: "100%",
      padding: "10px 0",
      [`& > div:last-of-type`]: {
        display: toggle ? "block" : "none",
      },
    })}
`;

const NavDropDown = styled.div`
  opacity: 0;
  position: absolute;
  top: 72px;
  left: 0;
  min-width: 160px;
  background-color: ${({ theme }) => theme.palette.common.white};
  padding: 8px 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid ${({ theme }) => theme.borderColor};
  transition: all 500ms ease;
  transform-origin: 0% 0%;
  transform: rotateX(-75deg);
  ${mdDown({
    position: "initial",
    transform: "rotateX(0deg)",
    marginTop: 10,
    opacity: 1,
  })}
`;

const NavDropDownItem = styled(NavLink)`
  width: 100%;
  display: block;
  &.active {
    color: ${({ theme }) => theme.palette.common.white};
    background-color: ${({ theme }) => theme.palette.primary.main};
  }
  color: ${({ theme }) => theme.palette.grey[900]};
  padding: 4px 16px;
  font-weight: 400;
  line-height: 1.5;
  background-color: transparent;
  &:hover {
    &.active {
      background-color: ${({ theme }) => theme.palette.primary.main};
    }
    background-color: ${({ theme }) => theme.palette.grey[100]};
  }
`;

const MediaContainer = styled.div`
  display: flex;
  align-items: center;
  ${mdDown({
    display: "none",
  })}
`;

export const DefaultMediaIconContainer = styled(Link)`
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MediaIconContainer = styled(DefaultMediaIconContainer)`
  background-color: ${({ theme }) => theme.palette.primary.light};
  margin-left: 16px;
  height: 32px;
  width: 32px;
`;

export const MediaIcon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.palette.primary.main};
`;

const BarsContainer = styled.button`
  display: none;
  padding: 4px 12px;
  background-color: transparent;
  border-width: 1px;
  border-color: ${({ theme }) => theme.palette.grey[300]};
  color: ${({ theme }) => theme.palette.grey[500]};
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: box-shadow 150ms ease-in-out;
  outline: 0;
  &:focus {
    box-shadow: 0 0 0 0.25rem;
  }
  ${mdDown({
    display: "initial",
  })}
`;

const Bars = styled(FontAwesomeIcon)`
  font-size: 2rem;
  color: ${({ theme }) => theme.palette.grey[500]};
`;

const ScrollTopBtnAnimation = keyframes`
  0% {
    opacity: 0;
    display: none;
  }
  25% {
    opacity: 0.12;
  }
  50% {
    opacity: 0.25;
  }
  70% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    display: block;
  }
`;

const ScrollTopBtn = styled.button`
  width: 48px;
  height: 48px;
  background-color: ${({ theme }) => theme.palette.primary.main};
  border: 1px solid ${({ theme }) => theme.palette.primary.main};
  opacity: ${({ display }) => (display === "true" ? 1 : 0)};
  display: ${({ display }) => (display === "true" ? "block" : "none")};
  border-radius: 50%;
  position: fixed;
  bottom: 30px;
  right: 30px;
  padding: 0;
  cursor: pointer;
  animation: ${ScrollTopBtnAnimation} 1500ms;
  animation-direction: alternate;
  animation-fill-mode: forwards;
  z-index: 4;
  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.darker};
  }
  &:focus {
    box-shadow: 0 0 0 0.25rem ${({ theme }) => theme.palette.primary.light}20;
  }
`;

const Icon = styled(FontAwesomeIcon)`
  color: ${({ theme }) => theme.palette.common.white};
  font-size: 1.5rem;
`;

export const hrefBaseUrl = (path) => `/finpocket/${path}`;

const Header = () => {
  const { pathname } = useLocation();
  const [isPagesActive, setIsPagesActive] = useState(false);
  const [navToggle, setNavToggle] = useState(false);
  const [dropDownToggle, setDropDownToggle] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [displayScrollTop, setDisplayScrollTop] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerWidth > 992) setIsDesktop(true);
      else setIsDesktop(false);
      if (window.scrollY > 300) {
        setDisplayScrollTop(true);
      } else {
        setDisplayScrollTop(false);
      }
      if (window.scrollY > 45) {
        setIsSticky(true);
      } else setIsSticky(false);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Header Dropdown isActive setter
  useEffect(() => {
    if (
      ["/project", "/feature", "/team", "/testimonial", "/notFound"].includes(
        pathname
      )
    )
      setIsPagesActive(true);
    else setIsPagesActive(false);
  }, [pathname]);

  const handleToggleNav = () => {
    setNavToggle(!navToggle);
    setDropDownToggle(false);
  };

  const handleToggleDropDown = () => {
    setDropDownToggle(!dropDownToggle);
  };

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  };

  // gsap fade-in on header bottom part
  const containerEl = useRef(null);
  useLayoutEffect(() => {
    const headerTween = gsap.to(containerEl.current, {
      opacity: 1,
      duration: 1,
      scrollTrigger: {
        trigger: containerEl.current,
      },
    });

    return () => {
      headerTween.scrollTrigger?.kill();
    };
  }, []);

  return (
    <>
      <Container ref={containerEl} isSticky={isSticky} isDesktop={isDesktop}>
        <Bottom>
          <LogoContainer to="">
            <Logo>Finpocket</Logo>
          </LogoContainer>
          <Right toggle={navToggle}>
            <Nav>
              <NavItem to="/">Home</NavItem>
              <NavItem to="/dashboard">Dashboard</NavItem>
              <NavItem as="a" href="https://expense1tracker.streamlit.app/" target="_blank" rel="noopener noreferrer">Expense Tracker</NavItem>
              <NavItem to="/fire">FIRE</NavItem>
              <NavItem to="/education">Education</NavItem>
              <NavItem as="a" href="/chatindex.html">Chat with AI</NavItem>
            </Nav>
          </Right>
          <BarsContainer onClick={handleToggleNav}>
            <Bars icon={["fas", "bars"]} />
          </BarsContainer>
        </Bottom>
      </Container>
      <ScrollTopBtn display={`${displayScrollTop}`} onClick={handleScrollTop}>
        <Icon icon={["fas", "arrow-up"]} />
      </ScrollTopBtn>
    </>
  );
};

export default Header;
