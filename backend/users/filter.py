import django_filters
from django.db.models import Q
from .models import Users

class DynamicLookupFilter(django_filters.FilterSet):
    class Meta:
        model = Users
        fields = ['id', 'employee_id', 'device_enrol_number', 'card_number', 'company', 'location', 'department', 'employee_type', 'gender', 'email_id', 'contact_number', 'date_of_joining', 'date_of_leaving']

    def filter_queryset(self, queryset):
        for param, value in self.request.query_params.items():
            if '__' in param:
                field, lookup_expr = param.split('__', 1)
                lookup = f"{field}__{lookup_expr}"
                queryset = queryset.filter(Q(**{lookup: value}))
        return queryset
