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

## drf-spectacular generate schema

```shell
python manage.py spectacular --color --file schema.yml
```

## Deploy

### `.env` settings:

- SECRET_KEY
- DJANGO_DEBUG
- STATIC_ROOT
- MEDIA_ROOT

### Nginx settings

```nginx
server {
    listen 80;

    location / {
        proxy_pass http://127.0.0.1:8001;
    }

    location /static {
        root STATIC_ROOT;
    }

    location /media {
        root MEDIA_ROOT;
    }
}
```

### Install Deploy Dependency

```shell
pip install gunicorn
pip install pymysql
```

In `__init__.py` file:

```python
import pymysql
pymysql.install_as_MySQLdb()
```

### `settings.py`

```python
CSRF_TRUSTED_ORIGINS = ["http://192.168.0.1"] # local IP

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": "database name",
        "USER": "user",
        "PASSWORD": "password",
        "HOST": "host",
        "PORT": 3306,
    }
}
```

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