import { Component, useState } from 'react';
import axios from 'axios';
import ChatBot, { Loading, Step } from 'react-simple-chatbot';
import ReactMarkdown from 'react-markdown';
import { ThemeProvider } from 'styled-components';
import image2 from '../assets/gaiabot.png';

// Define interfaces for the chat history
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Define interfaces for props and state
interface DBPediaProps {
  steps: {
    search: {
      value: string;
    };
  };
  triggerNextStep: () => void;
}

interface DBPediaState {
  loading: boolean;
  result: string;
  conversationHistory: ChatMessage[];
}

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

let chatHistory: ChatMessage[] = [];

class DBPedia extends Component<DBPediaProps, DBPediaState> {
  constructor(props: DBPediaProps) {
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

    this.setState({ loading: true, result: '' });
    const updatedHistory: ChatMessage[] = [
      ...limitedHistory,
      { role: 'user' as const, content: search },
    ];

    axios
      .post(
        'https://autonomous-backend.onrender.com/chatbot',
        {
          message: search,
          conversation: updatedHistory,
        },
        { headers: { 'Content-Type': 'application/json' } }
      )
      .then((response) => {
        const reply = response.data;

        const newHistory: ChatMessage[] = [
          ...updatedHistory,
          { role: 'assistant' as const, content: reply }
        ];
        chatHistory = newHistory;

        this.setState({
          loading: false,
          result: reply,
          conversationHistory: newHistory,
        });

        triggerNextStep();
      })
      .catch((error) => {
        console.error('Error:', error);
        const errorMessage = 'An error occurred while fetching data.';

        const newHistory: ChatMessage[] = [
          ...updatedHistory,
          { role: 'assistant' as const, content: errorMessage }
        ];
        chatHistory = newHistory;
        
        this.setState({
          loading: false,
          result: errorMessage,
          conversationHistory: newHistory,
        });
        
        triggerNextStep();
      });
  }

  render() {
    const { loading, result } = this.state;

    return (
      <div className="dbpedia">
        {loading ? <Loading /> : <ReactMarkdown>{result}</ReactMarkdown>}
      </div>
    );
  }
}

const Chatbox = () => {
  const [open, setOpen] = useState(false);

  const steps: Step[] = [
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
      component: (
        <DBPedia
          steps={{ search: { value: '' } }}
          triggerNextStep={() => {}}
        />
      ),
      waitAction: true,
      trigger: 'search',
    },
  ];

  if (!open) {
    return (
      <div className="">
        <div
          className="rounded-full w-20 h-20 absolute right-10 -bottom-60"
          onClick={() => setOpen(!open)}
        >
          <img className="rounded-lg" src={image2} alt="Chat bot" />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute right-10 -bottom-60 flex flex-col justify-end">
      <ThemeProvider theme={theme}>
        <ChatBot steps={steps} />
      </ThemeProvider>
      <div
        className="rounded-full w-20 h-20 mt-2 self-end"
        onClick={() => setOpen(!open)}
      >
        <img className="rounded-lg" src={image2} alt="Chat bot" />
      </div>
    </div>
  );
};

export default Chatbox;