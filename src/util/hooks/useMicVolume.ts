import { useEffect, useRef, useState } from "react";

export function useMicVolume() {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let cleanup = () => { };

    const init = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 512;
        analyserRef.current = analyser;

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        dataArrayRef.current = dataArray;

        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;

        source.connect(analyser);

        const tick = () => {
          if (!analyserRef.current || !dataArrayRef.current) return;

          analyserRef.current.getByteTimeDomainData(dataArrayRef.current as Uint8Array<ArrayBuffer>);

          // Compute RMS volume
          let sum = 0;
          for (let i = 0; i < dataArrayRef.current.length; i++) {
            const val = (dataArrayRef.current[i] - 128) / 128; // normalize -1..1
            sum += val * val;
          }
          const rms = Math.sqrt(sum / dataArrayRef.current.length);

          setVolume(rms); // returns 0 → 1

          rafRef.current = requestAnimationFrame(tick);
        };

        tick();

        cleanup = () => {
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          if (sourceRef.current) sourceRef.current.disconnect();
          if (analyserRef.current) analyserRef.current.disconnect();
          if (audioContextRef.current) audioContextRef.current.close();
          stream.getTracks().forEach((t) => t.stop());
        };
      } catch (err) {
        console.error("Microphone error:", err);
      }
    };

    init();
    return cleanup;
  }, []);

  return volume;
}