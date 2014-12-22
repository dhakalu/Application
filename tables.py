from google.appengine.ext import db


class Publication(db.Model):
    user = db.StringProperty(required=True)
    title = db.StringProperty(required=True)
    link = db.StringProperty()
    authors = db.StringProperty(required=True,
                                multiline=True
                                )

    @classmethod
    def create_publication(cls, user, title, link, authors):
        return Publication(user=user,
                           title=title,
                           link=link,
                           authors=authors
                           )
    
    @classmethod
    def by_user(cls, user_name):
        return Publication.all().filter('user =', user_name)


class Award(db.Model):
    user = db.StringProperty(required=True)
    title = db.StringProperty(required=True)
    details = db.TextProperty(required=True)

    @classmethod
    def creare_award(cls, user, title, details):
        return Award(user=user,
                     title=title,
                     details=details
                     )

    @classmethod
    def by_user(cls, user_name):
        return Award.all().filter('user =', user_name)


class Work(db.Model):
    user = db.StringProperty(required=True)
    title = db.StringProperty(required=True)
    employer = db.StringProperty(required=True)
    start_date = db.StringProperty(required=True)
    end_date = db.StringProperty(required=True)
    details = db.TextProperty()
    
    @classmethod
    def creat_work(cls, user, title, employer, start_date, end_date, details):
        return Work(user=user,
                    title=title,
                    employer=employer,
                    start_date=start_date,
                    end_date=end_date,
                    details=details
                    )
    
    @classmethod
    def by_user(cls, user_name):
        return Work.all().filter('user =', user_name)


class Education(db.Model):
    user = db.StringProperty(required=True)
    degree = db.StringProperty(required=True)
    majors = db.StringListProperty(required=True)
    school = db.StringProperty(required=True)
    gpa = db.StringProperty()
    graduation = db.StringProperty(required=True)
    courses = db.StringListProperty(required=True)
    
    @classmethod
    def create_edu(cls, user, degree,
                   school, majors, gpa, graduation, courses):
        return Education(user=user,
                         degree=degree,
                         school=school,
                         majors=majors,
                         gpa=gpa,
                         graduation=graduation,
                         courses=courses
                         )

    @classmethod
    def by_user(cls, user):
        return Education.all().filter('user =', user)
