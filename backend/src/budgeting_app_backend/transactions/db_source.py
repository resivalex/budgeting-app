import pycouchdb


class DbSource:
    def __init__(self, url):
        self.__server = pycouchdb.Server(url)

    def all(self):
        db = self.__server.database("budgeting")
        return [doc["doc"] for doc in db.all()]
