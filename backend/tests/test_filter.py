from app.models.filter import FilterExpression, FieldFilter, FilterOperation, FilterCompoundOperation, FilterCompound


def test_filter_construction():
    name_filter = FieldFilter(field='first_name', operation=FilterOperation.LIKE, value='es')
    role_filter = FieldFilter(field='role', operation=FilterOperation.GT, value=1)
    compound = FilterCompound(filters=[name_filter, role_filter], operator=FilterCompoundOperation.AND)

    expr = FilterExpression(compound)
    print(expr)
    assert str(expr) == '(first_name like es and role gt 1)'
