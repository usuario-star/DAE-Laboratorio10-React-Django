import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Producto

@csrf_exempt
def producto_view(request):
    if request.method == 'GET':
        # Inicializar productos base si la tabla esta vacia
        if Producto.objects.count() == 0:
            Producto.objects.create(codigo=1, descripcion='Coca cola', precio=2.33)
            Producto.objects.create(codigo=2, descripcion='Fanta', precio=1.7)
        
        productos = list(Producto.objects.all().values('codigo', 'descripcion', 'precio'))
        return JsonResponse(productos, safe=False)

    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            codigo = int(data.get('codigo'))
            descripcion = str(data.get('descripcion'))
            precio = float(data.get('precio'))

            # Si ya existe, actualizar; si no, crear
            prod, created = Producto.objects.update_or_create(
                codigo=codigo,
                defaults={'descripcion': descripcion, 'precio': precio}
            )
            return JsonResponse({
                'codigo': prod.codigo,
                'descripcion': prod.descripcion,
                'precio': prod.precio,
                'status': 'creado' if created else 'actualizado'
            }, status=201 if created else 200)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Metodo no permitido'}, status=405)
