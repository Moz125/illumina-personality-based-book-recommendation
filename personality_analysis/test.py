from ppredict import PPredictor
from cpredict import CPredictor

P = PPredictor()
C = CPredictor()

text = """"
    you know what was the best part of these books? and i say books as in plural because there were so fucking many of them i can't sit still long enough to check them all off. and i DID read every single one. what else was there to do in middle school?
    anyway, the best part of these books was brian's description of food. it was magnificent. it didn't just make you hungry, it made you crave weird ass things that nobody would ever dream about eating in middle school. nutted cheeses and flan bread and berry cakes and what-not; almost makes you want to be a sword weilding ferret yourself.
    which was good because by the tenth book you started to realize there was a trend to the plotlines. something bad happens, small furry animals go on a quest. they fight a lot of little battles until one major battle which the good guys almost lose until, when all hope is lost, a giant contingent of allies created on the preceding journey show up to conquer evil: together.
    still, i always finished satisfied. and a little hungry."""

# Traits: ['OPN', 'CON', 'EXT', 'AGR', 'NEU']
prediction =  P.user_predict([text])
print(prediction)

cluster = C.user_cluster_predict([prediction])
print(cluster)
