import user
import base
import json
import tables


class Resume(base.RequestHandler):
    def get(self):
        usr = self.request.get('u')
        if usr or self.user:
            if usr:
                u = user.User.by_name(usr)
            else:
                u = self.user

            if u is not None:
                education = list(tables.Education.by_user_name(u.user_name))
                awards = list(tables.Award.by_user_name(u.user_name))
                works = list(tables.Work.by_user_name(u.user_name))
                publications = tables.Publication.by_user_name(u.user_name)
                if u.user_name == self.user.user_name:
                    self.render("resume.html",
                                edu=education,
                                awards=awards,
                                works=works,
                                publications=publications,
                                loged_user=self.user
                                )
                else:
                    self.render("resume.html",
                                edu=education,
                                awards=awards,
                                works=works,
                                publications=publications,
                                )
            else:
                self.redirect("/")
        else:
            self.redirect("/")


class UpdateEducation(base.RequestHandler):
    def post(self):
        degree = self.request.get('degree')
        school = self.request.get('school')
        gpa = self.request.get('gpa')
        majors = self.request.get('majors').split(',')
        graduation = self.request.get('graduation')
        courses = self.request.get('courses').split(',')
        output_json = {
            'status': True,
            'degree': degree,
            'school': school,
            'gpa': gpa,
            'courses': courses
        }
        edu = tables.Education.create_edu(user_name=self.user.user_name,
                                          degree=degree,
                                          school=school,
                                          majors=majors,
                                          gpa=gpa,
                                          graduation=graduation,
                                          courses=courses
                                          )
        edu.put()
        self.render_json(json.dumps(output_json))


class UpdatePublication(base.RequestHandler):
    def post(self):
        title = self.request.get('title')
        link = self.request.get('link')
        authors = self.request.get('authors')
        output_json = {'title': title,
                       'link': link,
                       'authors': authors
                       }
        publication = (tables.Publication.create_publication(user_name=self.user.user_name,
                                                             title=title,
                                                             link=link,
                                                             authors=authors))
        publication.put()
        self.render_json(json.dumps(output_json))


class UpdateAward(base.RequestHandler):
    def post(self):
        title = self.request.get('title')
        details = self.request.get('details')
        output_json = {'title': title,
                       'details': details
                       }
        award = tables.Award.creare_award(user_name=self.user.user_name,
                                          title=title,
                                          details=details
                                          )
        award.put()
        self.render_json(json.dumps(output_json))


class UpdateWork(base.RequestHandler):
    def post(self):
        title = self.request.get('work_title')
        employer = self.request.get('employer')
        start_date = self.request.get('start_date')
        end_date = self.request.get('end_date')
        details = self.request.get('details')
        output_json = {'title': title,
                       'employer': employer,
                       'start_date': start_date,
                       'end_date': end_date,
                       }
        work = tables.Work.creat_work(user_name=self.user.user_name,
                                      title=title,
                                      employer=employer,
                                      start_date=start_date,
                                      end_date=end_date,
                                      details=details
                                      )
        work.put()
        self.render_json(json.dumps(output_json))


class GetJSON(base.RequestHandler):
    def get(self):
        user_name = self.request.get('u')
        if not user_name:
            user_name = self.user.user_name
        if user_name:
            educations = list(tables.Education.by_user_name(user_name))
            work = list(tables.Work.by_user_name(user_name))
            award = list(tables.Work.by_user_name(user_name))
            publication = list(tables.Publication.by_user_name(user_name))
            education_list = []
            for e in educations:
                edu = {
                    'institution': e.school,
                    'degree': e.degree,
                    'majors': e.majors,
                    'gpa': e.gpa,
                    'graduation': e.graduation,
                    'courses': e.courses
                }
                education_list.append(edu)
            work_list = []
            for w in work:
                wk = {
                    'title': w.title,
                    'employer': w.employer,
                    'start_date': w.start_date,
                    'end_date': w.end_date,
                    'details': w.details
                }
                work_list.append(wk)
            
            award_list = []
            for a in award:
                aw = {
                    'title': a.title,
                    'details': a.details
                }
                award_list.append(aw)
            
            publictaion_list = []
            for p in publication:
                pub = {
                    'title': p.title,
                    'link': p.link,
                    'authors': p.authors
                }
                publictaion_list.append(pub)

            output = {
                'results': {
                    'user': user_name,
                    'education': education_list,
                    'works': work_list,
                    'awards': award_list,
                    'publications': publictaion_list
                }
            }
            self.render_json(json.dumps(output))
