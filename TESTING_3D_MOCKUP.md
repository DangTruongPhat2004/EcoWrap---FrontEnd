# Testing Guide: 3D Mockup Feature

## Quick Test Checklist

### 1. Access the Feature

```
Navigate to: http://localhost:5173/customize/new
```

### 2. Test 3D Tab (Embedded Mode)

- [ ] Click the **"3D"** tab in the right panel
- [ ] Verify a 3D model appears (should be a box by default)
- [ ] Check browser console for initialization logs:
  ```
  MockupPanel: Initializing 3D scene with type: box
  Creating packaging model of type: box
  Added packaging model to scene: box
  MockupPanel: Created mockup model
  MockupPanel: 3D scene initialized successfully
  ```

### 3. Test Model Types

Click each button and verify the model changes:

- [ ] **Cốc ly** (Cup) - Should show cylindrical cup shape
- [ ] **Túi giấy** (Bag) - Should show box with handles
- [ ] **Hộp** (Box) - Should show rectangular box with lid
- [ ] **Túi đứng** (Pouch) - Should show rounded pouch shape

### 4. Test Interactions

- [ ] **Drag** - Model should rotate smoothly
- [ ] **Scroll Up** - Model should zoom in
- [ ] **Scroll Down** - Model should zoom out
- [ ] **Reset Button** (RotateCw icon) - Model returns to default position
- [ ] **Zoom In Button** (+) - Model zooms in
- [ ] **Zoom Out Button** (-) - Model zooms out

### 5. Test Texture Application

1. [ ] Switch to **"Vẽ"** (Drawing) tab
2. [ ] Draw something on the canvas with brush
3. [ ] Switch back to **"3D"** tab
4. [ ] Wait 2-3 seconds
5. [ ] Verify your drawing appears on the 3D model

### 6. Test Full-Screen Mode

1. [ ] Click the **Eye** icon (👁️) in the top toolbar to toggle mockup view
2. [ ] Verify the 3D model appears in full screen
3. [ ] Test drag to rotate
4. [ ] Click the type switcher at the bottom
5. [ ] Click Eye icon again to return to canvas view

### 7. Test Layer Switching

1. [ ] Go to **"Lớp"** (Layers) tab
2. [ ] Select different packaging types: Cốc ly, Túi giấy, Hộp
3. [ ] Go to **"3D"** tab
4. [ ] Verify the 3D model matches the selected packaging type

## Expected Behavior

### Lighting

- Model should have realistic lighting with shadows
- White/light gray background
- Model should be clearly visible from all angles

### Performance

- Smooth rotation with no lag
- Zoom should be fluid
- Model switching should be instant (< 100ms)
- No console errors

### Visual Quality

- Model should have smooth edges (antialiasing enabled)
- Shadows should be soft (PCFSoftShadowMap)
- Materials should have realistic paper texture appearance

## Common Issues & Solutions

### Issue: 3D panel is blank

**Solution**:

- Check browser console for errors
- Verify THREE.js is installed: `npm list three`
- Check if WebGL is enabled in browser

### Issue: Model doesn't rotate

**Solution**:

- Verify OrbitControls are initialized
- Check console for initialization logs
- Try clicking and dragging more forcefully

### Issue: Texture doesn't appear

**Solution**:

- Draw something clearly visible on canvas first
- Wait at least 2 seconds for texture update
- Check if `canvasRef` is passed to MockupPanel

### Issue: Page crashes on tab switch

**Solution**:

- Check cleanup logs in console
- Verify animation frame is being cancelled
- Look for memory leaks in browser DevTools

## Browser Console Expected Logs

### On Initial Load:

```
MockupPanel: Initializing 3D scene with type: box
Creating packaging model of type: box
Added packaging model to scene: box
MockupPanel: Created mockup model
MockupPanel: 3D scene initialized successfully
```

### On Type Change (e.g., switching to cup):

```
MockupPanel: Cleaning up 3D scene
MockupPanel: Initializing 3D scene with type: cup
Removed previous packaging model
Creating packaging model of type: cup
Added packaging model to scene: cup
MockupPanel: Created mockup model
MockupPanel: 3D scene initialized successfully
```

### On Tab Close/Unmount:

```
MockupPanel: Cleaning up 3D scene
```

## Performance Benchmarks

- **Initial Load**: < 500ms
- **Model Switch**: < 100ms
- **Texture Update**: < 2 seconds
- **FPS**: 60fps (smooth rotation)
- **Memory Usage**: < 100MB for 3D scene

## Browser Compatibility

Tested and working on:

- ✅ Chrome 100+
- ✅ Firefox 100+
- ✅ Edge 100+
- ✅ Safari 15+ (with WebGL enabled)

Requires:

- WebGL 1.0 or higher
- ES6+ JavaScript support

## Files to Monitor

If issues occur, check these files in order:

1. `src/components/customize/MockupPanel.jsx` - Main 3D component
2. `src/components/customize/PackagingModels.js` - 3D model definitions
3. `src/pages/customer/CustomizePage.jsx` - Integration
4. Browser console - Runtime errors
5. Network tab - THREE.js loading

## Success Criteria

All tests passed if:

- ✅ No console errors
- ✅ 3D model visible and interactive
- ✅ All 4 packaging types render correctly
- ✅ Controls work smoothly
- ✅ Texture updates appear on model
- ✅ Clean logs on mount/unmount
- ✅ No memory leaks (check DevTools memory profiler)
