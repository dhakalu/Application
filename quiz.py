"""Defines handler paths and initializes the app."""
import webapp2
import base
import signup
import resume
import todo


class MainPage(base.RequestHandler):
    def get(self):
        if self.user:
            self.render("faq.html")
        else:
            self.render("mainpage.html")


class FaqPage(base.RequestHandler):
    def get(self):
        self.render("faq.html")


class SettingsPage(base.RequestHandler):
    def get(self):
        self.render("settings.html")
       
app = webapp2.WSGIApplication([
    ('/', MainPage),
    ('/faqs', FaqPage),
    ('/todo', todo.ToDoPage),
    ('/todo_json', todo.GetJSON),
    ('/updatetodo', todo.Update),
    ('/settings', SettingsPage),
    ('/signup', signup.SignUp),
    ('/login', signup.Login),
    ('/logout', signup.Logout),
    ('/welcome', signup.ConfirmUserSignup),
    ('/resume', resume.Resume),
    ('/resume_json', resume.GetJSON),
    ('/updateresume', resume.UpdateEducation),
    ('/updatework', resume.UpdateWork),
    ('/updateaward', resume.UpdateAward),
    ('/updatepublication', resume.UpdatePublication),
    ('/updateselfsummary', resume.UpdateSelfSummary)
    ], debug=True)
