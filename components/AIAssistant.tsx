import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { MessageSquare, Send, X, Bot, Sparkles, Loader2, Minimize2, Maximize2, Briefcase, FileText, Home, Car, PlusCircle, CreditCard } from 'lucide-react';
import { useTranslation } from './LanguageContext';
import { Language } from '../types';
import { Link } from 'react-router-dom';

const AIAssistant: React.FC = () => {
  const { language, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    { 
      role: 'model', 
      text: language === Language.AM 
        ? 'ሰላም! እኔ የየስራሰው AI ረዳት ነኝ። ዛሬ እንዴት ልረዳዎ እችላለሁ?' 
        : 'Hello! I am the YesraSew AI Assistant. How can I help you today?' 
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    { 
      en: "Find a Job", 
      am: "ስራ ፈልግ", 
      icon: <Briefcase className="w-3 h-3" />,
      prompt: "I am looking for a job in Addis Ababa. Can you show me the latest openings?"
    },
    { 
      en: "View Tenders", 
      am: "ጨረታዎችን አሳይ", 
      icon: <FileText className="w-3 h-3" />,
      prompt: "What are the active tenders available right now?"
    },
    { 
      en: "Houses for Rent", 
      am: "የሚከራይ ቤት", 
      icon: <Home className="w-3 h-3" />,
      prompt: "I want to see properties available for rent."
    },
    { 
      en: "Buy a Car", 
      am: "መኪና ለመግዛት", 
      icon: <Car className="w-3 h-3" />,
      prompt: "Show me vehicles for sale in Ethiopia."
    },
    { 
      en: "Post an Ad", 
      am: "ማስታወቂያ ለመለጠፍ", 
      icon: <PlusCircle className="w-3 h-3" />,
      prompt: "How do I post a new advertisement on YesraSew?"
    },
    { 
      en: "Pricing", 
      am: "ስለ ክፍያ", 
      icon: <CreditCard className="w-3 h-3" />,
      prompt: "Tell me about the subscription plans and pricing."
    }
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (forcedInput?: string) => {
    const messageText = forcedInput || input;
    if (!messageText.trim() || isTyping) return;

    const userMessage = messageText.trim();
    if (!forcedInput) setInput('');
    
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const systemInstruction = `You are the official 'YesraSew AI Assistant', Ethiopia's leading marketplace for Jobs, Tenders, Properties, and Vehicles.
      Your goal is to help users navigate the site, search for items, and understand how to post ads or subscribe.
      The platform colors are Deep Navy (#001b3a) and Metallic Gold (#d4af37).
      
      CRITICAL: You MUST include internal links in your responses when relevant to help users navigate. Use the markdown format [Label](/path).
      Available paths:
      - Jobs Page: [/jobs](/jobs)
      - Tenders Page: [/tenders](/tenders)
      - Properties Page: [/property](/property)
      - Vehicles Page: [/vehicles](/vehicles)
      - Pricing & Plans: [/pricing](/pricing)
      - Post an Ad: [/post](/post)
      
      Example response: "You can find all our latest [property listings here](/property) or [post your own ad](/post) to reach more buyers."
      
      Always be professional, helpful, and polite. 
      Respond in ${language === Language.AM ? 'Amharic' : 'English'}. 
      If the user asks for things not on YesraSew, gently guide them back to marketplace categories.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...messages.map(m => ({ role: m.role === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })), 
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
          topP: 0.95,
        },
      });

      const aiText = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I am having trouble connecting right now. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessageText = (text: string) => {
    // Parser for [Label](/path)
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        const label = match[1];
        const url = match[2];
        return (
          <Link 
            key={i} 
            to={url} 
            className="inline-flex items-center gap-1 bg-accent/20 text-accent font-black underline decoration-accent/30 underline-offset-4 px-1.5 py-0.5 rounded-md hover:bg-accent hover:text-primary transition-all mx-0.5"
            onClick={() => setIsMinimized(true)}
          >
            {label}
          </Link>
        );
      }
      return part;
    });
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-[60] bg-primary text-accent p-4 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all border border-accent/20 group"
        aria-label="Open AI Assistant"
      >
        <div className="relative">
          <Bot className="w-6 h-6" />
          <Sparkles className="w-3 h-3 absolute -top-1 -right-1 animate-pulse" />
        </div>
        <span className="absolute right-full mr-4 bg-primary text-accent px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
          {language === Language.AM ? 'የየስራሰው AI ረዳት' : 'YesraSew AI Assistant'}
        </span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed bottom-6 right-6 z-[60] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,27,58,0.3)] border border-gray-100 flex flex-col transition-all duration-300 overflow-hidden ${
        isMinimized ? 'h-16 w-64' : 'h-[550px] w-[350px] md:w-[420px]'
      }`}
    >
      {/* Header */}
      <div className="bg-primary p-4 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-accent/10 p-2 rounded-xl border border-accent/20">
            <Bot className="w-5 h-5 text-accent" />
          </div>
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-wider">YesraSew AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Body */}
          <div 
            ref={scrollRef}
            className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/50"
          >
            {messages.map((m, i) => (
              <div 
                key={i} 
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div 
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-[12px] font-medium leading-relaxed shadow-sm ${
                    m.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                  }`}
                >
                  {renderMessageText(m.text)}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 className="w-3 h-3 text-accent animate-spin" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
                    Thinking...
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Prompt Suggestions */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar bg-white border-t border-gray-50">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.prompt)}
                disabled={isTyping}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full text-[9px] font-black text-primary uppercase tracking-widest hover:bg-accent hover:text-primary transition-all whitespace-nowrap active:scale-95 disabled:opacity-50"
              >
                <span className="text-accent group-hover:text-primary">{p.icon}</span>
                {language === Language.AM ? p.am : p.en}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="relative group">
              <input 
                type="text"
                placeholder={language === Language.AM ? 'እዚህ ይጻፉ...' : 'Type your message...'}
                className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-primary outline-none focus:bg-white focus:border-accent transition-all shadow-inner"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-accent rounded-xl hover:scale-105 active:scale-95 disabled:opacity-30 disabled:hover:scale-100 transition-all shadow-lg"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-center text-[8px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-3 opacity-60">
              Powered by YesraSew Intelligence
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default AIAssistant;