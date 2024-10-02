"use client";

import Header from "@/components/header";
import GameSetupModal from "@/components/modal";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(true);
  return (
    <div>
      <Header onRestart={() => setIsModalOpen(true)} />

      <GameSetupModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
}
