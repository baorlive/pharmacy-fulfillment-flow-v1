import React from 'react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
  style?: React.CSSProperties;
}

const Search = () => <path fill="currentColor" d="m29 27.586l-7.552-7.552a11.018 11.018 0 1 0-1.414 1.414L27.586 29ZM4 13a9 9 0 1 1 9 9a9.01 9.01 0 0 1-9-9"/>;
const Check = () => <path fill="currentColor" d="m13 24l-9-9l1.414-1.414L13 21.171L26.586 7.586L28 9z"/>;
const CloseIcon = () => <path fill="currentColor" d="M17.414 16L24 9.414L22.586 8L16 14.586L9.414 8L8 9.414L14.586 16L8 22.586L9.414 24L16 17.414L22.586 24L24 22.586z"/>;
const Time = () => <><path fill="currentColor" d="M16 30a14 14 0 1 1 14-14a14 14 0 0 1-14 14m0-26a12 12 0 1 0 12 12A12 12 0 0 0 16 4"/><path fill="currentColor" d="M20.59 22L15 16.41V7h2v8.58l5 5.01z"/></>;
const Document = () => <><path fill="currentColor" d="m25.7 9.3l-7-7c-.2-.2-.4-.3-.7-.3H8c-1.1 0-2 .9-2 2v24c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V10c0-.3-.1-.5-.3-.7M18 4.4l5.6 5.6H18zM24 28H8V4h8v6c0 1.1.9 2 2 2h6z"/><path fill="currentColor" d="M10 22h12v2H10zm0-6h12v2H10z"/></>;
const Medication = () => <path fill="currentColor" d="M24 2H8a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2M10 14h3v10h-3Zm12 14H10v-2h5V12h-5v-2h12ZM8 8V4h16v4Z"/>;
const Pills = () => <path fill="currentColor" d="M22 14a7.94 7.94 0 0 0-4 1.083V9A7 7 0 0 0 4 9v14a6.999 6.999 0 0 0 12.286 4.588A7.997 7.997 0 1 0 22 14m0 2a6.005 6.005 0 0 1 5.91 5H16.09A6.005 6.005 0 0 1 22 16M6 9a5 5 0 0 1 10 0v6H6Zm5 19a5.006 5.006 0 0 1-5-5v-6h9.765a7.96 7.96 0 0 0-.724 8.932A4.99 4.99 0 0 1 11 28m11 0a6.005 6.005 0 0 1-5.91-5h11.82A6.005 6.005 0 0 1 22 28"/>;
const BottleA = () => <path fill="currentColor" d="M26 9.37V3a1 1 0 0 0-1-1h-3v2h2v6.72s3 .507 3 4.28v13h-3v2h4a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63m-7 0V3a1 1 0 0 0-1-1h-3v2h2v6.72s3 .507 3 4.28v13h-3v2h4a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63m-7 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1v6.37c-1.067.606-3 2.178-3 5.63v14a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V15c0-3.452-1.933-5.024-3-5.63M13 28H5V15c0-3.772 3-4.28 3-4.28V4h2v6.72s3 .508 3 4.28z"/>;
const BottleB = () => <path fill="currentColor" d="M24 9.051V6a1 1 0 0 0-1-1h-3v2h2v3.02s2 1.124 2 3.48V25h-4v2h5a1 1 0 0 0 1-1V13.5a5.93 5.93 0 0 0-2-4.449m-8 0V6a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3.051A5.93 5.93 0 0 0 6 13.5V26a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V13.5a5.93 5.93 0 0 0-2-4.449M16 25H8V13.5c0-2.356 2-3.48 2-3.48V7h4v3.02s2 1.124 2 3.48z"/>;
const Box = () => <><path fill="currentColor" d="M20 21h-8a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2m-8-4v2h8v-2Z"/><path fill="currentColor" d="M28 4H4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2v16a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m-2 24H6V12h20Zm2-18H4V6h24z"/></>;
const Send = () => <path fill="currentColor" d="m27.45 15.11l-22-11a1 1 0 0 0-1.08.12a1 1 0 0 0-.33 1L7 16L4 26.74A1 1 0 0 0 5 28a1 1 0 0 0 .45-.11l22-11a1 1 0 0 0 0-1.78m-20.9 10L8.76 17H18v-2H8.76L6.55 6.89L24.76 16Z"/>;
const ImageIcon = () => <><path fill="currentColor" d="M19 14a3 3 0 1 0-3-3a3 3 0 0 0 3 3m0-4a1 1 0 1 1-1 1a1 1 0 0 1 1-1"/><path fill="currentColor" d="M26 4H6a2 2 0 0 0-2 2v20a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2m0 22H6v-6l5-5l5.59 5.59a2 2 0 0 0 2.82 0L21 19l5 5Zm0-4.83l-3.59-3.59a2 2 0 0 0-2.82 0L18 19.17l-5.59-5.59a2 2 0 0 0-2.82 0L6 17.17V6h20Z"/></>;
const User = () => <><path fill="currentColor" d="M16 8a5 5 0 1 0 5 5a5 5 0 0 0-5-5m0 8a3 3 0 1 1 3-3a3.003 3.003 0 0 1-3 3"/><path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2m-6 24.377V25a3.003 3.003 0 0 1 3-3h6a3.003 3.003 0 0 1 3 3v1.377a11.9 11.9 0 0 1-12 0m13.993-1.451A5 5 0 0 0 19 20h-6a5 5 0 0 0-4.992 4.926a12 12 0 1 1 15.985 0"/></>;
const Chat = () => <><path fill="currentColor" d="M17.74 30L16 29l4-7h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h9v2H6a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4h20a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4h-4.84Z"/><path fill="currentColor" d="M8 10h16v2H8zm0 6h10v2H8z"/></>;
const Notification = () => <path fill="currentColor" d="M28.707 19.293L26 16.586V13a10.014 10.014 0 0 0-9-9.95V1h-2v2.05A10.014 10.014 0 0 0 6 13v3.586l-2.707 2.707A1 1 0 0 0 3 20v3a1 1 0 0 0 1 1h7v.777a5.15 5.15 0 0 0 4.5 5.199A5.006 5.006 0 0 0 21 25v-1h7a1 1 0 0 0 1-1v-3a1 1 0 0 0-.293-.707M19 25a3 3 0 0 1-6 0v-1h6Zm8-3H5v-1.586l2.707-2.707A1 1 0 0 0 8 17v-4a8 8 0 0 1 16 0v4a1 1 0 0 0 .293.707L27 20.414Z"/>;
const Phone = () => <path fill="currentColor" d="M27 22.42v4.16a1.42 1.42 0 0 1-1.55 1.41a22.93 22.93 0 0 1-9.99-3.55a22.58 22.58 0 0 1-6.95-6.95A22.93 22.93 0 0 1 4.96 7.5A1.42 1.42 0 0 1 6.36 6h4.18A1.42 1.42 0 0 1 12 7.2c.12 1.15.36 2.27.72 3.35a1.42 1.42 0 0 1-.32 1.46l-1.77 1.77a18.9 18.9 0 0 0 7.59 7.59l1.77-1.77a1.42 1.42 0 0 1 1.46-.32c1.08.36 2.2.6 3.35.72A1.42 1.42 0 0 1 27 22.42"/>;
const Lifebuoy = () => <path fill="currentColor" d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2m9.93 13h-3.05a7 7 0 0 0-2.63-4.55l2.16-2.16A11.93 11.93 0 0 1 25.93 15m-9.93 9a9 9 0 0 1-1-.06V20.9a5 5 0 0 0 2 0v3.04a9 9 0 0 1-1 .06m-1-5.18a3 3 0 1 1 2 0a3 3 0 0 1-2 0m2-10.76V5.06a11.93 11.93 0 0 1 5.41 2.23l-2.16 2.16A7 7 0 0 0 17 8.06m-2 0a7 7 0 0 0-3.25 1.39L9.59 7.29A11.93 11.93 0 0 1 15 5.06Zm-4.63 2.39A7 7 0 0 0 7.12 15H4.07a11.93 11.93 0 0 1 3.52-6.71Zm-3.25 6.55a7 7 0 0 0 2.63 4.55l-2.16 2.16A11.93 11.93 0 0 1 4.07 17Zm4.63 5.49A7 7 0 0 0 15 23.94v3a11.93 11.93 0 0 1-5.41-2.23Zm8.66 0l2.16 2.16A11.93 11.93 0 0 1 17 26.94v-3a7 7 0 0 0 3.41-1.39M22.88 17h3.05a11.93 11.93 0 0 1-3.52 6.71l-2.16-2.16A7 7 0 0 0 22.88 17"/>;
const Hourglass = () => <><path fill="currentColor" d="M15 19h2v2h-2zm0 4h2v2h-2z"/><path fill="currentColor" d="M23 11.67V4h3V2H6v2h3v7.67a2 2 0 0 0 .4 1.2L11.75 16L9.4 19.13a2 2 0 0 0-.4 1.2V28H6v2h20v-2h-3v-7.67a2 2 0 0 0-.4-1.2L20.25 16l2.35-3.13a2 2 0 0 0 .4-1.2M21 4v7H11V4Zm0 16.33V28H11v-7.67L14.25 16L12 13h8l-2.25 3Z"/></>;
const ErrorIcon = () => <path fill="currentColor" d="M2 16A14 14 0 1 0 16 2A14 14 0 0 0 2 16m23.15 7.75L8.25 6.85a12 12 0 0 1 16.9 16.9M8.24 25.16a12 12 0 0 1-1.4-16.89l16.89 16.89a12 12 0 0 1-15.49 0"/>;
const Dot = () => <><circle cx="16" cy="16" r="10" fill="currentColor"/><path fill="currentColor" d="M16 30a14 14 0 1 1 14-14a14.016 14.016 0 0 1-14 14m0-26a12 12 0 1 0 12 12A12.014 12.014 0 0 0 16 4"/></>;
const Printer = () => <path fill="currentColor" d="M28 9h-3V3H7v6H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3v6h18v-6h3a2 2 0 0 0 2-2V11a2 2 0 0 0-2-2M9 5h14v4H9Zm14 22H9V17h14Zm5-6h-3v-6H7v6H4V11h24Z"/>;

const ICONS: Record<string, React.FC> = {
  search: Search, check: Check, close: CloseIcon, time: Time, document: Document,
  medication: Medication, pills: Pills, bottleA: BottleA, bottleB: BottleB, box: Box,
  send: Send, image: ImageIcon, user: User, chat: Chat, notification: Notification,
  phone: Phone, lifebuoy: Lifebuoy, hourglass: Hourglass, error: ErrorIcon,
  dot: Dot, printer: Printer,
};

export default function Icon({ name, className, size, style }: IconProps) {
  const Body = ICONS[name] ?? ICONS.medication;
  const cls = ['ui-icon', className].filter(Boolean).join(' ');
  const sz = size ? { width: size, height: size, ...style } : style;
  return (
    <svg className={cls} viewBox="0 0 32 32" aria-hidden="true" style={sz}>
      <Body />
    </svg>
  );
}
