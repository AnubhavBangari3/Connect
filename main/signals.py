from .models import Profile,FriendRequests,Message,AreaOfInterest
from django.contrib.auth.models import User
from django.db.models.signals import post_save,pre_delete
from django.dispatch import receiver
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .views import MatchingView

@receiver(post_save,sender=User)
def create_profile(sender,instance,created,**kwargs):
    current=User.objects.get(username=instance)
    if created:
        Profile.objects.create(username=instance,first_name=current.first_name,last_name=current.last_name,email=current.email)
        
        
@receiver(post_save,sender=FriendRequests)
def add_friend(sender,instance,created,**kwargs):
    send=instance.sender
    receive=instance.receiver
    
    if instance.status == 'accept':
        send.connections.add(receive.username)
        receive.connections.add(send.username)
        
        send.save()
        receive.save()

        
@receiver(pre_delete,sender=FriendRequests)
def unfriend(sender,instance,**kwargs):
    sender=instance.sender
    receive=instance.receiver
    sender.connections.remove(receive.username)
    receive.connections.remove(sender.username)
    

@receiver(m2m_changed, sender=AreaOfInterest.person)
def updatematchingsignal(sender,instance,action,**kwargs):
    matching_view=MatchingView()
    if action in ['post_add', 'post_remove', 'post_clear']:
            user1 = instance.person
            user2s = Profile.objects.exclude(id=user1.id)

            for user2 in user2s:
                matching_view.update_calculation(user1, user2)
                matching_view.update_calculation(user2, user1)
