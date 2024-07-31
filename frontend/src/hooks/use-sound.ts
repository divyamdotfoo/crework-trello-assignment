import { useRef, useEffect } from "react";

export const useSound = (uri: string) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.src = uri;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.src = "";
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [uri]);

  const play = (uri: string) => {
    if (audioRef.current) {
      console.log(audioRef.current.src);
      audioRef.current.src = uri;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { play, pause };
};
