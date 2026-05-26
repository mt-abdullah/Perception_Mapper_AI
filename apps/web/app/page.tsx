"use client";

import React from "react";
import LandingRedirect from "../components/LandingRedirect";
import Preloader from "../components/Preloader";

export default function PerceptionLanding() {
  return (
    <div className="min-h-screen bg-slate-955 flex items-center justify-center">
      <LandingRedirect />
      <Preloader message="INITIALIZING WORKSPACE ACCESS..." />
    </div>
  );
}

export const dynamic = "force-dynamic";
