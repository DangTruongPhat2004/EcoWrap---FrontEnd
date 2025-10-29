# EcoWrap Customizer - Layer-Based Design System

## 🎨 Overview

The EcoWrap customizer has been updated to use a **layer-based design system** with Vietnamese packaging models created using Three.js instead of relying on external image services like Unsplash.

## ✨ New Features

### 1. **Vietnamese Packaging Models (Three.js)**

Four packaging types are now available with realistic 3D models:

- **Cốc ly giấy (Paper Cup)** - Perfect for coffee shops and beverage packaging
- **Túi giấy (Paper Bag)** - Shopping bags with handles
- **Hộp giấy (Paper Box)** - Gift boxes and product packaging
- **Túi đứng (Stand-up Pouch)** - Food packaging with zipper closure

All models are created using Three.js geometry (no external dependencies).

### 2. **Layer Minimap System**

Each packaging type has multiple customizable layers/surfaces:

- **Cup**: Front, Back, Wrap-around sleeve
- **Bag**: Front, Back, Left side, Right side, Bottom
- **Box**: Front, Back, Left, Right, Top lid, Bottom
- **Pouch**: Front, Back

The minimap shows:

- ✅ Visual representation of each layer
- ✅ Active layer indicator
- ✅ Completion status (checkmarks)
- ✅ Progress tracker (e.g., "3/6 layers completed")

### 3. **Multi-Layer Canvas Editor**

The canvas editor now supports:

- Independent designs for each layer
- Automatic layer switching with data preservation
- Layer-specific save/load functionality
- All layers export together for 3D mockup

### 4. **3D Mockup Integration**

- Real-time texture mapping from canvas to 3D model
- Each layer's design is applied to the correct surface
- Interactive 3D preview with orbit controls
- Switch between packaging types in real-time

## 🚀 How to Use

### Step 1: Choose Packaging Type

In the "Lớp" (Layers) tab, select your packaging type:

- Click on Cốc ly 🥤, Túi giấy 🛍️, Hộp giấy 📦, or Túi đứng 🎒

### Step 2: Select a Layer

The minimap shows all available layers for your packaging. Click on a layer to start designing it.

### Step 3: Design Each Layer

- Use the "Phần tử" (Elements) tab to add text, shapes, icons
- Use the "Màu" (Colors) tab to apply colors and gradients
- Each layer is saved independently

### Step 4: Preview in 3D

Switch to the "3D" tab to see your design applied to the full 3D model. You can:

- Rotate the model by dragging
- Zoom in/out with mouse wheel
- Switch packaging types to see how your design looks on different products

### Step 5: Save & Export

Click "Lưu bản nháp" (Save Draft) to save all layers together. The design can be:

- Added to cart for ordering
- Exported as high-resolution images
- Applied to product templates

## 📁 File Structure

```
src/components/customize/
├── PackagingModels.js      # Three.js 3D packaging models
├── LayerMinimap.jsx        # Layer selection minimap UI
├── CanvasEditor.jsx        # Multi-layer canvas editor (updated)
├── MockupPanel.jsx         # 3D preview panel (updated)
└── index.js                # Component exports

src/pages/customer/
└── CustomizePage.jsx       # Main customizer page (updated)

src/services/
└── externalApi.js          # Removed Unsplash dependency
```

## 🔧 Technical Details

### Packaging Model Structure

Each packaging model returns:

```javascript
{
  model: THREE.Group,      // The 3D model
  layers: Array,           // Available layers
  type: String             // Packaging type ID
}
```

### Layer Data Format

```javascript
{
  id: "front",              // Layer identifier
  name: "Mặt trước",        // Display name (Vietnamese)
  position: "front"         // Position on model
}
```

### Saving Multiple Layers

```javascript
{
  packagingType: "box",
  layers: {
    front: { ...canvasData },
    back: { ...canvasData },
    left: { ...canvasData },
    // etc.
  }
}
```

## 🎯 Benefits

1. **No External Dependencies** - No need for Unsplash API keys
2. **Offline Capable** - All 3D models generated locally
3. **Better UX** - Visual layer selection with progress tracking
4. **Flexible Design** - Each surface can have unique designs
5. **Real 3D Preview** - See exactly how the final product will look

## 🔮 Future Enhancements

- [ ] Import custom 3D models
- [ ] Add more packaging types (bottles, cans, etc.)
- [ ] Layer templates and presets
- [ ] Collaborative multi-layer editing
- [ ] AR preview for mobile devices

---

Made with 💚 for EcoWrap
