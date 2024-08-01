"use client";
import React, { useState } from "react";
import { Button } from "../../components";
import useAudioRecorder from "@/hooks/useAudioRecorder";
import { getSpeechToText } from "@/actions/opean-ai.action";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
function convertStringToArray(input: string): string[] {
  return input
    .split(/\n/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}
export const AudioInterface = (): JSX.Element => {
  const [response, setResponse] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isRecording, audioURL, startRecording, stopRecording } =
    useAudioRecorder();

  const handleAudioSend = () => {
    startRecording();
  };

  const handleStop = () => {
    stopRecording();
  };

  const handlePlay = async () => {
    isRecording && stopRecording();
    setIsLoading(true);
    if (!audioURL) {
      return;
    }
    const response = await fetch(audioURL);
    const blob = await response.blob();
    const file = new File([blob], "audio.mp3", { type: "audio/mpeg" });
    const formData = new FormData();
    formData.append("file", file);
    getSpeechToText(formData).then((res) => {
      if (!res) {
        return;
      }
      setIsLoading(false);
      setResponse(convertStringToArray(res as unknown as string));
    });
  };
  return (
    <div className="flex flex-col items-center p-4 space-y-4 max-w-[500px] m-auto">
      {isLoading ? (
        <Card className="w-full">
          <div className="w-full h-32 p-2 border rounded animate-pulse bg-muted" />
        </Card>
      ) : (
        <>
          <Card className="min-h-32 flex flex-col gap-5">
            {response.map((item, index) => (
              <Label key={index} className="w-full">
                <Checkbox />
                <span>{item}</span>
              </Label>
            ))}
          </Card>
          <Card className="flex gap-4">
            <Button
              className="w-full"
              disabled={isRecording || !audioURL}
              onClick={handlePlay}
            >
              Hacer Lista
            </Button>
            <Button
              onClick={isRecording ? handleStop : handleAudioSend}
              className="w-full"
            >
              {isRecording ? "Grabando..." : "Grabar"}
            </Button>
          </Card>
        </>
      )}
    </div>
  );
};
