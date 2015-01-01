import base
import tables
import json


class ToDoPage(base.RequestHandler):
    def get(self):
        if self.user:
            self.render('todo.html', loged_user=self.user)
        else:
            self.redirect('/')


class Update(base.RequestHandler):
    user_name = None
    error = {}
    data = {}
    has_error = False
    output_json = {}

    def post(self):
        has_error = False
        if self.user:
            self.user_name = self.user.user_name
            task = self.request.get('task')
            mark_done = self.request.get('mark_done')
            edit = self.request.get('edit')
            delete = self.request.get('delete')
            if mark_done:
                self.mark_done(mark_done)
            elif edit:
                self.edit(edit)
            elif delete:
                self.delete(delete)
            elif task:
                self.create_todo(task, self.user_name)
            else:
                has_error = True
                self.error['invalid_request'] = 'Request is not valid'
        else:
            has_error = True
            self.error['no_user'] = 'You are not loged in.'
        
        if has_error:
            self.output_json['status'] = 'ERR'
        else:
            self.output_json['status'] = 'OK'
        self.output_json['data'] = self.data
        self.output_json['error'] = self.error
        self.render_json(json.dumps(self.output_json))
    
    def create_todo(self, task, user_name):
        t = tables.ToDo.create_todo(user_name=user_name, task=task)
        t.put()
        self.data['user_name'] = user_name
        self.data['tas'] = task

    def mark_done(self, todo_id):
        todo = tables.ToDo.by_id(int(todo_id))
        if todo:
            todo.status = True
            todo.put()
            self.output_json['status'] = 'OK'
        else:
            self.has_error = True
            self.output_json['status'] = 'ERR'
            self.output_json['error'] = 'No such task'

    def delete(self, todo_id):
        todo = tables.ToDo.by_id(int(todo_id))
        todo.delete()

    def edit(self, todo_id):
        pass


class GetJSON(base.RequestHandler):
    def get(self):
        user_name = self.user.user_name
        output_json = {}
        to_be_done = []
        done = []
        if user_name:
            tasks = tables.ToDo.by_user_name(user_name)
            for task in tasks:
                t = {'user': task.user_name,
                     'id': task.key().id(),
                     'task': task.task,
                     }
                if task.status:
                    t['status'] = task.status
                    done.append(t)
                else:
                    t['status'] = task.status
                    to_be_done.append(t)
            output_json['status'] = 'OK'
        else:
            output_json['status'] = 'ERR'
            output_json['erros'] = ' You are not loged in'
        output_json['done_tasks'] = done
        output_json['todo_tasks'] = to_be_done
        self.render_json(json.dumps(output_json))
