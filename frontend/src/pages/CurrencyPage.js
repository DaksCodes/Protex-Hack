import React from 'react'
import Heading from '../components/Heading'
import Card from '../components/Card'
const CurrencyPage = () => {
    const [result,setResult]=useState(0);
  const [to,setTo]=useState('');
    const [from,setFrom]=useState('');
    const [amount,setAmount]=useState('');
  return (
    <div>
      <Heading/>
      <Card
      to={to}
      setTo={setTo}
      from={from}
      setFrom={setFrom}
      amount={amount}
      setAmount={setAmount}
      result={result}
      setResult={setResult}/>
    </div>
  )
}

export default CurrencyPage
