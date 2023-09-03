from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile,Post,FriendRequests,Comment,LifeBook,Plan,SixMonthPlan,OneYearPlan,ThreeYearPlan,FiveYearPlan,TenYearPlan,Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year,AreaOfInterest,Message,Similarity

from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator
from django.contrib.auth.password_validation import validate_password

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.utils import timezone       
import pytz


class LoginSerializer(serializers.Serializer):
    """
    This serializer defines two fields for authentication:
      * username
      * password.
    It will try to authenticate the user with when validated.
    """
    username = serializers.CharField(
        label="Username",
        write_only=True
    )
    password = serializers.CharField(
        label="Password",
        # This will be used when the DRF browsable API is enabled
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        # Take username and password from request
        username = attrs.get('username')
        password = attrs.get('password')
        if username and password:
            # Try to authenticate the user using Django auth framework.
            user = authenticate(request=self.context.get('request'),
                                username=username, password=password)
            if not user:
                # If we don't have a regular user, raise a ValidationError
                msg = 'Access denied: wrong username or password.'
                raise serializers.ValidationError(msg, code='authorization')
        else:
            msg = 'Both "username" and "password" are required.'
            raise serializers.ValidationError(msg, code='authorization')
        # We have a valid user, put it in the serializer's validated_data.
        # It will be used in the view.
        attrs['user'] = user
        return attrs

class RealizerSerializer(serializers.ModelSerializer):
    username=serializers.CharField(write_only=True,required=True)
    email=serializers.EmailField(required=True,
                                 validators=[UniqueValidator(queryset=User.objects.all())])
    password=serializers.CharField(write_only=True,required=True,validators=[validate_password])
    password2=serializers.CharField(write_only=True,required=True)
    class Meta:
        model=User
        fields = ('username', 'email', 'first_name', 'last_name','password', 'password2',)
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    def validate(self,attribute):
        if attribute['password'] != attribute['password2']:
            raise serializers.ValidationError({"password":"Password fields didn't match"})
        return attribute
    def create(self,validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )        
        user.set_password(validated_data['password'])
        user.save()
        return user


class ProfileSerializer(serializers.ModelSerializer):
    username=serializers.PrimaryKeyRelatedField(read_only=True)
    profile_name=serializers.SerializerMethodField("getName")
    num_connections=serializers.SerializerMethodField("getCon")
    class Meta:
        model=Profile
        fields=('id','username','first_name','last_name','email','about','cover','pp','connections','access_token','slug','profile_name','num_connections',)
    def getName(self,instance):
        return instance.username.username
    def getCon(self,instance):
        return instance.connections.count()
    
class AllfriendsSerializer(serializers.ModelSerializer):
    username=serializers.PrimaryKeyRelatedField(read_only=True)

    num_connections=serializers.SerializerMethodField("getCon")
    profile_name=serializers.SerializerMethodField("getName")
    class Meta:
        model=Profile
        fields=('id','username','first_name','last_name','email','about','cover','pp','connections','access_token','slug','num_connections','profile_name',)
    def getName(self,instance):
        return instance.username.username
    def getCon(self,instance):
        return instance.connections.count()   
    
        
class CoverSerializers(serializers.ModelSerializer):
    class Meta:
        model=Profile
        fields=('id','cover',)
        
class PostSerializer(serializers.ModelSerializer):
    owner=serializers.PrimaryKeyRelatedField(read_only=True)
    total_likes=serializers.SerializerMethodField()
    owner_post=serializers.SerializerMethodField("getName")
    profile_picture = serializers.SerializerMethodField()
    class Meta:
        model=Post
        fields=('id','owner','image_post','text_post','likes','owner_post','total_likes','profile_picture',)
    def getName(self,instance):
        return instance.owner.username.username
    def get_total_likes(self,instance):
        return instance.likes.all().count()
    def get_profile_picture(self, obj):
        #Checking if profile exists for that post
        if obj.owner:#if yes then fetch the url for profile picture
            return obj.owner.cover.url
        return None
    
class HourField(serializers.Field):
    def to_representation(self, value):
        if value is None:
            return None
        return value.strftime("%H:%M:%S")
    
class CommentSerializer(serializers.ModelSerializer):
    owner_posting=serializers.PrimaryKeyRelatedField(read_only=True)
    current_post=serializers.PrimaryKeyRelatedField(read_only=True)
    name_owner_posting=serializers.SerializerMethodField("getName")
    # Additional fields for formatted date and time
    date = serializers.ReadOnlyField()
    time = serializers.ReadOnlyField()
    indian_time = serializers.ReadOnlyField()
    class Meta:
        model=Comment
        fields=('id','current_post','owner_posting','text_post','created','name_owner_posting','date', 'time', 'indian_time',)
    def getName(self,instance):
        return instance.owner_posting.username.username
    #for time and date
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        timestamp = instance.created

        # Convert the timezone to Indian Standard Time (IST)
        tz = pytz.timezone('Asia/Kolkata')
        indian_time = timestamp.astimezone(tz)

        # Extract date and time components from the IST datetime object
        representation['date'] = indian_time.strftime('%Y-%m-%d')
        representation['time'] = indian_time.strftime('%I:%M %p')
        representation['indian_time'] = indian_time.strftime('%I:%M %p')

        return representation 

class MessageSerializer(serializers.ModelSerializer):
    sender=serializers.PrimaryKeyRelatedField(read_only=True)
    receiver=serializers.PrimaryKeyRelatedField(read_only=True)
    # Additional fields for formatted date and time
    date = serializers.ReadOnlyField()
    time = serializers.ReadOnlyField()
    indian_time = serializers.ReadOnlyField()
    sender_name=serializers.SerializerMethodField("get_sender_name")

    class Meta:
        model = Message
        fields = ('id', 'sender', 'receiver', 'message_text', 'timestamp', 'date', 'time', 'indian_time','sender_name',)
        
    def get_sender_name(self, instance):
        return instance.sender.username.username if instance.sender else None

    #for time and date
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        timestamp = instance.timestamp

        # Convert the timezone to Indian Standard Time (IST)
        tz = pytz.timezone('Asia/Kolkata')
        indian_time = timestamp.astimezone(tz)

        # Extract date and time components from the IST datetime object
        representation['date'] = indian_time.strftime('%Y-%m-%d')
        representation['time'] = indian_time.strftime('%I:%M %p')
        representation['indian_time'] = indian_time.strftime('%I:%M %p')

        return representation   

class FriendRequestSerializer(serializers.ModelSerializer):
    sender=serializers.PrimaryKeyRelatedField(read_only=True)
    receiver=serializers.PrimaryKeyRelatedField(read_only=True)
    
    sender_from=serializers.SerializerMethodField("getNamefrom")
    receiver_to=serializers.SerializerMethodField("getNameto")
    
    sender_profile=serializers.SerializerMethodField("getsender_profile")
    receiver_profile=serializers.SerializerMethodField("getreceiver_profile")
    
    class Meta:
        model=FriendRequests
        fields=('id','sender','receiver','status','sender_from','receiver_to','sender_profile','receiver_profile',)
        
    def getNamefrom(self,instance):
        print(instance.sender.username.username,instance.sender)
        return instance.sender.username.username
    def getNameto(self,instance):
        return instance.receiver.username.username
    
    def getsender_profile(self,obj):
        if obj.sender:
            return obj.sender.cover.url
    def getreceiver_profile(self,obj):
        if obj.sender:
            return obj.receiver.cover.url
        
class LifeBookSerializer(serializers.ModelSerializer):
    class Meta:
        model=LifeBook
        fields=('id','plan_photo','plan',)

class PlanSerializer(serializers.ModelSerializer):
    current_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    prof=serializers.PrimaryKeyRelatedField(read_only=True)
    plan_name=serializers.SerializerMethodField("getName")
    class Meta:
        model=Plan
        fields=('id','current_plan','prof','oneMonth','oneMonthSdt','oneMonthEdt','plan_name',)
    def getName(self,instance):
        return instance.current_plan.plan
    
#Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year
class Vision1MonthSerializer(serializers.ModelSerializer):
    one_month_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField(source='one_month_plan.oneMonthSdt', read_only=True)
    end_date = serializers.DateField(source='one_month_plan.oneMonthEdt', read_only=True)
    one_month = serializers.SerializerMethodField()
    class Meta:
        model=Vision1Month
        fields=('id','one_month_plan','why_goal','goal_photo','feeling','start_date','end_date','one_month',)
    def get_one_month(self, instance):
        return instance.one_month_plan.oneMonth
    
class SixMonthPlanSerializer(serializers.ModelSerializer):
    current_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    prof=serializers.PrimaryKeyRelatedField(read_only=True)
    plan_name=serializers.SerializerMethodField("getName")
    class Meta:
        model=SixMonthPlan
        fields=('id','current_plan','prof','sixMonth','sixMonthSdt','sixMonthEdt','plan_name',)
    def getName(self,instance):
        return instance.current_plan.plan
    
#Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year
class Vision6MonthSerializer(serializers.ModelSerializer):
    six_month_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField(source='six_month_plan.sixMonthSdt', read_only=True)
    end_date = serializers.DateField(source='six_month_plan.sixMonthEdt', read_only=True)
    six_month=serializers.SerializerMethodField()
    class Meta:
        model=Vision6Month
        fields=('id','six_month_plan','why_goal','goal_photo','feeling','start_date','end_date','six_month',)
    def get_six_month(self, instance):
        return instance.six_month_plan.sixMonth
        
class OneYearPlanSerializer(serializers.ModelSerializer):
    current_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    prof=serializers.PrimaryKeyRelatedField(read_only=True)
    plan_name=serializers.SerializerMethodField("getName")
    class Meta:
        model=OneYearPlan
        fields=('id','current_plan','prof','oneyear','oneYearSdt','oneYearEdt','plan_name',)
    def getName(self,instance):
        return instance.current_plan.plan
    
#Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year
class Vision1YearSerializer(serializers.ModelSerializer):
    one_year_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    name=serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField(source='one_year_plan.oneYearSdt', read_only=True)
    end_date = serializers.DateField(source='one_year_plan.oneYearEdt', read_only=True)
    one_year=serializers.SerializerMethodField()
    class Meta:
        model=Vision1Year
        fields=('id','one_year_plan','why_goal','goal_photo','feeling','start_date','end_date','name','one_year',)
    def get_one_year(self, instance):
        return instance.one_year_plan.oneyear
        
        
class ThreeYearPlanSerializer(serializers.ModelSerializer):
    current_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    name=serializers.PrimaryKeyRelatedField(read_only=True)
    prof=serializers.PrimaryKeyRelatedField(read_only=True)
    plan_name=serializers.SerializerMethodField("getName")
    class Meta:
        model=ThreeYearPlan
        fields=('id','current_plan','prof','threeyear','threeYearSdt','threeYearEdt','plan_name','name',)
    def getName(self,instance):
        return instance.current_plan.plan
#Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year
class Vision3YearSerializer(serializers.ModelSerializer):
    three_year_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    name=serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField(source='three_year_plan.threeYearSdt', read_only=True)
    end_date = serializers.DateField(source='three_year_plan.threeYearEdt', read_only=True)
    three_year=serializers.SerializerMethodField()
    class Meta:
        model=Vision3Year
        fields=('id','three_year_plan','why_goal','goal_photo','feeling','start_date','end_date','name','three_year',)
    def get_three_year(self, instance):
        return instance.three_year_plan.threeyear
        
        
class FiveYearPlanSerializer(serializers.ModelSerializer):
    current_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    name=serializers.PrimaryKeyRelatedField(read_only=True)
    prof=serializers.PrimaryKeyRelatedField(read_only=True)
    plan_name=serializers.SerializerMethodField("getName")
    class Meta:
        model=FiveYearPlan
        fields=('id','current_plan','prof','fiveyear','fiveYearSdt','fiveYearEdt','plan_name','name',)
    def getName(self,instance):
        return instance.current_plan.plan
#Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year
class Vision5YearSerializer(serializers.ModelSerializer):
    five_year_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    name=serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField(source='five_year_plan.fiveYearSdt', read_only=True)
    end_date = serializers.DateField(source='five_year_plan.fiveYearEdt', read_only=True)
    five_year=serializers.SerializerMethodField()
    class Meta:
        model=Vision5Year
        fields=('id','five_year_plan','why_goal','goal_photo','feeling','start_date','end_date','name','five_year',)
    def get_five_year(self, instance):
        return instance.five_year_plan.fiveyear
               

class TenYearPlanSerializer(serializers.ModelSerializer):
    current_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    name=serializers.PrimaryKeyRelatedField(read_only=True)
    prof=serializers.PrimaryKeyRelatedField(read_only=True)
    plan_name=serializers.SerializerMethodField("getName")
    class Meta:
        model=TenYearPlan
        fields=('id','current_plan','prof','tenyear','tenYearSdt','tenYearEdt','plan_name','name',)
    def getName(self,instance):
        return instance.current_plan.plan

#Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year
class Vision10YearSerializer(serializers.ModelSerializer):
    ten_year_plan=serializers.PrimaryKeyRelatedField(read_only=True)
    name=serializers.PrimaryKeyRelatedField(read_only=True)
    start_date = serializers.DateField(source='ten_year_plan.tenYearSdt', read_only=True)
    end_date = serializers.DateField(source='ten_year_plan.tenYearEdt', read_only=True)
    ten_year=serializers.SerializerMethodField()
    class Meta:
        model=Vision10Year
        fields=('id','ten_year_plan','why_goal','goal_photo','feeling','start_date','end_date','name','ten_year',)
    def get_ten_year(self, instance):
        return instance.ten_year_plan.tenyear
        
class AreaOfInterestSerializer(serializers.ModelSerializer):
    person=serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model=AreaOfInterest
        fields=('id','add_choice','person',)
        



    
class SimilaritySerializer(serializers.ModelSerializer):
    pf1=serializers.PrimaryKeyRelatedField(read_only=True)
    pf2=serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model=Similarity
        fields=('id','pf1','pf2','matching',)
