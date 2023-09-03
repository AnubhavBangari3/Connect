from django.db import models
from django.contrib.auth.models import User
from .utils import get_random_code#For random code
from django.template.defaultfilters import slugify
from datetime import datetime
# Create your models here.

class Profile(models.Model):
    username=models.ForeignKey(User,on_delete=models.CASCADE,related_name="profile_users")
    first_name=models.CharField(max_length=200,null=True,blank=True)
    last_name=models.CharField(max_length=200,null=True,blank=True)
    email=models.EmailField(max_length=200,null=True,blank=True)
    about=models.TextField(max_length=255,default="No description")
    
    cover=models.ImageField(default="cover4.jpg",upload_to="Cover_picture",blank=True,null=True)
    pp=models.ImageField(default="cover2.jpg",upload_to="Profile_picture",blank=True,null=True)
    ##For unique
    slug=models.SlugField(unique=True,blank=True)
    
    connections=models.ManyToManyField(User,related_name="connections",blank=True)
    access_token=models.CharField(max_length=265,blank=True)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now_add=True)
    #For dynamically creating unique slug if users have similar name
    def save(self,*args,**kwargs):
        b=False
        if self.first_name and self.last_name:
            to_slug=slugify(str(self.first_name)+""+str(self.last_name))
            b=Profile.objects.filter(slug=to_slug).exists()
            
            while b:
                to_slug=slugify(to_slug+""+str(get_random_code()))
                b=Profile.objects.filter(slug=to_slug).exists()
        else:
            to_slug=str(self.username)
        self.slug=to_slug
        super().save(*args,**kwargs)
    
    def __str__(self):
        return str(self.username.username)
    

class Post(models.Model):
    owner=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="post_owner")
    image_post=models.ImageField(upload_to="Posts Images",blank=True,null=True)
    text_post=models.TextField(max_length=255,blank=True,null=True)
    likes=models.ManyToManyField(Profile,related_name="likes",blank=True)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering=['-created']
    
    
    def __str__(self):
        return f"{self.owner} Posts number {self.id}"  
class Comment(models.Model):
    current_post=models.ForeignKey(Post,on_delete=models.CASCADE,related_name="post_to_comment")
    owner_posting=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="person_commenting")
    text_post=models.TextField(max_length=255,blank=True,null=True)
    created=models.DateTimeField(auto_now_add=True)
    updated=models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering=['-created']
    def __str__(self):
        return f"{self.owner_posting} commented on {self.current_post}"
    
         
choices=(
    ('send','send'),
    ('accept','accept')
    )   
class FriendRequests(models.Model):
    sender=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="sender")
    receiver=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="receiver")
    status=models.CharField(max_length=30,choices=choices)
    created_at = models.DateTimeField(auto_now_add=True)
    
    
    def __str__(self):
        return f"{self.sender} sent freind request to {self.receiver}"
    
class LifeBook(models.Model):
    plan_photo=models.ImageField(upload_to="LifeBook",blank=True,null=True)
    plan=models.CharField(max_length=250,blank=True)
    
    def __str__(self):
        return f"{self.id}-{self.plan}"
    

class Plan(models.Model):
    current_plan=models.ForeignKey(LifeBook,on_delete=models.CASCADE,related_name="current_LP")
    prof=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="prof_user")
    
    oneMonth=models.BooleanField()
    oneMonthSdt=models.DateField()
    oneMonthEdt=models.DateField()
    
    
    def __str__(self):
        return f"{self.current_plan}"
    
class SixMonthPlan(models.Model):
    current_plan=models.ForeignKey(LifeBook,on_delete=models.CASCADE,related_name="current_LP6")
    prof=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="prof_user6")
    
    sixMonth=models.BooleanField()
    sixMonthSdt=models.DateField()
    sixMonthEdt=models.DateField()
    
    
    def __str__(self):
        return f"{self.current_plan}"
    
class OneYearPlan(models.Model):
    current_plan=models.ForeignKey(LifeBook,on_delete=models.CASCADE,related_name="current_LP1y")
    prof=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="prof_user1y")
    
    oneyear=models.BooleanField()
    oneYearSdt=models.DateField()
    oneYearEdt=models.DateField()
    
    
    def __str__(self):
        return f"{self.current_plan}"

class ThreeYearPlan(models.Model):
    current_plan=models.ForeignKey(LifeBook,on_delete=models.CASCADE,related_name="current_LP3y")
    prof=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="prof_user3y")
    
    threeyear=models.BooleanField()
    threeYearSdt=models.DateField()
    threeYearEdt=models.DateField()
    
    
    def __str__(self):
        return f"{self.current_plan}"
    
class FiveYearPlan(models.Model):
    current_plan=models.ForeignKey(LifeBook,on_delete=models.CASCADE,related_name="current_LP5y")
    prof=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="prof_user5y")
    
    fiveyear=models.BooleanField()
    fiveYearSdt=models.DateField()
    fiveYearEdt=models.DateField()
    
    
    def __str__(self):
        return f"{self.current_plan}"

class TenYearPlan(models.Model):
    current_plan=models.ForeignKey(LifeBook,on_delete=models.CASCADE,related_name="current_LP10y")
    prof=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="prof_user10y")
    
    tenyear=models.BooleanField()
    tenYearSdt=models.DateField()
    tenYearEdt=models.DateField()
    
    
    def __str__(self):
        return f"{self.current_plan}"




#Plan
class Vision1Month(models.Model):
    one_month_plan=models.ForeignKey(Plan,on_delete=models.CASCADE,related_name="onemonthvision")
    name=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="one_name",default=None)
    why_goal=models.TextField()
    goal_photo=models.ImageField(upload_to="vision/1month")
    feeling=models.TextField()
    
    def __str__(self):
        return f"Vision Board for {self.one_month_plan.current_plan}"
#SixMonthPlan
class Vision6Month(models.Model):
    six_month_plan=models.ForeignKey(SixMonthPlan,on_delete=models.CASCADE,related_name="sixmonthvision")
    name=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="six_name",default=None)
    why_goal=models.TextField()
    goal_photo=models.ImageField(upload_to="vision/6month")
    feeling=models.TextField()
    
    def __str__(self):
        return f"Vision Board for {self.six_month_plan.current_plan}"


#OneYearPlan
class Vision1Year(models.Model):
    one_year_plan=models.ForeignKey(OneYearPlan,on_delete=models.CASCADE,related_name="oneyearvision")
    name=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="one_year_name",default=None)
    why_goal=models.TextField()
    goal_photo=models.ImageField(upload_to="vision/1year")
    feeling=models.TextField()
    
    def __str__(self):
        return f"Vision Board for {self.one_year_plan.current_plan}"


#ThreeYearPlan

class Vision3Year(models.Model):
    three_year_plan=models.ForeignKey(ThreeYearPlan,on_delete=models.CASCADE,related_name="threeyearvision")
    name=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="three_year_name",default=None)
    why_goal=models.TextField()
    goal_photo=models.ImageField(upload_to="vision/3year")
    feeling=models.TextField()
    
    def __str__(self):
        return f"Vision Board for {self.three_year_plan.current_plan}"


#FiveYearPlan
class Vision5Year(models.Model):
    five_year_plan=models.ForeignKey(FiveYearPlan,on_delete=models.CASCADE,related_name="fiveyearvision")
    name=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="five_year_name",default=None)
    why_goal=models.TextField()
    goal_photo=models.ImageField(upload_to="vision/5year")
    feeling=models.TextField()
    
    def __str__(self):
        return f"Vision Board for {self.five_year_plan.current_plan}"


#TenYearPlan
class Vision10Year(models.Model):
    ten_year_plan=models.ForeignKey(TenYearPlan,on_delete=models.CASCADE,related_name="tenyearvision")
    name=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="ten_year_name",default=None)
    why_goal=models.TextField()
    goal_photo=models.ImageField(upload_to="vision/10year")
    feeling=models.TextField()
    
    def __str__(self):
        return f"Vision Board for {self.ten_year_plan.current_plan}"

class AreaOfInterest(models.Model):
    add_choice=models.CharField(max_length=250,null=True,blank=True)

    person=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="add_choice_person")
    
    def __str__(self):

        return str(self.add_choice)

class Message(models.Model):
    sender=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="sender_profile")
    receiver=models.ForeignKey(Profile,on_delete=models.CASCADE,related_name="receiver_profile")
    message_text=models.TextField()
    timestamp=models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Sender-{self.sender} - Receiver: {self.receiver}"

class Similarity(models.Model):
    pf1=models.ForeignKey(Profile, related_name='first_profile', on_delete=models.CASCADE)
    pf2= models.ForeignKey(Profile, related_name='second_profile', on_delete=models.CASCADE)
    matching=models.CharField(max_length=256)

    def __str__(self):
        return f"{self.pf1} {self.pf2} - {self.matching}"