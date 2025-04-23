from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

# ---------------------
# SEGURANÇA
# ---------------------
SECRET_KEY = 'django-insecure-altera-isto-para-producao'
DEBUG = True
ALLOWED_HOSTS = []

# ---------------------
# APPS INSTALADAS
# ---------------------
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'rest_framework.authtoken',  # para autenticação com token
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites', # para o reset do email
    'dj_rest_auth', 

    # outros
    'rest_framework',
    'corsheaders',

    # App do projeto
    'api',
]

INSTALLED_APPS += ['django_extensions']

# ---------------------
# MIDDLEWARES
# ---------------------
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Deve vir antes de CommonMiddleware
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# ---------------------
# TEMPLATES
# ---------------------
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],  # Podes adicionar pastas de templates se necessário
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ---------------------
# BASE DE DADOS
# ---------------------
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'pecd',
        'USER': 'postgres',      # <-- metam todos isto para conseguirmos aceder todos sem estarmos sempre a mudar
        'PASSWORD': 'postgres',  # <-- aqui também
        'HOST': 'localhost',
        'PORT': '5432',
    }
}

# ---------------------
# PASSWORD VALIDATORS
# ---------------------
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
]

# ---------------------
# LOCALIZAÇÃO
# ---------------------
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ---------------------
# STATIC FILES
# ---------------------
STATIC_URL = 'static/'

# ---------------------
# CAMPOS PADRÃO
# ---------------------
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ---------------------
# CORS (Permitir React)
# ---------------------
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
]

#  Para desenvolvimento apenas — em produção usa apenas CORS_ALLOWED_ORIGINS !!!!!!!!!!!!!!!!!!!!
CORS_ALLOW_ALL_ORIGINS = True

# ---------------------
# REST FRAMEWORK (Autenticação JWT)
# ---------------------
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

# ---------------------
# EMAILS (para ativação de conta ou recuperação de password)
# ---------------------
# para já os emails aparecem só no terminal (modo de desenvolvimento)
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'projetopecd@gmail.com'
EMAIL_HOST_PASSWORD = 'efnclqzgbsrpvurp'  # a app password que o Google deu (sem espaços)
DEFAULT_FROM_EMAIL = 'projetopecd@gmail.com'

EMAIL_USE_LOCALTIME = True
EMAIL_SUBJECT_PREFIX = '[TeacherSArch] '

SITE_ID = 1

DJANGO_REST_AUTH = {
    'PASSWORD_RESET_CONFIRM_URL': 'reset-password/{uid}/{token}/',
    'USE_JWT': True,  # ou False, se não estiveres a usar JWT
}

REST_AUTH_SERIALIZERS = {
    'PASSWORD_RESET_SERIALIZER': 'api.serializers.auth.CustomPasswordResetSerializer'
}
