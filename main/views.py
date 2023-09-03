from django.shortcuts import render
from django.contrib.auth import authenticate,login

from django.contrib.auth.models import User
from .models import Profile,Post,FriendRequests,Comment,LifeBook,Plan,SixMonthPlan,OneYearPlan,ThreeYearPlan,FiveYearPlan,TenYearPlan,Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year,AreaOfInterest,Message,Similarity

from .serializers import RealizerSerializer,ProfileSerializer,LoginSerializer,CoverSerializers,PostSerializer,FriendRequestSerializer,CommentSerializer,LifeBookSerializer,PlanSerializer,SixMonthPlanSerializer,OneYearPlanSerializer,ThreeYearPlanSerializer,FiveYearPlanSerializer,TenYearPlanSerializer,Vision1MonthSerializer,Vision6MonthSerializer,Vision1YearSerializer,Vision3YearSerializer,Vision5YearSerializer,Vision10YearSerializer,AreaOfInterestSerializer,AllfriendsSerializer,MessageSerializer,SimilaritySerializer

from django.shortcuts import get_object_or_404
from django.db.models import Q


from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated

from rest_framework.generics import UpdateAPIView
from rest_framework.viewsets import ModelViewSet

from rest_framework.decorators import action,api_view

from datetime import date

import requests
#code for pdf starts
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
#code for pdf ends

# Create your views here.

class RegisterView(viewsets.ModelViewSet):
    queryset=User.objects.all()
    serializer_class=RealizerSerializer
    

#Not using this view
class LoginUser(APIView):
      
      def post(self,request,format=None):
            serializer =LoginSerializer(data=self.request.data)
            serializer.is_valid(raise_exception=True)
            user = serializer.validated_data['user']
            password = serializer.validated_data['password']
            user=authenticate(username=user,password=password)
            print("is authenticated")
            login(request, user)
            d={}
            
            if user:#Create a field in profile for token. And add auto update logic from backend.
                  t=RefreshToken.for_user(user)
                  #CHeck its working
                  p=Profile.objects.get(username=user.id)
                  print("Profile:",p)
                  p.access_token=str(t.access_token),
                  p.save()
                 
                
                 
                  
                  if p.access_token is not None:
                        print("Access token")
                  else:
                        print("No access token yet")
                        
                  
                  d={"user":user.username,
                  'refresh': str(t),
                  'access': str(t.access_token),
                  }
                  print(d)
                  return Response(d, status=status.HTTP_202_ACCEPTED)
            
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
  
      def get(self,request):
            #u=User.objects.all()
            #print(u)
            user = User.objects.get(username=self.request.user)
            serializer=LoginSerializer(user,many=False)
            t=RefreshToken.for_user(user)
            
            d={"user":user.username,
                  'refresh': str(t),
                  'access': str(t.access_token),
                  }
            print(d)
            return Response(d, status=status.HTTP_202_ACCEPTED)

class ProfileView(APIView):
      permission_classes=[IsAuthenticated]
      serializer_class=ProfileSerializer
      def get(self,request):
          print("checking:",request.user)
          profile=Profile.objects.get(username_id=request.user.id)
          serializer=ProfileSerializer(profile,many=False)
          return Response(serializer.data)

#Id profile
class GetSingleProfile(APIView):
      permission_classes=[IsAuthenticated]
      serializer_class=ProfileSerializer
      
      def get(self,request,id):
            profile=Profile.objects.get(id=id)
            print(profile)
            serializer=ProfileSerializer(profile,many=False)
            return Response(serializer.data)
            
    
class ProfileLoginAuthView(APIView):
      
      serializer_class=ProfileSerializer
      def get(self,request):
          
          profile=Profile.objects.all()
          serializer=ProfileSerializer(profile,many=True)
          return Response(serializer.data)
    
class AllProfileView(APIView):
      permission_classes=[IsAuthenticated]
      serializer_class=ProfileSerializer
      def get(self,request):
          
          profile=Profile.objects.exclude(connections=request.user.id).exclude(username_id=request.user.id)
          serializer=ProfileSerializer(profile,many=True)
          return Response(serializer.data)
    
class UpdateProfile(viewsets.ModelViewSet):
      permission_classes=[IsAuthenticated]
      serializer_class=ProfileSerializer
      queryset=Profile.objects.all()
      
      def update(self,request,*args,**kwargs):
            instance=self.get_object()
            profile=Profile.objects.get(username_id=request.user.id)
            print("Inside Update profile",self.request.user,profile)
            serializer=self.get_serializer(instance=instance,data=request.data)
            serializer.is_valid(raise_exception=True)
            serializer.save(username_user=profile)
            return Response(serializer.data)
            
#
class ImageUpdate(UpdateAPIView):
      permission_classes=[IsAuthenticated]
      queryset=Profile.objects.all()
      serializer_class=CoverSerializers
      lookup_field='id'
      
class PostView(APIView):
      permission_classes=[IsAuthenticated]
      def post(self,request,format=None):
            profile=Profile.objects.get(username_id=request.user.id)
            serializer=PostSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                  serializer.save(owner=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)

class CommentView(APIView):
      permission_classes=[IsAuthenticated]
      def post(self,request,id):
            post=Post.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user.id)
            serializer=CommentSerializer(data=request.data)
            if serializer.is_valid(raise_exception=True):
                  serializer.save(current_post=post,owner_posting=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
            
      
class GetCommentView(APIView):
      def get(self,request,id):
            
            queryset=Comment.objects.filter(current_post=id)
            print(queryset)
            serializer=CommentSerializer(queryset,many=True)
            return Response(serializer.data)
      
class GetLifeBookView(APIView):
      def get(self,request,format=None):
            
            queryset=LifeBook.objects.all()
            print(queryset)
            serializer=LifeBookSerializer(queryset,many=True)
            return Response(serializer.data)

#Create One Month Plan
class PlanView(APIView):
      def post(self,request,id):
            lb=LifeBook.objects.get(id=id)
            print("LB:",lb)
            profile=Profile.objects.get(username_id=request.user)
            print("LB Prof:",profile)
            try:
                  lifebook=Plan.objects.get(current_plan=lb,prof=profile,oneMonth=True)
                  print("Plan is active")
            except Plan.DoesNotExist:
                  oneMonthSdt = request.data.get('oneMonthSdt')
                  oneMonthEdt = request.data.get('oneMonthEdt')
                  lifebook=Plan.objects.create(current_plan=lb,prof=profile,oneMonth=True,
                                               oneMonthSdt=oneMonthSdt,oneMonthEdt=oneMonthEdt,)
            serializer=PlanSerializer(lifebook)
            print(serializer)
            return Response(serializer.data)
#Get One month         
class ActiveOneMonthPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=Plan.objects.get(current_plan=lb,prof=profile,oneMonth=True)
                  
                  print("One month end date:",active_plan.oneMonthEdt)
                  print("Todays date:",date.today())
                  if active_plan.oneMonthEdt <= date.today():
                        active_plan.oneMonth=False
                        active_plan.save()
                  
                  serializer=PlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except Plan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)
class NotActiveOneMonthPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=Plan.objects.get(current_plan=lb,prof=profile,oneMonth=False)
                  
                  print("One month end date:",active_plan.oneMonthEdt)
                  print("Todays date:",date.today())
                  
                  
                  serializer=PlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except Plan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)

#Create 1 month Vision Board

class OneMonthVision(APIView):
      def post(self,request,id):
            plan=Plan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            serializer=Vision1MonthSerializer(data=request.data)
            
            existing_posts=plan.onemonthvision.filter(name=profile).count()
            print("Total posts in 1 month plan:",existing_posts)
            
            if existing_posts >= 10:
                  Response(
                {"detail": "You can only create up to 10 posts for this plan and profile."},
                status=status.HTTP_400_BAD_REQUEST
            )
                  
            
            if serializer.is_valid(raise_exception=True):
                  serializer.save(one_month_plan=plan,name=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  return Response(status=status.HTTP_404_NOT_FOUND)
                  
class GetOneMonthVision(APIView):  
      def get(self,request,id):
            
            plan=Plan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            
            vision=Vision1Month.objects.filter(Q(one_month_plan=plan) & Q(name=profile))
            print(vision)
            serializer=Vision1MonthSerializer(vision,many=True)
            return Response(serializer.data)
      
#Generate pdf for one month plan           
class GenerateOneMonthVisionPDF(APIView):
    def get(self, request, id):
        # Get the Plan and Profile objects
        plan = Plan.objects.get(id=id)
        profile = Profile.objects.get(username_id=request.user)

        # Fetch the OneMonthVision data for the given plan and profile
        visions = Vision1Month.objects.filter(one_month_plan=plan, name=profile)

        # Serialize the data
        serializer = Vision1MonthSerializer(visions, many=True)

        # Generate PDF content
        response = Response(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="one_month_vision.pdf"'

        # Create a PDF canvas and write the data to it
        p = canvas.Canvas(response, pagesize=letter)
        y = 800
        for vision in serializer.data:
            p.drawString(100, y, f"Goal: {vision['why_goal']}")
            y -= 20
            p.drawString(100, y, f"Outcome: {vision['feeling']}")
            y -= 30

        p.showPage()
        p.save()

        return response
                    
            
#SixMonthPlan,SixMonthPlanSerializer
class ActiveSixMonthPlan(APIView):
      def post(self,request,id):
            lb=LifeBook.objects.get(id=id)
            print("LB:",lb)
            profile=Profile.objects.get(username_id=request.user)
            print("LB Prof:",profile)
            try:
                  lifebook=SixMonthPlan.objects.get(current_plan=lb,prof=profile,sixMonth=True)
                  print("Six motnh Plan is active")
            except SixMonthPlan.DoesNotExist:
                  sixMonthSdt = request.data.get('sixMonthSdt')
                  sixMonthEdt = request.data.get('sixMonthEdt')
                  lifebook=SixMonthPlan.objects.create(current_plan=lb,prof=profile,sixMonth=True,
                                               sixMonthSdt=sixMonthSdt,sixMonthEdt=sixMonthEdt,)
            serializer=SixMonthPlanSerializer(lifebook)
            print(serializer)
            return Response(serializer.data)

class GetActiveSixMonthPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=SixMonthPlan.objects.get(current_plan=lb,prof=profile,sixMonth=True)
                  if active_plan.sixMonthEdt <= date.today():
                        active_plan.sixMonth=False
                        active_plan.save()
                  
                  serializer=SixMonthPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except SixMonthPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)

class GetNotActiveSixMonthPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=SixMonthPlan.objects.get(current_plan=lb,prof=profile,sixMonth=True)
                  
                  
                  serializer=SixMonthPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except SixMonthPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)  
                      
            

#6 month vison board
class SixMonthVision(APIView):
      def post(self,request,id):
            plan=SixMonthPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            serializer=Vision6MonthSerializer(data=request.data)
            existing_posts=plan.sixmonthvision.filter(name=profile).count()
            print("Total posts in 6 month plan:",existing_posts)
            
            if existing_posts >= 10:
                  Response(
                {"detail": "You can only create up to 10 posts for this plan and profile."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
            if serializer.is_valid(raise_exception=True):
                  serializer.save(six_month_plan=plan,name=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  return Response(status=status.HTTP_404_NOT_FOUND)
                  
class GetSixMonthVision(APIView):  
      def get(self,request,id):
            
            plan=SixMonthPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            vision=Vision6Month.objects.filter(Q(six_month_plan=plan) & Q(name=profile))
            print(vision)
            serializer=Vision6MonthSerializer(vision,many=True)
            return Response(serializer.data)
      
#Generate pdf for six month plan           
class GenerateSixMonthVisionPDF(APIView):
    def get(self, request, id):
        # Get the Plan and Profile objects
        plan = SixMonthPlan.objects.get(id=id)
        profile = Profile.objects.get(username_id=request.user)

       
        visions = Vision6Month.objects.filter(six_month_plan=plan, name=profile)

        # Serialize the data
        serializer = Vision6MonthSerializer(visions, many=True)

        # Generate PDF content
        response = Response(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="six_month_vision.pdf"'

        # Create a PDF canvas and write the data to it
        p = canvas.Canvas(response, pagesize=letter)
        y = 800
        for vision in serializer.data:
            p.drawString(100, y, f"Goal: {vision['why_goal']}")
            y -= 20
            p.drawString(100, y, f"Outcome: {vision['feeling']}")
            y -= 30

        p.showPage()
        p.save()

        return response


class ActiveOneYearPlan(APIView):
      def post(self,request,id):
            lb=LifeBook.objects.get(id=id)
            print("LB:",lb)
            profile=Profile.objects.get(username_id=request.user)
            print("LB Prof:",profile)
            try:
                  lifebook=OneYearPlan.objects.get(current_plan=lb,prof=profile,oneyear=True)
                  print("Plan is active")
            except OneYearPlan.DoesNotExist:
                  oneYearSdt = request.data.get('oneYearSdt')
                  oneYearEdt = request.data.get('oneYearEdt')
                  lifebook=OneYearPlan.objects.create(current_plan=lb,prof=profile,oneyear=True,
                                               oneYearSdt=oneYearSdt,oneYearEdt=oneYearEdt,)
            serializer=OneYearPlanSerializer(lifebook)
            print(serializer)
            return Response(serializer.data)

class GetActiveOneYearPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=OneYearPlan.objects.get(current_plan=lb,prof=profile,oneyear=True)
                  if active_plan.oneYearEdt <= date.today():
                        active_plan.oneyear=False
                        active_plan.save()
                  
                  serializer=OneYearPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except OneYearPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)

class GetNotActiveOneYearPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=OneYearPlan.objects.get(current_plan=lb,prof=profile,oneyear=True)

                  serializer=OneYearPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except OneYearPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)

#1 Year vison board
class OneYearVision(APIView):
      def post(self,request,id):
            plan=OneYearPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            serializer=Vision1YearSerializer(data=request.data)
            
            existing_posts=plan.oneyearvision.filter(name=profile).count()
            print("Total posts in 1 year plan:",existing_posts)
            
            if existing_posts >= 10:
                  Response(
                {"detail": "You can only create up to 10 posts for this plan and profile."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
            if serializer.is_valid(raise_exception=True):
                  serializer.save(one_year_plan=plan,name=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  return Response(status=status.HTTP_404_NOT_FOUND)
                  
class GetOneYearVision(APIView):  
      def get(self,request,id):
            
            plan=OneYearPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            vision=Vision1Year.objects.filter(Q(one_year_plan=plan) & Q(name=profile))
            print(vision)
            serializer=Vision1YearSerializer(vision,many=True)
            return Response(serializer.data)

#Generate pdf for 1 year plan           
class GenerateOneYearVisionPDF(APIView):
    def get(self, request, id):
        # Get the Plan and Profile objects
        plan = OneYearPlan.objects.get(id=id)
        profile = Profile.objects.get(username_id=request.user)

        
        visions = Vision1Year.objects.filter(one_year_plan=plan, name=profile)

        # Serialize the data
        serializer = Vision1YearSerializer(visions, many=True)

        # Generate PDF content
        response = Response(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="one_year_vision.pdf"'

        # Create a PDF canvas and write the data to it
        p = canvas.Canvas(response, pagesize=letter)
        y = 800
        for vision in serializer.data:
            p.drawString(100, y, f"Goal: {vision['why_goal']}")
            y -= 20
            p.drawString(100, y, f"Outcome: {vision['feeling']}")
            y -= 30

        p.showPage()
        p.save()

        return response



class ActiveThreeYearPlan(APIView):
      def post(self,request,id):
            lb=LifeBook.objects.get(id=id)
            print("LB:",lb)
            profile=Profile.objects.get(username_id=request.user)
            print("LB Prof:",profile)
            try:
                  lifebook=ThreeYearPlan.objects.get(current_plan=lb,prof=profile,threeyear=True)
                  print("3 year Plan is active")
            except ThreeYearPlan.DoesNotExist:
                  threeYearSdt = request.data.get('threeYearSdt')
                  threeYearEdt = request.data.get('threeYearEdt')
                  lifebook=ThreeYearPlan.objects.create(current_plan=lb,prof=profile,threeyear=True,
                                               threeYearSdt=threeYearSdt,threeYearEdt=threeYearEdt,)
            serializer=ThreeYearPlanSerializer(lifebook)
            print(serializer)
            return Response(serializer.data)
      
class GetActiveThreeYearPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=ThreeYearPlan.objects.get(current_plan=lb,prof=profile,threeyear=True)
                  if active_plan.threeYearEdt <= date.today():
                        active_plan.threeyear=False
                        active_plan.save()
                  
                  serializer=ThreeYearPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except ThreeYearPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)
            
 
#3 Year vison board
class ThreeYearVision(APIView):
      def post(self,request,id):
            plan=ThreeYearPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            serializer=Vision3YearSerializer(data=request.data)
            
            existing_posts=plan.threeyearvision.filter(name=profile).count()
            print("Total posts in 3 year plan:",existing_posts)
            
            if existing_posts >= 10:
                  Response(
                {"detail": "You can only create up to 10 posts for this plan and profile."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
            if serializer.is_valid(raise_exception=True):
                  serializer.save(three_year_plan=plan,name=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  return Response(status=status.HTTP_404_NOT_FOUND)
                  
class GetThreeYearVision(APIView):  
      def get(self,request,id):
            
            plan=ThreeYearPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            vision=Vision3Year.objects.filter(Q(three_year_plan=plan) & Q(name=profile))
            print(vision)
            serializer=Vision3YearSerializer(vision,many=True)
            return Response(serializer.data)

#Generate pdf for 3 year plan           
class GenerateThreeYearVisionPDF(APIView):
    def get(self, request, id):
        # Get the Plan and Profile objects
        plan = ThreeYearPlan.objects.get(id=id)
        profile = Profile.objects.get(username_id=request.user)

        
        visions = Vision3Year.objects.filter(three_year_plan=plan, name=profile)

        # Serialize the data
        serializer = Vision3YearSerializer(visions, many=True)

        # Generate PDF content
        response = Response(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="three_year_vision.pdf"'

        # Create a PDF canvas and write the data to it
        p = canvas.Canvas(response, pagesize=letter)
        y = 800
        for vision in serializer.data:
            p.drawString(100, y, f"Goal: {vision['why_goal']}")
            y -= 20
            p.drawString(100, y, f"Outcome: {vision['feeling']}")
            y -= 30

        p.showPage()
        p.save()

        return response


class ActiveFiveYearPlan(APIView):
      def post(self,request,id):
            lb=LifeBook.objects.get(id=id)
            print("LB:",lb)
            profile=Profile.objects.get(username_id=request.user)
            print("LB Prof:",profile)
            try:
                  lifebook=FiveYearPlan.objects.get(current_plan=lb,prof=profile,fiveyear=True)
                  print("5 year Plan is active")
            except FiveYearPlan.DoesNotExist:
                  fiveYearSdt = request.data.get('fiveYearSdt')
                  fiveYearEdt = request.data.get('fiveYearEdt')
                  lifebook=FiveYearPlan.objects.create(current_plan=lb,prof=profile,fiveyear=True,
                                               fiveYearSdt=fiveYearSdt,fiveYearEdt=fiveYearEdt,)
            serializer=FiveYearPlanSerializer(lifebook)
            print(serializer)
            return Response(serializer.data)
      
class GetActiveFiveYearPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=FiveYearPlan.objects.get(current_plan=lb,prof=profile,fiveyear=True)
                  if active_plan.fiveYearEdt <= date.today():
                        active_plan.fiveyear=False
                        active_plan.save()
                  
                  serializer=FiveYearPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except FiveYearPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)


#5 Year vison board
class FiveYearVision(APIView):
      def post(self,request,id):
            plan=FiveYearPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            serializer=Vision5YearSerializer(data=request.data)
            
            existing_posts=plan.fiveyearvision.filter(name=profile).count()
            print("Total posts in 5 year plan:",existing_posts)
            
            if existing_posts >= 10:
                  Response(
                {"detail": "You can only create up to 10 posts for this plan and profile."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
            if serializer.is_valid(raise_exception=True):
                  serializer.save(five_year_plan=plan,name=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  return Response(status=status.HTTP_404_NOT_FOUND)
                  
class GetFiveYearVision(APIView):  
      def get(self,request,id):
            
            plan=FiveYearPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            vision=Vision5Year.objects.filter(Q(five_year_plan=plan) & Q(name=profile))
            print(vision)
            serializer=Vision5YearSerializer(vision,many=True)
            
            return Response(serializer.data)

#Generate pdf for 5 year plan           
class GenerateFiveYearVisionPDF(APIView):
    def get(self, request, id):
        # Get the Plan and Profile objects
        plan = FiveYearPlan.objects.get(id=id)
        profile = Profile.objects.get(username_id=request.user)

        
        visions = Vision5Year.objects.filter(five_year_plan=plan, name=profile)

        # Serialize the data
        serializer = Vision5YearSerializer(visions, many=True)

        # Generate PDF content
        response = Response(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="five_year_vision.pdf"'

        # Create a PDF canvas and write the data to it
        p = canvas.Canvas(response, pagesize=letter)
        y = 800
        for vision in serializer.data:
            p.drawString(100, y, f"Goal: {vision['why_goal']}")
            y -= 20
            p.drawString(100, y, f"Outcome: {vision['feeling']}")
            y -= 30

        p.showPage()
        p.save()

        return response


class ActiveTenYearPlan(APIView):
      def post(self,request,id):
            lb=LifeBook.objects.get(id=id)
            print("LB:",lb)
            profile=Profile.objects.get(username_id=request.user)
            print("LB Prof:",profile)
            try:
                  lifebook=TenYearPlan.objects.get(current_plan=lb,prof=profile,tenyear=True)
                  print("10 year Plan is active")
            except TenYearPlan.DoesNotExist:
                  tenYearSdt = request.data.get('tenYearSdt')
                  tenYearEdt = request.data.get('tenYearEdt')
                  lifebook=TenYearPlan.objects.create(current_plan=lb,prof=profile,tenyear=True,
                                               tenYearSdt=tenYearSdt,tenYearEdt=tenYearEdt,)
            serializer=TenYearPlanSerializer(lifebook)
            print(serializer)
            return Response(serializer.data)
      
class GetActiveTenYearPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=TenYearPlan.objects.get(current_plan=lb,prof=profile,tenyear=True)
                  if active_plan.tenYearEdt <= date.today():
                        active_plan.tenyear=False
                        active_plan.save()
                  
                  serializer=TenYearPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except TenYearPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)
            

#10 Year vison board
class TenYearVision(APIView):
      def post(self,request,id):
            plan=TenYearPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            serializer=Vision10YearSerializer(data=request.data)
            
            existing_posts=plan.tenyearvision.filter(name=profile).count()
            print("Total posts in 10 year plan:",existing_posts)
            
            if existing_posts >= 10:
                  Response(
                {"detail": "You can only create up to 10 posts for this plan and profile."},
                status=status.HTTP_400_BAD_REQUEST
            )
            
            if serializer.is_valid(raise_exception=True):
                  serializer.save(ten_year_plan=plan,name=profile)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            else:
                  return Response(status=status.HTTP_404_NOT_FOUND)
                  
class GetTenYearVision(APIView):  
      def get(self,request,id):
            
            plan=TenYearPlan.objects.get(id=id)
            profile=Profile.objects.get(username_id=request.user)
            vision=Vision10Year.objects.filter(Q(ten_year_plan=plan) & Q(name=profile))
            print(vision)
            serializer=Vision10YearSerializer(vision,many=True)
            
            return Response(serializer.data)

class GetNotActiveThreeYearPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=ThreeYearPlan.objects.get(current_plan=lb,prof=profile,threeyear=True)

                  serializer=ThreeYearPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except ThreeYearPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)
                  
                  
                  
class GetNotActiveFiveYearPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=FiveYearPlan.objects.get(current_plan=lb,prof=profile,fiveyear=True)

                  serializer=FiveYearPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except FiveYearPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)
                  
                  
class GetNotActiveTenYearPlan(APIView):
      def get(self,request,id):
            profile=Profile.objects.get(username_id=request.user)
            lb=LifeBook.objects.get(id=id)
            try:
                  active_plan=TenYearPlan.objects.get(current_plan=lb,prof=profile,tenyear=True)

                  serializer=TenYearPlanSerializer(active_plan)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except TenYearPlan.DoesNotExist:
                  return Response(status=status.HTTP_404_NOT_FOUND)     

#Generate pdf for 10 year plan           
class GenerateTenYearVisionPDF(APIView):
    def get(self, request, id):
        # Get the Plan and Profile objects
        plan = TenYearPlan.objects.get(id=id)
        profile = Profile.objects.get(username_id=request.user)

        
        visions = Vision10Year.objects.filter(ten_year_plan=plan, name=profile)

        # Serialize the data
        serializer = Vision10YearSerializer(visions, many=True)

        # Generate PDF content
        response = Response(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="ten_year_vision.pdf"'

        # Create a PDF canvas and write the data to it
        p = canvas.Canvas(response, pagesize=letter)
        y = 800
        for vision in serializer.data:
            p.drawString(100, y, f"Goal: {vision['why_goal']}")
            y -= 20
            p.drawString(100, y, f"Outcome: {vision['feeling']}")
            y -= 30

        p.showPage()
        p.save()

        return response

class SendFRView(APIView):
      permission_classes=[IsAuthenticated]
      serializer_class=FriendRequestSerializer
      def post(self,request,id):
            profile=Profile.objects.get(username_id=request.user.id)
            a=Profile.objects.all().exclude(username_id=request.user.id)
            
            for i in a:
                  print(i.username,i.id)
      
            try:
                  receiver_profile =get_object_or_404(Profile,id=id)
                  print("It exists")
            except Profile.DoesNotExist:
                  
                  return Response({'detail': 'Receiver profile does not exist.'}, status=status.HTTP_404_NOT_FOUND)
            
            print("Profile sending request:",profile,profile.id)
            print("Profile receiving:",receiver_profile,receiver_profile.id)
            # Check if the profiles are already connected
            if profile.connections.filter(id=receiver_profile.id).exists() or FriendRequests.objects.filter(sender=profile,receiver=receiver_profile)or \
                FriendRequests.objects.filter(sender=receiver_profile, receiver=profile):
                  return Response({'detail': 'Profiles are already friends or freind request has been sent.'}, status=status.HTTP_400_BAD_REQUEST)
            
            friend_request = FriendRequests.objects.create(sender=profile, receiver=receiver_profile,status="send")
            serializer = FriendRequestSerializer(friend_request)
            
            
            return Response(serializer.data)

#To get profile posts + friends of profile posts         
class GetPostView(APIView):
      permission_classes = [IsAuthenticated]
      serializer_class = PostSerializer
      def get(self,request,format=None):
            #queryset=Post.objects.all()
            profile=Profile.objects.get(username__id=request.user.id)
            a=[]
            for i in profile.connections.all():
                  profile=Profile.objects.get(username=i)
                  a.append(profile)
            print(a)
            queryset =Post.objects.filter(owner__in=a+[Profile.objects.get(username=request.user)])
            
            serializer=PostSerializer(queryset,many=True)
            return Response(serializer.data)
      
class getAllPost(APIView):
      permission_classes = [IsAuthenticated]
      serializer_class = PostSerializer
      
      def get(self,request,format=None):
            queryset=Post.objects.all()
            print(queryset)
            serializer=PostSerializer(queryset,many=True)
            return Response(serializer.data)
      
            
      
      
class GetSinglePostView(APIView):
      def get(self,request,id):
            queryset=Post.objects.get(id=id)
            print(queryset)
            serializer=PostSerializer(queryset,many=False)
            return Response(serializer.data)
      
class DeletePost(ModelViewSet):
      serializer_class=PostSerializer
      queryset=Post.objects.all()
      
      def destroy(self,request,*args,**kwargs):
            instance=self.get_object()
            
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
      


class FriendRequestView(viewsets.ModelViewSet):
      queryset=FriendRequests.objects.all()
      serializer_class=FriendRequestSerializer
      
      @action(detail=True, methods=['post'])
      def accept(self,request, pk=None):
            friend_request = self.get_object()
            friend_request.status="accept"
            friend_request.save()
            return Response({'status': 'Friend request accepted'})
      
      @action(detail=True, methods=['post'])
      def reject(self, request, pk=None):
            friend_request = self.get_object()
            friend_request.delete()
            return Response({'status': 'Friend request rejected'})
      
      
      #show all freind request received
      def list(self, request, *args, **kwargs):
            profile=Profile.objects.get(username_id=request.user.id)
            queryset = self.filter_queryset(self.get_queryset().filter(Q(receiver=profile) & Q(status="send")))
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)


#For friends list       
class AllConnections(viewsets.ModelViewSet):
      queryset=FriendRequests.objects.all()
      serializer_class=FriendRequestSerializer
      def list(self, request, *args, **kwargs):
            
            profile=Profile.objects.get(username_id=request.user.id)
            queryset = self.filter_queryset(self.get_queryset().filter(Q(receiver=profile) & Q(status="accept")|Q(sender=profile) & Q(status="accept")))
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data)
      
      @action(detail=True, methods=['post'])
      def reject(self, request, pk):
            friend_request =FriendRequests.objects.get(id=pk)
            friend_request.delete()
            return Response({'status': 'Friend removed'})



class likeview(APIView):
      permission_classes=[IsAuthenticated]
      def post(self,request,id):
            try:
                  post=Post.objects.get(id=id)
                  print(post)
            except Post.DoesNotExist:
                  return Response({"message":"Post does not exists"},status=404)
            try:
                  profile=Profile.objects.get(username_id=request.user.id)
                  print(profile)
            except Profile.DoesNotExist:
                  return Response({"message": "Profile does not exist"}, status=404)
            # Check if the user has already liked the post
            if post.likes.filter(id=profile.id).exists():
                  return Response({"message": "Post already liked by the user"}, status=400)
            
            post.likes.add(profile)
            
            return Response({"message":"Post Liked"},status=200)


#Post area of interest           
class AreaOfInterestView(APIView):
      def post(self,request):
            
            serializer=AreaOfInterestSerializer(data=request.data)
            if serializer.is_valid():
                  add_choice=serializer.validated_data.get('add_choice')
                  
                  person=Profile.objects.get(username_id=request.user)
                  a=AreaOfInterest.objects.filter(person=person,add_choice=add_choice).exists()
                  if len(AreaOfInterest.objects.filter(person=person)) >= 10:
                        return Response({'message': '10 Choice already Present.'}, status=status.HTTP_400_BAD_REQUEST)
                  if a:
                        return Response({'message': 'Choice already Present.'}, status=status.HTTP_400_BAD_REQUEST)
                  if add_choice:
                        AreaOfInterest.objects.create(add_choice=add_choice,person=person)
                        return Response({'message': 'Custom choice added successfully.'}, status=status.HTTP_201_CREATED)
                  else:
                        return Response({'message': 'No choice provided.'}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


#Get all area of interest
class GetAreaOfInterestView(APIView):
      def get(self,request):
            try:
                  person=Profile.objects.get(username_id=request.user)
                  areaOfinterest=AreaOfInterest.objects.filter(person=person)
                  print("Total interests: ",len(AreaOfInterest.objects.filter(person=person)))
                  serializer=AreaOfInterestSerializer(areaOfinterest,many=True)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except Exception as e:
                  return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                  
#By id            
class GetProfileAreaOfInterestView(APIView):
      def get(self,request,id):
            try:
                  person=Profile.objects.get(id=id)
                  areaOfinterest=AreaOfInterest.objects.filter(person=person)
                  print("Total interests: ",len(AreaOfInterest.objects.filter(person=person)))
                  serializer=AreaOfInterestSerializer(areaOfinterest,many=True)
                  return Response(serializer.data,status=status.HTTP_200_OK)
            except Exception as e:
                  return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
class DeleteAreaOfInterest(APIView):
      def delete(self,request,id):
            try:
                  areaOfinterest = AreaOfInterest.objects.get(id=id)
                  areaOfinterest.delete()
                  return Response({'status': 'Area of interest removed'})
            except AreaOfInterest.DoesNotExist:
                  return Response({'message': 'Area of interest not found'}, status=status.HTTP_404_NOT_FOUND)
            except Exception as e:
                  return Response({'message': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
         
#get all friends of the user
class AllfriendsVIew(APIView):
      permission_classes=[IsAuthenticated]
      def get(self,request):
            loggedin=Profile.objects.get(username_id=request.user)
            allfriends=loggedin.connections.all()
            
            print("All friends:",allfriends)
            friend_profiles=[]
            for i in allfriends:
                  friend=Profile.objects.get(username=i)
                  friend_profiles.append(friend)
            print(friend_profiles)
            serializer = AllfriendsSerializer(friend_profiles, many=True)
            return Response(serializer.data)

#Message
class MessagePostView(APIView):
      def post(self,request,id):
            
            
            sender=Profile.objects.get(username_id=request.user)
            receiver=Profile.objects.get(id=id)
            message_text=request.data.get('message_text')
            message=Message(sender=sender,receiver=receiver,message_text=message_text)
            
                   
            message.save()
            serializer=MessageSerializer(data=message)
            if serializer.is_valid():
                  serializer.save()
                  return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      
class GetMessagePostView(APIView):
      def get(self,request,id):
            sender=Profile.objects.get(username=request.user)
            receiver=Profile.objects.get(id=id)
            message=Message.objects.filter(Q(sender=sender,receiver=receiver) | Q(sender=receiver,receiver=sender))
            print(message)
            serializer=MessageSerializer(message,many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)



class MatchingView(APIView):
      def calculate(self,upf1,upf2):
            pf1_intersts=set(upf1.add_choice_person.values_list('add_choice',flat=True))
            pf2_intersts=set(upf2.add_choice_person.values_list('add_choice',flat=True))
            ans=len(pf1_intersts.intersection(pf2_intersts))*10
            print("pf1_intersts:",pf1_intersts)
            print("pf2_intersts:",pf2_intersts)
            print("Calculate:",ans)
            return ans

      def update_calculation(self,user1,user2):

            ans=self.calculate(user1,user2)
            similarity, created = Similarity.objects.get_or_create(
            pf1=user1,
            pf2=user2,
            defaults={'matching': ans}
            )
            print("Update Calculate:",ans)
            if not created:
                  similarity.matching = ans
                  similarity.save()
      
      def get(self,request,id=id):
            profiles=Profile.objects.all()
            current_profile=Profile.objects.get(username=request.user)

            for profile in profiles:
                  if current_profile != profile:
                        self.update_calculation(current_profile,profile)

            similarities = Similarity.objects.filter(pf1=current_profile)
            serializer = SimilaritySerializer(similarities, many=True)  # Serialize the data
            #print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)




            
          
class LogoutView(APIView):
      
      permission_classes=(IsAuthenticated,)
      def post(self, request):
            
        try:
            print("Inside log out")
            refresh_token = request.data["refresh_token"]
            print("Refresh:",refresh_token)
            print(request.user)
            #RefreshToken.for_user(user)
            token = RefreshToken.for_user(request.user)
            print("Token:",token)
            token.blacklist()

            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            print("Inside log out except")
            return Response(status=status.HTTP_400_BAD_REQUEST)