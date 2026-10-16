from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=80)
    slug = models.SlugField(max_length=90, unique=True)
    blurb = models.CharField(max_length=200, blank=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Product(models.Model):
    class Material(models.TextChoices):
        STONEWARE = 'stoneware', 'Stoneware'
        PORCELAIN = 'porcelain', 'Porcelain'
        LINEN = 'linen', 'Linen'
        WOOL = 'wool', 'Wool'
        BRASS = 'brass', 'Brass'
        OAK = 'oak', 'Oak'
        GLASS = 'glass', 'Glass'
        COTTON = 'cotton', 'Cotton'

    name = models.CharField(max_length=140)
    slug = models.SlugField(max_length=160, unique=True)
    category = models.ForeignKey(Category, related_name='products', on_delete=models.PROTECT)
    sku = models.CharField(max_length=30, unique=True)
    description = models.TextField()
    care = models.CharField(max_length=300, blank=True)
    material = models.CharField(max_length=20, choices=Material.choices)
    price_cents = models.PositiveIntegerField(help_text='Price in US cents.')
    image_url = models.URLField(max_length=500)
    image_alt = models.CharField(max_length=200)
    stock = models.PositiveIntegerField(default=0)
    featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

    @property
    def price(self):
        return self.price_cents / 100

    @property
    def in_stock(self):
        return self.stock > 0
