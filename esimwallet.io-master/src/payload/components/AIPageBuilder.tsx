'use client';

import React, { useState, useCallback } from 'react';
import { useField } from '@payloadcms/ui';

interface SuggestedPrompt {
  label: string;
  prompt: string;
}

const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  { label: 'Generate SEO', prompt: 'Generate optimized SEO title and description for this page focusing on eSIM and travel connectivity keywords.' },
  { label: 'Write Hero', prompt: 'Write a compelling hero section with headline, subheadline, and call-to-action for eSIM services.' },
  { label: 'Create Benefits', prompt: 'Create a benefits section highlighting 4-6 key advantages of using our eSIM service.' },
  { label: 'Write FAQ', prompt: 'Write 5-7 frequently asked questions and answers about eSIM technology and usage.' },
  { label: 'Image Prompts', prompt: 'Generate detailed image prompts for hero, section illustrations, and feature icons.' },
];

interface AIEnhancementTask {
  field: string;
  label: string;
  required: boolean;
}

const AI_ENHANCEMENT_TASKS: AIEnhancementTask[] = [
  { field: 'seoTitle', label: 'SEO Title', required: true },
  { field: 'seoDescription', label: 'SEO Description', required: true },
  { field: 'aiImagePrompt', label: 'AI Image Prompt', required: false },
  { field: 'summary', label: 'Summary', required: false },
];

export const AIPageBuilder: React.FC<{
  path: string;
  field: { name: string };
}> = ({ path }) => {
  const { value, setValue } = useField<string>({ path });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!input.trim()) return;
    
    setIsLoading(true);
    setError(null);
    
    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      const response = await fetch('/esim-api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }
      
      const data = await response.json();
      const assistantMessage = data.response || data.message || 'No response received';
      
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
      
      if (data.parsed?.htmlContent) {
        setValue(data.parsed.htmlContent);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [input, setValue]);

  const handlePromptClick = useCallback((prompt: string) => {
    setInput(prompt);
  }, []);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setInput('');
    setError(null);
  }, []);

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.04)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      marginTop: '16px',
      backdropFilter: 'blur(16px)',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h3 style={{ 
          color: '#3b82f6', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 600,
          fontFamily: 'Inter, sans-serif',
        }}>
          <span style={{ fontSize: '18px' }}>&#10024;</span>
          AI Page Builder
        </h3>
        <button
          onClick={handleNewChat}
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#cbd5e1',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            transition: 'all 0.2s ease',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          + New Chat
        </button>
      </div>

      {messages.length > 0 && (
        <div style={{
          maxHeight: '200px',
          overflowY: 'auto',
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: 'rgba(10, 10, 10, 0.6)',
          borderRadius: '8px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '8px',
                padding: '8px 12px',
                borderRadius: '8px',
                backgroundColor: msg.role === 'user' ? 'rgba(37, 99, 235, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                color: '#ffffff',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              <strong style={{ color: msg.role === 'user' ? '#60a5fa' : '#3b82f6' }}>
                {msg.role === 'user' ? 'You' : 'BigMind'}:
              </strong>{' '}
              <span style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content.length > 500 ? msg.content.substring(0, 500) + '...' : msg.content}
              </span>
            </div>
          ))}
        </div>
      )}

      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste your ANDARA VISUAL CONFIG + HTML here, or ask AI to help build this page..."
          style={{
            flex: 1,
            minHeight: '100px',
            padding: '12px',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: '#ffffff',
            fontSize: '14px',
            resize: 'vertical',
            fontFamily: 'Inter, sans-serif',
            transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          }}
          disabled={isLoading}
          onFocus={(e) => {
            e.target.style.borderColor = '#2563eb';
            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.2)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.boxShadow = 'none';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              handleSubmit();
            }
          }}
        />
        <button
          onClick={handleSubmit}
          disabled={isLoading || !input.trim()}
          style={{
            width: '48px',
            backgroundColor: '#2563eb',
            border: 'none',
            borderRadius: '8px',
            color: '#ffffff',
            cursor: isLoading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading || !input.trim() ? 0.5 : 1,
            transition: 'all 0.2s ease',
          }}
        >
          {isLoading ? '...' : '▶'}
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          padding: '8px 12px',
          borderRadius: '8px',
          marginBottom: '16px',
          fontSize: '13px',
          fontFamily: 'Inter, sans-serif',
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '12px', 
          marginBottom: '8px',
          margin: '0 0 8px 0',
          fontFamily: 'Inter, sans-serif',
        }}>
          Suggested Prompts
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt.prompt)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#cbd5e1',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'all 0.2s ease',
                fontFamily: 'Inter, sans-serif',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.15)';
                e.currentTarget.style.borderColor = 'rgba(37, 99, 235, 0.3)';
                e.currentTarget.style.color = '#60a5fa';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = '#cbd5e1';
              }}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ 
          color: '#94a3b8', 
          fontSize: '12px', 
          marginBottom: '8px',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontFamily: 'Inter, sans-serif',
        }}>
          <span style={{ fontSize: '14px' }}>&#10024;</span>
          AI Enhancement Tasks
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {AI_ENHANCEMENT_TASKS.map((task, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 12px',
                backgroundColor: task.required ? 'rgba(245, 158, 11, 0.1)' : 'rgba(37, 99, 235, 0.1)',
                borderRadius: '8px',
                borderLeft: task.required ? '3px solid #f59e0b' : '3px solid #3b82f6',
              }}
            >
              <input
                type="checkbox"
                style={{ accentColor: '#2563eb' }}
              />
              <span style={{ color: '#ffffff', fontSize: '13px', fontFamily: 'Inter, sans-serif' }}>
                {task.label}
              </span>
              {task.required && (
                <span style={{
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  color: '#fbbf24',
                  padding: '2px 6px',
                  borderRadius: '9999px',
                  fontSize: '10px',
                  fontWeight: 500,
                  fontFamily: 'Inter, sans-serif',
                }}>
                  Missing
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {value && (
        <div style={{ marginTop: '16px' }}>
          <p style={{ color: '#94a3b8', fontSize: '12px', marginBottom: '8px', fontFamily: 'Inter, sans-serif' }}>
            Generated HTML Preview
          </p>
          <div
            style={{
              backgroundColor: 'rgba(10, 10, 10, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '12px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            <pre style={{ 
              color: '#ffffff', 
              fontSize: '12px', 
              margin: 0,
              whiteSpace: 'pre-wrap',
              fontFamily: 'Geist Mono, Monaco, monospace',
            }}>
              {typeof value === 'string' ? value.substring(0, 1000) : JSON.stringify(value, null, 2)}
              {typeof value === 'string' && value.length > 1000 && '...'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPageBuilder;
