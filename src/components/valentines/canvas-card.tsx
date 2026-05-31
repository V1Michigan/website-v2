"use client";

import React, { useRef, useEffect } from "react";

export type ImagePosition = "top" | "center" | "bottom";

interface CanvasCardProps {
  backgroundColor: string;
  messageText: string;
  imageUrl?: string | null;
  recipientName?: string | null;
  width?: number;
  height?: number;
  className?: string;
  /** Message text font size in px. Default 24. */
  fontSize?: number;
  /** Where to place the photo on the card. Default "top". */
  imagePosition?: ImagePosition;
}

const DEFAULT_WIDTH = 320;
const DEFAULT_HEIGHT = 400;

/** Reference size: all dimensions scale from this so preview and export match. */
const REF_WIDTH = 400;
const REF_HEIGHT = 500;
const BASE_MSG_FONT_SIZE = 38;
const BASE_NAME_FONT_SIZE = 46;
const BASE_NAME_LINE_HEIGHT = 54;
const DEFAULT_FONT_SIZE = BASE_MSG_FONT_SIZE;
const NAME_FONT_SIZE = BASE_NAME_FONT_SIZE;
const NAME_LINE_HEIGHT = BASE_NAME_LINE_HEIGHT;

const MESSAGE_FONT = "Instrument Serif";
const NAME_FONT = "Playfair Display";

function getTextFont(size: number) {
  return `${size}px "${MESSAGE_FONT}", Georgia, serif`;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  fontSize: number = DEFAULT_FONT_SIZE,
  fontOverride?: string
): string[] {
  const raw = (text || "").trim();
  if (!raw) return [];
  ctx.font = fontOverride ?? getTextFont(fontSize);
  const lines: string[] = [];
  const words = raw.split(/\s+/).filter(Boolean);
  let currentLine = "";

  for (const word of words) {
    const chunk = currentLine ? ` ${word}` : word;
    const testLine = currentLine + chunk;
    if (ctx.measureText(testLine).width <= maxWidth) {
      currentLine = testLine;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      currentLine = "";
    }

    // Word is too long; break it by character so it wraps
    let segment = "";
    for (const char of word) {
      const next = segment + char;
      if (ctx.measureText(next).width > maxWidth && segment) {
        lines.push(segment);
        segment = char;
      } else {
        segment = next;
      }
    }
    currentLine = segment;
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function drawCard(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  backgroundColor: string,
  messageText: string,
  recipientName: string | null,
  image: HTMLImageElement | null
) {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  const sizeScale = Math.min(width / REF_WIDTH, height / REF_HEIGHT);
  const minGap = 16;

  let fontScale = 1;
  const maxIterations = 8;
  let messageFontSize = BASE_MSG_FONT_SIZE;
  let nameFontSize = BASE_NAME_FONT_SIZE;
  let paddingBottom = 28;
  let paddingTop = 56;
  let gap = 20;
  let nameLineHeight = BASE_NAME_LINE_HEIGHT;
  let lineHeight = 48;
  let messageLines: string[] = [];
  let nameLines: string[] = [];
  let nameFont = `italic 600 ${nameFontSize}px "${NAME_FONT}", Georgia, serif`;
  let maxTextWidth = 352;
  let nameMaxWidth = 368;
  let messageBlockHeight = 100;
  let yAfterName = paddingTop;
  let imageTop = 0;
  let imageAvailableHeight = 0;
  const imageAvailableWidth = width * 0.92;
  let drawH = 0;
  let imageBottom = 0;
  let textY = 0;
  let messageTop = 0;

  for (let iter = 0; iter < maxIterations; iter++) {
    messageFontSize = Math.round(BASE_MSG_FONT_SIZE * sizeScale * fontScale);
    nameFontSize = Math.round(BASE_NAME_FONT_SIZE * sizeScale * fontScale);
    nameLineHeight = Math.round(BASE_NAME_LINE_HEIGHT * sizeScale * fontScale);
    lineHeight = Math.round(messageFontSize * 1.25);
    paddingBottom = Math.round(28 * sizeScale);
    paddingTop = Math.round(Math.max(28 * sizeScale, nameFontSize + 14 * sizeScale));
    gap = Math.max(minGap, Math.round(20 * sizeScale));

    maxTextWidth = Math.max(width - Math.round(48 * sizeScale), 40);
    nameMaxWidth = Math.max(width - Math.round(32 * sizeScale), 60);

    ctx.font = getTextFont(messageFontSize);
    messageLines = wrapText(
      ctx,
      messageText || "Your message here...",
      maxTextWidth,
      messageFontSize
    );
    messageBlockHeight = messageLines.length * lineHeight + paddingBottom;

    yAfterName = paddingTop;
    nameFont = `italic 600 ${nameFontSize}px "${NAME_FONT}", Georgia, serif`;
    nameLines = [];
    if (recipientName && recipientName.trim()) {
      ctx.font = nameFont;
      nameLines = wrapText(
        ctx,
        `For ${recipientName.trim()}`,
        nameMaxWidth,
        nameFontSize,
        nameFont
      );
      yAfterName += nameLines.length * nameLineHeight + gap;
    }

    imageTop = yAfterName;
    imageAvailableHeight = height - imageTop - messageBlockHeight - gap;

    drawH = 0;
    if (
      image &&
      image.complete &&
      image.naturalWidth > 0 &&
      imageAvailableHeight > 40
    ) {
      const imgScale = Math.min(
        imageAvailableWidth / image.naturalWidth,
        imageAvailableHeight / image.naturalHeight
      );
      drawH = image.naturalHeight * imgScale;
    }
    imageBottom = imageTop + drawH;
    textY = height - paddingBottom - messageLines.length * lineHeight;
    messageTop = textY - (messageLines.length > 0 ? lineHeight : 0);

    const overlap = messageTop < imageBottom + gap;
    if (!overlap || fontScale <= 0.5) break;
    fontScale *= 0.85;
  }

  let yOffset = paddingTop;

  if (recipientName && recipientName.trim() && nameLines.length > 0) {
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.font = nameFont;
    ctx.textAlign = "center";
    nameLines.forEach((line) => {
      ctx.fillText(line, width / 2, yOffset);
      yOffset += nameLineHeight;
    });
    yOffset += gap;
  }

  imageTop = yOffset;
  imageAvailableHeight = height - imageTop - messageBlockHeight - gap;

  if (
    image &&
    image.complete &&
    image.naturalWidth > 0 &&
    imageAvailableHeight > 40
  ) {
    const imgScale = Math.min(
      imageAvailableWidth / image.naturalWidth,
      imageAvailableHeight / image.naturalHeight
    );
    const drawW = image.naturalWidth * imgScale;
    drawH = image.naturalHeight * imgScale;
    const x = (width - drawW) / 2;
    ctx.drawImage(image, x, imageTop, drawW, drawH);
  }

  ctx.fillStyle = "#ffffff";
  ctx.font = getTextFont(messageFontSize);
  ctx.textAlign = "center";
  textY = height - paddingBottom - messageLines.length * lineHeight;
  messageLines.forEach((line) => {
    ctx.fillText(line, width / 2, textY);
    textY += lineHeight;
  });
}

const EXPORT_WIDTH = 800;
const EXPORT_HEIGHT = 1000;

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

/**
 * Renders the full card (background, "For X", image, wrapped text) to a PNG blob
 * for uploading. Use this instead of uploading the raw image file.
 */
export function renderCardToBlob(options: {
  backgroundColor: string;
  messageText: string;
  recipientName?: string | null;
  imageUrl?: string | null;
  width?: number;
  height?: number;
}): Promise<Blob> {
  const width = options.width ?? EXPORT_WIDTH;
  const height = options.height ?? EXPORT_HEIGHT;
  const recipient = (options.recipientName ?? "").trim() || null;
  const imgSrc = (options.imageUrl ?? "").trim();

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.reject(new Error("Could not get canvas context"));

  const draw = (img: HTMLImageElement | null) => {
    drawCard(
      ctx,
      width,
      height,
      options.backgroundColor,
      options.messageText || "Your message here...",
      recipient,
      img
    );
  };

  if (!imgSrc) {
    draw(null);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/png"
      );
    });
  }

  return loadImage(imgSrc).then((img) => {
    draw(img);
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("toBlob failed"))),
        "image/png"
      );
    });
  });
}

export default function CanvasCard({
  backgroundColor,
  messageText,
  imageUrl,
  recipientName,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  className = "",
}: CanvasCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });
  const imageRef = useRef<HTMLImageElement | null>(null);
  const imageUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio ?? 1;
    const needsResize =
      sizeRef.current.width !== width || sizeRef.current.height !== height;
    if (needsResize) {
      sizeRef.current = { width, height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    } else {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }

    const imgSrc = (imageUrl || "").trim();
    const recipient = recipientName?.trim() ?? null;

    if (!imgSrc) {
      imageRef.current = null;
      imageUrlRef.current = null;
      drawCard(ctx, width, height, backgroundColor, messageText, recipient, null);
      return;
    }

    const cachedImg = imageRef.current;
    const cachedUrl = imageUrlRef.current;
    const useCached =
      cachedImg &&
      cachedImg.complete &&
      cachedImg.naturalWidth > 0 &&
      cachedUrl === imgSrc;

    if (useCached) {
      drawCard(ctx, width, height, backgroundColor, messageText, recipient, cachedImg);
      return;
    }

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const img = new Image();
    img.crossOrigin = "anonymous";
    const src = imgSrc.startsWith("data:") ? imgSrc : imgSrc;
    img.onload = () => {
      imageRef.current = img;
      imageUrlRef.current = imgSrc;
      const c = canvasRef.current;
      if (!c) return;
      const ctx2 = c.getContext("2d");
      if (!ctx2) return;
      const dpr2 = window.devicePixelRatio ?? 1;
      ctx2.setTransform(1, 0, 0, 1, 0, 0);
      ctx2.scale(dpr2, dpr2);
      drawCard(ctx2, width, height, backgroundColor, messageText, recipient, img);
    };
    img.onerror = () => {};
    img.src = src;
  }, [backgroundColor, messageText, imageUrl, recipientName, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={`rounded-2xl shadow-lg ${className}`}
    />
  );
}
