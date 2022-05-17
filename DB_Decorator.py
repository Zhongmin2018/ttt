# -*- coding: utf-8 -*-
from django.http.response import HttpResponseServerError

def database_error(request, message):
    if message == '' or message is None:
        message = 'Error detail is not given.'
    context = {
        'database_error': message,
    }
    return HttpResponseServerError(content='系统异常，请联系管理员！')

def database_error_decorator(func):
    from functools import wraps
    from django.utils.decorators import available_attrs

    def decorator(view_func):

        @wraps(view_func, assigned=available_attrs(view_func))
        def _wrapped_view(request, *args, **kwargs):
            try:
                return view_func(request, *args, **kwargs)
            except Exception as e:
                return database_error(request, message=e.args)
        return _wrapped_view
    return decorator(func)
