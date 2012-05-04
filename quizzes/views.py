import random
import django
from django.contrib.auth import logout, authenticate
from django.contrib.auth.models import User
from django.contrib.auth.views import login
from django.core.exceptions import ObjectDoesNotExist
from django.shortcuts import render_to_response, get_object_or_404
from django.template.context import RequestContext
from django.http import HttpResponseRedirect, HttpResponse, Http404
from django.utils.datastructures import MultiValueDictKeyError
from Quizzes.quizzes.forms import *
from Quizzes.quizzes.models import *
from django.db.models import Q

def main_page(request):
    q = Quizzes.objects.filter(is_public=True)
    return render_to_response('main_page.html', RequestContext(request, {
        'quizzes':q
    }))

def pub_quiz_page(request):
	q = Quizzes.objects.filter(is_public=True)
	return render_to_response('pub.html', RequestContext(request, {
		'quizzes': q,
	}))
	
	
def user_page(request, username):
    user = get_object_or_404(User, username=username)
    quizzes = Quizzes.objects.filter(user=request.user)
    variables = RequestContext(request,{
        'username': username,
        'quizzes': quizzes
    })
    return render_to_response('user_page.html', variables)


def login_page(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/user/%s' % request.user.username)

def logout_page(request):
    logout(request)
    return HttpResponseRedirect('/')

def register_page(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email']
            )
            return HttpResponseRedirect('/register/success/')
    else:
        form = RegistrationForm()
    variables = RequestContext(request, {'form': form})
    return render_to_response('registration/register.html',variables)

def mc_page(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/')
    if request.method == 'POST':
        form = QuestionAddFrom(request.POST)
        if form.is_valid():
            print 'skfjsl'
            mcq = MCQ.objects.create()
            if request.POST['question'] != '':
                mcq.question=request.POST['question']
            tmp = int(request.POST['choices'])

            for i in xrange(4):
                if request.POST['answer_%d' % i]!='':
                    if i!=tmp:
                        mcq.choices.create(description=request.POST['answer_%d' % i], is_answer=False)
                    else:
                        mcq.choices.create(description=request.POST['answer_%d' % i], is_answer=True)

            mcq.save()
            q = get_object_or_404(Quizzes, quiz_id=request.GET.get('id'))
            q.mc.add(mcq)
            q.save()
            return HttpResponseRedirect('/quizzes/?id=%s' % request.GET.get('id'))
    else:
        form = QuestionAddFrom()
    var = RequestContext(request, {
        'form': form,
        'id': request.GET.get('id')
    })
    return render_to_response('add_quest.html', var)

def add_quiz_page(request):
    if not request.user.is_authenticated():
        return HttpResponseRedirect('/')
    if request.method == 'POST':
        form = QuizAddForm(request.POST)
        if form.is_valid():
            flag = True
            value = 5
            while flag:
                try:
                    quiz = Quizzes.objects.create(quiz_id = random_string(value), user = request.user)
                    flag = False
                except :
                    value+=1

            if request.POST['title'] != '':
                quiz.title=request.POST['title']
            else:
                return HttpResponse('Invalid title')

            if request.POST['description'] == '':
                quiz.description='No description'
            else:
                quiz.description=request.POST['description']

            try:
                quiz.is_public=request.POST['is_public']
            except :
                pass

            quiz.save()
			
            return HttpResponseRedirect('/')
    else:
        return render_to_response('add_quiz.html', RequestContext(request, {'form':QuizAddForm}))

def edit_quiz_page(request):
    if request.method=='POST':
        form = QuizEditForm(request.POST)
        if form.is_valid():
            q = Quizzes.objects.get(quiz_id = request.POST['hidden_id'])

            if not q:
                raise Http404('Invalid ID')

            #for q in prompt.prompt.all():
            #    q.delete()
            #prompt.prompt.clear()

            q.title = request.POST['title']
            q.description = request.POST['description']
            try:
                q.is_public = request.POST['is_public']
            except MultiValueDictKeyError:
                q.is_public = False
            q.save()
            return HttpResponseRedirect('/')
    else:
        q = get_object_or_404(Quizzes, quiz_id=request.GET.get('id'))
        if request.user != Quizzes.objects.get(quiz_id=q.quiz_id).user:
            return HttpResponse('You don\'t have permission to edit this form')

        list = dict([])

        try:
            list['title'] = q.title
            list['description'] = q.description
            list['is_public'] = q.is_public
            list['hidden_id'] = q.quiz_id
        except:
            pass

        form = QuizEditForm(list)

    var = RequestContext(request, {
        'form': form,
        })
    return render_to_response('edit_quiz.html', var)

def edit_quest_page(request):
    if request.method=='POST':
        form = QuestionEditFrom(request.POST)
        if form.is_valid():
            print request.POST['hidden_id']
            mcq = MCQ.objects.get(id = request.POST['hidden_id'])

            if not mcq:
                raise Http404('Invalid ID')

            for c in mcq.choices.all():
                c.delete()

            mcq.question = request.POST['question']
            tmp = int(request.POST['choices'])

            for i in xrange(4):
                if i!=tmp:
                    mcq.choices.create(description=request.POST['answer_%d' % i], is_answer=False)
                else:
                    mcq.choices.create(description=request.POST['answer_%d' % i], is_answer=True)

            mcq.save()
            return HttpResponseRedirect('/')
    else:
        mcq = get_object_or_404(MCQ, id=request.GET.get('id'))

        list = dict([])

        try:
            list['question'] = mcq.question
            i = 0
            for c in mcq.choices.all():
                list['answer_%s' % i] = c.description
                if c.is_answer==True:
                    list['choices'] = i
                i+=1
            list['hidden_id'] = request.GET.get('id')
        except:
            pass

        form = QuestionEditFrom(list)

    var = RequestContext(request, {
        'form': form,
        })
    return render_to_response('edit_quest.html', var)

def delete_quiz(request):
    try:
        q = Quizzes.objects.get(quiz_id=request.GET.get('id'))
    except ObjectDoesNotExist:
        raise Http404('Quizzes not found')
    for mcq in q.mc.all():
        for c in mcq.choices.all():
            c.delete()
        mcq.delete()
    q.delete()
    return HttpResponseRedirect('/')

def delete_quest(request):
    try:
        mcq = MCQ.objects.get(id=request.GET.get('id'))
    except ObjectDoesNotExist:
        raise Http404('Question not found')
    for c in mcq.choices.all():
        c.delete()
    mcq.delete()
    return HttpResponseRedirect('/')

def random_string(n):
    """ Create n length random string """
    code = ''.join([random.choice('abcdefghijklmnoprstuvwyxzABCDEFGHIJKLMNOPRSTUVWXYZ0123456789') for i in range(n)])
    return code

def quiz_page(request):
    q = get_object_or_404(Quizzes, quiz_id=request.GET.get('id'))
    var = RequestContext(request,{
        'quizzes': q,
        'mcq': q.mc,
        'id': request.GET.get('id'),
    })
    return render_to_response('show_quiz.html', var)

def quiz(request):
    if request.method == "POST":
        id=request.POST['id']
        q=get_object_or_404(Quizzes, quiz_id=id)
        correct=0
        i=0
        mcqs = q.mc.order_by('id')
        for mcq in mcqs:
            answer=int(request.POST['question%d' % i])
            choice=mcq.choices.order_by('id')
            j=0
            for c in choice:
               if c.is_answer and j==answer:
                   correct+=1
                   break
               else:
                   j+=1
            i+=1
        var = RequestContext(request, {
            'id': id,
            'correct': correct,
            'size':q.mc.count(),
        })
        return render_to_response('result.html', var)
    else:
        q = get_object_or_404(Quizzes, quiz_id=request.GET.get('id'))
        value = [0 for x in xrange(q.mc.count())]
        i=0
        mcqs = q.mc.order_by('id')
        for mcq in mcqs:
            value[i] = mcq.question+'***'
            for c in mcq.choices.all():
                value[i] += c.description + '***'
            value[i] = value[i][:-3]
            i += 1
        var = RequestContext(request, {
            'title': q.title,
            'id': request.GET.get('id'),
            'value': value,
            'size': q.mc.count(),
        })
        return render_to_response('quiz.html', var)

def profile_page(request):
    user = get_object_or_404(User, username=request.GET.get('user'))
    q = Quizzes.objects.filter(user=user, is_public=True)
    var = RequestContext(request, {
        'username': user.username,
        'quizzes': q,
    })
    return render_to_response('profile.html', var)

def quiz_manager(request):
    user = get_object_or_404(User, username=request.GET.get('user'))
    quizzes = Quizzes.objects.filter(user=request.user)
    variables = RequestContext(request,{
        'username': user.username,
        'quizzes': quizzes
    })
    return render_to_response('quizzes_manager.html', variables)

def quiz_list(request):
    q = Quizzes.objects.filter(is_public=True)
    return render_to_response('do_quizzes.html', RequestContext(request, {
        'quizzes':q
    }))

def login_page(request):
    if request.user.is_authenticated():
        return HttpResponseRedirect('/user/%s' % request.user.username)
    else:
        if request.method == 'POST':
            form = LoginForm(request.POST)
            if form.is_valid():
                if not request.POST.get('remember', None):
                    request.session.set_expiry(0)
                username=request.POST['username']
                password=request.POST['password']
                user = authenticate(username=username, password=password)
                if user is not None:
                    if user.is_active:
                        login(request, user)
                        return HttpResponseRedirect('/')
                    else:
                        return HttpResponse('Your account is not active')
                else:
                    return HttpResponse('Invalid login')
        else:
            form = LoginForm()
        var = RequestContext(request, {
            'head_title': 'Login',
            'title':'LOGIN',
            'form':form,
        })
        return render_to_response('registration/login.html', RequestContext(request, var))

"""def search_page(request):
    form = SearchForm()
    quiz = []
    show_results = False
    if 'keyword' in request.GET:
        show_results = True
        keyword = request.GET['keyword'].strip()
        if keyword:
            form = SearchForm({'keyword' : keyword})
            if form.is_valid():
                quiz = Quizzes.objects.filter(
                                                Q(title__icontains= form.cleaned_data['keyword'])|Q (request.GET.username__icontains = form.cleaned_data['keyword'])
                                                )[:10]
    variables = RequestContext(request, {
                                'form': form,
                                'quiz': quiz ,
                                'show_results': show_results,
                                })
    return render_to_response('search.html', variables)"""


def search_page(request):
    if request.method == 'POST':
        form = SearchForm(request.POST)
        if not form.is_valid():
            var = RequestContext(request,{'form': form})
            return render_to_response('search.html',var)
        else:
            quiz = Quizzes.objects.filter(Q(title__icontains = form.cleaned_data['keyword']))
            var = RequestContext(request,{'form': form,
                                          'quiz' : quiz})
            return render_to_response('search.html', var)
    form = SearchForm()
    return render_to_response('search.html', RequestContext(request,{'form': form}))
"""
while flag:
    value = IDRange.objects.get(id=1).r
    try:
        prompt = SetPrompt.objects.create(
            flashcard_id = random_string(value)
        )
        flag = False
    except :
        IDRange.objects.filter(id=1).update(r = value+1)
"""