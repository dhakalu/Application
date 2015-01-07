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
                subjects[x] = subject_list[x]
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
                c['user_name'] = course.user_name
                c['courses'] = json.loads(course.subjects)
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
