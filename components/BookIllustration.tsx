import React from 'react';
import { SvgXml } from 'react-native-svg';

const bookSvg = `<svg width="402" height="143" viewBox="0 0 402 143" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Book base -->
  <path d="M101 30 C101 25, 301 25, 301 30 L301 110 C301 115, 101 115, 101 110 Z" 
    fill="#FFFFFF" stroke="#8E1A3B" stroke-width="2"/>
  
  <!-- Left page -->
  <path d="M101 30 C101 25, 201 25, 201 30 L201 110 C201 115, 101 115, 101 110 Z" 
    fill="#F8F7F2" stroke="#8E1A3B" stroke-width="1"/>
  
  <!-- Right page -->
  <path d="M201 30 C201 25, 301 25, 301 30 L301 110 C301 115, 201 115, 201 110 Z" 
    fill="#F8F7F2" stroke="#8E1A3B" stroke-width="1"/>
  
  <!-- Book spine -->
  <path d="M201 30 L201 110" stroke="#8E1A3B" stroke-width="2"/>
  
  <!-- Page lines - left -->
  <path d="M120 45 L190 45" stroke="#8E1A3B" stroke-width="0.5" opacity="0.5"/>
  <path d="M120 60 L190 60" stroke="#8E1A3B" stroke-width="0.5" opacity="0.5"/>
  <path d="M120 75 L190 75" stroke="#8E1A3B" stroke-width="0.5" opacity="0.5"/>
  <path d="M120 90 L190 90" stroke="#8E1A3B" stroke-width="0.5" opacity="0.5"/>
  
  <!-- Page lines - right -->
  <path d="M212 45 L282 45" stroke="#8E1A3B" stroke-width="0.5" opacity="0.5"/>
  <path d="M212 60 L282 60" stroke="#8E1A3B" stroke-width="0.5" opacity="0.5"/>
  <path d="M212 75 L282 75" stroke="#8E1A3B" stroke-width="0.5" opacity="0.5"/>
  <path d="M212 90 L282 90" stroke="#8E1A3B" stroke-width="0.5" opacity="0.5"/>
  
  <!-- Bookmark -->
  <path d="M190 20 L195 20 L195 40 L192.5 35 L190 40 Z" fill="#8E1A3B"/>
  
  <!-- Decorative corner -->
  <path d="M101 30 C105 28, 110 28, 115 30" stroke="#8E1A3B" stroke-width="1"/>
  <path d="M287 30 C292 28, 297 28, 301 30" stroke="#8E1A3B" stroke-width="1"/>
</svg>`;

export const BookIllustration = () => {
  return (
    <SvgXml 
      xml={bookSvg} 
      width="100%" 
      height={200}
      style={{ opacity: 0.9 }}
    />
  );
};

export default BookIllustration;