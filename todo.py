import base
import tables
import json


class ToDoPage(base.RequestHandler):
    def get(self):
        user_name = self.user.user_name
        if user_name:
            self.render('todo.html')
        else:
            self.redirect('/')


class Update(base.RequestHandler):
    def post(self):
        task = self.request.get('task')
        user_name = self.user.user_name
        error = {}
        data = {}
        has_error = False
        output_json = {}
        if task:
            data['task'] = task
            if user_name:
                data['user_name'] = user_name
                t = tables.ToDo.create_todo(user_name=user_name, task=task)
                t.put()
            else:
                has_error = True
                error['no_user'] = 'You are not loged in.'
        else:
            has_error = True
            error['no_task'] = 'Task cannot be empty.'
        
        if has_error:
            output_json['status'] = 'ERR'
        else:
            output_json['status'] = 'OK'
        output_json['data'] = data
        output_json['error'] = error
        self.render_json(json.dumps(output_json))


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
