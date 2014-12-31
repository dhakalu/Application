import user
import base
import json
import tables


class Resume(base.RequestHandler):
    def get(self, usr=None):
        if usr:
            u = user.User.by_name(usr)
            if u:
                if usr == self.user.user_name:
                    self.render('resume.html', loged_user=self.user)
                else:
                    self.render('resume.html')
            else:
                self.render('404.html')
        elif self.user:
            self.redirect('/resume/' + self.user.user_name)
        else:
            self.render('404.html')


class UpdateSelfSummary(base.RequestHandler):
    def post(self):
        output_json = {}
        summary = self.request.get('self_summary')
        if summary:
            if self.user:
                x = tables.Summary.by_user_name(self.user.user_name)
                if x:
                    x.summary = summary
                    x.put()
                else:
                    summary = tables.Summary.create_summary(
                        user_name=self.user.user_name, summary=summary)
                    summary.put()
                output_json['status'] = 'OK'
            else:
                output_json['status'] = 'ERR'
                output_json['error'] = 'You are not loged in!'
        else:
            output_json['staus'] = 'ERR'
            output_json['error'] = 'Self summary cannot be empty'
        self.render_json(json.dumps(output_json))


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
                       'start_date': str(start_date),
                       'end_date': str(end_date),
                       'details': details
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


class EditEducation(base.RequestHandler):
    def post(self):
        output_json = {}
        edu_id = int(self.request.get('id'))
        education = tables.Education.by_id(edu_id)
        if education:
            degree = self.request.get('degree')
            school = self.request.get('school')
            gpa = self.request.get('gpa')
            majors = self.request.get('majors').split(',')
            graduation = self.request.get('graduation')
            courses = self.request.get('courses').split(',')
            education.degree = degree
            education.majors = majors
            education.school = school
            education.graduation = graduation
            education.gpa = gpa
            education.courses = courses
            education.put()
            output_json['status'] = 'OK'
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = 'No education details with that id found'
        self.render_json(json.dumps(output_json))


class EditPublication(base.RequestHandler):
    def post(self):
        output_json = {}
        error = []
        if self.user:
            publication_id = self.request.get('id')
            title = self.request.get('pub_title')
            if not title:
                error.append('Title is required')
            link = self.request.get('link')
            authors = self.request.get('authors')
            if not authors:
                error.append('Authors are required')
            if publication_id and publication_id.isdigit():
                publication = tables.Publication.by_id(int(publication_id))
                if publication:
                    if publication.user_name != self.user.user_name:
                        output_json['status'] = 'ERR'
                        output_json['error'] = 'Permission denied!'
                    else:
                        publication.title = title
                        publication.link = link
                        publication.authors = authors
                        publication.put()
                        output_json['status'] = 'OK'
                else:
                    output_json['status'] = 'ERR'
                    error.append('Invalid request')
            else:
                output_json['status'] = 'ERR'
                error.append('Publication id is required to edit it')
        else:
            output_json['status'] = 'ERR'
            error.append('You are not loged in')
        output_json['error'] = error
        self.render_json(json.dumps(output_json))


class EditAward(base.RequestHandler):
    def post(self):
        output_json = {}
        if self.user:
            award_id = self.request.get('id')
            title = self.request.get('title')
            details = self.request.get('details')
            if title and details:
                if award_id and award_id.isdigit():
                    award = tables.Award.by_id(int(award_id))
                    if award:
                        if award.user_name == self.user.user_name:
                            award.title = title
                            award.details = details
                            award.put()
                            output_json['status'] = 'OK'
                        else:
                            output_json['status'] = 'ERR'
                            output_json['error'] = 'Permission denied'
                    else:
                        output_json['status'] = 'ERR'
                        output_json['error'] = 'Invalid request!'
                else:
                    output_json['status'] = 'ERR'
                    output_json['error'] = ('Award id is not ' +
                                            'specified or is not valid')
            else:
                output_json['status'] = 'ERR'
                output_json['error'] = 'Title and Details are required'
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = 'You are not loged in'
        self.render_json(json.dumps(output_json))


class EditWork(base.RequestHandler):
    def post(self):
        output_json = {}
        if self.user:
            work_id = self.request.get('id')
            title = self.request.get('work_title')
            employer = self.request.get('employer')
            start_date = self.request.get('start_date')
            end_date = self.request.get('end_date')
            details = self.request.get('details')
            if work_id and work_id.isdigit():
                work = tables.Work.by_id(int(work_id))
                if work:
                    work.title = title
                    work.employer = employer
                    work.start_date = start_date
                    work.end_date = end_date
                    work.details = details
                    work.put()
                    output_json['status'] = 'OK'
                else:
                    output_json['status'] = 'ERR'
                    output_json['error'] = 'Invalid request'
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = 'You are not loged in'
        self.render_json(json.dumps(output_json))


class DeleteEducation(base.RequestHandler):
    def post(self):
        output_json = {}
        edu_id = self.request.get('id')
        if edu_id and edu_id.isdigit():
            if self.user:
                edu_id = int(edu_id)
                this_edu = tables.Education.by_id(edu_id)
                if this_edu.user_name == self.user.user_name:
                    this_edu.delete()
                    output_json['status'] = 'OK'
                else:
                    output_json['status'] = 'ERR'
                    output_json['error'] = 'You do not have the permission'
            else:
                output_json['status'] = 'ERR'
                output_json['error'] = 'You are not loged in'
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = 'Id is invalid'
        self.render_json(json.dumps(output_json))


class GetJSON(base.RequestHandler):
    def get(self):
        user_name = self.request.get('u')
        if user_name:
            summary = tables.Summary.by_user_name(user_name)
            educations = list(tables.Education.by_user_name(user_name))
            work = list(tables.Work.by_user_name(user_name))
            award = list(tables.Award.by_user_name(user_name))
            publication = list(tables.Publication.by_user_name(user_name))
            summary_dict = {}
            if summary:
                summary_dict['id'] = summary.key().id()
                summary_dict['user'] = summary.user_name
                summary_dict['summary'] = summary.summary
            education_list = []
            for e in educations:
                edu = {
                    'id': e.key().id(),
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
                    'id': w.key().id(),
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
                    'id': a.key().id(),
                    'title': a.title,
                    'details': a.details
                }
                award_list.append(aw)
            
            publictaion_list = []
            for p in publication:
                pub = {
                    'id': p.key().id(),
                    'title': p.title,
                    'link': p.link,
                    'authors': p.authors
                }
                publictaion_list.append(pub)

            output = {
                'results': {
                    'user': user_name,
                    'summary': summary_dict,
                    'education': education_list,
                    'works': work_list,
                    'awards': award_list,
                    'publications': publictaion_list
                }
            }
            self.render_json(json.dumps(output))
