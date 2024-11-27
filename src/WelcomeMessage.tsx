import React from "react";

type Props = {
  name: string;
  uncompletedCount: number;
  onNameChange: (name: string) => void;
};

const WelcomeMessage = ({ name, uncompletedCount, onNameChange }: Props) => {
  const currentTime = new Date();
  const greeting =
    currentTime.getHours() < 12 ? "おはようございます" : "こんにちは";

  return (
    <div className="rounded-lg bg-white p-4 shadow-md">
      <div className="mb-2 flex items-center text-blue-700">
        <span>{greeting}、</span>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          className="mx-2 rounded border border-gray-300 px-2 py-1 focus:border-blue-500 focus:outline-none"
          placeholder="名前を入力"
        />
        <span>さん。</span>
      </div>
      <div className="text-blue-700">
        現在の未完了タスクは{uncompletedCount}個です。
      </div>
    </div>
  );
};

export default WelcomeMessage;
