from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response

class ProductPagination(PageNumberPagination):
    page_size = 10                      # default products per page
    page_size_query_param = 'limit'     # allow frontend to change: ?limit=24
    max_page_size = 100                 # maximum allowed

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,       # total products
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })