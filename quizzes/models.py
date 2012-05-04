from django.contrib.auth.models import User
from django.db import models

class Choice(models.Model):
    description = models.CharField(max_length=200)
    is_answer = models.BooleanField()
    def __unicode__(self):
        return self.description

class MCQ(models.Model):
    question = models.CharField(max_length=200)
    choices = models.ManyToManyField('Choice')
    def __unicode__(self):
        return self.question

class Quizzes(models.Model):
    quiz_id = models.CharField(max_length=10, unique=True)
    title = models.CharField(max_length=250)
    description = models.CharField(max_length=300)
    is_public = models.BooleanField()
    user = models.ForeignKey(User)
    mc = models.ManyToManyField('MCQ')
