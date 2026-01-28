"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, AlertCircle, ArrowLeft, ArrowRight, Calendar, Clock, MapPin, PenLine, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTemplateById } from "@/lib/supabase/templates";

function CustomizePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template") || "scratch-reveal";
  const template = getTemplateById(templateId);

  const isLoveLetter = templateId === "love-letter-mailbox";

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewSplash, setPreviewSplash] = useState(true);

  // Template-specific fields
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [personalMessage, setPersonalMessage] = useState("");

  // Multi-step for love-letter-mailbox
  const [step, setStep] = useState(1);

  // Build dynamic preview URL with live form values
  const buildPreviewUrl = () => {
    const params = new URLSearchParams({ nosplash: "true" });
    if (name.trim()) params.set("name", name.trim());
    if (templateId === "love-letter-mailbox") {
      if (date.trim()) params.set("date", date.trim());
      if (location.trim()) params.set("location", location.trim());
      if (personalMessage.trim()) params.set("personalMessage", personalMessage.trim());
    }
    if (templateId === "cozy-scrapbook") {
      if (date.trim()) params.set("eventDate", date.trim());
      if (time.trim()) params.set("eventTime", time.trim());
      if (location.trim()) params.set("eventLocation", location.trim());
    }
    if (templateId === "stargazer" || templateId === "premiere") {
      if (message.trim()) params.set("message", message.trim());
      if (personalMessage.trim()) params.set("personalMessage", personalMessage.trim());
      if (date.trim()) params.set("date", date.trim());
      if (time.trim()) params.set("time", time.trim());
      if (location.trim()) params.set("location", location.trim());
    }
    return `/test/${templateId}?${params.toString()}`;
  };

  // Generate slug: name-4random
  const generateSlug = (name: string) => {
    const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "invite";
    const random = Math.random().toString(36).substring(2, 6);
    return `${cleanName}-${random}`;
  };

  // Get default message based on template
  const getDefaultMessage = (tid: string) => {
    switch (tid) {
      case "scratch-reveal":
        return "You're invited to something special!";
      case "love-letter-mailbox":
        return "I've been wanting to ask you this...";
      default:
        return "Will you be my Valentine?";
    }
  };

  // Handle next step for love letter
  const handleNext = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    setStep(2);
  };

  // Handle submit
  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    setShowConfirm(true);
  };

  // Confirm and redirect
  const handleConfirm = () => {
    const slug = generateSlug(name);
    const params = new URLSearchParams({
      slug,
      name: name.trim(),
      message: message.trim() || getDefaultMessage(templateId),
      template: templateId,
    });

    // Add template-specific params
    if (templateId === "love-letter-mailbox") {
      if (date.trim()) params.set("date", date.trim());
      if (location.trim()) params.set("location", location.trim());
      if (personalMessage.trim()) params.set("personalMessage", personalMessage.trim());
    }
    if (templateId === "cozy-scrapbook") {
      if (date.trim()) params.set("eventDate", date.trim());
      if (time.trim()) params.set("eventTime", time.trim());
      if (location.trim()) params.set("eventLocation", location.trim());
    }
    if (templateId === "stargazer" || templateId === "premiere") {
      if (personalMessage.trim()) params.set("personalMessage", personalMessage.trim());
      if (date.trim()) params.set("date", date.trim());
      if (time.trim()) params.set("time", time.trim());
      if (location.trim()) params.set("location", location.trim());
    }

    router.push(`/success?${params.toString()}`);
  };

  // ==========================================
  // LOVE LETTER MAILBOX — TWO-STEP FLOW
  // ==========================================
  if (isLoveLetter) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-red-50">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-20 p-4 md:p-6 border-b border-pink-100 bg-white/50 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto flex items-center gap-4">
            <button
              onClick={() => step === 3 ? setStep(2) : step === 2 ? setStep(1) : router.back()}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                {step === 1 ? "Customize your splash" : step === 2 ? "Customize your invite" : "Preview your invite"}
              </h1>
              <p className="text-gray-500 text-sm">
                {template ? `${template.emoji} ${template.name}` : templateId}
                {" · "}Step {step} of 3
              </p>
            </div>
          </div>
        </motion.div>

        {/* Step 3: Full Preview */}
        {step === 3 && (
          <FullPreview
            name={name}
            date={date}
            location={location}
            personalMessage={personalMessage}
            onBack={() => setStep(2)}
            onGenerate={handleSubmit}
          />
        )}

        {/* Main content — steps 1 & 2 */}
        {step !== 3 && (
        <div className="max-w-6xl mx-auto p-4 md:p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Form — animated between steps */}
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1-form"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -60 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                >
                  <div className="space-y-6">
                    <div className="text-center pb-2">
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Heart className="w-10 h-10 mx-auto text-pink-400 fill-pink-400 mb-3" />
                      </motion.div>
                      <h2 className="text-lg font-bold text-gray-800">Who is this from?</h2>
                      <p className="text-sm text-gray-500 mt-1">This will appear on the splash screen your recipient sees first</p>
                    </div>

                    {/* Name input */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 font-medium">
                        Your name
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Daniel"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                      />
                    </div>

                    {/* Next button */}
                    <Button
                      onClick={handleNext}
                      className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
                    >
                      Next
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2-form"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 60 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
                >
                  <div className="space-y-6">
                    <div className="text-center pb-2">
                      <h2 className="text-lg font-bold text-gray-800">Set your date details</h2>
                      <p className="text-sm text-gray-500 mt-1">These appear on the love letter card</p>
                    </div>

                    {/* Date & Time */}
                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-700 font-medium flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        Date & Time
                      </Label>
                      <Input
                        id="date"
                        type="text"
                        placeholder="Feb 14th @ 7:30 PM"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700 font-medium flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-pink-400" />
                        Location
                      </Label>
                      <Input
                        id="location"
                        type="text"
                        placeholder="The Little Italian Place"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                      />
                    </div>

                    {/* Personal Message */}
                    <div className="space-y-2">
                      <Label htmlFor="personalMessage" className="text-gray-700 font-medium flex items-center gap-1.5">
                        <PenLine className="w-4 h-4 text-pink-400" />
                        Personal Message
                      </Label>
                      <textarea
                        id="personalMessage"
                        placeholder="You make every moment feel like a fairytale. I can't imagine spending this day with anyone else."
                        value={personalMessage}
                        onChange={(e) => setPersonalMessage(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:border-pink-300 focus:ring-2 focus:ring-pink-200 focus:outline-none resize-none"
                        style={{
                          fontFamily: "'Poppins', sans-serif",
                          fontStyle: "italic",
                          fontSize: "15px",
                          lineHeight: 1.7,
                          color: "#880e4f",
                        }}
                      />
                      <p className="text-sm text-gray-500">
                        This appears on a dedicated card in cursive
                      </p>
                    </div>

                    {/* Preview button */}
                    <Button
                      onClick={() => setStep(3)}
                      className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white shadow-lg"
                    >
                      <Eye className="w-5 h-5 mr-2" />
                      Preview your invite
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preview — changes based on step */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              {/* Step indicator pills */}
              <div className="flex items-center gap-1.5 bg-white rounded-xl p-1.5 shadow-sm border border-pink-100">
                <div
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                    step === 1
                      ? "bg-pink-500 text-white shadow-md"
                      : "text-gray-400"
                  }`}
                >
                  1. Splash
                </div>
                <div
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                    step === 2
                      ? "bg-rose-500 text-white shadow-md"
                      : "text-gray-400"
                  }`}
                >
                  2. Details
                </div>
                <div
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold text-center transition-all ${
                    step === 3
                      ? "bg-red-500 text-white shadow-md"
                      : "text-gray-400"
                  }`}
                >
                  3. Preview
                </div>
              </div>

              {/* Preview container */}
              <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] max-h-[500px]">
                <div className="absolute inset-0 border-[3px] border-gray-800 rounded-2xl pointer-events-none z-10" />

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <SplashPreview key="splash" name={name} />
                  ) : (
                    <LoveLetterCardPreview
                      key="card"
                      date={date || "Feb 14th @ 7:30 PM"}
                      location={location || "The Little Italian Place"}
                      personalMessage={personalMessage || "You make every moment feel like a fairytale. I can't imagine spending this day with anyone else."}
                    />
                  )}
                </AnimatePresence>
              </div>

              <p className="text-center text-sm text-gray-500">
                {step === 1
                  ? "Your recipient sees this splash first"
                  : "Edit fields on the left to see changes here"}
              </p>
            </motion.div>
          </div>
        </div>
        )}

        {/* Confirmation Modal */}
        <AnimatePresence>
          {showConfirm && (
            <ConfirmModal
              name={name}
              onConfirm={handleConfirm}
              onCancel={() => setShowConfirm(false)}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ==========================================
  // ALL OTHER TEMPLATES — EXISTING SINGLE-PAGE
  // ==========================================
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 md:p-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm"
      >
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Customize your invite
            </h1>
            <p className="text-gray-500 text-sm">
              {template ? `${template.emoji} ${template.name}` : templateId}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          >
            <div className="space-y-6">
              {/* Name input */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 font-medium">
                  Your name
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Daniel"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                />
                <p className="text-sm text-gray-500">
                  This will appear on the splash screen
                </p>
              </div>

              {/* Message input */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-gray-700 font-medium">
                  Your message
                </Label>
                <Input
                  id="message"
                  type="text"
                  placeholder={getDefaultMessage(templateId)}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                />
                <p className="text-sm text-gray-500">
                  Leave blank for default message
                </p>
              </div>

              {/* Stargazer fields */}
              {templateId === "stargazer" && (
                <>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-indigo-700 mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Stargazer Details
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="personalMessage" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <PenLine className="w-4 h-4 text-gray-400" />
                      Personal Message
                    </Label>
                    <textarea
                      id="personalMessage"
                      placeholder="Every moment with you feels like stargazing..."
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-200 focus:outline-none resize-none"
                      style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        color: "#312e81",
                      }}
                    />
                    <p className="text-sm text-gray-500">
                      Appears as a stardust letter in the night sky
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="starDate" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Date
                    </Label>
                    <Input
                      id="starDate"
                      type="text"
                      placeholder="February 14th"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="starTime" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Time
                    </Label>
                    <Input
                      id="starTime"
                      type="text"
                      placeholder="7:00 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="starLocation" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      Location
                    </Label>
                    <Input
                      id="starLocation"
                      type="text"
                      placeholder="Under the stars"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-indigo-300 focus:ring-indigo-200"
                    />
                  </div>
                </>
              )}

              {/* Premiere fields */}
              {templateId === "premiere" && (
                <>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-amber-700 mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Premiere Details
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premPersonalMessage" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <PenLine className="w-4 h-4 text-gray-400" />
                      Personal Message
                    </Label>
                    <textarea
                      id="premPersonalMessage"
                      placeholder="Every scene of my life is better with you in it."
                      value={personalMessage}
                      onChange={(e) => setPersonalMessage(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 text-base rounded-xl border border-gray-200 focus:border-amber-300 focus:ring-2 focus:ring-amber-200 focus:outline-none resize-none"
                      style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontStyle: "italic",
                        fontSize: "15px",
                        lineHeight: 1.7,
                        color: "#78350f",
                      }}
                    />
                    <p className="text-sm text-gray-500">
                      Scrolls like film credits on the big screen
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premDate" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Date
                    </Label>
                    <Input
                      id="premDate"
                      type="text"
                      placeholder="February 14th"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-amber-300 focus:ring-amber-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premTime" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Time
                    </Label>
                    <Input
                      id="premTime"
                      type="text"
                      placeholder="7:00 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-amber-300 focus:ring-amber-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premLocation" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      Venue
                    </Label>
                    <Input
                      id="premLocation"
                      type="text"
                      placeholder="The usual spot"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-amber-300 focus:ring-amber-200"
                    />
                  </div>
                </>
              )}

              {/* Cozy Scrapbook fields */}
              {(templateId === "cozy-scrapbook") && (
                <>
                  <div className="border-t border-gray-100 pt-4">
                    <p className="text-sm font-semibold text-amber-700 mb-4 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      Scrapbook Event Details
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventDate" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      Event Date
                    </Label>
                    <Input
                      id="eventDate"
                      type="text"
                      placeholder="Valentine's Day"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventTime" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-gray-400" />
                      Event Time
                    </Label>
                    <Input
                      id="eventTime"
                      type="text"
                      placeholder="7:30 PM"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="eventLocation" className="text-gray-700 font-medium flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      Event Location
                    </Label>
                    <Input
                      id="eventLocation"
                      type="text"
                      placeholder="Somewhere romantic"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="h-12 text-lg rounded-xl border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                    />
                  </div>
                </>
              )}

              {/* Template indicator */}
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center gap-2 text-purple-700">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">
                    Template: {template ? template.name : templateId}
                  </span>
                </div>
              </div>

              {/* Submit button */}
              <Button
                onClick={handleSubmit}
                className="w-full h-14 text-lg font-semibold rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Generate my link
              </Button>
            </div>
          </motion.div>

          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {/* Toggle buttons */}
            <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
              <button
                onClick={() => setPreviewSplash(true)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  previewSplash
                    ? "bg-purple-500 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Splash Screen
              </button>
              <button
                onClick={() => setPreviewSplash(false)}
                className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
                  !previewSplash
                    ? "bg-pink-500 text-white shadow-md"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                }`}
              >
                Invite Preview
              </button>
            </div>

            {/* Preview container */}
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl aspect-[9/16] max-h-[500px]">
              {/* Phone frame effect */}
              <div className="absolute inset-0 border-[3px] border-gray-800 rounded-2xl pointer-events-none z-10" />

              <AnimatePresence mode="wait">
                {previewSplash ? (
                  <SplashPreview key="splash" name={name} />
                ) : (
                  <motion.div
                    key="invite"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0"
                  >
                    <iframe
                      src={buildPreviewUrl()}
                      className="w-full h-full border-0"
                      title={`${template?.name || templateId} preview`}
                      allow="autoplay"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <p className="text-center text-sm text-gray-500">
              Recipients see the splash screen first, then your invite
            </p>
          </motion.div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <ConfirmModal
            name={name}
            onConfirm={handleConfirm}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// FULL PREVIEW (Step 3)
// ============================================

function FullPreview({
  name,
  date,
  location,
  personalMessage,
  onBack,
  onGenerate,
}: {
  name: string;
  date: string;
  location: string;
  personalMessage: string;
  onBack: () => void;
  onGenerate: () => void;
}) {
  const previewParams = new URLSearchParams();
  if (name.trim()) previewParams.set("name", name.trim());
  if (date.trim()) previewParams.set("date", date.trim());
  if (location.trim()) previewParams.set("location", location.trim());
  if (personalMessage.trim()) previewParams.set("personalMessage", personalMessage.trim());

  const previewUrl = `/test/love-letter-mailbox?${previewParams.toString()}`;

  return (
    <div className="fixed inset-0 z-40 bg-black">
      <iframe
        src={previewUrl}
        className="w-full h-full border-0"
        title="Full invite preview"
        allow="autoplay"
      />

      {/* Floating toolbar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl px-4 py-3 border border-gray-200"
      >
        <Button
          onClick={onBack}
          variant="outline"
          className="h-11 px-5 rounded-xl font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to edit
        </Button>
        <Button
          onClick={onGenerate}
          className="h-11 px-5 rounded-xl font-semibold bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white"
        >
          <Heart className="w-4 h-4 mr-2" />
          Generate my link
        </Button>
      </motion.div>
    </div>
  );
}

// ============================================
// SPLASH PREVIEW
// ============================================

function SplashPreview({ name }: { name: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-rose-100 via-pink-50 to-purple-100"
    >
      <div className="text-center px-6">
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="mb-4"
        >
          <Heart className="w-12 h-12 mx-auto text-pink-500 fill-pink-500" />
        </motion.div>

        <p className="text-gray-600 mb-1">Wholeheartedly made by</p>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
          {name || "Your Name"}
        </h2>
      </div>
    </motion.div>
  );
}

// ============================================
// LOVE LETTER CARD PREVIEW (inline, real-time)
// ============================================

function LoveLetterCardPreview({
  date,
  location,
  personalMessage,
}: {
  date: string;
  location: string;
  personalMessage: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #fce4ec 0%, #f8bbd0 30%, #f5d6d6 100%)",
      }}
    >
      <div className="flex flex-col items-center gap-6 px-4 py-8">
        {/* Card 2: Details card with date/location */}
        <div className="rounded-2xl overflow-hidden relative w-full max-w-[280px]"
          style={{ boxShadow: "0 6px 24px rgba(233,30,99,0.12)" }}
        >
          <img
            src="/images/valentine-card2.png"
            alt="Valentine's Card"
            className="w-full h-auto"
          />
          <div className="absolute inset-0">
            <p
              className="absolute truncate"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(7px, 2.5vw, 11px)",
                color: "#c62828",
                bottom: "31%",
                left: "35%",
                right: "10%",
              }}
            >
              {date}
            </p>
            <p
              className="absolute truncate"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(7px, 2.5vw, 11px)",
                color: "#c62828",
                bottom: "18%",
                left: "30%",
                right: "10%",
              }}
            >
              {location}
            </p>
          </div>
        </div>

        {/* Ribbon dot */}
        <div className="w-3 h-3 rounded-full bg-rose-200 border-2 border-white shadow-sm" />

        {/* Card 4: Personal message with image */}
        <div className="rounded-2xl relative w-full max-w-[280px] overflow-hidden"
          style={{ boxShadow: "0 6px 24px rgba(233,30,99,0.12)" }}
        >
          <img
            src="/images/fourth-card.png"
            alt="Personal Message Card"
            className="w-full h-auto rounded-2xl"
          />
          <div
            className="absolute"
            style={{
              top: "38%",
              left: "18%",
              right: "15%",
              bottom: "10%",
            }}
          >
            <p
              className="whitespace-pre-line break-words overflow-hidden"
              style={{
                fontFamily: "'Poppins', sans-serif",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: "clamp(8px, 2.5vw, 12px)",
                color: "#fff0f3",
                lineHeight: 1.7,
                textShadow: "0 1px 4px rgba(0,0,0,0.15)",
              }}
            >
              {personalMessage}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================
// CONFIRMATION MODAL
// ============================================

function ConfirmModal({
  name,
  onConfirm,
  onCancel,
}: {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <AlertCircle className="w-12 h-12 mx-auto text-amber-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ready to generate?
          </h3>
          <p className="text-gray-600">
            Your invite will be created for <strong>{name}</strong>. You can&apos;t change this once submitted.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={onCancel}
            variant="outline"
            className="flex-1 h-12 rounded-xl"
          >
            Go back
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white"
          >
            Generate link
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ============================================
// MAIN EXPORT WITH SUSPENSE
// ============================================

export default function CustomizePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="w-12 h-12 text-pink-500" />
          </motion.div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <CustomizePageContent />
    </Suspense>
  );
}
