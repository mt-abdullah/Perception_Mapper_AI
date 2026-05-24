"use client";

import { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import { toggleListening, SpeechRecognitionResult } from "../voice-helper";

interface VoiceInputButtonProps {
  /**
   * Callback invoked for each speech recognition result.
   * The parent component can decide how to merge the transcript.
   */
  onResult: (result: SpeechRecognitionResult) => void;
}

export default function VoiceInputButton({ onResult }: VoiceInputButtonProps) {
  const [listening, setListening] = useState(false);

  // Initialise the speech recogniser once on mount.
  useEffect(() => {
    // The toggleListening function will lazily initialise the recogniser
    // if it hasn't been created yet.
    if (!listening) {
      // No need to start listening here – we only want to prepare the API.
      toggleListening(onResult);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClick = () => {
    const newState = toggleListening((result) => {
      onResult(result);
    });
    setListening(newState);
  };

  return (
    <button
      type="button"
      aria-label={listening ? "Stop voice input" : "Start voice input"}
      onClick={handleClick}
      className={`flex items-center justify-center rounded-full w-12 h-12 transition-colors border border-indigo-400 bg-indigo-500/10 hover:bg-indigo-600/20 
        ${listening ? "animate-pulse text-indigo-500" : "text-slate-400"}`}
    >
      <Mic className="w-5 h-5" />
    </button>
  );
}
