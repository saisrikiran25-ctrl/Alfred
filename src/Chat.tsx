import {
  ArrowUp,
  Menu,
  MessageSquare,
  Mic,
  MicOff,
  PlusCircle,
  Smartphone,
  Sparkles,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import React, { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { generateSmartBotReply, suggestedQuestions } from "./lib/botLogic";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatSession = {
  id: string;
  title: string;
  messages: Message[];
};

// Add Speech recognition types for TS
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Typewriter effect state
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );
  const [displayedStreamingContent, setDisplayedStreamingContent] =
    useState("");
  const [fullStreamingContent, setFullStreamingContent] = useState("");
  const [isDetailed, setIsDetailed] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        let finalTranscript = "";
        let interimTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          setInputValue((prev) => prev + (prev ? " " : "") + finalTranscript);
        }
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsRecording(false);
        if (event.error === "not-allowed") {
          alert(
            "Microphone access denied. Please grant permission or try opening the app in a new tab (using the button in the top right).",
          );
        }
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsRecording(true);
        } catch (e) {
          console.error("Could not start recording", e);
        }
      } else {
        alert("Your browser does not support speech recognition.");
      }
    }
  };

  useEffect(() => {
    if (!streamingMessageId) {
      scrollToBottom();
    }
  }, [messages, streamingMessageId]);

  useEffect(() => {
    if (streamingMessageId && fullStreamingContent) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedStreamingContent(fullStreamingContent.substring(0, i + 1));
        scrollToBottom();
        i++;
        if (i >= fullStreamingContent.length) {
          clearInterval(interval);
          const newMsg: Message = {
            id: streamingMessageId,
            role: "assistant",
            content: fullStreamingContent,
          };
          setMessages((prev) => [...prev, newMsg]);

          setSessions((prevSessions) =>
            prevSessions.map((s) =>
              s.id === currentSessionId
                ? { ...s, messages: [...s.messages, newMsg] }
                : s,
            ),
          );

          setStreamingMessageId(null);
          setFullStreamingContent("");
          setDisplayedStreamingContent("");
          setIsTyping(false);
        }
      }, 15);
      return () => clearInterval(interval);
    }
  }, [streamingMessageId, fullStreamingContent, currentSessionId]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping || streamingMessageId) return;

    const userMsgId = Date.now().toString();
    const newUserMsg: Message = {
      id: userMsgId,
      role: "user",
      content: text.trim(),
    };

    let activeSessionId = currentSessionId;
    if (!activeSessionId) {
      activeSessionId = Date.now().toString();
      setCurrentSessionId(activeSessionId);
      const title = text.trim();
      setSessions((prev) => [
        { id: activeSessionId!, title, messages: [newUserMsg] },
        ...prev,
      ]);
    } else {
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? { ...s, messages: [...s.messages, newUserMsg] }
            : s,
        ),
      );
    }

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600));

    const reply = generateSmartBotReply(text, isDetailed, messages);
    const botMsgId = (Date.now() + 1).toString();

    setStreamingMessageId(botMsgId);
    setFullStreamingContent(reply);
  };

  const clearChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
    setSidebarOpen(false);
  };

  const loadChat = (session: ChatSession) => {
    setMessages(session.messages);
    setCurrentSessionId(session.id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-page text-text-primary overflow-hidden font-sans">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-panel border-r border-border transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-sm" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-white">
              Alfred
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1 custom-scrollbar">
          <button
            onClick={clearChat}
            className="w-full flex items-center justify-between px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 text-white transition-all mb-8"
          >
            <span>New Chat</span>
            <span className="opacity-40 text-xs">⌘N</span>
          </button>

          <div className="mb-4">
            <h3 className="text-[10px] uppercase tracking-widest text-text-tertiary font-bold px-2 mb-2">
              Recent
            </h3>
            <div className="space-y-1">
              {sessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => loadChat(session)}
                  className={`group flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors w-full text-left ${
                    currentSessionId === session.id
                      ? "bg-white/10 text-white"
                      : "text-text-secondary hover:bg-white/5 hover:text-text-primary"
                  }`}
                >
                  <span className="truncate">{session.title}</span>
                </button>
              ))}
              {sessions.length === 0 && (
                <div className="px-3 py-2 text-xs text-text-tertiary">
                  No recent chats
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow-lg">
              SK
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-white">
                Beta Version 1.0
              </span>
              <span className="text-[10px] text-text-tertiary">
                Premium Access
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-page relative">
        {/* Header (Mobile mostly, but visible on desktop too) */}
        <header className="h-16 flex items-center justify-between px-8 border-bottom border-border bg-page/80 backdrop-blur-md z-10 sticky top-0 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 md:hidden rounded-lg text-text-secondary hover:text-white hover:bg-white/5"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium px-2 py-1 bg-white/5 rounded border border-white/10 hidden md:inline-block">
              Omni Architecture
            </span>
          </div>

          <div className="flex md:hidden flex-1 items-center justify-center">
            <h2 className="text-sm font-medium text-text-secondary">Alfred</h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              className={`p-2 rounded-lg transition-colors ${messages.length > 0 ? "text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer" : "text-gray-600 opacity-50 cursor-not-allowed"}`}
              disabled={messages.length === 0}
              onClick={() => {
                if (messages.length > 0) {
                  const chatText = messages
                    .map(
                      (m) =>
                        `${m.role === "user" ? "SK" : "Alfred"}: ${m.content}`,
                    )
                    .join("\n\n");
                  navigator.clipboard.writeText(
                    `Alfred Chat Session\n\n${chatText}`,
                  );
                  alert("Chat history copied to clipboard!");
                }
              }}
              title={messages.length > 0 ? "Share chat" : "Chat is empty"}
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-4 pb-32">
          <div className="max-w-3xl mx-auto flex flex-col gap-8 pb-32 pt-8">
            {messages.length === 0 && !isTyping && !streamingMessageId ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center min-h-[50vh] text-center"
              >
                <h2 className="text-4xl font-medium text-white mb-8 tracking-tight">
                  How can I help you?
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-4 text-left">
                  {suggestedQuestions.slice(0, 4).map((q, i) => (
                    <div
                      key={i}
                      onClick={() => handleSend(q)}
                      className="p-4 rounded-2xl bg-[#171717] border border-white/10 hover:border-white/20 cursor-pointer transition-colors"
                    >
                      <div className="text-sm text-white font-medium mb-1 line-clamp-1">
                        {q.split("?")[0] + "?"}
                      </div>
                      <div className="text-xs text-text-tertiary line-clamp-2">
                        {q}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <>
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} msg={msg} />
                ))}

                {streamingMessageId && (
                  <MessageBubble
                    msg={{
                      id: streamingMessageId,
                      role: "assistant",
                      content: displayedStreamingContent,
                    }}
                    isStreaming
                  />
                )}

                {isTyping && !streamingMessageId && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 shrink-0 rounded-lg bg-white flex items-center justify-center relative shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                      <div className="w-4 h-4 bg-black rounded-sm" />
                    </div>
                    <div className="flex items-center h-8 gap-1.5 px-1">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
                        animate={{ y: [0, -3, 0] }}
                        transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full bg-text-tertiary"
                        animate={{ y: [0, -3, 0] }}
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </motion.div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="absolute top-[85%] sm:top-[88%] lg:top-[85%] bottom-0 left-0 right-0 bg-gradient-to-t from-page via-page/90 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 z-20">
          <div className="max-w-3xl mx-auto relative flex items-end">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex gap-2 z-10 hidden sm:flex">
              <button
                onClick={toggleRecording}
                className={`p-2 rounded-full transition-colors ${isRecording ? "text-red-500 bg-red-500/10" : "text-text-tertiary hover:bg-white/10 hover:text-white"}`}
                title={isRecording ? "Stop recording" : "Start voice input"}
              >
                {isRecording ? (
                  <MicOff className="w-5 h-5" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </button>
            </div>
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputValue);
                }
              }}
              placeholder={
                isRecording ? "Listening..." : "Ask Alfred anything..."
              }
              className="w-full bg-[#171717] border border-white/10 hover:border-white/20 rounded-2xl py-4 sm:pl-14 pl-4 pr-16 sm:pr-40 text-white focus:outline-none focus:border-white/30 shadow-2xl resize-none max-h-32"
              rows={1}
            />
            <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 sm:gap-3 z-10">
              <button
                onClick={() => setIsDetailed(!isDetailed)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wide border transition-all hidden sm:block ${
                  isDetailed
                    ? "bg-white/10 text-white border-white/20 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
                    : "bg-white/5 text-text-tertiary border-white/5 hover:bg-white/10 hover:text-white/80"
                }`}
              >
                DETAILED: {isDetailed ? "ON" : "OFF"}
              </button>
              <button
                disabled={
                  !inputValue.trim() || isTyping || !!streamingMessageId
                }
                onClick={() => handleSend(inputValue)}
                className="bg-white p-1.5 sm:p-2 rounded-lg text-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
              >
                <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </button>
            </div>
          </div>
          <div className="mt-4 text-center text-[10px] text-text-tertiary">
            Alfred may provide inaccurate information. Version 4.0.2 • Verified
            by SK Industries
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({
  msg,
  isStreaming = false,
}: {
  msg: Message;
  isStreaming?: boolean;
  key?: React.Key;
}) {
  const isUser = msg.role === "user";

  return (
    <motion.div
      initial={isStreaming ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex md:gap-5 gap-4 ${isUser ? "flex-row-reverse" : "flex-row"} w-full group`}
    >
      <div
        className={`w-8 h-8 shrink-0 flex items-center justify-center mt-1 border ${
          isUser
            ? "rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 border-none text-white font-bold text-xs shadow-lg"
            : "rounded-lg bg-white border-white"
        }`}
      >
        {isUser ? "SK" : <div className="w-4 h-4 rounded-sm bg-black" />}
      </div>

      <div
        className={`flex flex-col ${isUser ? "items-end" : "items-start"} max-w-[85%] md:max-w-[75%]`}
      >
        <div
          className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed word-break-words ${
            isUser
              ? "bg-[#171717] border border-white/5 text-white rounded-tr-sm"
              : "text-text-primary"
          }`}
        >
          <div className="markdown-body">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
          {isStreaming && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 ml-1 align-middle bg-accent"
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}
