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
      backgroundColor: '#1a1a2e',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '16px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h3 style={{ 
          color: '#00d4aa', 
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '14px',
          fontWeight: 600,
        }}>
          <span style={{ fontSize: '18px' }}>&#10024;</span>
          AI Page Builder
        </h3>
        <button
          onClick={handleNewChat}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #3a3a5c',
            borderRadius: '6px',
            color: '#888',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
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
          backgroundColor: '#0d0d1a',
          borderRadius: '6px',
        }}>
          {messages.map((msg, idx) => (
            <div
              key={idx}
              style={{
                marginBottom: '8px',
                padding: '8px 12px',
                borderRadius: '6px',
                backgroundColor: msg.role === 'user' ? '#2a2a4e' : '#1e3a5f',
                color: '#e0e0e0',
                fontSize: '13px',
              }}
            >
              <strong style={{ color: msg.role === 'user' ? '#00d4aa' : '#4da6ff' }}>
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
            backgroundColor: '#0d0d1a',
            border: '1px solid #3a3a5c',
            borderRadius: '6px',
            color: '#e0e0e0',
            fontSize: '14px',
            resize: 'vertical',
          }}
          disabled={isLoading}
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
            backgroundColor: '#00d4aa',
            border: 'none',
            borderRadius: '6px',
            color: '#000',
            cursor: isLoading ? 'wait' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isLoading || !input.trim() ? 0.5 : 1,
          }}
        >
          {isLoading ? '...' : '&#9658;'}
        </button>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#5c1a1a',
          color: '#ff6b6b',
          padding: '8px 12px',
          borderRadius: '6px',
          marginBottom: '16px',
          fontSize: '13px',
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <p style={{ 
          color: '#888', 
          fontSize: '12px', 
          marginBottom: '8px',
          margin: '0 0 8px 0',
        }}>
          Suggested Prompts
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {SUGGESTED_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handlePromptClick(prompt.prompt)}
              style={{
                backgroundColor: '#2a2a4e',
                border: '1px solid #3a3a5c',
                borderRadius: '6px',
                color: '#e0e0e0',
                padding: '6px 12px',
                cursor: 'pointer',
                fontSize: '12px',
              }}
            >
              {prompt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ 
          color: '#888', 
          fontSize: '12px', 
          marginBottom: '8px',
          margin: '0 0 8px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
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
                backgroundColor: task.required ? '#3d2a1a' : '#1e2a3a',
                borderRadius: '6px',
                borderLeft: task.required ? '3px solid #ff9500' : '3px solid #4da6ff',
              }}
            >
              <input
                type="checkbox"
                style={{ accentColor: '#00d4aa' }}
              />
              <span style={{ color: '#e0e0e0', fontSize: '13px' }}>
                {task.label}
              </span>
              {task.required && (
                <span style={{
                  backgroundColor: '#ff9500',
                  color: '#000',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
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
          <p style={{ color: '#888', fontSize: '12px', marginBottom: '8px' }}>
            Generated HTML Preview
          </p>
          <div
            style={{
              backgroundColor: '#0d0d1a',
              border: '1px solid #3a3a5c',
              borderRadius: '6px',
              padding: '12px',
              maxHeight: '200px',
              overflowY: 'auto',
            }}
          >
            <pre style={{ 
              color: '#e0e0e0', 
              fontSize: '12px', 
              margin: 0,
              whiteSpace: 'pre-wrap',
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
