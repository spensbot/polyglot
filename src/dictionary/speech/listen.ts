import { BaseError, Err, Ok, Result } from "@/util/result/Result";

interface InitListenError extends BaseError {
  type:
  | "no-speech-recognition"
  | "start-failed";
}

export interface ListenError extends BaseError {
  type:
  | "no-speech-recognition"
  | "start-failed"
  | SpeechRecognitionErrorCode
  | "no-match"
  | "other";
}

export function listen(language: string) {
  type PromiseResult = Result<string, ListenError>;

  const recognition_ = getSpeechRecognition()

  const promise: Promise<PromiseResult> = new Promise((resolve) => {
    if (!recognition_.ok) return resolve(Err(recognition_.err));
    const recognition = recognition_.val;

    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? "";
      resolve(Ok(transcript));
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      resolve(Err({
        type: event.error,
        message: `Speech recognition error: ${event.error}`,
        originalError: event.error
      }));
    };

    recognition.onnomatch = () => {
      resolve(Err({
        type: 'no-match',
        message: "Speech could not be recognized."
      }));
    };

    recognition.onend = () => {
      // If end happens before result/no-match/error, we still want graceful handling.
      // But if already resolved, this does nothing (promise can't resolve twice).
    };

    try {
      recognition.start();
    } catch (e: any) {
      resolve(Err({
        type: "start-failed",
        message: "Failed to start speech recognition.",
        originalError: e
      }));
    }
  });

  const notifyDoneTalking = () => {
    try {
      if (recognition_.ok) {
        recognition_.val.stop();
      }
    } catch {
      // Ignore safely; do not throw
    }
  };

  return { promise, notifyDoneTalking };
}

function getSpeechRecognition(): Result<SpeechRecognition, InitListenError> {
  const SpeechRec =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRec) {
    return Err({
      type: "no-speech-recognition",
      message: "Browser does not support Speech Recognition."
    })
  }

  try {
    return Ok(new SpeechRec());
  } catch (e: any) {
    return Err({
      type: "start-failed",
      message: "Failed to initialize speech recognition.",
      originalError: e
    })
  }
}