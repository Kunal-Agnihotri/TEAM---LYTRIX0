import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage } from '../types';
import { INITIAL_MATCHES, INITIAL_REQUIREMENTS, MSP_REFERENCE_DATA, GOVERNMENT_SCHEMES } from '../data/mockData';
import { Mic, MicOff, Volume2, Send, X, Sparkles } from 'lucide-react';

type Language = 'en' | 'hi' | 'pa' | 'mr' | 'ta' | 'te';

type AgricultureData = {
  [key: string]: any;
};

interface AashiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const LANGUAGE_CONFIG: Record<Language, { speech: string; label: string }> = {
  en: { speech: 'en-IN', label: 'English (India)' },
  hi: { speech: 'hi-IN', label: 'Hindi' },
  pa: { speech: 'pa-IN', label: 'Punjabi' },
  mr: { speech: 'mr-IN', label: 'Marathi' },
  ta: { speech: 'ta-IN', label: 'Tamil' },
  te: { speech: 'te-IN', label: 'Telugu' },
};

const INDIAN_FEMALE_HINTS = [
  'heera', 'swara', 'kalpana', 'neerja', 'veena', 'female',
  'hindi india', 'india female', 'en-in'
];

function getIndianFemaleVoice(language: Language): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  const locale = LANGUAGE_CONFIG[language].speech.toLowerCase();
  const base = locale.split('-')[0];

  const exactIndian = voices.filter(v => {
    const lang = (v.lang || '').toLowerCase();
    return lang === locale || (lang.startsWith(base + '-') && lang.endsWith('-in'));
  });

  const hinted = exactIndian.find(v =>
    INDIAN_FEMALE_HINTS.some(h => v.name.toLowerCase().includes(h))
  );

  return hinted ||
    exactIndian[0] ||
    voices.find(v => v.lang.toLowerCase() === locale) ||
    voices.find(v => v.lang.toLowerCase().startsWith(base)) ||
    null;
}

function normalise(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFKC')
    .replace(/[^\p{L}\p{N}\s₹]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findCrop(text: string, agriculture: AgricultureData): string | null {
  const q = normalise(text);
  const aliases: Record<string, string[]> = {
    wheat: ['wheat', 'गेहूं', 'ਗੇਹੂੰ'],
    paddy: ['paddy', 'rice', 'चावल', 'धान', 'ਝੋਨਾ', 'ਚੌਲ'],
    maize: ['maize', 'corn', 'मक्का', 'ਮੱਕੀ'],
  };

  for (const [key, words] of Object.entries(aliases)) {
    if (words.some(word => q.includes(normalise(word)))) return key;
  }

  const cropKnowledge = agriculture?.en?.crop_knowledge || {};
  for (const key of Object.keys(cropKnowledge)) {
    if (q.includes(key.toLowerCase())) return key;
  }
  return null;
}

function dataGroundedAgricultureAnswer(
  query: string,
  language: Language,
  agriculture: AgricultureData
): string | null {
  const q = normalise(query);
  const crop = findCrop(query, agriculture);

  const greetings = ['hi', 'hello', 'hey', 'namaste', 'नमस्ते', 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ'];
  if (greetings.some(word => q === normalise(word) || q.startsWith(normalise(word) + ' '))) {
    return agriculture?.[language]?.greeting_response ||
      agriculture?.en?.greeting_response ||
      'Namaste! I am Aashi. How can I help you with your agricultural work today?';
  }

  if (crop) {
    const item = agriculture?.en?.crop_knowledge?.[crop];
    if (item) {
      const asksMsp = ['msp', 'minimum support', 'support price', 'सरकारी भाव', 'एमएसपी', 'ਭਾਵ']
        .some(word => q.includes(normalise(word)));

      if (asksMsp || q.includes('price') || q.includes('rate') || q.includes('भाव') || q.includes('ਕੀਮਤ')) {
        return `${item.name}: the agricultural knowledge data contains an MSP reference of ${item.msp}. I am using the bundled BRIDGE agriculture dataset for this answer.`;
      }

      return `${item.name} is available in Aashi's agricultural knowledge base. The bundled dataset records an MSP reference of ${item.msp}. Ask me about MSP, market rates, or workforce planning for this crop.`;
    }
  }

  const agricultureTerms = [
    'crop', 'farming', 'farm', 'wheat', 'rice', 'paddy', 'maize', 'corn',
    'msp', 'mandi', 'fertilizer', 'irrigation', 'फसल', 'खेती', 'गेहूं',
    'धान', 'मक्का', 'मंडी', 'खाद', 'ਸਬਜ਼ੀ', 'ਫਸਲ', 'ਖੇਤੀ'
  ];

  if (agricultureTerms.some(term => q.includes(normalise(term)))) {
    return language === 'hi'
      ? 'इस समय मेरे पास सीमित कृषि ज्ञान उपलब्ध है। कृपया गेहूं, धान या मक्का और अपना सवाल बताइए। मैं केवल उपलब्ध BRIDGE कृषि डेटा के आधार पर उत्तर दूंगी।'
      : language === 'pa'
        ? 'ਮੇਰੇ ਕੋਲ ਇਸ ਵੇਲੇ ਸੀਮਿਤ ਖੇਤੀਬਾੜੀ ਡਾਟਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਫਸਲ ਅਤੇ ਆਪਣਾ ਸਵਾਲ ਦੱਸੋ। ਮੈਂ BRIDGE ਦੇ ਉਪਲਬਧ ਡਾਟੇ ਦੇ ਆਧਾਰ ਤੇ ਜਵਾਬ ਦਿਆਂਗੀ।'
        : 'I can answer agricultural questions from the bundled BRIDGE agriculture dataset. Tell me the crop and what you want to know. I will not invent agricultural facts that are not in the dataset.';
  }

  return null;
}

function generatePlatformAnswer(query: string): string {
  const q = normalise(query);

  if (q.includes('worker') || q.includes('labour') || q.includes('labor') || q.includes('mazdoor') || q.includes('मजदूर') || q.includes('ਲੈਬਰ')) {
    const req = INITIAL_REQUIREMENTS[0];
    const matches = INITIAL_MATCHES.length;
    return `BRIDGE currently has ${matches} sample worker matches. The active example requirement is ${req.workersRequired} workers for ${req.cropRequirement} in ${req.location}, at ₹${req.dailyRate} per day.`;
  }

  if (q.includes('scheme') || q.includes('yojana') || q.includes('loan') || q.includes('बीमा') || q.includes('योजना')) {
    const scheme = GOVERNMENT_SCHEMES[0];
    return `BRIDGE has a platform reference for ${scheme.title}: ${scheme.benefit} Eligibility shown in the current demo data: ${scheme.eligibility}`;
  }

  if (q.includes('market') || q.includes('mandi') || q.includes('msp') || q.includes('price') || q.includes('rate') || q.includes('भाव')) {
    const wheat = MSP_REFERENCE_DATA.find(x => x.crop.toLowerCase().includes('wheat'));
    return `For the current BRIDGE demo reference, Wheat MSP is ${wheat?.msp || 'not available'}. Live mandi prices should be treated separately from this bundled reference data.`;
  }

  return `I understand your question. I can help with agricultural knowledge from the BRIDGE dataset, workforce coordination, sample matching, and platform information. Try asking about a crop, MSP, workers, or a government scheme.`;
}

export const AashiAssistant: React.FC<AashiAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: 'Namaste! I am Aashi, your agricultural AI partner. I use the BRIDGE agricultural knowledge data for crop answers and can also help with workforce coordination.',
      timestamp: 'Just now'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [language, setLanguage] = useState<Language>('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [agriculture, setAgriculture] = useState<AgricultureData | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/agriculture_data_enriched.json')
      .then(response => response.ok ? response.json() : Promise.reject(new Error('Agriculture data unavailable')))
      .then(data => setAgriculture(data))
      .catch(() => setAgriculture({}));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.getVoices();
  }, []);

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not available in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_CONFIG[language].speech;

    const voice = getIndianFemaleVoice(language);
    if (voice) utterance.voice = voice;

    // Warm, clear conversational delivery.
    utterance.pitch = 1.05;
    utterance.rate = 0.92;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const generateAashiResponse = (query: string): string => {
    const agricultureAnswer = dataGroundedAgricultureAnswer(query, language, agriculture || {});
    return agricultureAnswer || generatePlatformAnswer(query);
  };

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend ?? inputValue).trim();
    if (!text) return;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `${Date.now()}-user`,
      sender: 'user',
      text,
      timestamp: now
    };

    const replyText = generateAashiResponse(text);
    const assistantMsg: ChatMessage = {
      id: `${Date.now()}-assistant`,
      sender: 'assistant',
      text: replyText,
      timestamp: now
    };

    setMessages(prev => [...prev, userMsg, assistantMsg]);
    setInputValue('');
    speakText(replyText);
  };

  const toggleListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome or Edge.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = LANGUAGE_CONFIG[language].speech;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setInputValue(speechResult);
        setIsListening(false);
        handleSendMessage(speechResult);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
      alert('Microphone access could not be initialized. Allow microphone permission and try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-6 bottom-6 w-[380px] max-w-[calc(100vw-3rem)] h-[520px] bg-[#fffce9] border-2 border-[#f6b84a] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      <div className="h-16 bg-[#f6b84a] px-4 flex items-center justify-between text-white flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/25 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Aashi - AI Companion</h3>
            <p className="text-[10px] opacity-90">{isSpeaking ? 'Speaking with Indian voice' : 'Agriculture data + BRIDGE assistant'}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-white/20 text-white text-xs px-2 py-1 rounded border-none outline-none cursor-pointer"
            title="Voice language"
          >
            {Object.entries(LANGUAGE_CONFIG).map(([code, config]) => (
              <option key={code} value={code} className="text-gray-800">{config.label}</option>
            ))}
          </select>

          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30" aria-label="Close Aashi">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col max-w-[85%] ${msg.sender === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'}`}>
            <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
              msg.sender === 'user'
                ? 'bg-[#ffd987] text-[#765923] rounded-br-none'
                : 'bg-[#b8cd91] text-[#628543] rounded-bl-none font-medium'
            }`}>
              {msg.text}
            </div>
            {msg.sender === 'assistant' && (
              <button
                onClick={() => speakText(msg.text)}
                className="mt-1 text-[10px] text-[#628543] flex items-center gap-1 hover:underline"
              >
                <Volume2 className="w-3 h-3" /> {isSpeaking ? 'Speaking...' : 'Speak Aloud'}
              </button>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 bg-white border-t border-[#f0dfae] flex items-center gap-2 flex-shrink-0">
        <button
          onClick={toggleListening}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition ${
            isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-[#b8cd91] text-[#628543] hover:bg-[#789b55] hover:text-white'
          }`}
          title={`Speech to text (${LANGUAGE_CONFIG[language].label})`}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder={isListening ? 'Listening...' : 'Ask Aashi about agriculture...'}
          className="flex-1 h-10 px-3 rounded-xl border border-[#d9dfc7] bg-white text-xs text-[#566b49] outline-none focus:border-[#789b55]"
        />

        <button
          onClick={() => handleSendMessage()}
          className="w-10 h-10 rounded-xl bg-[#789b55] hover:bg-[#628543] text-white flex items-center justify-center transition"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>

        {isSpeaking && (
          <button onClick={stopSpeaking} className="w-10 h-10 rounded-xl bg-[#f6b84a] text-white flex items-center justify-center" title="Stop voice">
            <Volume2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
