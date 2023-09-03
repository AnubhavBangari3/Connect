from django.urls import path,include
from .views import RegisterView,LoginUser,ProfileView,LogoutView,UpdateProfile,ImageUpdate,PostView,GetPostView,DeletePost,FriendRequestView,AllProfileView,SendFRView,ProfileLoginAuthView,AllConnections,likeview,GetSinglePostView,CommentView,GetCommentView,GetLifeBookView,PlanView,ActiveOneMonthPlan,ActiveSixMonthPlan,ActiveOneYearPlan,ActiveThreeYearPlan,ActiveFiveYearPlan,ActiveTenYearPlan,GetActiveSixMonthPlan,GetActiveOneYearPlan,GetActiveThreeYearPlan,GetActiveFiveYearPlan,GetActiveTenYearPlan,OneMonthVision,GetOneMonthVision,SixMonthVision,GetSixMonthVision,OneYearVision,GetOneYearVision,ThreeYearVision,GetThreeYearVision,FiveYearVision,GetFiveYearVision,TenYearVision,GetTenYearVision,GenerateOneMonthVisionPDF,GenerateSixMonthVisionPDF,GenerateOneYearVisionPDF,GenerateThreeYearVisionPDF,GenerateFiveYearVisionPDF,GenerateTenYearVisionPDF,AreaOfInterestView,GetAreaOfInterestView,DeleteAreaOfInterest,AllfriendsVIew,MessagePostView,GetMessagePostView,getAllPost,GetSingleProfile,GetProfileAreaOfInterestView,MatchingView,NotActiveOneMonthPlan,GetNotActiveSixMonthPlan,GetNotActiveOneYearPlan,GetNotActiveThreeYearPlan,GetNotActiveFiveYearPlan,GetNotActiveTenYearPlan  


from rest_framework.routers import DefaultRouter


router=DefaultRouter()
router.register("register",RegisterView,basename="register")
router.register("updateProfile",UpdateProfile,basename="updateProfile")
router.register("deletePost",DeletePost,basename="deletePost")
router.register("friendRequest",FriendRequestView,basename="friendRequest")
router.register("allConnections",AllConnections,basename="allConnections")

urlpatterns=[
    path("",include(router.urls)),
    path("login",LoginUser.as_view(),name="login"),
    path("profile/",ProfileView.as_view(),name="profile"),
    path("logout",LogoutView.as_view(),name="logout"),
    path("profile/cover/<int:id>/",ImageUpdate.as_view(),name="coverUpdate"),
    path("posts",PostView.as_view(),name="posts"),
    path("getposts",GetPostView.as_view(),name="getposts"),
    path("allProfile",AllProfileView.as_view(),name="allprofile"),
    path("sendFR/<int:id>/",SendFRView.as_view(),name="sendFR"),
    path("allProfileauth",ProfileLoginAuthView.as_view(),name="allProfileauth"),
    path("posts/<int:id>/like",likeview.as_view(),name="like"),
    path("getposts/<int:id>/",GetSinglePostView.as_view(),name="getsinglepost"),
    path("commentPost/<int:id>/",CommentView.as_view(),name="commentPost"),
    path("commentPost/<int:id>/comments/",GetCommentView.as_view(),name="comments"),
    path("lifeplan",GetLifeBookView.as_view(),name="lifeplan"),
    path("lifeplan/<int:id>/active",PlanView.as_view(),name="oneMonth"),
    path("lifeplan/<int:id>/activeOnemonthPlan",ActiveOneMonthPlan.as_view(),name="activeOnemonthPlan"),
    path("lifeplan/<int:id>/activeSixmonthPlan",ActiveSixMonthPlan.as_view(),name="activeSixmonthPlan"),
    path("lifeplan/<int:id>/activeOneyearPlan",ActiveOneYearPlan.as_view(),name="activeOneyearPlan"),
    path("lifeplan/<int:id>/activeThreeYearPlan",ActiveThreeYearPlan.as_view(),name="activeThreeYearPlan"),
    path("lifeplan/<int:id>/activeFiveYearPlan",ActiveFiveYearPlan.as_view(),name="activeFiveYearPlan"),
    path("lifeplan/<int:id>/activeTenYearPlan",ActiveTenYearPlan.as_view(),name="activeTenYearPlan"),
    path("lifeplan/<int:id>/getactiveSixmonthPlan",GetActiveSixMonthPlan.as_view(),name="getactiveSixmonthPlan"),
    path("lifeplan/<int:id>/getactiveOneyearPlan",GetActiveOneYearPlan.as_view(),name="getactiveOneyearPlan"),
    path("lifeplan/<int:id>/getactiveThreeYearPlan",GetActiveThreeYearPlan.as_view(),name="getactiveThreeYearPlan"),
    path("lifeplan/<int:id>/getactiveFiveYearPlan",GetActiveFiveYearPlan.as_view(),name="getactiveFiveYearPlan"),
    path("lifeplan/<int:id>/getactiveTenYearPlan",GetActiveTenYearPlan.as_view(),name="getactiveTenYearPlan"),
    path("lifeplan/vision1month/<int:id>",OneMonthVision.as_view(),name="vision1month"),
    path("lifeplan/getvision1month/<int:id>",GetOneMonthVision.as_view(),name="getvision1month"),
    path("lifeplan/vision6month/<int:id>",SixMonthVision.as_view(),name="vision6month"),
    path("lifeplan/getvision6month/<int:id>",GetSixMonthVision.as_view(),name="getvision6month"),
    path("lifeplan/vision1year/<int:id>",OneYearVision.as_view(),name="vision1year"),
    path("lifeplan/getvision1year/<int:id>",GetOneYearVision.as_view(),name="getvision1year"),
    path("lifeplan/vision3year/<int:id>",ThreeYearVision.as_view(),name="vision3year"),
    path("lifeplan/getvision3year/<int:id>",GetThreeYearVision.as_view(),name="getvision3year"),
    path("lifeplan/vision5year/<int:id>",FiveYearVision.as_view(),name="vision5year"),
    path("lifeplan/getvision5year/<int:id>",GetFiveYearVision.as_view(),name="getvision5year"),
    path("lifeplan/vision10year/<int:id>",TenYearVision.as_view(),name="vision10year"),
    path("lifeplan/getvision10year/<int:id>",GetTenYearVision.as_view(),name="getvision10year"),
    path('lifeplan/generate-one-month-vision-pdf/<int:id>/', GenerateOneMonthVisionPDF.as_view(), name='generate_one_month_vision_pdf'),
    path('lifeplan/generate-six-month-vision-pdf/<int:id>/', GenerateSixMonthVisionPDF.as_view(), name='generate_six_month_vision_pdf'),
    path('lifeplan/generate-one-year-vision-pdf/<int:id>/', GenerateOneYearVisionPDF.as_view(), name='generate_one_year_vision_pdf'),
    path('lifeplan/generate-three-year-vision-pdf/<int:id>/', GenerateThreeYearVisionPDF.as_view(), name='generate_three_year_vision_pdf'),
    path('lifeplan/generate-five-year-vision-pdf/<int:id>/', GenerateFiveYearVisionPDF.as_view(), name='generate_five_year_vision_pdf'),
    path('lifeplan/generate-ten-year-vision-pdf/<int:id>/', GenerateTenYearVisionPDF.as_view(), name='generate_ten_year_vision_pdf'), 
    path('areaOfinterest', AreaOfInterestView.as_view(), name='areaOfinterest'),    
    path('getareaOfinterest', GetAreaOfInterestView.as_view(), name='getareaOfinterest'),
    path('deleteareaOfinterest/<int:id>/delete', DeleteAreaOfInterest.as_view(), name='deleteareaOfinterest'),
    path('allfriends', AllfriendsVIew.as_view(), name='allfriends'),
    path('message/<int:id>', MessagePostView.as_view(), name='message'),
    path('getmessage/<int:id>', GetMessagePostView.as_view(), name='getmessage'),
    path('getallpost',getAllPost.as_view(),name="getallpost"),
    path("getSingleProfile/<int:id>",GetSingleProfile.as_view(),name="getSingleProfile"),
    path("getProfileareaOfinterest/<int:id>",GetProfileAreaOfInterestView.as_view(),name="getProfileareaOfinterest"),
    path("matching/<int:id>",MatchingView.as_view(),name="matching"),
    path("lifeplan/<int:id>/notactiveOnemonthPlan",NotActiveOneMonthPlan.as_view(),name="notactiveOnemonthPlan"),
    path("lifeplan/<int:id>/notactiveSixmonthPlan",GetNotActiveSixMonthPlan.as_view(),name="notactiveSixmonthPlan"),
    path("lifeplan/<int:id>/getnotactiveOneyearPlan",GetNotActiveOneYearPlan.as_view(),name="getnotactiveOneyearPlan"),
    path("lifeplan/<int:id>/getnotactiveThreeYearPlan",GetNotActiveThreeYearPlan.as_view(),name="getnotactiveThreeYearPlan"),
    path("lifeplan/<int:id>/getnotactiveFiveYearPlan",GetNotActiveFiveYearPlan.as_view(),name="getnotactiveFiveYearPlan"),
    path("lifeplan/<int:id>/getnotactiveTenYearPlan",GetNotActiveTenYearPlan.as_view(),name="getnotactiveTenYearPlan"),
    ]





