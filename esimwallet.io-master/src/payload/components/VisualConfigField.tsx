'use client';

import React, { useState } from 'react';

const MOTION_PRESETS = [
  { value: 'none', label: 'None' },
  { value: 'liquid-crystal-float', label: 'Liquid Crystal Float' },
  { value: 'energetic-pulse', label: 'Energetic Pulse' },
  { value: 'magnetic-drift', label: 'Magnetic Drift' },
  { value: 'krystal-bloom', label: 'Krystal Bloom' },
  { value: 'scalar-slide', label: 'Scalar Slide' },
  { value: 'vortex-reveal', label: 'Vortex Reveal' },
  { value: 'parallax-depth', label: 'Parallax Depth' },
  { value: 'ripple-emergence', label: 'Ripple Emergence' },
  { value: 'subtle-shimmer', label: 'Subtle Shimmer' },
  { value: 'layered-parallax', label: 'Layered Parallax' },
];

const VISUAL_PRIORITIES = [
  { value: 'p1', label: 'P1 - Primary' },
  { value: 'p2', label: 'P2 - Secondary' },
  { value: 'p3', label: 'P3 - Tertiary' },
];

interface VisualConfigState {
  visualPriority: string;
  contentCluster: string;
  vibeKeywords: string;
  emotionalTone: string;
  animationIdeas: string;
  motionPreset: string;
  entranceMotion: string;
  hoverMotion: string;
  ambientMotion: string;
}

export const VisualConfigField: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [config, setConfig] = useState<VisualConfigState>({
    visualPriority: 'p2',
    contentCluster: '',
    vibeKeywords: '',
    emotionalTone: '',
    animationIdeas: '',
    motionPreset: 'none',
    entranceMotion: '',
    hoverMotion: '',
    ambientMotion: '',
  });

  const updateConfig = (key: keyof VisualConfigState, value: string) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const fieldStyle = {
    backgroundColor: '#0d0d1a',
    border: '1px solid #3a3a5c',
    borderRadius: '6px',
    padding: '8px 12px',
    color: '#e0e0e0',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box' as const,
  };

  const labelStyle = {
    color: '#888',
    fontSize: '12px',
    marginBottom: '4px',
    display: 'block',
  };

  const rowStyle = {
    display: 'flex',
    gap: '16px',
    marginBottom: '16px',
  };

  const colStyle = {
    flex: 1,
  };

  return (
    <div style={{
      backgroundColor: '#1a1a2e',
      borderRadius: '8px',
      padding: '16px',
      marginTop: '8px',
    }}>
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
          marginBottom: isExpanded ? '16px' : 0,
        }}
      >
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
          Visual Config
        </h3>
        <button
          type="button"
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #3a3a5c',
            borderRadius: '6px',
            color: '#888',
            padding: '6px 12px',
            cursor: 'pointer',
            fontSize: '12px',
          }}
        >
          {isExpanded ? '- Remove' : '+ Add Visual Config'}
        </button>
      </div>

      {isExpanded && (
        <>
          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>Visual Priority</label>
              <select 
                style={fieldStyle}
                value={config.visualPriority}
                onChange={(e) => updateConfig('visualPriority', e.target.value)}
              >
                {VISUAL_PRIORITIES.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>Content Cluster</label>
              <input
                type="text"
                style={fieldStyle}
                placeholder="e.g., science"
                value={config.contentCluster}
                onChange={(e) => updateConfig('contentCluster', e.target.value)}
              />
            </div>
          </div>

          <div style={rowStyle}>
            <div style={colStyle}>
              <label style={labelStyle}>Vibe Keywords</label>
              <input
                type="text"
                style={fieldStyle}
                placeholder="flowing, structured..."
                value={config.vibeKeywords}
                onChange={(e) => updateConfig('vibeKeywords', e.target.value)}
              />
              <span style={{ color: '#666', fontSize: '11px' }}>Comma-separated</span>
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>Emotional Tone</label>
              <input
                type="text"
                style={fieldStyle}
                placeholder="wonder, clarity..."
                value={config.emotionalTone}
                onChange={(e) => updateConfig('emotionalTone', e.target.value)}
              />
              <span style={{ color: '#666', fontSize: '11px' }}>Comma-separated</span>
            </div>
            <div style={colStyle}>
              <label style={labelStyle}>Animation Ideas</label>
              <input
                type="text"
                style={fieldStyle}
                placeholder="water flow, pulse..."
                value={config.animationIdeas}
                onChange={(e) => updateConfig('animationIdeas', e.target.value)}
              />
              <span style={{ color: '#666', fontSize: '11px' }}>Comma-separated</span>
            </div>
          </div>

          <div style={{ 
            borderTop: '1px solid #3a3a5c', 
            paddingTop: '16px',
            marginTop: '8px',
          }}>
            <p style={{ 
              color: '#888', 
              fontSize: '12px', 
              marginBottom: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}>
              <span>&#9632;</span> Motion Designer
            </p>

            <div style={rowStyle}>
              <div style={colStyle}>
                <label style={labelStyle}>Motion Preset</label>
                <select
                  style={fieldStyle}
                  value={config.motionPreset}
                  onChange={(e) => updateConfig('motionPreset', e.target.value)}
                >
                  {MOTION_PRESETS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <span style={{ color: '#666', fontSize: '11px' }}>Primary animation style for page elements</span>
              </div>
              <div style={colStyle}>
                <label style={labelStyle}>Entrance Motion</label>
                <input
                  type="text"
                  style={fieldStyle}
                  placeholder="fadeUp, stagger.container..."
                  value={config.entranceMotion}
                  onChange={(e) => updateConfig('entranceMotion', e.target.value)}
                />
                <span style={{ color: '#666', fontSize: '11px' }}>e.g., fadeUp, scaleIn, slideFromLeft</span>
              </div>
            </div>

            <div style={rowStyle}>
              <div style={colStyle}>
                <label style={labelStyle}>Hover Motion</label>
                <input
                  type="text"
                  style={fieldStyle}
                  placeholder="hover.lift, hover.glow..."
                  value={config.hoverMotion}
                  onChange={(e) => updateConfig('hoverMotion', e.target.value)}
                />
                <span style={{ color: '#666', fontSize: '11px' }}>e.g., hover.lift, hover.glow, hover.scale</span>
              </div>
              <div style={colStyle}>
                <label style={labelStyle}>Ambient Motion</label>
                <input
                  type="text"
                  style={fieldStyle}
                  placeholder="ambient.float, ambient.pulse..."
                  value={config.ambientMotion}
                  onChange={(e) => updateConfig('ambientMotion', e.target.value)}
                />
                <span style={{ color: '#666', fontSize: '11px' }}>e.g., ambient.float, ambient.shimmer</span>
              </div>
            </div>

            <div style={{ 
              borderTop: '1px solid #3a3a5c', 
              paddingTop: '16px',
              marginTop: '8px',
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
              }}>
                <p style={{ 
                  color: '#888', 
                  fontSize: '12px', 
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}>
                  <span>&#128279;</span> ELEMENT MOTION LINKS
                </p>
                <button
                  type="button"
                  style={{
                    backgroundColor: 'transparent',
                    border: '1px solid #3a3a5c',
                    borderRadius: '6px',
                    color: '#888',
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span>&#10024;</span> Auto-link
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ 
                  flex: 1, 
                  padding: '8px 12px',
                  backgroundColor: '#0d0d1a',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ color: '#e0e0e0', fontSize: '13px' }}>Hero Section</span>
                  <span style={{ color: '#666' }}>&#128279;</span>
                </div>
                <div style={{ 
                  flex: 1, 
                  padding: '8px 12px',
                  backgroundColor: '#0d0d1a',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ color: '#e0e0e0', fontSize: '13px' }}>Content Sections</span>
                  <span style={{ color: '#666' }}>&#128279;</span>
                </div>
                <div style={{ 
                  flex: 1, 
                  padding: '8px 12px',
                  backgroundColor: '#0d0d1a',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <span style={{ color: '#e0e0e0', fontSize: '13px' }}>Cards/Boxes</span>
                  <span style={{ color: '#666' }}>&#128279;</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VisualConfigField;
