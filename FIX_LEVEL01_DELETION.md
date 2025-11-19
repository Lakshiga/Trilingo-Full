# 🔧 Fix: level-01/ Folder Getting Deleted on Git Merge

## ❌ Problem

When you merge to `master` branch, the GitHub Actions deployment:
1. Syncs Angular build files to S3
2. Uses `--delete` flag which deletes everything NOT in source
3. **Deletes `level-01/` folder** because it's not in Angular build output
4. Creates delete markers for all files in `level-01/img/numbers/` etc.

## ✅ Solution

The deployment workflow now **excludes** `level-01/` folder from deletion using `--exclude` patterns.

### What Changed

**File**: `.github/workflows/deploy.yml`

**Before**:
```yaml
- name: Sync files to S3
  uses: jakejarvis/s3-sync-action@master
  with:
    args: --delete  # This deletes EVERYTHING not in source
```

**After**:
```yaml
- name: Sync Angular files to S3 (protect level-01 folder)
  run: |
    aws s3 sync dist/trilingo-admin-angular/ \
      s3://${{ secrets.AWS_BUCKET }}/ \
      --delete \
      --exclude "level-01/*" \    # Protect level-01 folder
      --exclude "level-02/*" \    # Protect level-02 folder
      --exclude "level-03/*" \    # Protect level-03 folder
      --exclude "dist/*"          # Protect dist folder
```

## 🛡️ Protected Folders

The following folders are now **protected** from deletion:
- ✅ `level-01/` - Your image/audio data
- ✅ `level-02/` - Future levels
- ✅ `level-03/` - Future levels
- ✅ `dist/` - Any dist folders

## 📋 How It Works

1. **Angular build files** are synced to S3 root
2. **Old Angular files** (not in new build) are deleted
3. **level-01/ folder** is **NOT touched** - remains safe
4. **Delete markers** won't be created for level-01 files

## 🔍 Verify It Works

After next deployment:
1. Go to S3 Console
2. Check `level-01/img/numbers/` folder
3. Files should still be there (no delete markers)
4. Only Angular build files in root should be updated

## ⚠️ Important Notes

- **level-01/ folder** is managed separately (not part of Angular build)
- **Angular build files** go to S3 root (index.html, main.js, etc.)
- **Data folders** (level-01, level-02, etc.) are protected from deletion

## 🚀 Next Steps

1. **Commit and push** the updated workflow
2. **Merge to master** - level-01/ folder will be protected
3. **Verify** in S3 Console that level-01/ files are still there

---

## 🔄 If You Need to Restore Deleted Files

If files were already deleted (have delete markers):

### Option 1: Restore from S3 Versioning
1. Go to S3 Console
2. Navigate to `level-01/img/numbers/`
3. Select file with delete marker
4. Click "Actions" → "Delete" (removes delete marker)
5. Or restore from previous version

### Option 2: Re-upload Files
1. Upload files again to `level-01/img/numbers/`
2. Delete markers will be removed automatically

---

## ✅ Summary

- ✅ **Fixed**: Deployment workflow now protects `level-01/` folder
- ✅ **Safe**: Your image/audio data won't be deleted
- ✅ **Automatic**: Works on every git merge to master
- ✅ **Protected**: Multiple level folders are excluded

**No more delete markers for level-01/ files!** 🎉

