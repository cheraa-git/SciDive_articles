from flask import Flask, request, session, jsonify, render_template, url_for
from flask_caching import Cache
from flask_sockets import Sockets
from database1 import SignupEmailError, SignupLoginError, get_subscriptions, get_article, get_articles_subscriptions, get_articles_blog, set_article, \
    set_subscription, del_article, del_subscription, update_article, get_most_recent_articles, get_user_id, request_user_avatar, request_user, check_admin, add_user, check_user_by_email, add_check_password, get_check_password, request_user_login, change_user_password, remove_check_password, get_user_login, plus_view_on_article
from database1 import AccountNotFound, AccountExists
from flask_mail import Mail, Message
from werkzeug.security import generate_password_hash, check_password_hash
from flask_marshmallow import Marshmallow
from flask_cors import CORS
import jwt
import time
import os
import subprocess
import json
from copy import deepcopy


app = Flask(__name__, template_folder="templates")
# Отмена кэширования статических файлов
app.config["CACHE_TYPE"] = "null"
# Инициализация кэша приложения
cache = Cache(app)
cache.init_app(app)
app.config['MAIL_SERVER'] = 'smtp.googlemail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
# введите свой адрес электронной почты здесь
app.config['MAIL_USERNAME'] = 'scidivecommunity@gmail.com'
app.config['MAIL_DEFAULT_SENDER'] = 'scidivecommunity@gmail.com'  # и здесь
# введите пароль
app.config['MAIL_PASSWORD'] = 'S17050405S1705040SolomonHardKey'
app.config['UPLOAD_FOLDER'] = "static/"
CORS(app)

app.secret_key = "FIYGRFERBKCYBKEUYVCYECERUYBCRU"
sockets = Sockets(app)
secret_key_for_images = "FHIRLUGIGYRERLVBUV132BJHVLYRFEHRCEBVKRRVJHBVB34"
# Secret_key из переменной окружения моего ноутбука.
# app.secret_key = str(subprocess.check_output(['launchctl', 'getenv', 'SECRET_KEY']))[2:-3]
url = "http://127.0.0.1:5000"

mail = Mail(app)
ma = Marshmallow(app)


class Article_m(ma.Schema):
    class Meta:
        fields = ['id', 'blog_id', 'title', 'image', 'prev_content',
                  'content', 'category', 'tags', 'date', 'views']


article_m = Article_m(many=False)


class Articles_m(ma.Schema):
    class Meta:
        fields = ['id', 'blog_id', 'title', 'image',
                  'prev_content', 'category', 'tags', 'date', 'views']


articles_m = Articles_m(many=True)


class Subscriptions_m(ma.Schema):
    class Meta:
        fields = ['blog_id']


subscriptions_m = Subscriptions_m(many=True)


class Author_m(ma.Schema):
    class Meta:
        fields = ['login', 'avatar']


login_u = Author_m(many=False)


@app.route("/main_page", methods=["GET"])
def show_main_page():
    # token = jwt.decode(bytes(request.args.get("token", 1), encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    # print(token)
    # user_id = token["login"]
    articles = get_most_recent_articles()
    result = articles
    return jsonify(result)


@app.route("/article/<int:article_id>", methods=["GET"])
def show_article(article_id):
    # token = jwt.decode(bytes(request.args.get("token", 1), encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    # print(token)
    article, author = get_article(article_id)
    result = article_m.dump(article)
    result["author"] = login_u.dump(author)
    # result["content"] = json.loads(result["content"])
    return jsonify(result)


@app.route('/my_subscriptions', methods=["GET"])
def show_subscriptions():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    print(f'Это user_id{user_id}')
    subscriptions = get_subscriptions(user_id)
    result = subscriptions_m.dumps(subscriptions)
    return jsonify(result)


@app.route('/tape', methods=["GET"])
def show_articles_by_subscriptions():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    articles = get_articles_subscriptions(user_id)
    result = articles
    return jsonify(result)


@app.route('/user_articles/<login>', methods=["GET"])
def show_user_blog(login):
    # token = jwt.decode(bytes(request.args.get("token", 1), encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    # print(token)
    # user_id = token["login"]
    try: 
        articles = get_articles_blog(login)
        print(articles)
        result = articles
        # result["articles"] = json.loads(articles_m.dumps(articles))
        # print(result)
        # result["author"] = login_u.dump(author)
        return jsonify(result)
    except:
        return jsonify({'error': True})


@app.route('/my_articles', methods=["GET"])
def show_my_articles():
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    articles = get_articles_blog(user_id)
    print(articles)
    result = articles
    # result["articles"] = json.loads(articles_m.dumps(articles))
    # print(result)
    # result["author"] = login_u.dump(author)
    return jsonify(result)


@app.route('/edit/article', methods=["POST"])
def add_article():
    data = dict(request.form)
    token = data["token"]
    token = jwt.decode(bytes(token, encoding='utf-8'),
                       app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(token)
    title = data['title']
    prev_content = data['prev_content']
    content = data['content']
    category = data['category']
    tags = data['tags']
    try: 
        file = request.files["image"]
        extens = file.filename.split(".")[-1].replace("\"", "")
        # Создаём имя файла, хэшируя его
        file_name = generate_password_hash(title + secret_key_for_images)
        # Убираем из названия все : и тп
        file_name = file_name.replace(":", "") + '.' + extens
        path = app.config["UPLOAD_FOLDER"]
        full_path = path + file_name
        print("Это full path: " + full_path)
    except:
        file_name = ''
    # info = []
    # info_dict = {}
    # for component in range(int(sorted(data)[-1][-1]) + 1):
    #     print(component)
    #     info_dict["id"] = data[f"id_{component}"]
    #     info_dict["type"] = data[f"type_{component}"]
    #     if info_dict["type"] !="text" and info_dict["type"] !="code":
    #         info_component = request.files[f"info_{component}"]
    #         extens = info_component.filename.split(".")[-1].replace("\"", "")
    #         filename = str(time.time()) + '.' + extens
    #         path = app.config["UPLOAD_FOLDER"]
    #         try:
    #             full_path = path + filename
    #             info_component.save(full_path)
    #             info_dict["info"] = f'http://127.0.0.1:5000{full_path}'
    #         except TypeError:
    #             pass
    #     else:
    #         info_dict["info"] = data[f"info_{component}"]
    #         if info_dict["type"] == "code":
    #             info_dict["pr_ln"] = data[f"pr_ln_{component}"]
    #     info.append(info_dict)
    #     info_dict = {}
    # info = json.dumps(info)
    try:
        article_id = set_article(user_id, title, file_name, prev_content, content, category, tags)
        print(article_id)
        try: 
            file.save(os.path.join(path, file_name))
        except:
            pass
        return jsonify({"error": False, 'id': article_id})
    except:
        return jsonify({"error": True})


@app.route('/subscription/<int:blog_id>', methods=["POST"])
def add_subscription(blog_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    user_id = token["login"]
    subscriptions = get_subscriptions(user_id)
    if blog_id not in subscriptions:
        try:
            subscription = set_subscription(user_id, blog_id)
            return jsonify({"error": False})
        except:
            return jsonify({"error": True})
    else:
        return jsonify({"error": True})
    return 0


@app.route('/article/<int:article_id>', methods=["DELETE"])
def del_article_(article_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(user_id)
    created_articles = get_articles_blog(user_id)
    articles = [i["id"]
                for i in json.loads(articles_m.dumps(created_articles))]
    admin = check_admin(user_id)
    print(created_articles)
    if article_id in articles or admin:
        del_article(article_id)
        return jsonify({"error": False})
    else:
        return jsonify({"error": True})


@app.route('/subscription/<int:blog_id>', methods=["DELETE"])
def del_subscription_(blog_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(user_id)
    subscriptions = get_subscriptions(user_id)
    subscriptions_ = [i["blog_id"]
                      for i in json.loads(subscriptions_m.dumps(subscriptions))]
    admin = check_admin(user_id)
    if blog_id in subscriptions_ or admin:
        del_subscription(user_id, blog_id)
        return jsonify({"error": False})
    else:
        return jsonify({"error": True})


@app.route('/edit/article/<int:article_id>', methods=["PUT"])
def update_article_(article_id):
    data = dict(request.form)
    token = data["token"]
    token = jwt.decode(bytes(token, encoding='utf-8'),
                       app.secret_key, algorithms=['HS256'])
    user_id = token["login"]
    print(token)
    title = data['title']
    prev_content = data['prev_content']
    content = data['content']
    category = data['category']
    tags = data['tags']
    try:
        file = request.files["image"]
        extens = file.filename.split(".")[-1].replace("\"", "")
        # Создаём имя файла, хэшируя его
        file_name = generate_password_hash(title + secret_key_for_images)
        # Убираем из названия все : и тп
        file_name = file_name.replace(":", "") + '.' + extens
        path = app.config["UPLOAD_FOLDER"]
        full_path = path + file_name
        print("Это full path: " + full_path)
    except:
        file_name = ''
    # info = []
    # info_dict = {}
    # for component in range(int(sorted(data)[-1][-1]) + 1):
    #     print(component)
    #     info_dict["id"] = data[f"id_{component}"]
    #     info_dict["type"] = data[f"type_{component}"]
    #     if info_dict["type"] !="text" and info_dict["type"] !="code":
    #         info_component = request.files[f"info_{component}"]
    #         extens = info_component.filename.split(".")[-1].replace("\"", "")
    #         filename = str(time.time()) + '.' + extens
    #         path = app.config["UPLOAD_FOLDER"]
    #         try:
    #             full_path = path + filename
    #             info_component.save(full_path)
    #             info_dict["info"] = f'http://127.0.0.1:5000{full_path}'
    #         except TypeError:
    #             pass
    #     else:
    #         info_dict["info"] = data[f"info_{component}"]
    #         if info_dict["type"] == "code":
    #             info_dict["pr_ln"] = data[f"pr_ln_{component}"]
    #     info.append(info_dict)
    #     info_dict = {}
    # info = json.dumps(info)
    try:
        update_article(article_id, user_id, title, file_name,
                       prev_content, content, category, tags)
        try:
            file.save(os.path.join(path, file_name))
        except:
            pass
        return jsonify({"error": False})
    except:
        return jsonify({"error": True})


# Страница авторизации/регистрации/восстановления пароля/подтверждения нового пароля
@app.route('/authorization/<form>', methods=['POST'])
def post(form):
    if form == "log_in":
        email = request.json['email']
        password = request.json['password']
        avatar = request_user_avatar(email)
        try:
            email, password_hash_valid = request_user(email)
            bool_hash = check_password_hash(password_hash_valid, password)
        except AccountNotFound:
            return jsonify({"error": True})
        if bool_hash:
            user_id = get_user_id(email)
            admin = check_admin(user_id)
            login = get_user_login(email)
            token = jwt.encode(
                {'login': user_id}, key=app.secret_key, algorithm='HS256').decode('utf-8')
            print(token)
            return jsonify({'token': token, 'avatar': f"{avatar}", "admin": admin, "login": login})
        else:
            return jsonify({"error": True})

    elif form == "sign_up":

        login = request.json['login']
        email = request.json['email']
        password = request.json['password']
        try:
            add_user(login=login, email=email, password=password)
        except AccountExists:
            return jsonify({"error": True})
        except SignupEmailError:
            return jsonify({"error": 'SignupEmailError'})
        except SignupLoginError:
            return jsonify({"error": 'SignupLoginError'})
        return jsonify({"error": False})

    elif form == "forgot":
        email = request.json['email']
        try:
            email = check_user_by_email(email)
        except AccountNotFound:
            return jsonify({"error": True})
        code = add_check_password(email)
        msg = Message("Код подтверждения", recipients=[email])
        msg.body = code
        mail.send(msg)
        session["mail_confirm"] = email
        return jsonify({"error": False})

    elif form == "confirm_new_password":
        email = request.json["email"]
        code_valid = get_check_password(email)
        code = request.json["code"]
        login = request_user_login(email)
        old_password = request_user(login)[1]
        print(old_password)
        new_password = request.json['password']
        bool_hash = check_password_hash(old_password, new_password)
        print(bool_hash)
        if code_valid == code:
            if bool_hash:
                return jsonify({'error': "Пароли совпадают"})
            else:
                change_user_password(email, new_password)
                remove_check_password(email)
                login = request_user_login(email)
                session['login'] = login
                return jsonify({'error': False})
        else:
            return jsonify({'error': "Код подтверждения неверный"})

@app.route('/plus/view/<int:article_id>', methods=["GET"])
def plus_view(article_id):
    token = jwt.decode(bytes(request.args.get("token", 1),
                             encoding='utf-8'), app.secret_key, algorithms=['HS256'])
    print(token)
    login = token["login"]
    try:
        rez = plus_view_on_article(login, article_id)
        return jsonify({"error": False, "plus": rez})
    except:
        return jsonify({"error": True})

app.run()
