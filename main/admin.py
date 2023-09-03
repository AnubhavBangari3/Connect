from django.contrib import admin
from .models import Profile,Post,FriendRequests,Comment,LifeBook,Plan,SixMonthPlan,OneYearPlan,ThreeYearPlan,FiveYearPlan,TenYearPlan,Vision1Month,Vision6Month,Vision1Year,Vision3Year,Vision5Year,Vision10Year,AreaOfInterest,Message,Similarity
from django.contrib.auth.models import User
# Register your models here.

#for not showing the current user option in connections 
# class ProfileAdmin(admin.ModelAdmin):
#     def formfield_for_manytomany(self, db_field, request, **kwargs):
#         if db_field.name == "connections":
#             kwargs["queryset"] = User.objects.exclude(id=request.user.id)
#         return super().formfield_for_manytomany(db_field, request, **kwargs)

admin.site.register(Profile)
admin.site.register(Post)
admin.site.register(FriendRequests)
admin.site.register(Comment)
admin.site.register(LifeBook)
admin.site.register(Plan)
admin.site.register(SixMonthPlan)
admin.site.register(OneYearPlan)
admin.site.register(ThreeYearPlan)
admin.site.register(FiveYearPlan)
admin.site.register(TenYearPlan)
admin.site.register(Vision1Month)
admin.site.register(Vision6Month)
admin.site.register(Vision1Year)
admin.site.register(Vision3Year)
admin.site.register(Vision5Year)
admin.site.register(Vision10Year)
admin.site.register(AreaOfInterest)
admin.site.register(Message)
admin.site.register(Similarity)