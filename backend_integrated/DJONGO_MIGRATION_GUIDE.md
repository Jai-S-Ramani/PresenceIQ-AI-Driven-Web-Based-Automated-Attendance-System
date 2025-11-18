# Django Migration Issues with djongo - Summary & Solution

## Problem: "Index already exists" Error

**Error Message**: `Index already exists with a different name: [fieldname]_idx`

This is a **djongo bug** that occurs when:

1. You have a ForeignKey field
2. You also define an explicit index for that same field in the model's Meta class
3. djongo tries to create BOTH indexes, causing a name conflict

## Root Cause

When you define a ForeignKey in Django:

-   Django automatically creates a database index for FK fields
-   djongo generates SQL like: `ALTER TABLE ADD CONSTRAINT [name] INDEX`
-   If you ALSO define `models.Index(fields=['fk_field'])` in Meta.indexes
-   djongo tries to create it again with a different name → **CONFLICT**

## Solution Applied

### ✅ Step 1: Add `db_constraint=False` to ALL ForeignKeys

MongoDB doesn't support foreign key constraints anyway, so this is safe:

```python
# Before:
department = models.ForeignKey('academic.Department', on_delete=models.SET_NULL, null=True)

# After:
department = models.ForeignKey('academic.Department', on_delete=models.SET_NULL, null=True, db_constraint=False)
```

**Status**: ✅ Applied to ALL ForeignKeys in all apps

### ✅ Step 2: Remove ForeignKey fields from Meta.indexes

Django automatically indexes ForeignKeys, so explicit indexes are redundant:

```python
# Before:
class Meta:
    indexes = [
        models.Index(fields=['department']),  # ← REMOVE THIS
        models.Index(fields=['other_field']),
    ]

# After:
class Meta:
    indexes = [
        # Department index automatically created by ForeignKey
        models.Index(fields=['other_field']),
    ]
```

**Status**: ⚠️ PARTIALLY DONE

-   ✅ Fixed: authentication.User
-   ✅ Fixed: academic.Department, Holiday (partially)
-   ✅ Fixed: academic.Subject (department removed)
-   ✅ Fixed: academic.Timetable (subject/faculty removed)
-   ⚠️ **PENDING**: attendance models still have FK field indexes
-   ⚠️ **PENDING**: face_recognition models still have FK field indexes

### ❌ Step 3: Remove Composite Indexes with ForeignKeys

**CRITICAL**: If you have composite indexes that include FK fields, they MUST be removed or modified:

```python
# PROBLEMATIC - attendance models:
models.Index(fields=['session', 'student']),  # Both are FKs!
models.Index(fields=['student', 'subject']),  # Both are FKs!
models.Index(fields=['faculty', 'status']),   # faculty is FK!
models.Index(fields=['subject', 'day_of_week']),  # subject is FK!

# face_recognition models:
models.Index(fields=['face_data', 'angle']),  # face_data is FK!
models.Index(fields=['recognized_user', '-timestamp']),  # recognized_user is FK!
```

**Solution**: Remove FK fields from these indexes or remove the indexes entirely.

## Files That Need Manual Fixes

### 1. `apps/attendance/models.py`

**ClassSession Meta** (around line 70):

```python
# CURRENT (WRONG):
indexes = [
    models.Index(fields=['scheduled_date', 'start_time']),
    models.Index(fields=['faculty', 'status']),  # ← REMOVE faculty
    models.Index(fields=['subject']),             # ← REMOVE entirely
]

# SHOULD BE:
indexes = [
    models.Index(fields=['scheduled_date', 'start_time']),
    models.Index(fields=['status']),  # Keep only non-FK
]
```

**Attendance Meta** (around line 210):

```python
# CURRENT (WRONG):
indexes = [
    models.Index(fields=['session', 'student']),  # ← REMOVE entirely (both FK)
    models.Index(fields=['student', 'status']),   # ← REMOVE student
    models.Index(fields=['marked_at']),
]

# SHOULD BE:
indexes = [
    models.Index(fields=['status']),
    models.Index(fields=['marked_at']),
]
```

**AttendanceStatistics Meta** (around line 280):

```python
# CURRENT (WRONG):
indexes = [
    models.Index(fields=['student', 'subject']),  # ← REMOVE entirely (both FK)
    models.Index(fields=['attendance_percentage']),
    models.Index(fields=['is_below_threshold']),
]

# SHOULD BE:
indexes = [
    models.Index(fields=['attendance_percentage']),
    models.Index(fields=['is_below_threshold']),
]
```

### 2. `apps/face_recognition/models.py`

**FaceImage Meta** (around line 120):

```python
# CURRENT (WRONG):
indexes = [
    models.Index(fields=['face_data', 'angle']),  # ← REMOVE face_data
]

# SHOULD BE:
indexes = [
    models.Index(fields=['angle']),
]
```

**RecognitionLog Meta** (around line 180):

```python
# CURRENT (WRONG):
indexes = [
    models.Index(fields=['-timestamp']),
    models.Index(fields=['recognized_user', '-timestamp']),  # ← REMOVE recognized_user
    models.Index(fields=['status']),
]

# SHOULD BE:
indexes = [
    models.Index(fields=['-timestamp']),
    models.Index(fields=['status']),
]
```

## Migration Workflow

After fixing the indexes:

```powershell
# 1. Remove all migration files
Remove-Item -Path "apps\*\migrations\0*.py" -Force

# 2. Regenerate migrations
python manage.py makemigrations

# 3. Run migrations
python manage.py migrate

# 4. Create superuser
python manage.py createsuperuser

# 5. Start server
python manage.py runserver
```

## Current Status

✅ **Completed**:

-   Database configuration fixed (presenceiq_final)
-   All ForeignKeys have `db_constraint=False`
-   authentication.User indexes fixed
-   academic.Department, Subject, Timetable, Holiday indexes fixed

⚠️ **In Progress**:

-   attendance models need index fixes
-   face_recognition models need index fixes

❌ **Blocked Until Fixed**:

-   Cannot run migrations successfully
-   Cannot create superuser
-   Cannot start server

## Why This Happens

djongo is a compatibility layer that translates Django ORM to MongoDB. It has bugs/limitations:

1. It tries to enforce relational database concepts (FKs, constraints) on MongoDB
2. Index generation is buggy - creates duplicate indexes with different names
3. Poor handling of composite indexes with ForeignKey fields

## Alternative Solution

If these fixes don't work, consider:

1. Using **django-mongodb** (newer, better maintained)
2. Using **Djongo-Next** (community fork with fixes)
3. Using **pymongo directly** for complex queries
4. Switching to **PostgreSQL** if relational data is important

## Next Steps

1. **Manually edit** the two files above to remove FK fields from indexes
2. Run the migration workflow again
3. If still failing, provide the new error message

---

**Last Updated**: After fixing academic models, before fixing attendance/face_recognition models
**Database**: presenceiq_final (clean)
**Django Version**: 4.2.7
**djongo Version**: 1.3.6
