import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import ChatBot, { Loading } from 'react-simple-chatbot';
import ReactMarkdown from 'react-markdown';
import { ThemeProvider } from 'styled-components';
import image2 from '../assets/gaiabot.png'


const theme = {
    background: '#f5f8fb',
    fontFamily: 'Helvetica Neue',
    headerBgColor: '#EF6C00',
    headerFontColor: '#fff',
    headerFontSize: '15px',
    botBubbleColor: '#EF6C00',
    botFontColor: '#fff',
    userBubbleColor: '#fff',
    userFontColor: '#4a4a4a',
  };

class DBPedia extends Component {
  constructor(props : any) {
    super(props);

    this.state = {
      loading: true,
      result: '',
      conversationHistory: [], 
    };

    this.searchDBPedia = this.searchDBPedia.bind(this);
  }

  componentDidMount() {
    this.searchDBPedia();
  }


  searchDBPedia() {
    const { steps, triggerNextStep } = this.props;
    const search = steps.search.value;
    const limitedHistory = chatHistory.slice(-5);

    console.log(chatHistory)

    this.setState({ loading: true, result: '' });
    const updatedHistory = [
      ...limitedHistory,
      { role: 'user', content: search },
    ];

    console.log(updatedHistory)

    axios
      .post(
        'https://autonomous-backend.onrender.com/chatbot',
        {
          message: search,
          conversation: updatedHistory, 
        },
        { headers: { 'Content-Type': 'application/json' }}
      )
      .then((response) => {
        const reply = response.data;

        updatedHistory.push({ role: 'assistant', content: reply });
        chatHistory = updatedHistory;

        this.setState((prevState) => ({
          loading: false, 
          result: reply, 
          conversationHistory: updatedHistory, 
        }));

        triggerNextStep();
      })
      .catch((error) => {
        console.error('Error:', error);
        const errorMessage = 'An error occurred while fetching data.';

        updatedHistory.push({ role: 'assistant', content: errorMessage });
        chatHistory = updatedHistory
        this.setState((prevState) => ({
          loading: false, 
          result: errorMessage, 
          conversationHistory: updatedHistory,
        }));
        
        triggerNextStep();
      });
  }

  render() {
    const { loading , result } = this.state;

    return <div className="dbpedia">{loading ? <Loading /> : <ReactMarkdown>{result}</ReactMarkdown>}</div>;
  }
}

DBPedia.propTypes = {
  steps: PropTypes.object.isRequired,
  triggerNextStep: PropTypes.func.isRequired,
};

let chatHistory : any = [];

const Chatbox = () => {

  const [open , setOpen] = useState(false);

  if(!open){
    return (
    <div className=''>
      <div className='rounded-full w-20 h-20 absolute right-10 -bottom-60' onClick={() => (setOpen(!open))}><img className='rounded-lg' src={image2}/></div>
    </div>
    )
  }

  return (
      <div className='absolute right-10 -bottom-60 flex flex-col justify-end'>
       <ThemeProvider theme = {theme}>
       <ChatBot
    steps={[
      {
        id: '1',
        message: 'Hello! I am a Gaia chatbot. What would you like to know?',
        trigger: 'search',
      },
      {
        id: 'search',
        user: true,
        trigger: '3',
      },
      {
        id: '3',
        component: <DBPedia />,
        waitAction: true,
        trigger: 'search',
      },
    ]}
  />
       </ThemeProvider>
  <div className='rounded-full w-20 h-20 mt-2 self-end' onClick={() => (setOpen(!open))}><img className='rounded-lg' src={image2}/></div>
  </div>
  )
}

export default Chatbox;