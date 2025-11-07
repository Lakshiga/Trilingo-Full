# How to Add Exercises to Activities - Step by Step Guide

## Understanding the System

The exercise system now works with **two separate steps**:

1. **First**: Save the Activity
2. **Then**: Add Exercises to that Activity

Each exercise is stored as a **separate database record** with its own ID and JSON content.

---

## Step-by-Step: Creating a New Activity with Exercises

### Step 1: Create and Save the Activity

1. Click **"+ ADD NEW ACTIVITY"** button from the Activities list
2. Fill in the Activity details:
   - **Activity Title** (in Tamil, English, Sinhala)
   - **Sequence Order** (e.g., 1, 2, 3...)
   - **Main Activity Category** (e.g., Learning, Practice, Test)
   - **Activity Type** (e.g., MediaSpotlightSingle, Flashcard, MCQ, etc.)

3. **IMPORTANT**: Click the **"💾 SAVE ENTIRE ACTIVITY"** button at the top
   - This saves the activity to the database
   - The activity gets a unique ID
   - Now you can add exercises

### Step 2: Add Exercises

After saving the activity, the Exercises section becomes active:

1. Look at the **"Exercises"** section (middle column)
2. You'll see a blue message with clear instructions
3. Click the **"Add Exercise"** button
   - A new exercise is created automatically
   - It's pre-filled with a JSON template based on your selected Activity Type
   - The exercise panel opens automatically

### Step 3: Edit the Exercise JSON

1. You'll see the exercise JSON in a text area
2. Edit the JSON to update:
   - **Image paths**: `/images/media1.png` → `/images/your-image.png`
   - **Audio paths**: `/audio/ta/media1.mp3` → `/audio/ta/your-audio.mp3`
   - **Video paths**: `/videos/video1.mp4` → `/videos/your-video.mp4`
   - **Text content**: Update Tamil, English, Sinhala text
   
3. The JSON is validated in real-time:
   - ✅ Green = Valid JSON
   - ❌ Red = Invalid JSON (with error message)

### Step 4: Save the Exercise

**VERY IMPORTANT**: After editing the JSON, click the **"💾 SAVE CHANGES"** button inside the exercise panel.

- This saves the exercise to the database
- The panel stays open so you can continue editing if needed
- You can close the panel manually by clicking on it again

### Step 5: Add More Exercises

1. Click **"Add Exercise"** button again
2. A new exercise is created with the template
3. Edit its JSON (different images, audio, video paths)
4. Click **"💾 SAVE CHANGES"** for this exercise too
5. Repeat for as many exercises as you need!

---

## Other Operations

### Preview an Exercise
- Click the **"Preview"** button (eye icon) in the exercise header
- The preview panel on the right shows how it will look on devices

### Copy Exercise JSON
- Click the **"Copy"** button in the exercise header
- The JSON is copied to your clipboard
- You can paste it elsewhere or use it as a reference

### Delete an Exercise
- Click the **red trash icon** in the exercise header
- Confirm the deletion
- **Note**: You must have at least 1 exercise per activity

---

## Editing Existing Activities

When you click the "Edit" button on an existing activity:

1. The activity details load automatically
2. **All exercises** for that activity load from the database
3. You can:
   - Edit any exercise JSON
   - Click "Save Changes" to update it
   - Add new exercises
   - Delete exercises (minimum 1 required)

---

## Troubleshooting

### "Add Exercise" button is disabled?

**Reason**: The activity hasn't been saved yet.

**Solution**: 
1. Scroll to the top of the page
2. Click the **"💾 SAVE ENTIRE ACTIVITY"** button
3. Wait for the success message
4. Now the "Add Exercise" button will be enabled

### Exercise JSON not saving / Panel closes unexpectedly?

**Reason**: You didn't click the "Save Changes" button.

**Solution**: 
- After editing JSON, always click **"💾 SAVE CHANGES"**
- This explicitly saves the exercise to the database
- The panel will stay open

### Can't see my exercises after page reload?

**Reason**: Exercises weren't saved properly.

**Solution**:
- Make sure you clicked "Save Changes" for each exercise
- Exercises are stored in the database separately from activities
- Reload the page and check if they're still there

---

## Current Workflow Summary

```
1. CREATE ACTIVITY
   ↓
2. SAVE ACTIVITY (💾 button at top)
   ↓
3. ADD EXERCISE (button becomes enabled)
   ↓
4. EDIT JSON (update media paths)
   ↓
5. SAVE CHANGES (💾 button in exercise panel)
   ↓
6. REPEAT steps 3-5 for more exercises
   ↓
7. DONE! All exercises are saved in database
```

---

## Database Structure

- **Activities Table**: Stores activity details (title, type, sequence, etc.)
- **Exercises Table**: Stores exercises with:
  - `Id` - Unique exercise ID
  - `ActivityId` - Links to parent activity
  - `JsonData` - The exercise JSON content
  - `SequenceOrder` - Order of exercise (1, 2, 3...)
  - `CreatedAt`, `UpdatedAt` - Timestamps

When you delete an activity, all its exercises are automatically deleted (cascade delete).

---

## Tips

1. **Save activity first** before adding exercises
2. **Click "Save Changes"** after editing each exercise
3. **Preview frequently** to see how exercises look
4. **Copy-paste** JSON from one exercise to another as a starting point
5. **Use unique file paths** for each exercise's media files

---

**That's it! The exercises system is now fully functional with complete CRUD operations!** 🎉
