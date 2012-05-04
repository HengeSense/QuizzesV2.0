import os
from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
from django.views.generic.simple import direct_to_template
from quizzes.views import *
from UserInfo.views import *

site_media = os.path.join(
    os.path.dirname(__file__), 'site_media'
)

urlpatterns = patterns('',
    (r'^$', main_page),
    (r'user/(\w+)/$', user_page),
	(r'^pub/$', pub_quiz_page),
    (r'^login/$', login_page),
    (r'^logout/$', logout_page),
    (r'^register/$', register_page),
    (r'^register/success/$', direct_to_template,{ 'template': 'registration/register_success.html' }),
    (r'^site_media/(?P<path>.*)$', 'django.views.static.serve',{ 'document_root': site_media }),
    (r'^mc/$', mc_page),
    (r'^add_quiz/$', add_quiz_page),
    (r'^edit_quiz/$', edit_quiz_page),
    (r'^edit_quest/$', edit_quest_page),
    (r'^delete/$', delete_quiz),
    (r'^del_quest/$', delete_quest),
    (r'^quizzes/$', quiz_page),
    (r'^quizzes_manager/$', quiz_manager),
    (r'^quizzes_list/$', quiz_list),
    (r'^profile/$', profile_page),
    (r'^do_quizzes/$', quiz),
    (r'^result/$', quiz),
    (r'^search/$', search_page),
    (r'^avatar/', include('avatar.urls')),
    url(r'^media/(?P<path>.*)$', 'django.views.static.serve',{'document_root': settings.MEDIA_ROOT,}),
    (r'^setting/', 'django.contrib.auth.views.password_change',{ 'template_name': 'setting.html', 'post_change_redirect': '/' }),
    
)