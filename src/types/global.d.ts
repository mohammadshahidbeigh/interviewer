interface Window {
  webkitSpeechRecognition: typeof SpeechRecognition;
  SpeechRecognition: {
    new (): {
      continuous: boolean;
      interimResults: boolean;
      onresult: (event: {
        resultIndex: number;
        results: {
          [x: number]: {
            [x: number]: {
              transcript: string;
            };
            isFinal: boolean;
          };
          length: number;
        };
      }) => void;
      onerror: (event: {error: string}) => void;
      start: () => void;
      stop: () => void;
    };
  };
}
