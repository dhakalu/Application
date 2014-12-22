"""Contains base handler."""
import os
import jinja2
import webapp2
import hmac
import urllib2
from xml.dom import minidom
from google.appengine.ext import db
import user

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader=jinja2.FileSystemLoader(template_dir),
                               autoescape=True)
IP_URL = "http://api.hostip.info/?ip="


def get_user_location(ip):
    url = IP_URL+ip
    content = None
    try:
        content = urllib2.urlopen(url).read()
    except urllib2.URLError:
        return
    if content:
        location = {}
        dom = minidom.parseString(content)
        coords = dom.getElementsByTagName("gml:coordinates")
        address = dom.getElementsByTagName("gml:name")
        if coords and coords[0].childNodes[0].nodeValue:
            latlng = coords[0].childNodes[0].nodeValue.split(',')
            location['latlng'] = db.GeoPt(latlng[1], latlng[0])
        if address and address[0].childNodes[0].nodeValue:
            location['address'] = address[0].childNodes[0].nodeValue
    return location

SECRET = "jkahjkhds3iyui!2ahjhajk*&hgjhg"


def hash_str(s):
    return hmac.new(SECRET, s).hexdigest()


def make_secure_val(s):
    return "%s|%s" % (s, hash_str(s))


def check_secure_val(h):
    val = h.split('|')[0]
    if h == make_secure_val(val):
        return val

SECRET = "51f4mgd2"


class RequestHandler(webapp2.RequestHandler):
    def write(self, *a, **kw):
        self.response.write(*a, **kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.response.write(self.render_str(template, **kw))

    def render_json(self, json_object):
        self.response.headers.add_header('Content-Type', 'application/json')
        self.write(json_object)

    def set_cookie(self, name, val):
        cookie_val = make_secure_val(val)
        self.response.headers.add_header('Set-Cookie',
                                         '%s=%s;Path=/' % (name, cookie_val))

    def read_cookie(self, name):
        cookie_val = self.request.cookies.get(name)
        return cookie_val and check_secure_val(cookie_val)

    def login(self, user):
        self.set_cookie('uid', str(user.key().id()))

    def logout(self, user):
        self.response.headers.add_header('Set-Cookie', 'uid=;path=/')

    def initialize(self, *a, **kw):
        webapp2.RequestHandler.initialize(self, *a, **kw)
        uid = self.read_cookie('uid')
        self.user = uid and user.User.by_id(int(uid))
  
