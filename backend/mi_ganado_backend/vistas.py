from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import NotificationSettings # type: ignore
from .forms import NotificationSettingsForm

@login_required
def notification_settings(request):
    settings, created = NotificationSettings.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = NotificationSettingsForm(request.POST, instance=settings)
        if form.is_valid():
            form.save()
            return redirect('notification_settings')
    else:
        form = NotificationSettingsForm(instance=settings)
    return render(request, 'notification_settings.html', {'form': form})
