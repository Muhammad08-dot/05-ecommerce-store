"""
Seed realistic demo data for the Halden storefront.

Run after migrate:
    python seed.py

Idempotent: clears catalog/orders/customers it owns and recreates them.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import os  # noqa: E402

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

import django  # noqa: E402

django.setup()

from django.contrib.auth import get_user_model  # noqa: E402

from catalog.models import Category, Product  # noqa: E402
from orders.models import Order, OrderItem  # noqa: E402

User = get_user_model()

U = 'https://images.unsplash.com/photo-{pid}?auto=format&fit=crop&w=900&q=80'

CATEGORIES = [
    ('Ceramics', 'ceramics', 'Wheel-thrown stoneware and porcelain for daily rituals.'),
    ('Textiles', 'textiles', 'Washed linen and undyed wool, woven in small runs.'),
    ('Kitchen', 'kitchen', 'Considered tools and serving pieces for the table.'),
    ('Lighting', 'lighting', 'Warm, dimmable light in brass, oak, and glass.'),
    ('Bath', 'bath', 'Soft underfoot things for the morning and the evening.'),
]

# (name, category_slug, sku, material, price_cents, stock, featured, photo_id, alt, desc, care)
PRODUCTS = [
    ('Kite Serving Bowl', 'ceramics', 'HAL-CB-01', 'stoneware', 6800, 24, True,
     '1530006498959-b7884e829a04', 'Two pale handmade ceramic bowls on a white table',
     'A generous, low bowl for salads, grain, or fruit. Thrown thin and dipped three times so the glaze pools around the ring marks, it is as happy on the table as it is on a shelf.',
     'Dishwasher safe. Avoid direct flame.'),
    ('Ridge Mug - Pair', 'ceramics', 'HAL-CB-02', 'stoneware', 4200, 40, True,
     '1514228742587-6b1558fcca3d', 'Two handmade speckled stoneware mugs on a wooden table',
     'Our everyday mug, sold as a pair. A pronounced ridge wraps the lip where your thumb rests, and the unglazed foot keeps it grounded on the counter.',
     'Dishwasher and microwave safe.'),
    ('Halo Dinner Plate', 'ceramics', 'HAL-CB-03', 'porcelain', 3900, 30, False,
     '1621453571889-0b228e998080', 'Overhead view of a glazed round plate',
     'A wide, rimmed plate with a soft reactive glaze that deepens toward the well. Each plate sits slightly proud of the last, so a stack reads like a set of rings.',
     'Dishwasher safe. Handle the rim with care.'),
    ('Halo Cup & Saucer', 'ceramics', 'HAL-CB-04', 'stoneware', 4600, 26, False,
     '1605117012605-b68dedd4accc', 'Brown ceramic cup resting on a pale saucer',
     'A quiet pairing for a slow coffee. The cup is thrown with a thick base to hold the heat, the saucer cut slightly wider so a spoon has somewhere to rest.',
     'Dishwasher safe.'),
    ('Loom Linen Tea Towels - Set of 3', 'textiles', 'HAL-TX-01', 'linen', 5200, 50, True,
     '1638232928539-6e91c47ddec5', 'A soft grey linen towel folded neatly',
     'Three heavyweight linen towels that only get softer. Hemmed by hand and garment-washed, they dry fast and refuse to look precious.',
     'Machine wash warm. Tumble dry low, or hang.'),
    ('Undyed Wool Throw', 'textiles', 'HAL-TX-02', 'wool', 18500, 8, True,
     '1634120455427-d4db69777fdc', 'Folded warm-toned wool blanket in close detail',
     'A slow-woven throw in undyed fleece, so the colour is exactly what the sheep gave. Heavy enough to settle, light enough to carry to the sofa.',
     'Dry clean only. Air between uses.'),
    ('Nesting Prep Bowls - Set of 4', 'kitchen', 'HAL-KT-01', 'stoneware', 5800, 22, False,
     '1525973779373-015bdf68e579', 'Four round white ceramic bowls on a pale surface',
     'Four bowls sized to nest: prep, mix, hold, serve. The matte white finish hides knife marks and the rims are thick enough to grip with a wet hand.',
     'Dishwasher safe.'),
    ('Oak Serving Board', 'kitchen', 'HAL-KT-02', 'oak', 7400, 20, True,
     '1666013942797-9daa4b8b3b4f', 'A blade resting on a pale oak board',
     'A single slab of white oak, finished with food-safe oil and a thumb-hole for hanging. The grain runs long, so it carves as well as it serves.',
     'Hand wash. Re-oil every few months.'),
    ('Brass Measuring Spoons', 'kitchen', 'HAL-KT-03', 'brass', 4800, 28, False,
     '1556911220-bff31c812dba', 'Kitchen tools laid out on a stone counter',
     'Solid brass, weighted so they level themselves, on a split ring that will not tangle. The finish darkens quietly with use.',
     'Hand wash to keep the patina even.'),
    ('Caster Table Light', 'lighting', 'HAL-LG-01', 'brass', 16500, 10, True,
     '1667312939978-64cf31718a6e', 'A small warm lamp glowing beside a stack of books',
     'A cordless little lamp for the corner of a table. Touch to raise or drop the light, and it holds a charge for about a full evening of dinner.',
     'USB-C charging. Wipe with a dry cloth.'),
    ('Marlow Side Lamp', 'lighting', 'HAL-LG-02', 'brass', 12800, 9, False,
     '1506377295352-e3154d43ea9e', 'A white-shaded lamp lit on a side table',
     'A low, warm pool of light for the reading chair. The linen shade takes the edge off the bulb, so the corner glows instead of glaring.',
     'Fitted plug. Dry dust only.'),
    ('Ash Glass Bud Vase', 'kitchen', 'HAL-KT-04', 'glass', 4600, 24, False,
     '1609210885628-4c6a41a8caf7', 'Clear glass vase holding stems on an oak surface',
     'A hand-blown vase with a slight smoke to the glass, so dried grasses and single stems both read well in it. Weighted base, narrow enough for a posy.',
     'Rinse by hand. No dishwasher.'),
    ('Hatched Bath Towel', 'bath', 'HAL-BA-01', 'cotton', 6800, 20, False,
     '1616663717839-2fea42e1a1f6', 'Crisp white towels folded along a stone bathtub',
     'A fast-drying hatch-weave towel with a heavy, looped pile. Big enough to wrap, dense enough to actually dry you.',
     'Machine wash warm. Hang to dry.'),
    ('Waffle Hand Towels - Set of 2', 'bath', 'HAL-BA-02', 'cotton', 4400, 42, False,
     '1651513825857-9fda9d5729fe', 'Folded towels and warm wood in a bright bathroom',
     'Two loose waffle towels that dry a pair of hands in seconds and never feel stiff. Loop-hung for the rail, not the hook.',
     'Machine wash warm. No fabric softener.'),
    ('Draped Cotton Throw', 'bath', 'HAL-BA-03', 'cotton', 9600, 14, True,
     '1674475760738-8c7af859f821', 'A chunky blanket laid across a linen sofa',
     'The catch-all throw for the arm of the chair or the end of the bed. Quilted cotton, machine washable, and soft without being precious.',
     'Machine wash cold. Tumble low.'),
    ('Studio Carafe', 'ceramics', 'HAL-CB-05', 'stoneware', 5800, 16, False,
     '1590605095243-072811dbe64c', 'A freshly thrown pale clay jug held in two hands',
     'A two-litre jug with a pinched pour spout that cuts drips. The matte exterior stays cool and quiet on the table.',
     'Hand wash recommended.'),
    ('Clay Catchall Dish', 'ceramics', 'HAL-CB-06', 'stoneware', 2800, 48, False,
     '1571987530791-58e3e7744d99', 'Small clay dishes set on a pale tray',
     'A palm-sized dish for the entryway - keys, rings, the week coins. Glazed inside, raw clay underneath so it grips the shelf.',
     'Wipe clean.'),
    ('Heavy Linen Cushion Cover', 'textiles', 'HAL-TX-03', 'linen', 6200, 26, False,
     '1545042746-ec9e5a59b359', 'Soft neutral linen textile folded in layers',
     'An envelope-back cover in stonewashed linen that fits a 45cm insert. Two thick layers in front, so the fill never shows through.',
     'Machine wash cold. Iron damp if you like.'),
]

DEMO_ORDERS = [
    # (email, name, line refs by sku, city, postal, status)
    ('n.fletcher@example.com', 'Nadia Fletcher', ['HAL-CB-02', 'HAL-KT-02'], 'Portland', '97201', 'fulfilled'),
    ('m.okafor@example.com', 'Michael Okafor', ['HAL-TX-02', 'HAL-LG-01'], 'Austin', '78701', 'paid'),
    ('s.delgado@example.com', 'Sofia Delgado', ['HAL-CB-01', 'HAL-CB-06', 'HAL-KT-01'], 'Brooklyn', '11215', 'paid'),
]


def seed():
    print('Clearing existing demo data...')
    OrderItem.objects.all().delete()
    Order.objects.all().delete()
    Product.objects.all().delete()
    Category.objects.all().delete()

    for name, slug, blurb in CATEGORIES:
        Category.objects.create(name=name, slug=slug, blurb=blurb)
    print(f'  {len(CATEGORIES)} categories')

    for (name, cat, sku, material, price, stock, featured, pid, alt, desc, care) in PRODUCTS:
        Product.objects.create(
            name=name, slug=name.lower().replace(' — ', '-').replace(' ', '-').replace("'", ''),
            category=Category.objects.get(slug=cat), sku=sku, description=desc, care=care,
            material=material, price_cents=price, image_url=U.format(pid=pid), image_alt=alt,
            stock=stock, featured=featured, is_active=True,
        )
    print(f'  {len(PRODUCTS)} products')

    # Staff + demo customer accounts
    admin = User.objects.filter(email='studio@halden.co').first()
    if not admin:
        admin = User.objects.create_superuser(
            username='studio@halden.co',
            email='studio@halden.co', password='HaldenAdmin#1', first_name='Ada', last_name='Reyes',
        )
    admin.role = User.Role.ADMIN
    admin.save()
    demo = User.objects.filter(email='shopper@halden.co').first()
    if not demo:
        demo = User.objects.create_user(
            username='shopper@halden.co',
            email='shopper@halden.co', password='Shopper#2025', first_name='Leo', last_name='Bennett',
        )
    print('  2 user accounts (admin + demo shopper)')

    # A couple of prior orders so the history page isn't empty
    for email, fullname, skus, city, postal, status in DEMO_ORDERS:
        order = Order.objects.create(
            reference=Order.next_reference(), email=email, shipping_name=fullname,
            shipping_address=f'{120 + len(skus) * 7} Alder Street', shipping_city=city,
            shipping_postal=postal, status=status,
            subtotal_cents=0, shipping_cents=0, tax_cents=0, grand_total_cents=0,
        )
        subtotal = 0
        for sku in skus:
            p = Product.objects.get(sku=sku)
            OrderItem.objects.create(order=order, product=p, name=p.name, sku=p.sku,
                                     unit_price_cents=p.price_cents, qty=1)
            subtotal += p.price_cents
        shipping = 0 if subtotal >= 12000 else 900
        tax = int(round(subtotal * 0.08))
        order.subtotal_cents = subtotal
        order.shipping_cents = shipping
        order.tax_cents = tax
        order.grand_total_cents = subtotal + shipping + tax
        order.save()
    print(f'  {Order.objects.count()} demo orders')
    print('Seed complete.')


if __name__ == '__main__':
    seed()
