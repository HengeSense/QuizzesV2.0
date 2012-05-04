from django.contrib.auth.decorators import login_required
from django.template.context import RequestContext
from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponseRedirect
from django.contrib.auth import *
from django.contrib.auth.models import check_password, User
from UserInfo.models import Profile
from django.core.mail import send_mail
from UserInfo.forms import *

def register_page(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = User.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email'])
            user.first_name = form.cleaned_data['first_name']
            user.last_name = form.cleaned_data['last_name']
            user.save()
            profile = Profile.objects.create(user = user , phone_number = form.cleaned_data['phone_number'])
            profile.save()
            return HttpResponseRedirect('/register/success/')
    else:
        form = RegistrationForm()
    variables = RequestContext(request, {'form': form})
    return render_to_response('registration/register.html',variables)

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
 
def edit_profile_page(request):
    if request.method == 'POST':
        form = Edit_Profile_Form(request.POST)
        if form.is_valid(): 
            
            user = User.objects.get(username = request.user.username)
            user.first_name = form.cleaned_data['first_name']
            user.last_name = form.cleaned_data['last_name']
            user.save()
            profile = Profile.objects.get(user = request.user)
            profile.phone_number = form.cleaned_data['phone_number']
            profile.save()
            return HttpResponseRedirect('/')
        
    else:
        profile = Profile.objects.get(user = request.user)
        first_name = profile.user.first_name
        last_name = profile.user.last_name
        phone_number = profile.phone_number
        form = Edit_Profile_Form(
                                {'first_name': first_name,
                                'last_name' : last_name,
                                'phone_number' : phone_number})
    variables = RequestContext(request,
                               {'form': form}
                                )
    return render_to_response('edit_profile.html', variables)    
    
