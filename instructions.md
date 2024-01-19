## pip

```shell
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple -r requirements.txt
```

## django manage

```shell
django-admin startproject project-name
python manage.py startapp app-name
python manage.py createsuperuser

python manage.py collectstatic

python manage.py makemigrations
python manage.py migrate

python manage.py runserver 127.0.0.1:8000
```

## django deploy

### `.env` settings:

- SECRET_KEY
- DJANGO_DEBUG
- STATIC_ROOT
- MEDIA_ROOT

### Before run server

```shell
python manage.py collectstatic
python manage.py makemigrations api
python manage.py migrate
```

### Gunicorn startup command

```shell
gunicorn backend.wsgi -b 127.0.0.1:8001
```