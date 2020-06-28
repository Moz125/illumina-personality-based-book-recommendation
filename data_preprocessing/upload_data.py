from mongoengine import connect
from mongoengine import NotUniqueError
import os
import os.path
import json

from models import Books


username = 'admin'
password = 'admin'
db = 'illumina'
host = f'mongodb+srv://{username}:{password}@illumina-lmf8b.gcp.mongodb.net/{db}?retryWrites=true&w=majority'

db = connect(host=host)

genres = ['10th-century', '11th-century', '12th-century', '13th-century', '14th-century', 
'15th-century', '16th-century', '17th-century', '1864-shenandoah-campaign', '18th-century', 
'1917', '19th-century', '1st-grade', '20th-century', '21st-century', '2nd-grade', '40k', 
'ableism', 'abuse', 'academia', 'academic', 'academics', 'accounting', 'accra', 'action', 
'activism', 'adaptations', 'addis-ababa', 'addition', 'adolescence', 'adoption', 'adult', 
'adult-colouring-books', 'adult-fiction', 'adventure', 'adventurers', 'aeroplanes', 'africa', 
'african-american', 'african-american-literature', 'african-american-romance', 
'african-literature', 'agender', 'agriculture', 'ahistory', 'aircraft', 'airliners', 
'airships', 'albanian-literature', 'alcohol', 'alexandria', 'algebra', 'algeria', 
'algiers', 'algorithms', 'aliens', 'alternate-history', 'alternate-universe', 
'alternative-medicine', 'amateur-sleuth', 'amazon', 'ambulance-service', 'ambulances', 
'american', 'american-civil-war', 'american-classics', 'american-fiction', 'american-history', 
'american-novels', 'american-revolution', 'american-revolutionary-war', 'americana', 'amish', 
'amish-fiction', 'amish-historical-romance-fiction', 'ancient', 'ancient-history', 'androgyne',
'angels', 'anglo-saxon', 'angola', 'animal-fiction', 'animals', 'anime', 'anthologies', 
'anthropology', 'anthropomorphic', 'anti-intellectualism', 'anti-racist', 'anti-science', 
'antietam-campaign', 'antiquities', 'antisemitism', 'apocalyptic', 'apple']

for genre in genres:
    with open(f"data/analyzed_books/{genre}.json", encoding="utf8") as read_file:
        try:
            books_data = json.load(read_file)
        except:
            print('Error! Book not loaded')
            continue
        print(genre)
        count = 0
        for id, data in books_data.items():
            extra_details = {}
            for key, value in data.items():
                if key not in ['title', 'reviews', 'authors', 'description', 'genres', 
                                'cover_image', 'avg_ratings', 'links', 'OPN', 'CON',
                                'EXT', 'AGR', 'NEU', 'average', 'cluster', 'rating']:
                    extra_details[key] = value
            try:
                Books(
                    book_title = data['title'],
                    authors = data['authors'],
                    description = data['description'],
                    genres = data['genres'],
                    cover_image = data['cover_image'],
                    avg_rating = data['rating'],
                    links = data['links'],
                    personality_index = data['average'],
                    cluster = int(data['cluster']),
                    extra_details = extra_details
                ).save()
                count += 1
            except NotUniqueError:
                continue

        print(f'Books in {genre} added equal {count}')