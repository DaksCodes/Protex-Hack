import React from 'react';
import FireExplanation from '../components/FireExplanation';
import FireCalculator from '../components/FireCalculator';

const FirePage = () => {
    return (
        <div style={{ backgroundColor: '#f4f7f6', minHeight: '100vh', paddingBottom: '3rem' }}>
            <FireCalculator />  
            <FireExplanation /> 
        </div>
    );
};

export default FirePage;