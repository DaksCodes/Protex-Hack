import React from 'react';
import styled from 'styled-components';

const FireExplanation = () => {
    return (
        <Container>
            <MainHeading>
                What on earth is <span>F.I.R.E?</span> 🔥
            </MainHeading>
            <IntroText>
                FIRE stands for <b>Financial Independence, Retire Early</b>. It's not about sitting idle in your 40s; it's about buying back your freedom. Imagine having enough wealth that your money works for you, giving you the choice to pursue passion projects, travel the world (or buy those VIP concert tickets you always wanted), without worrying about the next paycheck.
            </IntroText>

            <SectionTitle>Decoding the FIRE Math 🧮</SectionTitle>
            <Grid>
                <InfoCard>
                    <Icon>🎯</Icon>
                    <h3>The Rule of 25 (Target Corpus)</h3>
                    <p>
                        To be financially independent, you need an invested corpus that is <b>25 times your annual expenses</b>. This is based on the famous "4% Rule," which assumes you can safely withdraw 4% of your portfolio every year for 30+ years without running out of money.
                    </p>
                </InfoCard>

                <InfoCard>
                    <Icon>📉</Icon>
                    <h3>Inflation (The Silent Thief)</h3>
                    <p>
                        A lifestyle that costs ₹50,000/month today won't cost the same 20 years from now. In India, average inflation is around 6-7%. We calculate the future value of your current expenses so your target corpus is realistic for your actual retirement year.
                    </p>
                </InfoCard>

                <InfoCard>
                    <Icon>📈</Icon>
                    <h3>Expected Equity Return (12%)</h3>
                    <p>
                        Keeping money in a savings account won't beat inflation. To grow wealth, your investments (like Mutual Funds, Index Funds, or Stocks) need to generate returns. Historically, the Indian stock market (Nifty 50) has averaged around 12% annual returns over the long term.
                    </p>
                </InfoCard>

                <InfoCard>
                    <Icon>🚀</Icon>
                    <h3>Yearly SIP Step-Up</h3>
                    <p>
                        This is the real magic trick! As you progress in your career and your salary jumps, your savings should jump too. A 10% step-up means if you invest ₹10,000/month this year, you commit to investing ₹11,000/month next year. It drastically cuts down the time needed to reach your target.
                    </p>
                </InfoCard>
            </Grid>

            <BottomNote>
                💡 <b>Pro Tip:</b> The younger you start, the heavier the compound interest works in your favor. Even small amounts invested consistently can snowball into massive wealth!
            </BottomNote>
        </Container>
    );
};

export default FireExplanation;

// --- STYLED COMPONENTS ---
const Container = styled.div`
    padding: 3rem 2rem;
    max-width: 1200px;
    margin: 2rem auto;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
    font-family: 'Inter', sans-serif;
`;

const MainHeading = styled.h1`
    text-align: center;
    font-size: 2.5rem;
    color: #1a1a1a;
    margin-bottom: 1rem;
    span {
        color: #ff5722;
    }
`;

const IntroText = styled.p`
    text-align: center;
    font-size: 1.1rem;
    line-height: 1.6;
    color: #555;
    max-width: 800px;
    margin: 0 auto 3rem auto;
`;

const SectionTitle = styled.h2`
    text-align: center;
    font-size: 1.8rem;
    color: #333;
    margin-bottom: 2rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
`;

const InfoCard = styled.div`
    background: #f9fbfc;
    padding: 2rem;
    border-radius: 12px;
    border: 1px solid #e1e8ed;
    transition: transform 0.2s ease, box-shadow 0.2s ease;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0,119,255,0.1);
        border-color: #b3d4fc;
    }

    h3 {
        color: #0052cc;
        margin-bottom: 1rem;
        font-size: 1.2rem;
    }

    p {
        color: #4a5568;
        line-height: 1.5;
        font-size: 0.95rem;
    }
`;

const Icon = styled.div`
    font-size: 2.5rem;
    margin-bottom: 1rem;
`;

const BottomNote = styled.div`
    margin-top: 3rem;
    padding: 1.5rem;
    background: #e8f5e9;
    border-left: 5px solid #4caf50;
    border-radius: 4px 8px 8px 4px;
    color: #2e7d32;
    font-size: 1.05rem;
    text-align: center;
`;