# Djongo Admin Form Fix

## Issue Description

When using `limit_choices_to` parameter in ForeignKey fields, Django generates complex SQL queries with `EXISTS` subqueries to filter the choices. However, djongo 1.3.6 cannot parse these complex SQL queries, resulting in a `DatabaseError` when trying to access admin pages for adding/editing records.

### Error Example

```
django.db.utils.DatabaseError: (Could not get exception message)

FAILED SQL: ('SELECT "users"."password", "users"."is_superuser", "users"."id", ...
FROM "users" WHERE EXISTS(SELECT %(0)s AS "a" FROM "users" U0
WHERE (U0."role" = %(1)s AND U0."id" = ("users"."id")) LIMIT 1)
ORDER BY "users"."created_at" DESC',)

Params: ((1, 'hod'),)
```

### Root Cause

When a model has a ForeignKey with `limit_choices_to`:

```python
hod = models.ForeignKey(
    User,
    limit_choices_to={'role': 'hod'},  # ← This causes the issue
    ...
)
```

Django's admin automatically creates a form widget that needs to query for available choices. The `limit_choices_to` parameter generates an SQL query with `EXISTS` subquery, which djongo cannot parse.

---

## Solution

Override the admin forms to manually filter querysets without using `limit_choices_to` in the query.

### Implementation

#### Step 1: Create Custom Admin Forms

```python
from django import forms
from .models import Department
from apps.authentication.models import User


class DepartmentAdminForm(forms.ModelForm):
    """Custom form for Department to avoid djongo query issues."""

    class Meta:
        model = Department
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Manually filter HOD users without using limit_choices_to
        if 'hod' in self.fields:
            self.fields['hod'].queryset = User.objects.filter(
                role='hod'
            ).order_by('first_name', 'last_name')
```

#### Step 2: Use Custom Form in Admin

```python
@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    form = DepartmentAdminForm  # ← Add this line
    list_display = ['code', 'name', 'hod', 'is_active']
    # ... rest of admin configuration
```

---

## Applied Fixes

### 1. Department Admin (`apps/academic/admin.py`)

**Problem**: HOD field with `limit_choices_to={'role': 'hod'}`

**Fix**: Created `DepartmentAdminForm` that manually filters users by role='hod'

```python
class DepartmentAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'hod' in self.fields:
            self.fields['hod'].queryset = User.objects.filter(role='hod').order_by('first_name', 'last_name')
```

### 2. Subject Admin (`apps/academic/admin.py`)

**Problem**: Multiple fields with `limit_choices_to`:

-   `primary_faculty` → `{'role': 'faculty'}`
-   `additional_faculty` → `{'role': 'faculty'}`
-   `enrolled_students` → `{'role': 'student'}`

**Fix**: Created `SubjectAdminForm` that manually filters each field

```python
class SubjectAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'primary_faculty' in self.fields:
            self.fields['primary_faculty'].queryset = User.objects.filter(role='faculty').order_by('first_name', 'last_name')
        if 'additional_faculty' in self.fields:
            self.fields['additional_faculty'].queryset = User.objects.filter(role='faculty').order_by('first_name', 'last_name')
        if 'enrolled_students' in self.fields:
            self.fields['enrolled_students'].queryset = User.objects.filter(role='student').order_by('first_name', 'last_name')
```

### 3. Timetable Admin (`apps/academic/admin.py`)

**Problem**: Faculty field with `limit_choices_to={'role': 'faculty'}`

**Fix**: Created `TimetableAdminForm`

```python
class TimetableAdminForm(forms.ModelForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if 'faculty' in self.fields:
            self.fields['faculty'].queryset = User.objects.filter(role='faculty').order_by('first_name', 'last_name')
```

---

## Why This Works

1. **Bypasses limit_choices_to**: By manually setting the queryset in the form's `__init__` method, we bypass Django's automatic query generation from `limit_choices_to`.

2. **Simple Filter Query**: `User.objects.filter(role='faculty')` generates a simple SQL query that djongo can handle:

    ```sql
    SELECT * FROM users WHERE role = 'faculty'
    ```

3. **No EXISTS Subquery**: Avoids the complex `EXISTS` subquery that djongo cannot parse.

4. **Maintains Functionality**: The end result is the same - only appropriate users appear in the dropdown, but without the problematic SQL.

---

## Alternative Solutions

If this approach doesn't work or you encounter similar issues elsewhere:

### Option 1: Remove limit_choices_to from Models

Remove `limit_choices_to` from model definitions and rely entirely on admin forms:

```python
# In models.py - REMOVE limit_choices_to
hod = models.ForeignKey(
    User,
    on_delete=models.SET_NULL,
    # limit_choices_to={'role': 'hod'},  # ← Remove this
    db_constraint=False
)
```

### Option 2: Use Raw Queries

For very complex filtering, use raw queries:

```python
def __init__(self, *args, **kwargs):
    super().__init__(*args, **kwargs)
    from django.db import connection
    with connection.cursor() as cursor:
        cursor.execute("SELECT id, email, first_name, last_name FROM users WHERE role = %s", ['hod'])
        hod_users = cursor.fetchall()
    # Create choices manually
```

### Option 3: Switch to djongo-ng or PostgreSQL

-   **djongo-ng**: More actively maintained fork of djongo
-   **PostgreSQL**: Most stable database for Django (recommended for production)

---

## Testing

After applying these fixes, test the following:

1. **Access Add Pages**:

    ```
    http://127.0.0.1:8000/admin/academic/department/add/
    http://127.0.0.1:8000/admin/academic/subject/add/
    http://127.0.0.1:8000/admin/academic/timetable/add/
    ```

2. **Verify Dropdowns**:

    - Department → HOD field should show only users with role='hod'
    - Subject → Primary/Additional Faculty should show only users with role='faculty'
    - Subject → Enrolled Students should show only users with role='student'
    - Timetable → Faculty should show only users with role='faculty'

3. **Create Records**:
    - Try creating a department with an HOD
    - Try creating a subject with faculty and students
    - Verify data saves correctly

---

## Important Notes

1. **Keep db_constraint=False**: This is still required for djongo to avoid index conflicts during migrations.

2. **Model-Level Validation**: Since we're not using `limit_choices_to` at the model level, add validation in your views/serializers:

    ```python
    def clean_hod(self):
        hod = self.cleaned_data.get('hod')
        if hod and hod.role != 'hod':
            raise ValidationError('Selected user must have HOD role')
        return hod
    ```

3. **API Endpoints**: If using DRF, apply similar filtering in serializers:

    ```python
    class DepartmentSerializer(serializers.ModelSerializer):
        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
            self.fields['hod'].queryset = User.objects.filter(role='hod')
    ```

4. **Performance**: For large user bases, consider adding `select_related()` or pagination to the querysets.

---

## Status

✅ **FIXED**: All academic admin pages now work correctly

-   Department add/edit forms load without errors
-   Subject add/edit forms load without errors
-   Timetable add/edit forms load without errors
-   Dropdowns correctly filtered by user role

---

## Future Considerations

For future models with ForeignKeys that need filtering:

1. **Always use custom forms** for admin pages when using djongo
2. **Don't rely on limit_choices_to** - it will cause SQL parsing errors
3. **Document the workaround** in model docstrings
4. **Consider migrating to PostgreSQL** for production deployment

---

**Date Fixed**: November 18, 2025  
**Django Version**: 4.1.13  
**Djongo Version**: 1.3.6  
**Status**: Working ✅
