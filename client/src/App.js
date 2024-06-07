import './App.css';
import mqtt from 'mqtt';
import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import Message from './message';
import React from 'react'
import { LOCAL_STORAGE_KEY, TOPIC, isCtrlEnterKey } from './utils';

const client = mqtt.connect('wss://test.mosquitto.org:8081');

function App() {
  const [value, setValue] = useState('');
  const [userId, setUserId] = useState();
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isSubscribe, setIsSubscribe] = useState(false);
  const ref = useRef();

  const handleOnMessage = () => {
    client.on('message',async function (topic, message) { // message is Buffer
      setMessages(prev => {
        const splitted = message.toString().split(':');
        if (splitted[0] === userId) {
          ref.current.scrollTop = 0;
        }
        return prev.concat({ userId: splitted[0], content: splitted[1], msgId: splitted[2] })
      })
    });
  }

  useEffect(() => {
    fetch('http://localhost:3000/messages')
      .then(res => res.json())
      .then(data => setMessages(data.message));

    const userPersisted = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (userPersisted) {
      setUserId(userPersisted);
    } else {
      fetch('http://localhost:3000/user')
        .then(res => res.json())
        .then(data => {
          setUserId(data.message.id)
          localStorage.setItem(LOCAL_STORAGE_KEY, data.message.id);
        });
    }

    client.subscribe(TOPIC);
    handleOnMessage();
    setIsSubscribe(true);

    return () => {
      client.unsubscribe(TOPIC)
    }
  }, [])

  const handleChange = (e) => {
    const _value = e.target.value;
    setValue(_value);
  }

  const handleSend = () => {
    if (!isSending) {
      setIsSending(true);
  
      fetch('http://localhost:3000/send-message', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: { userId, content: value.trim() } })
      }).then(res => res.json()).then(data => {
        setIsSending(false);
        setValue('');
        ref.current.scrollTop = 0;
      })
    }
  }

  const handleKeyDown = (e) => {
    if (isCtrlEnterKey(e)) {
      handleSend()
    }
  }

  const handleLeave = () => {
    client.unsubscribe(TOPIC);
    setIsSubscribe(false);
  }

  const handleJoin = () => {
    client.subscribe(TOPIC);
    setIsSubscribe(true);
  }

  if (!userId) {
    return <p>Loading...</p>
  }

  return (
    <div className="App">
      <div>
        Hi {userId}!
        {isSubscribe && (
          <button onClick={handleLeave} style={{ marginLeft: 4 }}>
            Leave room
          </button>
        )}
      </div>
      {
        !isSubscribe ? (
          <button onClick={handleJoin} style={{ marginLeft: 4 }}>
        Join room <b>{TOPIC}</b>
      </button>
        ) : (
          <React.Fragment>
            <div className='chat-box-outer' ref={ref}>
              <div className='chat-box-inner'>
                {messages.map(({ userId: _userId, content, msgId }) => {
                  return (
                    <Message>
                      <div className={clsx({ reverse: _userId !== userId }, 'chat-item')} key={msgId}>
                        <div className='user-id'>
                          {_userId}
                        </div>
                        <div className='message'>
                          {content}
                        </div>
                      </div>
                    </Message>
                  )
                })}
              </div>
            </div>
            <div className='action'>
              <textarea value={value} onChange={handleChange} onKeyDown={handleKeyDown} />
              <button className='action--send' onClick={handleSend} disabled={!value || isSending}>
                {isSending ? 'Sending' : 'Send'}
              </button>
            </div>
          </React.Fragment>
        )
      }
    </div>
  );
}

export default App;
