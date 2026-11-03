import React, { useState, useEffect, useRef } from 'react';
import { Zap, X, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/SoundManager';

const WIRE_COLORS = [
  { id: 'red', name: 'RED', hex: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)' },
  { id: 'blue', name: 'BLUE', hex: '#3b82f6', glow: 'rgba(59, 130, 246, 0.8)' },
  { id: 'yellow', name: 'YELLOW', hex: '#eab308', glow: 'rgba(234, 179, 8, 0.8)' },
  { id: 'magenta', name: 'MAGENTA', hex: '#ec4899', glow: 'rgba(236, 72, 153, 0.8)' },
];

export default function WirePuzzleModal({ gameState, onComplete, onClose }) {
  // Shuffled terminal orders
  const [leftWires, setLeftWires] = useState([]);
  const [rightWires, setRightWires] = useState([]);
  // Connected mapping: { red: true, blue: true, ... }
  const [connections, setConnections] = useState({});
  // Currently dragging / selected wire id
  const [activeWire, setActiveWire] = useState(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isFinished, setIsFinished] = useState(false);
  const [powerRestoredAmount, setPowerRestoredAmount] = useState(12);
  const isPowerZero = Boolean(!gameState || gameState.power <= 0 || gameState.isBlackout);

  const containerRef = useRef(null);
  const leftPinRefs = useRef({});
  const rightPinRefs = useRef({});

  // Shuffle colors on mount
  useEffect(() => {
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
    setLeftWires(shuffle(WIRE_COLORS));
    setRightWires(shuffle(WIRE_COLORS));
    // 10 to 15% power bonus
    setPowerRestoredAmount(Math.floor(Math.random() * 6) + 10);
  }, []);

  // Track cursor / touch for wire drawing
  const updatePointer = (e) => {
    if (!activeWire || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    setCursorPos({
      x: clientX - rect.left,
      y: clientY - rect.top,
    });
  };

  // Start connecting from left terminal
  const handleLeftClick = (wireId, e) => {
    e.stopPropagation();
    if (connections[wireId] || isFinished) return;
    setActiveWire(wireId);
    updatePointer(e);
  };

  // Connect to right terminal
  const handleRightClick = (wireId, e) => {
    e.stopPropagation();
    if (!activeWire || isFinished) return;

    if (activeWire === wireId) {
      // Successful match!
      soundManager.playWireConnect?.();
      const updated = { ...connections, [wireId]: true };
      setConnections(updated);
      setActiveWire(null);

      // Check if all 4 are connected
      if (Object.keys(updated).length === WIRE_COLORS.length) {
        setIsFinished(true);
        soundManager.playGeneratorRevUp?.();
        setTimeout(() => {
          if (onComplete) onComplete(powerRestoredAmount);
        }, 800);
      }
    } else {
      // Mismatched color
      setActiveWire(null);
    }
  };

  // Cancel dragging on outside click
  const handleContainerClick = () => {
    if (activeWire) {
      setActiveWire(null);
    }
  };

  // Coordinate helpers for SVG wires
  const getLeftPos = (wireId) => {
    const el = leftPinRefs.current[wireId];
    if (!el || !containerRef.current) return { x: 40, y: 50 };
    const cRect = containerRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: elRect.right - cRect.left,
      y: elRect.top + elRect.height / 2 - cRect.top,
    };
  };

  const getRightPos = (wireId) => {
    const el = rightPinRefs.current[wireId];
    if (!el || !containerRef.current) return { x: 300, y: 50 };
    const cRect = containerRef.current.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return {
      x: elRect.left - cRect.left,
      y: elRect.top + elRect.height / 2 - cRect.top,
    };
  };

  return (
    <div 
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-60 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 select-none animate-fadeIn"
    >
      <div 
        ref={containerRef}
        onClick={handleContainerClick}
        onMouseMove={updatePointer}
        onTouchMove={updatePointer}
        className="relative bg-neutral-900 border-4 border-yellow-600/90 rounded-2xl w-full max-w-lg md:max-w-xl p-4 sm:p-6 shadow-[0_0_60px_rgba(234,179,8,0.4)] flex flex-col justify-between font-mono overflow-hidden text-gray-200"
      >
        {/* Metal Casing Hazard Stripes Header */}
        <div className="absolute top-0 inset-x-0 h-3 bg-[repeating-linear-gradient(45deg,#ca8a04,#ca8a04_10px,#171717_10px,#171717_20px)] border-b border-yellow-500/50" />

        {/* Top Header */}
        <div className="flex justify-between items-center pt-2 pb-3 border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-yellow-400 animate-pulse" />
            <div>
              <h3 className="text-sm sm:text-base font-black text-yellow-400 tracking-wider">
                AUXILIARY GENERATOR // REWIRE
              </h3>
              <p className="text-[10px] text-gray-400">
                {isPowerZero
                  ? 'Connect all 4 wires to restore power (+10-15%) immediately!'
                  : 'Connect all 4 wires to arm generator. Extra power activates when power reaches 0%!'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-neutral-800 p-1.5 rounded transition cursor-pointer"
            title="Cancel Rewire"
          >
            <X size={18} />
          </button>
        </div>

        {/* Live Wiring Board Area */}
        <div className="relative my-4 sm:my-6 h-64 sm:h-72 bg-neutral-950 border-2 border-neutral-800 rounded-xl p-4 flex justify-between items-center overflow-hidden">
          {/* SVG Canvas for Wires */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Completed Connected Wires */}
            {WIRE_COLORS.map((w) => {
              if (!connections[w.id]) return null;
              const p1 = getLeftPos(w.id);
              const p2 = getRightPos(w.id);
              const cp1X = p1.x + (p2.x - p1.x) * 0.45;
              const cp2X = p1.x + (p2.x - p1.x) * 0.55;
              return (
                <g key={`wire-${w.id}`}>
                  <path
                    d={`M ${p1.x} ${p1.y} C ${cp1X} ${p1.y}, ${cp2X} ${p2.y}, ${p2.x} ${p2.y}`}
                    stroke={w.hex}
                    strokeWidth="10"
                    strokeLinecap="round"
                    fill="none"
                    filter="drop-shadow(0 0 8px currentColor)"
                  />
                  <path
                    d={`M ${p1.x} ${p1.y} C ${cp1X} ${p1.y}, ${cp2X} ${p2.y}, ${p2.x} ${p2.y}`}
                    stroke="#ffffff"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    fill="none"
                    opacity="0.8"
                  />
                </g>
              );
            })}

            {/* Currently Dragged / Active Wire */}
            {activeWire && (
              <g>
                {(() => {
                  const p1 = getLeftPos(activeWire);
                  const w = WIRE_COLORS.find(c => c.id === activeWire);
                  const cp1X = p1.x + (cursorPos.x - p1.x) * 0.5;
                  return (
                    <>
                      <path
                        d={`M ${p1.x} ${p1.y} Q ${cp1X} ${(p1.y + cursorPos.y) / 2 + 10}, ${cursorPos.x} ${cursorPos.y}`}
                        stroke={w?.hex || '#ffffff'}
                        strokeWidth="10"
                        strokeLinecap="round"
                        fill="none"
                        filter="drop-shadow(0 0 8px currentColor)"
                      />
                      <circle cx={cursorPos.x} cy={cursorPos.y} r="8" fill={w?.hex || '#ffffff'} />
                    </>
                  );
                })()}
              </g>
            )}
          </svg>

          {/* LEFT TERMINALS */}
          <div className="flex flex-col justify-around h-full z-20 space-y-3">
            {leftWires.map((w) => {
              const isConnected = Boolean(connections[w.id]);
              const isSelected = activeWire === w.id;
              return (
                <div key={`left-${w.id}`} className="flex items-center gap-2">
                  <div
                    ref={(el) => (leftPinRefs.current[w.id] = el)}
                    onClick={(e) => handleLeftClick(w.id, e)}
                    className={`w-10 sm:w-12 h-9 sm:h-10 rounded-lg flex items-center justify-center font-bold text-[10px] sm:text-xs cursor-pointer border-2 transition active:scale-95 shadow-md ${
                      isConnected
                        ? 'border-emerald-500 bg-neutral-900 opacity-90 cursor-default'
                        : isSelected
                        ? 'border-white scale-105 shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                        : 'border-neutral-700 hover:border-white'
                    }`}
                    style={{ backgroundColor: w.hex }}
                    title={`Click to connect ${w.name} wire`}
                  >
                    <span className="text-black font-black drop-shadow">{w.name[0]}</span>
                  </div>
                  {/* Status LED */}
                  <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-800'}`} />
                </div>
              );
            })}
          </div>

          {/* RIGHT TERMINALS */}
          <div className="flex flex-col justify-around h-full z-20 space-y-3">
            {rightWires.map((w) => {
              const isConnected = Boolean(connections[w.id]);
              const isHoveredTarget = activeWire === w.id;
              return (
                <div key={`right-${w.id}`} className="flex items-center gap-2 flex-row-reverse">
                  <div
                    ref={(el) => (rightPinRefs.current[w.id] = el)}
                    onClick={(e) => handleRightClick(w.id, e)}
                    className={`w-10 sm:w-12 h-9 sm:h-10 rounded-lg flex items-center justify-center font-bold text-[10px] sm:text-xs cursor-pointer border-2 transition active:scale-95 shadow-md ${
                      isConnected
                        ? 'border-emerald-500 bg-neutral-900 opacity-90 cursor-default'
                        : isHoveredTarget
                        ? 'border-white scale-105 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]'
                        : 'border-neutral-700 hover:border-white'
                    }`}
                    style={{ backgroundColor: w.hex }}
                    title={`Connect here for ${w.name}`}
                  >
                    <span className="text-black font-black drop-shadow">{w.name[0]}</span>
                  </div>
                  {/* Status LED */}
                  <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-neutral-800'}`} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Status / Completion Bar */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-700 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">WIRES CONNECTED:</span>
            <span className="font-bold text-yellow-400">
              {Object.keys(connections).length} / 4
            </span>
          </div>

          {isFinished ? (
            <div className="flex items-center gap-2 text-emerald-400 font-black animate-bounce text-sm">
              <CheckCircle2 size={16} />
              <span>
                {isPowerZero
                  ? `GENERATOR ACTIVATED (+${powerRestoredAmount}% POWER RESTORED)!`
                  : `GENERATOR ARMED! (+${powerRestoredAmount}% READY FOR 0% POWER)!`}
              </span>
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 flex items-center gap-1">
              <AlertTriangle size={13} className="text-yellow-500" />
              <span>{isPowerZero ? 'MATCH WIRES TO RESTORE POWER IMMEDIATELY' : 'MATCH WIRES: WILL ACTIVATE WHEN POWER REACHES 0%'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
