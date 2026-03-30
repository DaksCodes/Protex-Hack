import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const FireCalculator = () => {
    // data
    const [monthlyExpense, setMonthlyExpense] = useState(0);
    const [yearlySavings, setYearlySavings] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    //sliders
    const [currentAge, setCurrentAge] = useState(21);
    const [retirementAge, setRetirementAge] = useState(45);
    const [inflation, setInflation] = useState(7); 
    const [expectedReturn, setExpectedReturn] = useState(12); 
    const [stepUpPercent, setStepUpPercent] = useState(10); 
    const [currentCorpus, setCurrentCorpus] = useState(0);

    //api
    useEffect(() => {
        const fetchMLData = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/fire-stats'); 
                if (res.data.success) {
                    setMonthlyExpense(res.data.data.predicted_monthly_expense);
                    setYearlySavings(res.data.data.predicted_yearly_savings);
                }
            } catch (error) {
                console.error("Failed to load ML prediction");
            } finally {
                setIsLoading(false);
            }
        };
        fetchMLData();
    }, []);

    //calc
    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    
    //target fire corpus
    const annualExpenseToday = monthlyExpense * 12;
    const expenseAtRetirement = annualExpenseToday * Math.pow(1 + (inflation / 100), yearsToRetirement);
    const targetFireNumber = expenseAtRetirement * 25; // Rule of 25

    //projected
    let projectedCorpus = currentCorpus * Math.pow(1 + (expectedReturn / 100), yearsToRetirement);
    let currentYearlySaving = yearlySavings;

    for (let i = 1; i <= yearsToRetirement; i++) {
        projectedCorpus += currentYearlySaving * Math.pow(1 + (expectedReturn / 100), yearsToRetirement - i);
        currentYearlySaving += currentYearlySaving * (stepUpPercent / 100);
    }

    // required savings
    const fvCurrentCorpus = currentCorpus * Math.pow(1 + (expectedReturn / 100), yearsToRetirement);
    const shortfall = Math.max(0, targetFireNumber - fvCurrentCorpus);

    //sip formula
    let requiredYearlySavings = 0;
    if (shortfall > 0 && yearsToRetirement > 0) {
        let sumFactor = 0;
        for (let i = 1; i <= yearsToRetirement; i++) {
            // (1 + stepUp)^(year-1) * (1 + return)^(remaining_years)
            sumFactor += Math.pow(1 + (stepUpPercent / 100), i - 1) * Math.pow(1 + (expectedReturn / 100), yearsToRetirement - i);
        }
        requiredYearlySavings = shortfall / sumFactor;
    }
    const requiredMonthlySavings = requiredYearlySavings / 12;


    if (isLoading) return <LoadingScreen>Fetching your financial data via ML...</LoadingScreen>;

    return (
        <Container>
            <Header>
                <h2>Personalised FIRE Calculator</h2>
                <p>Note: Personalized from your transaction history. You can also adjust the numbers below.</p>
            </Header>

            <Dashboard>
                <Controls>
                    <InputGroup>
                        <label>Monthly Expense (in Rs)</label>
                        <input 
                            type="number" 
                            value={monthlyExpense} 
                            onChange={(e) => setMonthlyExpense(Number(e.target.value))}
                            className="editable-input" 
                        />
                    </InputGroup>
                    <InputGroup>
                        <label>Current Yearly Savings (in Rs)</label>
                        <input 
                            type="number" 
                            value={yearlySavings} 
                            onChange={(e) => setYearlySavings(Number(e.target.value))}
                            className="editable-input" 
                        />
                    </InputGroup>

                    <SliderGroup>
                        <label>Current Age: <b>{currentAge}</b></label>
                        <input type="range" min="18" max="60" value={currentAge} onChange={(e) => setCurrentAge(Number(e.target.value))} />
                    </SliderGroup>

                    <SliderGroup>
                        <label>Target Retirement Age: <b>{retirementAge}</b></label>
                        <input type="range" min={currentAge + 1} max="65" value={retirementAge} onChange={(e) => setRetirementAge(Number(e.target.value))} />
                    </SliderGroup>

                    <SliderGroup>
                        <label>Expected Equity Return (%): <b>{expectedReturn}%</b></label>
                        <input type="range" min="5" max="20" value={expectedReturn} onChange={(e) => setExpectedReturn(Number(e.target.value))} />
                    </SliderGroup>

                    <SliderGroup>
                        <label>Yearly SIP Step-Up (%): <b>{stepUpPercent}%</b></label>
                        <input type="range" min="0" max="50" value={stepUpPercent} onChange={(e) => setStepUpPercent(Number(e.target.value))} />
                    </SliderGroup>
                </Controls>

                <Results>
                    <ResultCard>
                        <h3>Target FIRE Corpus</h3>
                        <h1 className="target">₹ {Math.round(targetFireNumber).toLocaleString('en-IN')}</h1>
                        <p>Required to retire comfortably at age {retirementAge}</p>
                    </ResultCard>

                    <ResultCard>
                        <h3>Projected Corpus at Retirement</h3>
                        <h1 className={projectedCorpus >= targetFireNumber ? 'success' : 'shortfall'}>
                            ₹ {Math.round(projectedCorpus).toLocaleString('en-IN')}
                        </h1>
                        <p>
                            {projectedCorpus >= targetFireNumber 
                                ? "Wohoo! You are on track to achieve FIRE!" 
                                : "OOPS! Shortfall detected on current trajectory."}
                        </p>
                    </ResultCard>

                    <ActionCard>
                        <h3>Action Required to Hit Target</h3>
                        {projectedCorpus >= targetFireNumber ? (
                            <p className="success-text">Just keep doing what you are doing! Your current savings rate is enough.</p>
                        ) : (
                            <>
                                <h1>₹ {Math.round(requiredMonthlySavings).toLocaleString('en-IN')} <span style={{fontSize: '1rem', color: '#666'}}>/ month</span></h1>
                                <p>You need to save this amount starting today (increasing by {stepUpPercent}% every year) to reach your target corpus.</p>
                            </>
                        )}
                    </ActionCard>
                </Results>
            </Dashboard>
        </Container>
    );
};

export default FireCalculator;

const LoadingScreen = styled.div`padding: 4rem; text-align: center; font-size: 1.2rem; font-weight: bold; color: #555;`;
const Container = styled.div`padding: 2rem; max-width: 1200px; margin: auto; font-family: sans-serif;`;
const Header = styled.div`text-align: center; margin-bottom: 2rem; color: #333; h2 {margin-bottom: 5px;} p {color: #666; margin-top: 0;}`;
const Dashboard = styled.div`display: flex; gap: 2rem; flex-wrap: wrap;`;
const Controls = styled.div`flex: 1; min-width: 300px; padding: 2rem; background: #f8f9fa; border-radius: 12px; border: 1px solid #eee;`;
const Results = styled.div`flex: 1; min-width: 300px; display: flex; flex-direction: column; gap: 1.5rem; justify-content: flex-start;`;

const InputGroup = styled.div`margin-bottom: 1.5rem; display: flex; flex-direction: column; 
    label {font-weight: bold; margin-bottom: 0.5rem; color: #444; font-size: 0.9rem;} 
    input.editable-input { padding: 12px; border-radius: 6px; background: #fff; border: 2px solid #1e88e5; color: #333; font-weight: bold; outline: none; transition: border-color 0.2s; }
    input.editable-input:focus { border-color: #0d47a1; box-shadow: 0 0 5px rgba(30, 136, 229, 0.3); }
`;
const SliderGroup = styled.div`margin-bottom: 1.5rem; display: flex; flex-direction: column; label { margin-bottom: 0.5rem; color: #444; font-size: 0.9rem;} input[type="range"] { width: 100%; cursor: pointer; accent-color: #1e88e5; }`;

const ResultCard = styled.div`
    padding: 2rem; background: white; border-radius: 12px; text-align: center; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee;
    h3 { color: #666; margin-top: 0; font-size: 1.1rem; text-transform: uppercase; letter-spacing: 1px;}
    h1 { font-size: 2.5rem; margin: 15px 0;}
    h1.target { color: #1e88e5; }
    h1.success { color: #2e7d32; }
    h1.shortfall { color: #d32f2f; }
    p { color: #777; font-size: 0.95rem; margin-bottom: 0;}
`;

const ActionCard = styled(ResultCard)`
    background: #fff8e1; /* Halka peela background attention ke liye */
    border: 1px solid #ffe082;
    h1 { color: #f57c00; }
    .success-text {color: #2e7d32; font-weight: bold; font-size: 1.1rem; }
`;