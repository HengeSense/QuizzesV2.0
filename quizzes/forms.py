import re
from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ObjectDoesNotExist
from django.forms.widgets import RadioSelect
from quizzes.models import Choice, Quizzes, MCQ


class QuestionAddFrom(forms.Form):
    question = forms.CharField(label='Question ', required=True)
    answer_0 = forms.CharField(label='Answer 1', required=False)
    answer_1 = forms.CharField(label='Answer 2', required=False)
    answer_2 = forms.CharField(label='Answer 3', required=False)
    answer_3 = forms.CharField(label='Answer 4', required=False)
    choices = forms.ChoiceField(choices=[(0,"A"), (1,"B"), (2,"C"), (4,"D")], widget=RadioSelect, label='', required=True)

    def clean_question(self):
        question = self.cleaned_data['question']
        if question!='':
            return question
        else:
            raise forms.ValidationError('Invalid Question')

        #self.fields['choices'] = forms.ModelMultipleChoiceField(queryset=)
        #self.fields['True_ans'] = forms.TypedChoiceField(label='', coerce=bool, choices=(('True')),widget=forms.RadioSelect)

class LoginForm(forms.Form):
    username = forms.CharField(label='Username', max_length=30)
    password = forms.CharField(label='Password',widget=forms.PasswordInput())
    remember = forms.BooleanField(label='Remember me', required=False)

    def clean_username(self):
        username = self.cleaned_data['username']
        try:
            User.objects.get(username=username)
        except ObjectDoesNotExist:
            raise forms.ValidationError('Username is not exist')
        return username
    def clean_password(self):
        password = self.cleaned_data['password']
        try:
            user = User.objects.get(username = self.cleaned_data['username'])
        except :
            raise forms.ValidationError('Username is not exist')
        if user.check_password(password):
            return password
        else:
            raise forms.ValidationError('Invalid password')

class QuizAddForm(forms.Form):
    title = forms.CharField(label='Title', max_length=250, required=True)
    description = forms.CharField(label='Description', max_length= 500, required=False)
    is_public = forms.BooleanField(label='Public', required=False)
    #quest = QuestionAddFrom

    def clean_title(self):
        title = self.cleaned_data['title']
        if title != '':
            return title
        else:
            raise forms.ValidationError('Invalid Title')

class QuizEditForm(forms.Form):
    title = forms.CharField(label='Title', required=True, widget=forms.TextInput(attrs={'size':28}))
    description = forms.CharField(label='Description', required=False, widget = forms.Textarea(attrs = {'cols': 65, 'rows': 2}))
    is_public = forms.BooleanField(label='Public', required=False)
    hidden_id = forms.CharField(label='', widget=forms.HiddenInput)

    def clean_title(self):
        title = self.cleaned_data['title']
        if title != '':
            return title
        else:
            raise forms.ValidationError('Invalid Title')

class QuestionEditFrom(forms.Form):
    question = forms.CharField(label='Question ', required=True)
    answer_0 = forms.CharField(label='Answer 1', required=False)
    answer_1 = forms.CharField(label='Answer 2', required=False)
    answer_2 = forms.CharField(label='Answer 3', required=False)
    answer_3 = forms.CharField(label='Answer 4', required=False)
    choices = forms.ChoiceField(choices=[(0,"A"), (1,"B"), (2,"C"), (4,"D")], widget=RadioSelect, label='', required=True)
    hidden_id = forms.CharField(label='', widget=forms.HiddenInput)

    def clean_question(self):
        question = self.cleaned_data['question']
        if question!='':
            return question
        else:
            raise forms.ValidationError('Invalid Question')

class SearchForm(forms.Form):
    keyword = forms.CharField(widget = forms.TextInput(attrs = {'placeholder': 'Search'}))

