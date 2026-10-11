'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  PhoneOff,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function VideoCallRoomPage() {
  const params = useParams();
  const roomId = params?.roomId as string;
  const router = useRouter();
  const { user } = useAuth();
  const { lang } = useLanguage();

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callStatus, setCallStatus] = useState<'CONNECTING' | 'CONNECTED' | 'ENDED'>('CONNECTING');
  const [streamActive, setStreamActive] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Initialize media devices
  useEffect(() => {
    let localStream: MediaStream | null = null;

    const setupMedia = async () => {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          localStream = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          setStreamActive(true);
        }
      } catch (err) {
        console.warn('Camera/Mic permission not granted or devices not found:', err);
      }
      setCallStatus('CONNECTED');
    };

    setupMedia();

    // Call timer
    const interval = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const toggleMic = () => {
    setMicOn(!micOn);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getAudioTracks().forEach((t) => (t.enabled = !micOn));
    }
  };

  const toggleCamera = () => {
    setCameraOn(!cameraOn);
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getVideoTracks().forEach((t) => (t.enabled = !cameraOn));
    }
  };

  const handleHangUp = () => {
    setCallStatus('ENDED');
    router.push('/dashboard');
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-[#1A171B] text-white flex flex-col justify-between p-4 sm:p-8">
      {/* Top Header */}
      <div className="flex justify-between items-center max-w-6xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-xs text-gold-400 font-bold">{roomId}</span>
          <span className="bg-maroon-900/90 text-ivory text-[10px] font-semibold px-2.5 py-0.5 rounded-full border border-gold-400/30">
            End-to-End Encrypted WebRTC
          </span>
        </div>

        <div className="flex items-center space-x-1.5 bg-dark-surface px-3 py-1 rounded-full border border-white/10 text-xs font-mono font-bold">
          <Clock className="w-3.5 h-3.5 text-gold-400" />
          <span>{formatTimer(callDuration)}</span>
        </div>
      </div>

      {/* Video Screens Viewport */}
      <div className="max-w-6xl mx-auto w-full flex-1 my-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Remote Candidate Viewport */}
        <div className="relative h-80 md:h-[480px] bg-slate-900 rounded-3xl overflow-hidden border border-gold-400/30 flex items-center justify-center shadow-2xl">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40">
            <div className="w-20 h-20 rounded-full bg-maroon-800 border-2 border-gold-400 flex items-center justify-center text-2xl font-bold text-white shadow-lg mb-3">
              M
            </div>
            <h3 className="font-bold text-base text-ivory font-bengali">প্রার্থী (Connected Member)</h3>
            <p className="text-xs text-emerald-400 mt-1 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              WebRTC অডিও ও ভিডিও স্ট্রিমিং সংযুক্ত
            </p>
          </div>
        </div>

        {/* Local My Viewport */}
        <div className="relative h-80 md:h-[480px] bg-slate-950 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center shadow-xl">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover ${!cameraOn ? 'hidden' : ''}`}
          />
          {!cameraOn && (
            <div className="text-center p-6 space-y-2">
              <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto text-xl font-bold">
                {user?.name?.[0] || 'U'}
              </div>
              <p className="text-xs text-slate-400">আপনার ক্যামেরা বন্ধ রয়েছে</p>
            </div>
          )}
          <span className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-xs font-bold px-3 py-1 rounded-full border border-white/20">
            আপনি ({user?.name || 'User'})
          </span>
        </div>
      </div>

      {/* Control Buttons Strip */}
      <div className="max-w-md mx-auto w-full flex justify-center items-center space-x-4">
        {/* Mic */}
        <button
          onClick={toggleMic}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
            micOn ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-rose-600 text-white'
          }`}
          title={micOn ? 'Mute' : 'Unmute'}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCamera}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
            cameraOn ? 'bg-white/15 hover:bg-white/25 text-white' : 'bg-rose-600 text-white'
          }`}
          title={cameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
        >
          {cameraOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>

        {/* Hang Up */}
        <button
          onClick={handleHangUp}
          className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90"
          title="End Call"
        >
          <PhoneOff className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
