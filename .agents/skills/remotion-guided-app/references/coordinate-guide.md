# Extracting & Calibrating Coordinates for App Highlights

Getting the exact bounding box (`{ x, y, w, h }`) of a button or card from a screen recording is the most critical step for sharp, professional spotlights.

---

## 1. Coordinate Coordinate Spaces

In Remotion, there are two common coordinate spaces:

1. **Native Screen Recording Space**:
   - The raw video pixel dimensions (e.g. 1170×2532 on iPhone 15 Pro, 1080×2400 on Pixel, or 1920×1080 on Desktop).
2. **Composition Space**:
   - The canvas size in `Root.tsx` (e.g. 1080×1920 for vertical reels, or 1920×1080 for desktop).
3. **Inside Device Mockup Screen Space**:
   - If the video is rendered inside a phone frame (`<PhoneMockup>`), the video container has an explicit width/height inside the mockup (e.g. `width: 390, height: 844`).

> **Rule:** Always measure coordinates relative to the container where `<Highlight>` is rendered. If `<Highlight>` is inside `<PhoneMockup>` directly over the video, use screen container pixels!

---

## 2. Extraction Methods

### Method A — Remotion Studio Coordinate Overlay (Fastest)
Add a temporary debug coordinate overlay in your scene while authoring:

```tsx
export const DebugCursorOverlay: React.FC = () => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPos({
          x: Math.round(e.clientX - rect.left),
          y: Math.round(e.clientY - rect.top),
        });
      }}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 9999,
        cursor: "crosshair",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "black",
          color: "lime",
          padding: "6px 12px",
          fontFamily: "monospace",
          fontSize: 16,
          borderRadius: 8,
        }}
      >
        X: {pos.x} | Y: {pos.y}
      </div>
    </div>
  );
};
```
Move the cursor to top-left and bottom-right of the target UI element to calculate `w = x2 - x1` and `h = y2 - y1`.

### Method B — Image Screenshot Tool
1. Render a still frame at the target time:
   ```bash
   npx remotion still src/index.ts MyComp out/frame.png --frame 90
   ```
2. Open in Figma, Photoshop, or browser dev tools.
3. Draw a rectangle over the target element and copy `{ x, y, width, height }`.

---

## 3. Standard UI Element Radii & Padding

- **Standard Buttons**: `radius: 12`, `pad: 6`
- **Pills / Chips**: `radius: 999`, `pad: 6`
- **Cards**: `radius: 20`, `pad: 10`
- **Floating Action Buttons (FAB) / Circular Icons**: Use `shape: "circle"`, `pad: 8`

---

## 4. Zoom Camera Targeting

When setting `ZoomCue.origin`:
- Set `{ x, y }` to the **center** of the highlighted element:
  ```ts
  const target = {
    x: rect.x + rect.w / 2,
    y: rect.y + rect.h / 2,
  };
  ```
- Keep `scale` between **1.2x and 1.45x**. Anything above 1.5x risks pixelating mobile recordings or cutting off surrounding interface context.
