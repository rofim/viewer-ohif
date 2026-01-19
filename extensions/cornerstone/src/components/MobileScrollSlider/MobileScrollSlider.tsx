import React, { useEffect, useState, useCallback } from 'react';
import { getEnabledElement, StackViewport, Enums } from '@cornerstonejs/core';
import { useServices } from '@ohif/core';

function MobileScrollSlider({ element, viewportId }) {
  const [show, setShow] = useState(false);
  const [index, setIndex] = useState(0);
  const [max, setMax] = useState(1);

  // Mobile Check
  useEffect(() => {
    const checkMobile = () => {
      // Improved Mobile/Tablet Detection
      const userAgent = window.navigator.userAgent;
      const isIpad = /iPad/i.test(userAgent) || (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 0);

      const isTouch =
        (window.matchMedia && window.matchMedia('(any-pointer: coarse)').matches) ||
        (navigator.maxTouchPoints > 0) ||
        isIpad;

      const shouldShow = isTouch || window.innerWidth < 1024;
      setShow(shouldShow);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update Slider Logic
  const updateState = useCallback(() => {
    if (!element) return;
    const enabledElement = getEnabledElement(element);

    if (!enabledElement) return;

    const { viewport } = enabledElement;

    if (viewport instanceof StackViewport) {
      const imageIds = viewport.getImageIds();
      const current = viewport.getCurrentImageIdIndex();
      setMax(imageIds.length - 1);
      setIndex(current);
    }
  }, [element]);

  useEffect(() => {
    if (!element || !show) return;

    const onNewImage = (evt) => {
      const { imageIdIndex } = evt.detail;
      setIndex(imageIdIndex);
    };

    const onNewImageSet = () => {
       updateState();
    }

    element.addEventListener(Enums.Events.STACK_NEW_IMAGE, onNewImage);
    element.addEventListener(Enums.Events.VIEWPORT_NEW_IMAGE_SET, onNewImageSet);

    // Initial update
    updateState();

    return () => {
      element.removeEventListener(Enums.Events.STACK_NEW_IMAGE, onNewImage);
      element.removeEventListener(Enums.Events.VIEWPORT_NEW_IMAGE_SET, onNewImageSet);
    };
  }, [element, show, updateState]);

  // Handle Custom Touch/Pointer Interaction
  const containerRef = React.useRef<HTMLDivElement>(null);
  const isDragging = React.useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    // Prevent browser default behavior (like scrolling)
    e.preventDefault();
    isDragging.current = true;
    updateValueFromX(e.clientX);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    // e.preventDefault();
    if (!isDragging.current) return;
    updateValueFromX(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
     isDragging.current = false;
     try {
       (e.target as HTMLElement).releasePointerCapture(e.pointerId);
     } catch (err) {
       // ignore
     }
  };

  const updateValueFromX = (clientX: number) => {
    if (!containerRef.current || !element) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, x / rect.width));
    const newIndex = Math.round(percentage * max);

    if (newIndex !== index) {
      setIndex(newIndex);

      const enabledElement = getEnabledElement(element);
      if (enabledElement?.viewport instanceof StackViewport) {
         enabledElement.viewport.setImageIdIndex(newIndex);
      }
    }
  };

  const updateValueFromPointer = (e: React.PointerEvent) => updateValueFromX(e.clientX);

  if (!show) return null;

  const percent = max > 0 ? (index / max) * 100 : 0;

  return (
    <div
      className="absolute bottom-8 left-0 right-0 z-[999] flex h-16 w-full items-center px-12 touch-none"
    >
      {/* Interactive Container */}
      <div
        ref={containerRef}
        className="relative h-full w-full flex items-center"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Visual Track */}
        <div className="pointer-events-none absolute left-0 right-0 top-1/2 h-1 -translate-y-1/2 rounded-full bg-white/20">
           {/* Progress Bar */}
           <div
             className="absolute h-full rounded-full bg-[#0944b3]"
             style={{ width: `${percent}%` }}
           ></div>
           {/* Thumb */}
           <div
             className="absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-white shadow-md"
             style={{ left: `${percent}%`, transform: 'translate(-50%, -50%)' }}
           ></div>
        </div>
      </div>
    </div>
  );
}

export default MobileScrollSlider;
