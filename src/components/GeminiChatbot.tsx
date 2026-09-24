"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Bot, User, Key, Settings, Sparkles } from "lucide-react";
import { useToast } from "@/context/ToastContext";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

export default function GeminiChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [customKey, setCustomKey] = useState("");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "msg-1",
      sender: "bot",
      text: "👋 Assalamu Alaikum! I am Chaldal Assistant powered by Gemini AI. How can I help you today? Ask me about grocery items, delivery times, or our official bKash payment (+8801975300759).",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("chaldal_gemini_api_key");
    if (savedKey) {
      setCustomKey(savedKey);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const saveCustomKey = (key: string) => {
    setCustomKey(key);
    if (key.trim()) {
      localStorage.setItem("chaldal_gemini_api_key", key.trim());
      showToast("Gemini API key saved successfully!", "success");
    } else {
      localStorage.removeItem("chaldal_gemini_api_key");
      showToast("Custom Gemini API key cleared", "info");
    }
    setShowSettings(false);
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!messageText) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          customApiKey: customKey.trim() || undefined,
        }),
      });

      const data = await res.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: data.reply || "Sorry, I am unable to answer right now. Please call +8801975300759.",
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: "bot",
          text: "I am having trouble connecting to the network. You can also reach our helpline at +8801975300759.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "bKash payment guide (+8801975300759)",
    "What is the delivery fee?",
    "Do you deliver in Dhaka?",
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="chatbot-widget-btn"
          aria-label="Open Gemini customer care chat"
        >
          <Sparkles size={18} color="#fde047" />
          <span>Customer Care</span>
          <span
            style={{
              width: "10px",
              height: "10px",
              background: "#4ade80",
              borderRadius: "50%",
              boxShadow: "0 0 8px #4ade80",
            }}
          />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.2)",
                  padding: "0.35rem",
                  borderRadius: "50%",
                }}
              >
                <Bot size={20} color="#ffffff" />
              </div>
              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: 0 }}>
                  Chaldal AI Care
                </h4>
                <div style={{ fontSize: "0.72rem", opacity: 0.9, display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <span style={{ width: "6px", height: "6px", background: "#4ade80", borderRadius: "50%" }} />
                  <span>Powered by Gemini</span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
              <button
                onClick={() => setShowSettings(!showSettings)}
                style={{ color: "#ffffff", padding: "0.35rem", borderRadius: "4px" }}
                title="Gemini API Key Settings"
                aria-label="Gemini API Key Settings"
              >
                <Settings size={18} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ color: "#ffffff", padding: "0.35rem" }}
                aria-label="Close Chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Settings Sub-panel (optional Gemini API key configuration) */}
          {showSettings && (
            <div
              style={{
                background: "#f1f5f9",
                borderBottom: "1px solid #cbd5e1",
                padding: "0.85rem",
                fontSize: "0.82rem",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontWeight: 700, marginBottom: "0.35rem" }}>
                <Key size={14} color="var(--primary)" />
                <span>Your Gemini API Key (Optional)</span>
              </div>
              <p style={{ color: "#64748b", margin: "0 0 0.5rem", fontSize: "0.78rem" }}>
                Enter your Google Gemini API key to run live queries with your own quota.
              </p>
              <div style={{ display: "flex", gap: "0.35rem" }}>
                <input
                  type="password"
                  placeholder="Paste Gemini API Key (AIza...)"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  style={{
                    flex: 1,
                    padding: "0.35rem 0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #cbd5e1",
                    fontSize: "0.8rem",
                  }}
                />
                <button
                  type="button"
                  onClick={() => saveCustomKey(customKey)}
                  className="btn-primary"
                  style={{ padding: "0.35rem 0.75rem", fontSize: "0.78rem" }}
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {/* Messages list */}
          <div className="chatbot-messages">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`chat-bubble ${
                  m.sender === "user" ? "chat-bubble-user" : "chat-bubble-bot"
                }`}
              >
                {m.text}
              </div>
            ))}

            {loading && (
              <div className="chat-bubble chat-bubble-bot" style={{ display: "flex", gap: "0.3rem", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}>Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick suggestions */}
          <div
            style={{
              padding: "0.4rem 0.75rem",
              background: "#ffffff",
              borderTop: "1px solid var(--border-color)",
              display: "flex",
              gap: "0.35rem",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                type="button"
                style={{
                  background: "#f1f5f9",
                  border: "1px solid #e2e8f0",
                  borderRadius: "999px",
                  padding: "0.2rem 0.6rem",
                  fontSize: "0.72rem",
                  color: "var(--text-dark)",
                  cursor: "pointer",
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="chatbot-input-bar"
          >
            <input
              type="text"
              placeholder="Ask anything about groceries or orders..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="form-input"
              style={{ padding: "0.5rem 0.75rem", fontSize: "0.88rem" }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn-primary"
              style={{
                padding: "0.5rem 0.75rem",
                borderRadius: "var(--radius-sm)",
                opacity: loading || !input.trim() ? 0.6 : 1,
              }}
              aria-label="Send message"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
