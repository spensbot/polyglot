import { LanguageCode } from "@/app/LanguageSettings";
import { Result } from "@/util/result/Result";

export interface PronounceError {
  type: "NoSpeechSynthesis" | "NoVoices" | "SpeakFailed";
  message: string;
  originalError?: any;
}

export function pronounce(
  phrase: string,
  language: LanguageCode
): Promise<Result<void, PronounceError>> {
  return new Promise((resolve) => {
    if (!("speechSynthesis" in window)) {
      resolve({
        ok: false,
        err: {
          type: "NoSpeechSynthesis",
          message: "Browser does not support Speech Synthesis."
        }
      });
      return;
    }

    const synth = window.speechSynthesis;
    let voices = synth.getVoices();

    // Some browsers load voices asynchronously
    if (voices.length === 0) {
      synth.onvoiceschanged = () => {
        voices = synth.getVoices();
      };
    }

    const utter = new SpeechSynthesisUtterance(phrase);
    utter.lang = language;

    // Use the first matching voice, fallback to default
    const matching = voices.find(v => v.lang.startsWith(language));
    if (matching) utter.voice = matching;

    utter.onerror = (event) => {
      resolve({
        ok: false,
        err: {
          type: "SpeakFailed",
          message: "Speech synthesis failed.",
          originalError: event.error
        }
      });
    };

    utter.onend = () => {
      resolve({ ok: true, val: undefined });
    };

    try {
      synth.speak(utter);
    } catch (e: any) {
      resolve({
        ok: false,
        err: {
          type: "SpeakFailed",
          message: "Failed to start speech synthesis.",
          originalError: e
        }
      });
    }
  });
}