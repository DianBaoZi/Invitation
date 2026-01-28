"use client";

import { Editor } from "@craftjs/core";
import { TopBar } from "./top-bar";
import { LeftSidebar } from "./left-sidebar";
import { Canvas } from "./canvas";
import { RightSidebar } from "./right-sidebar";
import {
  TextElement,
  HeadingElement,
  SubheadingElement,
  BodyTextElement,
  LoveQuoteElement,
  ButtonElement,
  YesButtonElement,
  RunawayNoButtonElement,
  ShrinkingNoButtonElement,
  NormalButtonElement,
  HeartElement,
  EmojiElement,
  DividerElement,
  Container,
} from "./canvas-elements";

export function EditorWrapper() {
  return (
    <Editor
      resolver={{
        TextElement,
        HeadingElement,
        SubheadingElement,
        BodyTextElement,
        LoveQuoteElement,
        ButtonElement,
        YesButtonElement,
        RunawayNoButtonElement,
        ShrinkingNoButtonElement,
        NormalButtonElement,
        HeartElement,
        EmojiElement,
        DividerElement,
        Container,
      }}
    >
      <div className="h-screen flex flex-col overflow-hidden">
        <TopBar />
        <div className="flex-1 flex overflow-hidden">
          <LeftSidebar />
          <Canvas />
          <RightSidebar />
        </div>
      </div>
    </Editor>
  );
}
