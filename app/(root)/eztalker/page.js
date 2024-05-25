'use client'
import React, {useState} from "react";
import OpenAI from "openai";
import TypingAnimation from "@/components/TypingAnimation";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export default function Home() {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUserInput = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setChatHistory(prevChat => [
      ...prevChat,
      {role: 'user', content: userInput}
    ]);
  
    try {
      const chatCompletion = await openai.chat.completions.create({
        messages: [...chatHistory, {role: 'assistant', content: userInput}],
        model: 'gpt-3.5-turbo'
      });
  
      setChatHistory(prevChat => [
        ...prevChat,
        {role: 'assistant', content: chatCompletion.choices[0].message.content},
      ]);
    } catch (error) {
      console.error('Failed to fetch chat completion:', error);
      // Optionally, update the UI to show an error message
    }
  
    setUserInput('');
    setIsLoading(false);
  };
  
  

  return (
<div className="main-container">
  {/* Title */}
  <h1 className="head-text self-center ">EzTalker</h1>

  {/* Chat Area */}
  <div className="flex-grow p-6 custom-scrollbar space-y-4">
    {/* Mapping through the chat history */}
    {
      chatHistory.map((message, index) => (
        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`rounded-lg p-4 text-white max-w-sm ${message.role === 'user' ? 'activity-card bg-gradient-to-r from-violet-800 via-blue-700 to-sky-500' : 'bg-blue'}`}>
            {message.content}
          </div>
        </div>
      ))
    }
    {/* Loading State */}
    {
      isLoading &&
      <div key={chatHistory.length} className="flex justify-start">
        <div className="bg-dark-2 rounded-lg p-4 text-white max-w-sm">
          {/* Typing animation will be styled separately */}
          <TypingAnimation />
        </div>
      </div>
    }
  </div>

  {/* Input Area */}
  <form className="flex-none px-6 py-4" onSubmit={handleUserInput}>
    <div className="flex gap-2 rounded-lg bg-dark-2 p-2">
      <input type="text" className="searchbar_input flex-grow px-4 py-2 bg-dark-3 text-white" placeholder="Type your message..." value={userInput} onChange={(e) => setUserInput(e.target.value)} />
      <button type="submit" className="community-card_btn bg-gradient-to-r from-violet-800 via-blue-700 to-sky-500 ">Send</button>
    </div>
  </form>
</div>

  );
}
