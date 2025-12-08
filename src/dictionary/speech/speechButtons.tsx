import { LanguageCode } from "@/app/LanguageSettings"
import { Button } from "@/components/ui/button"
import { listen } from "@/dictionary/speech/listen"
import { pronounce } from "@/dictionary/speech/pronounce"
import { Word } from "@/dictionary/Word"
import { cn } from "@/lib/utils"
import { useMicVolume } from "@/util/hooks/useMicVolume"
import { Log } from "@/util/Log"
import { AudioWaveform, Mic, Speech, Volume2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface SpeechProps {
  word: Word
  language: LanguageCode
}

/** Plays back the word */
export function PronounceButton({ word, language }: SpeechProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const play = async () => {
    setIsPlaying(true)
    const result = await pronounce(word, language)
    if (!result.ok) {
      toast.error(result.err.type)
    }
    setIsPlaying(false)
  }

  return (
    <button onClick={play} className="p-1">
      {isPlaying ? <AudioWaveform className="animate-pulse" /> : <Volume2 />}
    </button>
  )
}

/** Listens for the user to speak the word */
export function ListenButton({ word, language }: SpeechProps) {
  const [heard, setHeard] = useState<string | null>(null)

  const wordChars = word.split("")
  const heardChars = heard === null ? null : heard.split("")

  const listen_ = async () => {
    toast.info(`Listening for "${word}"...`)
    setHeard("")
    const { promise, notifyDoneTalking } = listen(language)

    setTimeout(() => {
      notifyDoneTalking()
      setHeard(null)
    }, 5000)

    // TODO: Future. Can actively stream the interim results by calling setHeard on each
    const heard = await promise
    if (heard.ok) {
      setHeard(heard.val)
    } else {
      toast.error("Listen error:" + heard.err.type)
    }
  }

  return (
    <button onClick={listen_} className="p-1 flex items-center flex-wrap gap-2">
      {heardChars === null ? <Mic /> : <ListeningIndicator />}
      {heardChars && (
        <div>
          {heardChars.map((char, i) => {
            return (
              <span
                key={i}
                className={cn(
                  wordChars.includes(char) ? "text-green-500" : "text-red-800"
                )}
              >
                {char}
              </span>
            )
          })}
        </div>
      )}
    </button>
  )
}

function ListeningIndicator() {
  const volume = useMicVolume()
  return <Speech style={{ opacity: volume + 0.3 }} className="animate-pulse" />
}
