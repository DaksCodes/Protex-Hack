import React, { useLayoutEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { WrapperContainer, imgbaseUrl } from "./SliderItem";
import { ParagraphWithLightBorder, TitleH4 } from "./About";
import { TitleWithBigMargin } from "./Services";
import { DefaultMediaIconContainer, MediaIcon } from "./Header";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { lgDown, mdDown, smDown, xlDown } from "../utils/responsive";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const Container = styled(WrapperContainer)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 48px;
  padding-bottom: 48px;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 24px;
`;

const CardWrapper = styled.div`
  flex: 1;
  max-width: 350px;
  margin: 0 auto;
  padding: 0 12px;
  padding-top: 24px;
`;

const Card = styled.div`
  padding: 64px 0;
  width: 100%;
  position: relative;
  &:hover {
    & > div {
      background-color: ${({ theme }) => theme.palette.primary.main};
    }
    & h4 {
      color: ${({ theme }) => theme.palette.common.white};
    }
  }
`;

const CardImgBg = styled.div`
  position: absolute;
  left: 48px;
  right: 48px;
  top: 0;
  bottom: 0;
  border: 1px solid ${({ theme }) => theme.palette.primary.light};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background-color 300ms linear;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  z-index: 1;
`;

const MediaContainer = styled.div`
  display: flex;
  position: relative;
`;

const StyledMediaIconContainer = styled(DefaultMediaIconContainer)`
  background-color: ${({ theme }) => theme.palette.primary.light};
  transition: background-color 300ms linear;
  width: 38px;
  height: 38px;
  margin: 0 4px;
  cursor: pointer;
  & svg {
    transition: color 300ms linear;
  }
  &:hover {
    background-color: ${({ theme }) => theme.palette.primary.main};
    & svg {
      color: ${({ theme }) => theme.palette.primary.light};
    }
  }
`;

const CardImg = styled.img`
  width: 100%;
  height: 380px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius};
`;

const Team = () => {
  const cardItem = useMemo(
    () => [
      {
        name: "Dakshita Agrawal ",
        img: 1,
      },
      {
        name: "Sneha Yadav",
        img: 2,
      },
      {
        name: "Anushree Agrawal",
        img: 3,
      },
    ],
    []
  );

  // Top and Cards scroll trigger animation
  const containerEl = useRef(null);
  const topEl = useRef(null);
  const cardWrapperEls = useRef([]);

  const addToCardwrapperRefs = (el) => {
    if (el && !cardWrapperEls.current.includes(el))
      cardWrapperEls.current.push(el);
  };

  useLayoutEffect(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerEl.current,
        start: "top center",
      },
    });
    tl.from(topEl.current, {
      opacity: 0,
      y: "100%",
    }).from(cardWrapperEls.current, {
      opacity: 0,
      y: "100%",
      stagger: 0.2,
    });

    return () => {
      tl.scrollTrigger?.kill();
    };
  }, []);

  const handleLoad = () => {
    ScrollTrigger.refresh();
  };

  return (
    <Container ref={containerEl}>
      <Top ref={topEl}>
        <ParagraphWithLightBorder>Our Team</ParagraphWithLightBorder>
        <TitleWithBigMargin>Exclusive Team</TitleWithBigMargin>
      </Top>
      <CardContainer>
        {cardItem.map(({ name, img }, idx) => (
          <CardWrapper ref={addToCardwrapperRefs} key={idx}>
            <Card>
              <CardImg
                onLoad={handleLoad}
                src={`${imgbaseUrl}team-${img}.jpg`}
              />
            </Card>
          </CardWrapper>
        ))}
      </CardContainer>
    </Container>
  );
};

export default Team;
