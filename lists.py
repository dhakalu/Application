import base
import json
import tables


class CreateShoppingList(base.RequestHandler):
    def post(self):
        output_json = {}
        name = self.request.get('name')
        if name:
            items_list = self.request.get('items').split(',')
            items = {}
            for x in range(0, len(items_list)-1):
                items[x] = items_list[x]
            items_json = json.dumps(items)
            output_json['json'] = items
            if items_json:
                shopping_list = tables.ShoppingList.create(
                    user_name=self.user.user_name,
                    name=name,
                    items=items_json
                )
                shopping_list.put()
                output_json['status'] = 'OK'
            else:
                output_json['status'] = 'ERR'
                output_json['error'] = 'Items are required'
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = "Name is required"
        self.render_json(json.dumps(output_json))


class CreateCourse(base.RequestHandler):
    def post(self):
        output_json = {}
        if self.user:
            user_name = self.user.user_name
            subject = self.request.get('subjects')
            subject_list = subject.split(',')
            subjects = {}
            for x in range(0, len(subject_list)-1):
                subjects[x] = {
                    'name': subject_list[x],
                    'status': False
                }
            subjects_str = json.dumps(subjects)
            if subject:
                sub = tables.Major.create_major(user_name=user_name,
                                                subjects=subjects_str)
                sub.put()
                output_json['status'] = 'OK'
            else:
                output_json['status'] = 'ERR'
                output_json['error'] = 'Subject is requited'
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = 'You are not loged in!'
        self.render_json(json.dumps(output_json))


class UpdateCourse(base.RequestHandler):
    def post(self):
        is_delete = self.request.get('delete')
        is_edit = self.request.get('edit')
        is_completed = self.request.get('completed')
        if is_delete:
            ids = is_delete.split('|')
            self.deleteSubject(ids)
        elif is_edit:
            ids = is_edit.split('|')
            self.editSubject(ids)
        elif is_completed:
            ids = is_completed.split('|')
            self.completeSubject(ids)
        
    def deleteSubject(self, ids):
        output_json = {}
        major_id = ids[0]
        subject_id = ids[1]
        major = tables.Major.by_id(int(major_id))
        if major:
            subjects = json.loads(major.subjects)
            try:
                del subjects[subject_id]
                major.subjects = json.dumps(subjects)
                major.put()
            except KeyError:
                output_json['status'] = 'ERR'
                output_json['error'] = 'Invalid subject key.'
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = 'Invalid key.'
        self.render_json(json.dumps(output_json))
        
    def completeSubject(self, ids):
        output_json = {}
        major_id = ids[0]
        subject_id = ids[1]
        if major_id and major_id.isdigit():
            major = tables.Major.by_id(int(major_id))
            if major:
                subjects = json.loads(major.subjects)
                subjects.get(subject_id)['status'] = True
                major.subjects = json.dumps(subjects)
                major.put()
            else:
                output_json['status'] = 'ERR'
                output_json['error'] = 'Invalid key!'
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = 'Invalid key!'


class GetJson(base.RequestHandler):
    def get(self):
        output_json = {}
        if self.user:
            user_name = self.user.user_name
            shoppingLists = list(tables.ShoppingList.get_by_user_name(user_name))
            courses = list(tables.Major.get_by_user_name(user_name))
            shopping_lists = []
            for lis in shoppingLists:
                l = {}
                l['user_name'] = self.user.user_name
                l['name'] = lis.name
                l['items'] = json.loads(lis.items).items()
                shopping_lists.append(l)
            output_courses = []
            for course in courses:
                c = {}
                c['id'] = course.key().id()
                c['user_name'] = course.user_name
                c['courses'] = json.loads(course.subjects).items()
                output_courses.append(c)
            output_json['status'] = 'OK'
            results = {'shopping_list': shopping_lists,
                       'courses_list': output_courses
                       }
            output_json['results'] = results
        else:
            output_json['status'] = 'ERR'
            output_json['error'] = ('It seems you are not loged in.' +
                                    ' Please login to get the information')
        self.render_json(json.dumps(output_json))
