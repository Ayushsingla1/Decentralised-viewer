// src/types/react-simple-chatbot.d.ts

declare module 'react-simple-chatbot' {
    import { Component } from 'react';
  
    export interface Step {
      id: string;
      message?: string;
      trigger?: string | number | ((value: any) => string | number);
      user?: boolean;
      asMessage?: boolean;
      component?: React.ReactNode;
      avatar?: string;
      delay?: number;
      end?: boolean;
      hideInput?: boolean;
      inputAttributes?: any;
      metadata?: any;
      placeholder?: string;
      validator?: (value: string) => boolean | string;
      waitAction?: boolean;
      waitUser?: boolean;
      options?: Array<{
        value: string;
        label: string;
        trigger: string;
      }>;
    }
  
    export interface ChatBotProps {
      steps: Step[];
      headerTitle?: string;
      botAvatar?: string;
      botDelay?: number;
      customDelay?: number;
      userAvatar?: string;
      userDelay?: number;
      customStyle?: any;
      floating?: boolean;
      hideHeader?: boolean;
      hideSubmitButton?: boolean;
      hideBotAvatar?: boolean;
      hideUserAvatar?: boolean;
      placeholder?: string;
      inputAttributes?: any;
      width?: string | number;
      height?: string | number;
      enableSmoothScroll?: boolean;
      enableMobileAutoFocus?: boolean;
      opened?: boolean;
      toggleFloating?: () => void;
      recognitionEnable?: boolean;
      speechSynthesis?: {
        enable?: boolean;
        lang?: string;
        voice?: SpeechSynthesisVoice | null;
      };
      handleEnd?: () => void;
    }
  
    export class Loading extends Component {}
  
    export default class ChatBot extends Component<ChatBotProps> {}
  }