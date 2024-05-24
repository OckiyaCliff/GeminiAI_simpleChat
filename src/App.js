import { useState } from 'react';
import './App.css';

const App = () => {
  const [ value, setValue ] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  const surpriseOptions = [
    'Who won the latest Novel Peace Prize?',
    'Where does pizza come from?',
    'Howdo you make a BLT Sandwish ?'
  ]

  const surprise = () => {
    const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)]
    setValue(randomValue)
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!")
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value,
        }), 
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response
      console.log(data)
      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
      },
        {
          role: "model",
          part: data
        }
    ])
    setValue("")
    } catch (error) {
      console.error(error)
      setError("Something went wrong! Please try again later!.")
    }
  }

  const clear = ()=> {
    setValue("")
    setError("")
    setChatHistory([])
  }

  return (
      <div className="app">
        <p>what do you want to do know?
          <button className="surprise" onClick={surprise} disabled={!chatHistory}>Surprise me!</button>
        </p>
        <div className="input-container">
            <input
              value={value}
              placeholder='when is Christmas...?'
              onChange={(e) =>setValue(e.target.value)}
             />

             {!error && <button onClick={getResponse}>Ask me</button>}
             {error && <button onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, _index) => <div key={_index}>
            <p className="answer">{chatItem.role} : {chatItem.parts}</p>
          </div>)}
        </div>
      </div>
  );
}

export default App;
