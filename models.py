from mongoengine import Document
from mongoengine.fields import *
from mongoengine import Document, EmbeddedDocument
from datetime import datetime
from mongoengine.queryset.visitor import Q
from mongoengine import connect
import json
from scipy.spatial import distance

# review document schema
class Reviews(EmbeddedDocument):
    username = StringField(unque=True)
    profile_pic = StringField(default="../images/default_user.png")
    review_text = StringField()
    rating = FloatField(default=0.0)
    created = DateTimeField(default=datetime.utcnow())

# book document schema
class Books(Document):
    book_title = StringField(required=True)
    authors = ListField(StringField(), required=True)
    description = StringField(required=True, unique=True, default="")
    genres = ListField(StringField(), required=True)
    cover_image = StringField(required=True, default="../images/default_book.png")
    avg_rating = FloatField(default=0.0) 
    links = DictField()       # {'link name': url}
    personality_index = DictField()
    reviews = EmbeddedDocumentListField(Reviews)
    cluster = IntField(default=0)
    extra_details = DictField()
    created = DateTimeField(default=datetime.utcnow())

    meta = {
        "ordering": ["-created"],
        "reverse": True
    }

# Shelf Schema
class Shelves(EmbeddedDocument):
    shelf_title = StringField(required=True)
    shelved_books = ListField(ReferenceField('Books', dbref=True), default=[])
    shelf_pic = StringField(default="../images/default_bookshelf.png")
    created = DateTimeField(default=datetime.utcnow())

# user document schema
class Users(Document):
    username = StringField(unque=True)
    password = StringField()
    email = EmailField(unique=True)
    profile_pic = StringField(default="../images/default_user.png")
    date_of_birth = DateTimeField()
    description = StringField(default="i am a default user")
    personality_index = DictField()
    friends_list = ListField(ReferenceField('self',  dbref=True))
    shelves = EmbeddedDocumentListField(Shelves, default=[
        Shelves(
            shelf_title="Favourite",
            shelf_pic = "../images/favourite.png"
        )
    ], ordering="created", reverse=True)
    created = DateTimeField(default=datetime.utcnow())

    meta = {
        "indexes": ["username", "email"],
        "ordering": ["-created"]
    }

username = 'admin'
password = 'admin'
db = 'illumina'
host = f'mongodb+srv://{username}:{password}@illumina-lmf8b.gcp.mongodb.net/{db}?retryWrites=true&w=majority'

connect(host=host)

per = { 
        'OPN': 4.209927295182957,
        'CON': 3.48769107555891,
        'EXT': 3.2318085088125743,
        'AGR': 3.560093853496472,
        'NEU': 2.5305670186373637
    }

print('connected')

books = Books.objects(cluster = 12).aggregate(*[
            {
                '$project': {
                    'book_title': 1,
                    'cover_image': 1,
                    'avg_rating': 1,
                    'genres': 1,
                    'authors': 1,
                    'cluster': 1,
                    'personality_index': 1
                }
            },
            { '$sample': { 'size': 20 } }
        ])

books = list(books)

dis = {}
up = tuple(per.values())
for x in range(len(books)):
    bp = tuple(books[x]['personality_index'].values())
    dis[x] = distance.euclidean(up, bp)

dis = sorted(dis.items(), key=lambda x: x[1])
sorted_books = []
for x in dis:
    sorted_books.append(books[x[0]]['book_title'])

print(sorted_books)