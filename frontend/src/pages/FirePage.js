import React from 'react';
import FireExplanation from '../components/FireExplanation';
import FireCalculator from '../components/FireCalculator';
import Header from '../components/Header';

const FirePage = () => {
    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '3rem' }}>
            <Header />
            <FireCalculator />  
            <FireExplanation /> 
        </div>
    );
};

export default FirePage;