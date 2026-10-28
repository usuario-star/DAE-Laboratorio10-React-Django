from django.db import models

class Producto(models.Model):
    codigo = models.IntegerField(unique=True)
    descripcion = models.CharField(max_length=200)
    precio = models.FloatField()

    def __str__(self):
        return f"{self.codigo} - {self.descripcion}"
