from google.appengine.ext import db


class Publication(db.Model):
    user_name = db.StringProperty(required=True)
    title = db.StringProperty(required=True)
    link = db.StringProperty()
    authors = db.StringProperty(required=True,
                                multiline=True
                                )

    @classmethod
    def create_publication(cls, user_name, title, link, authors):
        return Publication(user_name=user_name,
                           title=title,
                           link=link,
                           authors=authors
                           )
    
    @classmethod
    def by_user_name(cls, user_name):
        return Publication.all().filter('user_name =', user_name)


class Award(db.Model):
    user_name = db.StringProperty(required=True)
    title = db.StringProperty(required=True)
    details = db.TextProperty(required=True)

    @classmethod
    def creare_award(cls, user_name, title, details):
        return Award(user_name=user_name,
                     title=title,
                     details=details
                     )

    @classmethod
    def by_user_name(cls, user_name):
        return Award.all().filter('user_name =', user_name)


class Work(db.Model):
    user_name = db.StringProperty(required=True)
    title = db.StringProperty(required=True)
    employer = db.StringProperty(required=True)
    start_date = db.DateProperty(required=True)
    end_date = db.DateProperty(required=True)
    details = db.TextProperty()
    
    @classmethod
    def creat_work(cls, user_name,
                   title, employer,
                   start_date, end_date, details):
        return Work(user_name=user_name,
                    title=title,
                    employer=employer,
                    start_date=start_date,
                    end_date=end_date,
                    details=details
                    )
    
    @classmethod
    def by_user_name(cls, user_name):
        return Work.all().filter('user_name =', user_name).order('end_date')


class Education(db.Model):
    user_name = db.StringProperty(required=True)
    degree = db.StringProperty(required=True)
    majors = db.ListProperty(str, required=True)
    school = db.StringProperty(required=True)
    gpa = db.StringProperty()
    graduation = db.DateProperty(required=True)
    courses = db.ListProperty(str, required=True)
    
    @classmethod
    def create_edu(cls, user_name, degree,
                   school, majors, gpa, graduation, courses):
        return Education(user_name=user_name,
                         degree=degree,
                         school=school,
                         majors=majors,
                         gpa=gpa,
                         graduation=graduation,
                         courses=courses
                         )

    @classmethod
    def by_user_name(cls, user_name):
        return Education.all().filter('user_name =', user_name).order('graduation')


class ToDo(db.Model):
    user_name = db.StringProperty(required=True)
    task = db.StringProperty(required=True)
    status = db.BooleanProperty(required=True)
    date = db.DateTimeProperty(auto_now_add=True)

    @classmethod
    def by_id(cls, id):
        return ToDo.get_by_id(id)

    @classmethod
    def by_user_name(cls, user_name):
        return ToDo.all().filter('user_name =', user_name).order('date')

    @classmethod
    def create_todo(cls, user_name, task,):
        return ToDo(user_name=user_name,
                    task=task,
                    status=False)


class Summary(db.Model):
    user_name = db.StringProperty(required=True)
    summary = db.TextProperty(required=True)

    @classmethod
    def create_summary(cls, user_name, summary):
        return Summary(user_name=user_name,
                       summary=summary)

    @classmethod
    def by_id(cls, sid):
        return Summary.get_by_id(sid)

    @classmethod
    def by_user_name(cls, user_name):
        return Summary.all().filter('user_name =', user_name).get()
